'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function AppBar({ onMenuClick }) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={onMenuClick}
          >
            â˜°
          </Button>
          <h1 className="text-xl font-semibold text-gray-900">Habit Tracker</h1>
        </div>

        <div className="relative">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsProfileOpen(!isProfileOpen)}
          >
            {localStorage.getItem('firstName') || 'Welcome'} â–¼
          </Button>
          
          {isProfileOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-50">
              <div className="px-4 py-2 border-b border-gray-200">
                <div className="text-sm font-medium">
                  {localStorage.getItem('firstName')} {localStorage.getItem('lastName')}
                </div>
                <div className="text-xs text-gray-500">
                  {localStorage.getItem('email')}
                </div>
              </div>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  localStorage.removeItem('firstName');
                  localStorage.removeItem('lastName');
                  localStorage.removeItem('email');
                  window.location.href = '/login';
                }}
                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}