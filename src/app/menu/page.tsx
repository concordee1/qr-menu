// src/app/menu/page.tsx

import MenuClient from '../components/MenuClient';
import { getProductsData, getCategoriesData } from '../../lib/data';

// This is the Server Component for the menu page.
export default async function MenuPage() {
  // Fetch data directly from the database on the server, avoiding the localhost fetch.
  const products = await getProductsData();
  const categories = await getCategoriesData();

  return <MenuClient products={products} categories={categories} />;
}
