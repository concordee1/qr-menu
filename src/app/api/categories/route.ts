// src/app/api/categories/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';

// --- Tüm kategorileri getiren GET fonksiyonu ---
export async function GET(request: Request) {
  try {
    await dbConnect(); // Veritabanına bağlan

    // Tüm kategorileri bul ve parent bilgilerini de "populate" et
    const categories = await Category.find({}).populate('parent');

    return NextResponse.json({ success: true, data: categories });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}


// --- Yeni bir kategori oluşturan POST fonksiyonu ---
export async function POST(request: Request) {
  try {
    await dbConnect(); // Veritabanına bağlan

    // Gelen isteğin body'sinden JSON verisini al (örneğin { name: "Pizzalar" })
    const body = await request.json(); 
    
    // Eğer istekte parent belirtilmemişse, null olarak ayarla. Bu bir ana kategori olur.
    if (!body.parent) {
      body.parent = null;
    }

    // Yeni kategoriyi veritabanına kaydet
    const newCategory = await Category.create(body); 

    // Başarıyla oluşturulduğuna dair yeni kategoriyi ve 201 kodunu geri döndür.
    return NextResponse.json({ success: true, data: newCategory }, { status: 201 }); 
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}
