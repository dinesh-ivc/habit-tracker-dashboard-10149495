'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-gray-900">
          Build Better Habits
        </h1>
        <p className="text-xl text-gray-600">
          Track your daily progress and achieve your goals with our simple habit tracker
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg">
            <Link href="/register">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}