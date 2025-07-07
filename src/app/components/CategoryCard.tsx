// src/app/components/CategoryCard.tsx

import { Category } from '@/types';

type CategoryCardProps = {
  category: Category;
  onClick: () => void;
};

export default function CategoryCard({ category, onClick }: CategoryCardProps) {
  return (
    <div 
      onClick={onClick}
      className="relative w-72 h-48 rounded-lg shadow-xl flex items-end p-4 text-white font-bold text-2xl bg-cover bg-center cursor-pointer transform hover:scale-105 transition-transform duration-300"
      style={{ backgroundImage: `url(${category.imageUrl || '/placeholder.png'})` }}
    >
      {/* Resmin üzerine hafif bir karartma efekti ekleyerek yazının okunurluğunu artırıyoruz */}
      <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>
      
      {/* Kategori adını z-index ile karartma efektinin üzerine çıkarıyoruz */}
      <span className="relative z-10">{category.name}</span>
    </div>
  );
}
