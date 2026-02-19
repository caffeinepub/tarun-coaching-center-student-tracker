import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import AttendanceForm from '../components/AttendanceForm';
import AttendanceHistory from '../components/AttendanceHistory';

export default function AttendancePage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedStudentId, setSelectedStudentId] = useState<bigint | null>(null);

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/login' });
    }
  }, [identity, navigate]);

  if (!identity) {
    return null;
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">Attendance Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Record and track student attendance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-blue-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Record Attendance</CardTitle>
            <CardDescription>Mark student attendance</CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceForm onDateSelect={setSelectedDate} onStudentSelect={setSelectedStudentId} />
          </CardContent>
        </Card>

        <Card className="shadow-lg border-blue-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Attendance History</CardTitle>
            <CardDescription>View attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            <AttendanceHistory studentId={selectedStudentId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
