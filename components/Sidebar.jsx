'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';

export default function Sidebar({ isOpen, onClose }) {
  const router = useRouter();

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
    router.refresh();
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard' },
    { name: 'Habits', href: '/dashboard' },
    { name: 'Analytics', href: '/dashboard' },
  ];

  if (typeof window !== 'undefined') {
    return (
      <div 
        className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        } transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-gray-200">
          <div className="font-bold text-lg">HabitTracker</div>
          {isOpen && (
            <Button 
              variant="ghost" 
              size="sm"
              className="lg:hidden"
              onClick={onClose}
            >
              âœ•
            </Button>
          )}
        </div>
        
        <nav className="mt-6">
          <ul className="space-y-2 px-4">
            {navItems.map((item) => (
              <li key={item.name}>
                <Link href={item.href}>
                  <div className="flex items-center px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 cursor-pointer">
                    {item.name}
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div className="absolute bottom-0 w-full p-4 border-t border-gray-200">
          <Button onClick={handleLogout} variant="outline" className="w-full">
            Logout
          </Button>
        </div>
      </div>
    );
  }

  return null;
}