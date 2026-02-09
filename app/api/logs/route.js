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
    const habitId = searchParams.get('habitId');

    let query = supabase
      .from('daily_logs')
      .select(`
        *,
        habit:habits(name)
      `)
      .eq('user_id', userIdFromToken);

    if (startDate) {
      query = query.gte('date', startDate);
    }

    if (endDate) {
      query = query.lte('date', endDate);
    }

    if (habitId) {
      query = query.eq('habit_id', habitId);
    }

    const { data: logs, error } = await query.order('date', { ascending: false });

    if (error) {
      throw new Error(error.message);
    }

    // Format habit name for each log
    const formattedLogs = logs.map(log => ({
      ...log,
      habitName: log.habit?.name || 'Unknown Habit'
    }));

    return NextResponse.json({ logs: formattedLogs });
  } catch (error) {
    console.error('Fetch logs error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch logs' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const userIdFromToken = extractUserIdFromToken(token);

    if (!userIdFromToken) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const logData = await request.json();

    if (!logData.habitId || !logData.date || typeof logData.completed === 'undefined') {
      return NextResponse.json(
        { message: 'Habit ID, date, and completion status are required' },
        { status: 400 }
      );
    }

    // Check if log already exists for this habit and date
    const { data: existingLog } = await supabase
      .from('daily_logs')
      .select('id')
      .eq('habit_id', logData.habitId)
      .eq('date', logData.date)
      .eq('user_id', userIdFromToken)
      .single();

    let result;
    if (existingLog) {
      // Update existing log
      const { data, error } = await supabase
        .from('daily_logs')
        .update({ completed: logData.completed })
        .eq('id', existingLog.id)
        .select()
        .single();

      if (error) throw error;
      result = data;
    } else {
      // Create new log
      const { data, error } = await supabase
        .from('daily_logs')
        .insert([
          {
            habit_id: logData.habitId,
            user_id: userIdFromToken,
            date: logData.date,
            completed: logData.completed
          }
        ])
        .select()
        .single();

      if (error) throw error;
      result = data;
    }

    return NextResponse.json(
      { log: result },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create/edit log error:', error);
    return NextResponse.json(
      { message: 'Failed to create or update log' },
      { status: 500 }
    );
  }
}

function extractUserIdFromToken(token) {
  // In a real app, you'd verify the JWT and extract user ID
  return 'dummy-user-id'; // Placeholder
}