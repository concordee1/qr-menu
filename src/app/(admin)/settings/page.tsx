// src/app/(admin)/settings/page.tsx

"use client";

import { useState, useEffect } from 'react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({ instagramUrl: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    // Fetch initial settings
    const fetchSettings = async () => {
      try {
        const res = await fetch('/api/settings');
        if (!res.ok) throw new Error('Ayarlar alınamadı');
        const data = await res.json();
        setSettings(prev => ({ ...prev, ...data }));
      } catch (error) {
        setMessage(error instanceof Error ? error.message : 'Bir hata oluştu');
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setMessage('');
    try {
      const res = await fetch('/api/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error('Ayarlar kaydedilemedi');
      const data = await res.json();
      if (data.success) {
        setMessage('Ayarlar başarıyla kaydedildi!');
      } else {
        throw new Error(data.message || 'Bilinmeyen bir hata oluştu');
      }
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Bir hata oluştu');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <div>Yükleniyor...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Genel Ayarlar</h1>
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md">
        <div className="mb-4">
          <label htmlFor="instagramUrl" className="block text-gray-700 font-semibold mb-2">
            Instagram URL
          </label>
          <input
            type="url"
            id="instagramUrl"
            name="instagramUrl"
            value={settings.instagramUrl}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-emerald-500"
            placeholder="https://instagram.com/kullaniciadiniz"
          />
        </div>
        
        <button
          type="submit"
          disabled={isSaving}
          className="bg-emerald-500 text-white px-6 py-2 rounded-md hover:bg-emerald-600 disabled:bg-gray-400"
        >
          {isSaving ? 'Kaydediliyor...' : 'Kaydet'}
        </button>

        {message && <p className="mt-4 text-sm text-gray-600">{message}</p>}
      </form>
    </div>
  );
}
