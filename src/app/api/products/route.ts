// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export async function GET(request: Request) {
  try {
    // 1. Veritabanına bağlan
    await dbConnect();

    // 2. Tüm ürünleri bul
    const products = await Product.find({});

    // 3. Ürünleri JSON olarak geri döndür
    return NextResponse.json(products);
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ message: 'Something went wrong!' }, { status: 500 });
  }
}