import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const userIdFromToken = extractUserIdFromToken(token);

    if (!userIdFromToken) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    // Fetch habits for the user
    const { data: habits } = await supabase
      .from('habits')
      .select('*')
      .eq('user_id', userIdFromToken);

    // For each habit, compute analytics
    const allStats = [];

    for (const habit of habits) {
      // Fetch logs for this specific habit
      const logQuery = supabase
        .from('daily_logs')
        .select('*')
        .eq('habit_id', habit.id)
        .eq('user_id', userIdFromToken);

      if (startDate) {
        logQuery.gte('date', startDate);
      }
      if (endDate) {
        logQuery.lte('date', endDate);
      }

      const { data: logs, error } = await logQuery.order('date', { ascending: true });

      if (error) {
        throw new Error(`Failed to fetch logs for habit ${habit.id}: ${error.message}`);
      }

      // Calculate various statistics
      const totalLogs = logs?.length || 0;
      const completedLogs = logs?.filter(log => log.completed)?.length || 0;
      
      const completionRate = totalLogs > 0 ? (completedLogs / totalLogs) * 100 : 0;

      // Calculate longest streak
      let longestStreak = 0;
      let currentStreak = 0;
      
      // Convert to array of dates to easily check for consecutive entries
      const logDates = logs.map(log => new Date(log.date).toDateString()).sort();
      
      for (let i = 0; i < logDates.length; i++) {
        if (i === 0 || 
          new Date(logDates[i]).getTime() - new Date(logDates[i - 1]).getTime() === 24 * 60 * 60 * 1000) {
          // Consecutive day
          currentStreak++;
        } else if (new Date(logDates[i]).getTime() - new Date(logDates[i - 1]).getTime() > 24 * 60 * 60 * 1000) {
          // Gap longer than a day - break streak unless there was more than a gap
          currentStreak = 1; // Reset to current, unless it's truly interrupted
        } else {
          currentStreak = 1;
        }
        
        if (currentStreak > longestStreak) {
          longestStreak = currentStreak;
        }
      }

      const stats = {
        habitId: habit.id,
        habitName: habit.name,
        totalLogs,
        completedLogs,
        completionRate: Math.round(completionRate),
        longestStreak
      };

      allStats.push(stats);
    }

    return NextResponse.json({ stats: allStats });
  } catch (error) {
    console.error('Fetch stats error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}

function extractUserIdFromToken(token) {
  // In a real app, you'd verify the JWT and extract user ID
  return 'dummy-user-id'; // Placeholder
}