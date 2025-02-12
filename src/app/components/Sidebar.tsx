'use client'
import React, { useState } from 'react';
import Link from 'next/link';
import { HomeIcon, PackageIcon, SettingsIcon, MenuIcon, XIcon } from 'lucide-react';

const Sidebar = () => {

  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        className="fixed top-4 left-4 z-50 p-2 bg-gray-400 md:bg-gray-900 text-white rounded-lg md:hidden"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <XIcon className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
      </button>

      <div
        className={`fixed h-full w-64 bg-gray-900 text-white p-4 transform transition-transform duration-200 ease-in-out z-40 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } md:translate-x-0`}
      >
        <div className="mb-8">
          <h1 className="text-xl font-bold">Dashboard</h1>
        </div>
        <nav className="space-y-2">
          <Link href="/" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800">
            <HomeIcon className="h-5 w-5" />
            <span>Home</span>
          </Link>
          <Link href="/orders" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800">
            <PackageIcon className="h-5 w-5" />
            <span>Orders</span>
          </Link>
          <Link href="/settings" className="flex items-center space-x-2 p-2 rounded hover:bg-gray-800">
            <SettingsIcon className="h-5 w-5" />
            <span>Settings</span>
          </Link>
        </nav>
      </div>
    </>
  );
}

export default Sidebar