"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

export default function SuperAdminRoutingHub() {
  const router = useRouter();

  const navigateTo = (route: string) => {
    router.push(route);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-black">
      <div className="flex w-full max-w-3xl flex-wrap justify-center gap-8 p-8">
        {/* Admin Button */}
        <div 
          onClick={() => navigateTo('/admin')} 
          className="cursor-pointer w-64 h-48 rounded-xl border-2 border-green-400 p-6 flex flex-col justify-center text-center bg-black hover:bg-gray-900 transition-colors"
        >
          <h2 className="text-green-400 text-2xl font-bold mb-4">admin</h2>
          <p className="text-green-400 text-sm">click to go</p>
          <p className="text-green-400 text-sm">to admin route</p>
        </div>
        
        {/* Home Page Button */}
        <div 
          onClick={() => navigateTo('/')}
          className="cursor-pointer w-64 h-48 rounded-xl border-2 border-green-400 p-6 flex flex-col justify-center text-center bg-black hover:bg-gray-900 transition-colors"
        >
          <h2 className="text-green-400 text-2xl font-bold mb-4">home page</h2>
          <p className="text-green-400 text-sm">click to go</p>
          <p className="text-green-400 text-sm">to home route</p>
        </div>
      </div>
    </div>
  );
}