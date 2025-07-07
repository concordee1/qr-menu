// src/app/api/products/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/Product';

export async function GET(request: Request) {
  try {
    await dbConnect();
    // Populate category details when fetching products
    const products = await Product.find({}).populate('category');
    return NextResponse.json({ success: true, data: products });
  } catch (error) {
    console.error("API Error:", error);
    return NextResponse.json({ success: false, message: 'Something went wrong!' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const newProduct = await Product.create(body);
    return NextResponse.json({ success: true, data: newProduct }, { status: 201 });
  } catch (error) {
    console.error("API Error:", error);
    // Provide more specific error message for validation errors
    const errorMessage = error instanceof Error ? error.message : 'Something went wrong!';
    return NextResponse.json({ success: false, message: errorMessage }, { status: 400 });
  }
}
