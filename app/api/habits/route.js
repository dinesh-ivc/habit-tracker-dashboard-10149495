import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(request) {
  try {
    // Extract user ID from auth header (this would come from middleware)
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    // In a real app, you'd verify the JWT and extract user ID
    // For this example, assume we get user ID from somewhere
    // Let's decode it here assuming it was stored in localStorage
    // In reality, you'd use JWT verification middleware
    
    // Get user ID from session (simplified for demo)
    const searchParams = request.nextUrl.searchParams;
    const userId = searchParams.get('userId'); // This is just for demo

    if (!userId) {
      return NextResponse.json(
        { message: 'User not authenticated' },
        { status: 401 }
      );
    }

    const { data: habits, error } = await supabase
      .from('habits')
      .select(`
        *,
        daily_logs(*)
      `)
      .eq('user_id', userId);

    if (error) {
      throw new Error(error.message);
    }

    // For each habit, calculate relevant metrics
    const habitsWithStats = await Promise.all(habits.map(async (habit) => {
      const { data: logs, error: logsError } = await supabase
        .from('daily_logs')
        .select('*')
        .eq('habit_id', habit.id)
        .order('date', { ascending: false });

      if (logsError) {
        console.error('Error fetching logs for habit:', habit.id, logsError);
        return { ...habit, dailyLogs: [], currentStreak: 0 };
      }

      // Calculate current streak
      const today = new Date().toISOString().split('T')[0];
      let currentStreak = 0;
      const sortedLogs = [...logs].sort((a, b) => new Date(b.date) - new Date(a.date));

      while (currentStreak < sortedLogs.length) {
        const logDate = new Date(sortedLogs[currentStreak].date);
        const expectedDate = new Date();
        expectedDate.setDate(expectedDate.getDate() - currentStreak);
        
        if (sortedLogs[currentStreak].completed && 
            logDate.toISOString().split('T')[0] === expectedDate.toISOString().split('T')[0]) {
          currentStreak++;
        } else {
          break;
        }
      }

      return {
        ...habit,
        dailyLogs: logs || [],
        currentStreak
      };
    }));

    return NextResponse.json({ habits: habitsWithStats });
  } catch (error) {
    console.error('Fetch habits error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch habits' },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const userIdFromToken = extractUserIdFromToken(token);
    if (!userIdFromToken) {
      return NextResponse.json(
        { message: 'Invalid token' },
        { status: 401 }
      );
    }

    const habitData = await request.json();

    if (!habitData.name || !habitData.description || !habitData.targetFrequency) {
      return NextResponse.json(
        { message: 'Missing required fields' },
        { status: 400 }
      );
    }

    const { data: newHabit, error } = await supabase
      .from('habits')
      .insert([
        {
          user_id: userIdFromToken,
          name: habitData.name,
          description: habitData.description,
          target_frequency: habitData.targetFrequency,
        }
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json(
      { habit: newHabit },
      { status: 201 }
    );
  } catch (error) {
    console.error('Create habit error:', error);
    return NextResponse.json(
      { message: 'Failed to create habit' },
      { status: 500 }
    );
  }
}

// Helper function to extract userId from token
function extractUserIdFromToken(token) {
  try {
    // In a real app, you'd verify JWT token properly
    // For now, return a dummy value or implement proper JWT verification
    return 'dummy-user-id'; // This would come from JWT verification in real implementation
  } catch (error) {
    return null;
  }
}