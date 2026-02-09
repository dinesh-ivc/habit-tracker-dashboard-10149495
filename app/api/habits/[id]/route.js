import { NextResponse } from 'next/server';
import { supabase } from '@/lib/db';

export async function GET(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const userIdFromToken = extractUserIdFromToken(token);

    if (!userIdFromToken) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { data: habit, error } = await supabase
      .from('habits')
      .select(`
        *,
        daily_logs(*)
      `)
      .eq('id', params.id)
      .eq('user_id', userIdFromToken)
      .single();

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 404 }
      );
    }

    if (!habit) {
      return NextResponse.json(
        { message: 'Habit not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ habit });
  } catch (error) {
    console.error('Fetch habit error:', error);
    return NextResponse.json(
      { message: 'Failed to fetch habit' },
      { status: 500 }
    );
  }
}

export async function PUT(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const userIdFromToken = extractUserIdFromToken(token);

    if (!userIdFromToken) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const habitData = await request.json();
    
    // Update only the allowed fields
    const { data: updatedHabit, error } = await supabase
      .from('habits')
      .update({
        name: habitData.name,
        description: habitData.description,
        target_frequency: habitData.targetFrequency,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .eq('user_id', userIdFromToken)
      .select()
      .single();

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ habit: updatedHabit });
  } catch (error) {
    console.error('Update habit error:', error);
    return NextResponse.json(
      { message: 'Failed to update habit' },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '');
    const userIdFromToken = extractUserIdFromToken(token);

    if (!userIdFromToken) {
      return NextResponse.json(
        { message: 'Authentication required' },
        { status: 401 }
      );
    }

    const { error } = await supabase
      .from('habits')
      .delete()
      .eq('id', params.id)
      .eq('user_id', userIdFromToken);

    if (error) {
      return NextResponse.json(
        { message: error.message },
        { status: 500 }
      );
    }

    // Also delete related logs
    await supabase
      .from('daily_logs')
      .delete()
      .eq('habit_id', params.id);

    return NextResponse.json({ message: 'Habit deleted successfully' });
  } catch (error) {
    console.error('Delete habit error:', error);
    return NextResponse.json(
      { message: 'Failed to delete habit' },
      { status: 500 }
    );
  }
}

function extractUserIdFromToken(token) {
  // In a real app, you'd verify the JWT and extract user ID
  return 'dummy-user-id'; // Placeholder
}