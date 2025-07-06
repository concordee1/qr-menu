// src/components/MenuClient.tsx

"use client";

import { useState } from 'react';
import ProductCard from './ProductCard';

// Kategori ve Ürün tiplerimizi daha net tanımlayalım
type Category = {
  _id: string;
  name: string;
  parent?: { _id: string; name: string };
  imageUrl: string;
};

type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string; // Kategori ID'si
};

export default function MenuClient({ products, categories }: { products: Product[], categories: Category[] }) {

  // State'imizi güncelliyoruz: Artık seçili olan 'üst' kategoriyi tutacağız.
  // Başlangıçta null, yani en üst seviyeyi göstereceğiz.
  const [currentParent, setCurrentParent] = useState<Category | null>(null);

  // Gösterilecek alt kategorileri hesaplayalım
  const categoriesToShow = categories.filter(c => {
    if (currentParent === null) return c.parent === null; // En üst seviyede olanları göster
    return c.parent?._id === currentParent._id; // Seçili olanın altındakileri göster
  });

  // Gösterilecek ürünleri hesaplayalım
  const productsToShow = products.filter(p => p.category === currentParent?._id);

  // Kategoriye tıklama fonksiyonu
  const handleCategoryClick = (category: Category) => {
    setCurrentParent(category); // Tıklanan kategoriyi yeni 'ebeveyn' olarak ayarla
  };

  // Geri gitme fonksiyonu
  const handleBackClick = () => {
    if (currentParent?.parent) {
      // Eğer mevcut kategorinin bir ebeveyni varsa, ona geri dön
      const grandParent = categories.find(c => c._id === currentParent.parent?._id) || null;
      setCurrentParent(grandParent);
    } else {
      // Yoksa en başa dön
      setCurrentParent(null);
    }
  };

  // Eğer bir kategori seçilmişse ve o kategorinin alt kategorisi yoksa, ürünleri göster.
  const shouldShowProducts = currentParent && categoriesToShow.length === 0;

  return (
    <div className="w-full text-center p-8">
      <h1 className="text-4xl font-bold mb-4">{currentParent ? currentParent.name : "Kategoriler"}</h1>

      {/* Geri Butonu: En üst seviyede değilsek göster */}
      {currentParent && (
        <button 
          onClick={handleBackClick}
          className="mb-4 bg-emerald-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-emerald-600 transition duration-200"
        >
          &larr; Geri
        </button>
      )}

      {/* Duruma göre ya kategorileri ya da ürünleri göster */}
      <div className="flex flex-wrap justify-center items-center gap-4">
        {shouldShowProducts ? (
          // Ürünleri Göster
          productsToShow.map(product => (
            <ProductCard 
              key={product._id} 
              productName={product.name}
              description={product.description}
              price={product.price}
              imageUrl={product.imageUrl}
            />
          ))
        ) : (
          // Kategorileri Göster
          categoriesToShow.map(category => (
  <div 
    key={category._id}
    onClick={() => handleCategoryClick(category)}
    className="w-72 h-48 rounded-lg shadow-xl flex items-end p-4 text-white font-bold text-2xl bg-cover bg-center cursor-pointer transform hover:scale-105 transition-transform duration-300"
    style={{ backgroundImage: `url(${category.imageUrl || '/placeholder.png'})` }}
  >
    {/* Resmin üzerine hafif bir karartma efekti ekleyerek yazının okunurluğunu artırıyoruz */}
    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>
    
    {/* Kategori adını z-index ile karartma efektinin üzerine çıkarıyoruz */}
    <span className="relative z-10">{category.name}</span>
  </div>
))
        )}
      </div>
    </div>
  );
}