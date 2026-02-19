import { useGetAttendanceByStudent } from '../hooks/useQueries';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { CheckCircle2, XCircle, Calendar } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

interface AttendanceHistoryProps {
  studentId: bigint | null;
}

export default function AttendanceHistory({ studentId }: AttendanceHistoryProps) {
  const { data: attendance, isLoading } = useGetAttendanceByStudent(studentId);

  if (!studentId) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>Select a student to view attendance history</p>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Loading attendance...</p>
      </div>
    );
  }

  if (!attendance || attendance.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500 dark:text-gray-400">
        <p>No attendance records for this student yet</p>
      </div>
    );
  }

  const totalDays = attendance.length;
  const presentDays = attendance.filter((record) => record.present).length;
  const absentDays = totalDays - presentDays;
  const attendancePercentage = totalDays > 0 ? Math.round((presentDays / totalDays) * 100) : 0;

  return (
    <div className="space-y-4">
      <Card className="p-4 bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700 border-blue-200 dark:border-gray-600">
        <h3 className="font-semibold text-lg text-blue-900 dark:text-blue-100 mb-3">Statistics</h3>
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-gray-700 dark:text-gray-300">Attendance Rate</span>
              <span className="font-bold text-blue-900 dark:text-blue-100">{attendancePercentage}%</span>
            </div>
            <Progress value={attendancePercentage} className="h-2" />
          </div>
          <div className="grid grid-cols-3 gap-2 text-center">
            <div className="p-2 bg-white dark:bg-gray-800 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400">Total</p>
              <p className="text-lg font-bold text-gray-900 dark:text-gray-100">{totalDays}</p>
            </div>
            <div className="p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <p className="text-xs text-green-700 dark:text-green-400">Present</p>
              <p className="text-lg font-bold text-green-900 dark:text-green-100">{presentDays}</p>
            </div>
            <div className="p-2 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <p className="text-xs text-red-700 dark:text-red-400">Absent</p>
              <p className="text-lg font-bold text-red-900 dark:text-red-100">{absentDays}</p>
            </div>
          </div>
        </div>
      </Card>

      <div className="space-y-2 max-h-[300px] overflow-y-auto">
        <h3 className="font-semibold text-gray-900 dark:text-gray-100">Recent Records</h3>
        {attendance.slice().reverse().map((record, idx) => (
          <div
            key={idx}
            className={`flex items-center justify-between p-3 rounded-lg ${
              record.present
                ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                : 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800'
            }`}
          >
            <div className="flex items-center gap-3">
              {record.present ? (
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              ) : (
                <XCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-gray-500" />
                <span className="font-medium text-gray-900 dark:text-gray-100">{record.date}</span>
              </div>
            </div>
            <Badge variant={record.present ? 'default' : 'destructive'}>
              {record.present ? 'Present' : 'Absent'}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  );
}
