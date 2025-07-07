// src/app/(admin)/products/page.tsx

"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Product } from '@/types';

// We need to extend the Product type to possibly include the populated category object
interface PopulatedProduct extends Omit<Product, 'category'> {
  category: {
    _id: string;
    name: string;
  } | null;
}

export default function ProductsPage() {
  const [products, setProducts] = useState<PopulatedProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/products');
      if (!res.ok) throw new Error('Ürünler yüklenemedi.');
      const data = await res.json();
      setProducts(data.data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Bu ürünü silmek istediğinizden emin misiniz?')) {
      return;
    }
    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      const result = await res.json();
      if (!res.ok || !result.success) {
        throw new Error(result.message || 'Ürün silinemedi.');
      }
      fetchProducts(); // Refresh list
    } catch (err) {
      alert(err instanceof Error ? err.message : 'Bir hata oluştu.');
    }
  };

  if (isLoading) return <div>Yükleniyor...</div>;
  if (error) return <div>Hata: {error}</div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Ürün Yönetimi</h1>
        <Link href="/admin/products/form">
          <span className="bg-emerald-500 text-white px-4 py-2 rounded-md hover:bg-emerald-600">
            Yeni Ürün Ekle
          </span>
        </Link>
      </div>
      <div className="bg-white p-4 rounded-lg shadow-md">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-2">Ürün Adı</th>
              <th className="text-left p-2">Kategori</th>
              <th className="text-left p-2">Fiyat</th>
              <th className="text-right p-2">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product._id} className="border-b hover:bg-gray-50">
                <td className="p-2">{product.name}</td>
                <td className="p-2">{product.category?.name || 'N/A'}</td>
                <td className="p-2">{product.price} TL</td>
                <td className="p-2 text-right">
                  <Link href={`/admin/products/form/${product._id}`}>
                    <span className="text-blue-500 hover:underline mr-4">Düzenle</span>
                  </Link>
                  <button
                    onClick={() => handleDelete(product._id)}
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
