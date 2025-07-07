// src/lib/data.ts
import 'server-only'; // Ensures this code only runs on the server
import dbConnect from './dbConnect';
import Product from '@/models/Product';
import Category from '@/models/Category';

export async function getProductsData() {
  try {
    await dbConnect();
    const products = await Product.find({}).populate('category').lean();
    // Convert non-serializable data like ObjectId to string
    return JSON.parse(JSON.stringify(products));
  } catch (error) {
    console.error("Database Error (getProductsData):", error);
    throw new Error('Failed to fetch products data.');
  }
}

export async function getCategoriesData() {
  try {
    await dbConnect();
    const categories = await Category.find({}).populate('parent').lean();
    return JSON.parse(JSON.stringify(categories));
  } catch (error) {
    console.error("Database Error (getCategoriesData):", error);
    throw new Error('Failed to fetch categories data.');
  }
}
