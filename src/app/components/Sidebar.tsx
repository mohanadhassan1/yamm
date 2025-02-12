import React from 'react';
import Link from 'next/link';
import { HomeIcon, PackageIcon, SettingsIcon } from 'lucide-react';

export function Sidebar() {
  return (
    <div className="fixed h-full w-64 bg-gray-900 text-white p-4">
      <div className="mb-8">
        <h1 className="text-xl font-bold">Dashboard</h1>
      </div>
      <nav className="space-y-2">
        <Link href="/dashboard" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800">
          <HomeIcon className="h-5 w-5" />
          <span>Home</span>
        </Link>
        <Link href="/dashboard/orders" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800">
          <PackageIcon className="h-5 w-5" />
          <span>Orders</span>
        </Link>
        <Link href="/dashboard/settings" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800">
          <SettingsIcon className="h-5 w-5" />
          <span>Settings</span>
        </Link>
      </nav>
    </div>
  );
}