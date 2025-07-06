// src/app/page.tsx

import MenuClient from './components/MenuClient';

// Veri çeken fonksiyonlarımız aynı kalıyor.
async function getProducts() {
  const res = await fetch('http://localhost:3000/api/products', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch products');
  return res.json();
}

async function getCategories() {
  const res = await fetch('http://localhost:3000/api/categories', { cache: 'no-store' });
  if (!res.ok) throw new Error('Failed to fetch categories');
  return res.json();
}

// Bu component artık bir Sunucu Component'i. "use client" veya useState yok.
export default async function Home() {
  // 1. Veriyi sunucuda BİR KERE çekiyoruz.
  const products = await getProducts();
  const categories = await getCategories();

  // 2. Çektiğimiz hazır verileri, interaktif olan MenuClient component'ine prop olarak gönderiyoruz.
  return <MenuClient products={products} categories={categories} />;
}