// src/app/admin/products/form/[[...id]]/page.tsx

"use client";

import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Category } from '@/types';

export default function ProductFormPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id?.[0];

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditing = Boolean(id);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/categories');
        const data = await res.json();
        setCategories(data.data || []);
      } catch (err) {
        console.error("Failed to fetch categories", err);
      }
    };

    fetchCategories();

    if (isEditing) {
      const fetchProductData = async () => {
        try {
          const res = await fetch(`/api/products/${id}`);
          const { data } = await res.json();
          setFormData({
            name: data.name,
            description: data.description,
            price: data.price.toString(),
            category: data.category?._id || '',
            imageUrl: data.imageUrl || '',
          });
        } catch (err) {
          setError('Ürün bilgileri yüklenemedi.');
          console.error(err);
        }
      };
      fetchProductData();
    }
  }, [id, isEditing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setError(null);

    const productData = {
      ...formData,
      price: parseFloat(formData.price),
    };

    const url = isEditing ? `/api/products/${id}` : '/api/products';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(productData),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'İşlem başarısız.');
      }

      router.push('/admin/products');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">
        {isEditing ? 'Ürünü Düzenle' : 'Yeni Ürün Ekle'}
      </h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        {/* Name */}
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 font-semibold mb-2">Ürün Adı</label>
          <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
        </div>

        {/* Description */}
        <div className="mb-4">
          <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">Açıklama</label>
          <textarea id="description" name="description" value={formData.description} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required />
        </div>

        {/* Price */}
        <div className="mb-4">
          <label htmlFor="price" className="block text-gray-700 font-semibold mb-2">Fiyat</label>
          <input type="number" id="price" name="price" value={formData.price} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" required step="0.01" />
        </div>

        {/* Category */}
        <div className="mb-4">
          <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">Kategori</label>
          <select id="category" name="category" value={formData.category} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md bg-white" required>
            <option value="">-- Kategori Seçin --</option>
            {categories.map(cat => (
              <option key={cat._id} value={cat._id}>{cat.name}</option>
            ))}
          </select>
        </div>

        {/* Image URL */}
        <div className="mb-4">
          <label htmlFor="imageUrl" className="block text-gray-700 font-semibold mb-2">Resim URL</label>
          <input type="url" id="imageUrl" name="imageUrl" value={formData.imageUrl} onChange={handleInputChange} className="w-full px-3 py-2 border rounded-md" placeholder="https://example.com/image.png" required />
        </div>

        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="flex gap-4">
          <button type="submit" disabled={isSaving} className="bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 disabled:bg-gray-400">
            {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
          </button>
          <button type="button" onClick={() => router.push('/admin/products')} className="bg-gray-300 text-gray-800 px-6 py-2 rounded-md hover:bg-gray-400">
            İptal
          </button>
        </div>
      </form>
    </div>
  );
}
