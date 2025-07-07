// src/components/MenuClient.tsx

// src/components/MenuClient.tsx

"use client";

import { useState, useMemo } from 'react';
import ProductCard from './ProductCard';
import CategoryCard from './CategoryCard';
import { Product, Category } from '@/types';

export default function MenuClient({ products, categories }: { products: Product[], categories: Category[] }) {
  const [currentParent, setCurrentParent] = useState<Category | null>(null);

  // useMemo kullanarak gereksiz hesaplamaları önlüyoruz.
  // Sadece currentParent değiştiğinde yeniden hesaplanacak.
  const categoriesToShow = useMemo(() => {
    return categories.filter(c => {
      if (currentParent === null) {
        // En üst seviyede, parent'ı olmayanları göster
        return !c.parent;
      }
      // Seçili kategorinin alt kategorilerini göster
      return c.parent?._id === currentParent._id;
    });
  }, [categories, currentParent]);

  // useMemo kullanarak gereksiz hesaplamaları önlüyoruz.
  // Sadece currentParent veya products değiştiğinde yeniden hesaplanacak.
  const productsToShow = useMemo(() => {
    if (!currentParent) return [];
    return products.filter(p => {
      // Check if category is populated (is an object) or just an ID (is a string)
      const categoryId = typeof p.category === 'object' && p.category !== null ? p.category._id : p.category;
      return categoryId === currentParent._id;
    });
  }, [products, currentParent]);

  const handleCategoryClick = (category: Category) => {
    setCurrentParent(category);
  };

  const handleBackClick = () => {
    if (currentParent?.parent) {
      // Mevcut kategorinin ebeveynini bul ve ona geri dön
      const grandParent = categories.find(c => c._id === currentParent.parent?._id) || null;
      setCurrentParent(grandParent);
    } else {
      // En üst seviyeye geri dön
      setCurrentParent(null);
    }
  };

  // Ürünlerin gösterilip gösterilmeyeceğini belirleyen koşul
  const shouldShowProducts = currentParent && categoriesToShow.length === 0;

  return (
    <div className="w-full text-center p-8">
      <h1 className="text-4xl font-bold mb-4">{currentParent ? currentParent.name : "Kategoriler"}</h1>

      {currentParent && (
        <button 
          onClick={handleBackClick}
          className="mb-4 bg-emerald-500 text-white px-4 py-2 rounded-md shadow-md hover:bg-emerald-600 transition duration-200"
        >
          &larr; Geri
        </button>
      )}

      <div className="flex flex-wrap justify-center items-start gap-4">
        {shouldShowProducts ? (
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
          categoriesToShow.map(category => (
            <CategoryCard 
              key={category._id}
              category={category}
              onClick={() => handleCategoryClick(category)}
            />
          ))
        )}
      </div>
    </div>
  );
}
