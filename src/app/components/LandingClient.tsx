// src/app/components/LandingClient.tsx

"use client";

import { useRouter } from 'next/navigation';

type LandingClientProps = {
  instagramUrl?: string;
};

export default function LandingClient({ instagramUrl }: LandingClientProps) {
  const router = useRouter();

  const handleMenuClick = () => {
    router.push('/menu');
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 text-center p-4">
      <div className="mb-8">
        <h1 className="text-5xl font-bold text-gray-800">Restoran Adı</h1>
        <p className="text-xl text-gray-500 mt-2">Lezzete Açılan Kapınız</p>
      </div>

      <button
        onClick={handleMenuClick}
        className="mb-12 bg-emerald-500 text-white font-bold py-4 px-8 rounded-full shadow-lg hover:bg-emerald-600 transition-transform transform hover:scale-105 duration-300 text-2xl"
      >
        Menüyü Görüntüle
      </button>

      {instagramUrl && instagramUrl !== '#' && (
        <div className="flex items-center space-x-4">
          <p className="text-gray-600">Bizi Takip Edin:</p>
          <a 
            href={instagramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="cursor-pointer hover:opacity-75 transition-opacity"
            title="Instagram"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600">
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
            </svg>
          </a>
        </div>
      )}
    </div>
  );
}
