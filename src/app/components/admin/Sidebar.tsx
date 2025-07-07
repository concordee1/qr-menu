// src/app/components/admin/Sidebar.tsx

"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navLinks = [
  { href: '/admin/dashboard', label: 'Dashboard' },
  { href: '/admin/categories', label: 'Kategoriler' },
  { href: '/admin/products', label: 'Ürünler' },
  { href: '/admin/settings', label: 'Ayarlar' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-gray-800 text-white h-screen p-4">
      <h2 className="text-2xl font-bold mb-8">Admin Paneli</h2>
      <nav>
        <ul>
          {navLinks.map(link => {
            const isActive = pathname === link.href;
            return (
              <li key={link.href} className="mb-2">
                <Link href={link.href}>
                  <span className={`block p-2 rounded-md ${isActive ? 'bg-emerald-500' : 'hover:bg-gray-700'}`}>
                    {link.label}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
}
