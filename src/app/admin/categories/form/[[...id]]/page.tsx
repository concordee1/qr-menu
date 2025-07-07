// src/app/admin/categories/form/[[...id]]/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Category } from '@/types';

export default function CategoryFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id?.[0]; // The 'id' is an array, we take the first element

  const [name, setName] = useState('');
  const [parent, setParent] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(id);

  useEffect(() => {
    // Fetch all categories for the parent dropdown
    const fetchAllCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        // Exclude the current category from the list of possible parents
        setAllCategories(data.data.filter((cat: Category) => cat._id !== id));
      } catch (err) {
        console.error("Failed to fetch categories for dropdown", err);
      }
    };

    fetchAllCategories();

    if (isEditing) {
      // Fetch the specific category to edit
      const fetchCategoryData = async () => {
        try {
          const res = await fetch(`/api/categories/${id}`);
          const { data } = await res.json();
          setName(data.name);
          setParent(data.parent?._id || '');
          setImageUrl(data.imageUrl || '');
        } catch (err) {
          setError('Kategori bilgileri yüklenemedi.');
          console.error(err);
        }
      };
      fetchCategoryData();
    }
  }, [id, isEditing]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const categoryData = { name, parent, imageUrl };
    const url = isEditing ? `/api/categories/${id}` : '/api/categories';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(categoryData),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'İşlem başarısız.');
      }

      router.push('/admin/categories');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {isEditing ? 'Kategoriyi Düzenle' : 'Yeni Kategori Ekle'}
      </h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Kategori Adı</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            required
          />
        </div>

        <div className="mb-4">
          <label htmlFor="parent" className="block text-gray-700 font-semibold mb-2">Üst Kategori</label>
          <select
            id="parent"
            value={parent}
            onChange={(e) => setParent(e.target.value)}
            className="w-full px-3 py-2 border rounded-md bg-white"
          >
            <option value="">-- Üst Kategori Yok --</option>
            {allCategories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-gray-700 font-semibold mb-2">Resim URL</label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full px-3 py-2 border rounded-md"
            placeholder="https://example.com/image.png"
          />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex gap-4">
          <button
            type="submit"
            disabled={isSaving}
            className="bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 disabled:bg-gray-400"
          >
            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
          <button
            type="button"
            onClick={() => router.push('/admin/categories')}
            className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400"
          >
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}
