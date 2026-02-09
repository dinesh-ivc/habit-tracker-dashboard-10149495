'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export default function HabitCard({ habit, onUpdate }) {
  const [checkedToday, setCheckedToday] = useState(false);
  const [currentStreak, setCurrentStreak] = useState(0);

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const todayLog = habit.dailyLogs.find(log => log.date === today);
    setCheckedToday(todayLog ? todayLog.completed : false);
    
    // Calculate current streak based on recent logs
    calculateCurrentStreak();
  }, [habit]);

  const calculateCurrentStreak = () => {
    // Simple streak calculation - you might want to enhance this
    const sortedLogs = [...habit.dailyLogs].sort((a, b) => new Date(b.date) - new Date(a.date));
    let streak = 0;
    const today = new Date();
    
    for (let i = 0; i < sortedLogs.length; i++) {
      const logDate = new Date(sortedLogs[i].date);
      const diffDays = Math.floor((today - logDate) / (1000 * 60 * 60 * 24));
      
      if (diffDays === i && sortedLogs[i].completed) {
        streak++;
      } else {
        break;
      }
    }
    
    setCurrentStreak(streak);
  };

  const handleCheckIn = async () => {
    try {
      const today = new Date().toISOString().split('T')[0];
      
      const response = await fetch('/api/logs', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          habitId: habit.id,
          date: today,
          completed: !checkedToday
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update log');
      }

      setCheckedToday(!checkedToday);
      onUpdate();
    } catch (error) {
      console.error('Error updating habit log:', error);
    }
  };

  const completionRate = habit.dailyLogs.length > 0 
    ? Math.round((habit.dailyLogs.filter(log => log.completed).length / habit.dailyLogs.length) * 100)
    : 0;

  return (
    <div className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">{habit.name}</h3>
          <p className="text-gray-600 text-sm mt-1">{habit.description}</p>
        </div>
        <Badge variant="secondary" className="ml-2">
          {habit.targetFrequency}/day
        </Badge>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Completion Rate:</span>
          <span className="font-medium">{completionRate}%</span>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">Current Streak:</span>
          <span className="font-medium">{currentStreak}</span>
        </div>

        <div className="pt-3">
          <Button
            onClick={handleCheckIn}
            variant={checkedToday ? "default" : "outline"}
            className="w-full"
            disabled={checkedToday}
          >
            {checkedToday ? 'Completed Today ✓' : 'Mark Complete Today'}
          </Button>
        </div>
      </div>
    </div>
  );
}