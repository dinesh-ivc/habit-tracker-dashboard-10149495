import { Badge } from '@/components/ui/badge';

export default function LogEntry({ log }) {
  const logDate = new Date(log.date);
  
  return (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
      <div>
        <div className="font-medium text-gray-900">
          {logDate.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
        <div className="text-sm text-gray-600">
          {log.habitName}
        </div>
      </div>
      
      <Badge variant={log.completed ? "default" : "destructive"}>
        {log.completed ? 'Completed' : 'Missed'}
      </Badge>
    </div>
  );
}