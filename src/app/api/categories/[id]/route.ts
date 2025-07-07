// src/app/api/categories/[id]/route.ts

import { NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Category from '@/models/Category';
import Product from '@/models/Product';

// GET a single category by ID
export async function GET(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const category = await Category.findById(params.id).populate('parent');
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}

// UPDATE a category by ID
export async function PUT(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    const body = await request.json();
    // Ensure parent is null if an empty string is passed
    if (body.parent === '') {
      body.parent = null;
    }
    const category = await Category.findByIdAndUpdate(params.id, body, {
      new: true,
      runValidators: true,
    });
    if (!category) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: category });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 400 });
  }
}

// DELETE a category by ID
export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  await dbConnect();
  try {
    // Optional: Check if any products are using this category before deleting
    const productCount = await Product.countDocuments({ category: params.id });
    if (productCount > 0) {
      return NextResponse.json(
        { success: false, message: 'Cannot delete category. It is currently in use by products.' },
        { status: 400 }
      );
    }
    
    // Optional: Check if this category is a parent to other categories
    const childCount = await Category.countDocuments({ parent: params.id });
    if (childCount > 0) {
        return NextResponse.json(
            { success: false, message: 'Cannot delete category. It is a parent to other categories.' },
            { status: 400 }
        );
    }

    const deletedCategory = await Category.findByIdAndDelete(params.id);
    if (!deletedCategory) {
      return NextResponse.json({ success: false, message: 'Category not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, message: 'Category deleted' });
  } catch (error) {
    return NextResponse.json({ success: false, message: 'Server error' }, { status: 500 });
  }
}
