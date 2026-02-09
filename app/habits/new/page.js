'use client';

import { useState } from 'react';
import HabitForm from '@/components/HabitForm';
import { useRouter } from 'next/navigation';

export default function NewHabitPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCreateHabit = async (habitData) => {
    setLoading(true);
    try {
      const response = await fetch('/api/habits', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(habitData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create habit');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      alert('Error creating habit: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Create New Habit</h1>
        <p className="text-gray-600 mt-2">Set up a habit you want to track daily</p>
      </div>

      <HabitForm
        onSubmit={handleCreateHabit}
        loading={loading}
      />
    </div>
  );
}