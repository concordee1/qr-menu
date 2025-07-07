// src/app/admin/categories/page.tsx

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Category } from '@/types';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error('Kategoriler yüklenemedi.');
      const data = await res.json();
      // The API returns { success: true, data: [...] }, so we need to access data.data
      setCategories(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kategoriyi silmek istediğinizden emin misiniz?')) {
      return;
    }
    try {
      const res = await fetch(`/api/categories/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Kategori silinemedi.');
      }
      // Refresh the list after deleting
      fetchCategories();
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Bir hata oluştu.');
    }
  };

  if (isLoading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Kategori Yönetimi</h1>
        <Link href="/admin/categories/form">
          <span className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600">
            Yeni Kategori Ekle
          </span>
        </Link>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Kategori Adı</th>
              <th className="text-left p-2">Üst Kategori</th>
              <th className="text-right p-2">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {categories.map(category => (
              <tr key={category._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{category.name}</td>
                <td className="p-2">{category.parent?.name || '-'}</td>
                <td className="p-2 text-right">
                  <Link href={`/admin/categories/form/${category._id}`}>
                    <span className="text-blue-500 hover:underline mr-4">Düzenle</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(category._id)}
                    className="text-red-500 hover:underline"
                  >
                    Sil
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
