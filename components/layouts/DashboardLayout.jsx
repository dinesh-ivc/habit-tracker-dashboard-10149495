'use client';

import { useState } from 'react';
import Sidebar from '../Sidebar';
import AppBar from '../AppBar';

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile sidebar */}
      <div className="lg:hidden">
        <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />
      </div>

      <div className="flex">
        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div className="flex-1">
          <AppBar onMenuClick={() => setSidebarOpen(true)} />
          
          <main className="p-6 lg:p-8">
            {children}
          </main>
        </div>
      </div>
    </div>
  );
}