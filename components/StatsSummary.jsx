import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function StatsSummary({ habits }) {
  const totalHabits = habits.length;
  const completedToday = habits.filter(habit => {
    const today = new Date().toISOString().split('T')[0];
    const todayLog = habit.dailyLogs.find(log => log.date === today);
    return todayLog?.completed;
  }).length;
  const totalCompletionRate = habits.length > 0 
    ? Math.round(
        habits.reduce((sum, habit) => 
          sum + (habit.dailyLogs.length > 0 
            ? habit.dailyLogs.filter(log => log.completed).length / habit.dailyLogs.length 
            : 0)
        , 0) / habits.length * 100
      )
    : 0;

  const longestStreak = Math.max(...habits.map(habit => habit.currentStreak || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Total Habits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalHabits}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Completed Today</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{completedToday}</div>
          <div className="text-xs text-gray-500 mt-1">out of {totalHabits}</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Avg Completion Rate</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalCompletionRate}%</div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">Longest Streak</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{longestStreak}</div>
          <div className="text-xs text-gray-500 mt-1">days</div>
        </CardContent>
      </Card>
    </div>
  );
}