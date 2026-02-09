'use client';

import { useState, useEffect } from 'react';
import HabitCard from '@/components/HabitCard';
import StatsSummary from '@/components/StatsSummary';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export default function DashboardPage() {
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchHabits();
  }, []);

  const fetchHabits = async () => {
    try {
      const response = await fetch('/api/habits', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch habits');
      }

      const data = await response.json();
      setHabits(data.habits || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHabitUpdate = () => {
    fetchHabits();
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-lg">Loading habits...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Habit Tracker Dashboard</h1>
          <p className="text-gray-600 mt-2">Track and improve your daily habits</p>
        </div>
        <Button asChild>
          <Link href="/habits/new">Add New Habit</Link>
        </Button>
      </div>

      <StatsSummary habits={habits} />

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {habits.map((habit) => (
          <HabitCard
            key={habit.id}
            habit={habit}
            onUpdate={handleHabitUpdate}
          />
        ))}
      </div>

      {habits.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-900 mb-2">No habits yet</h3>
          <p className="text-gray-600 mb-4">Start building better habits by adding your first one</p>
          <Button asChild>
            <Link href="/habits/new">Create Your First Habit</Link>
          </Button>
        </div>
      )}
    </div>
  );
}