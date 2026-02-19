import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import MarkForm from '../components/MarkForm';
import MarksHistory from '../components/MarksHistory';

export default function MarksPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();
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
        <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">Marks Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Record and track student marks</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-blue-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Record Marks</CardTitle>
            <CardDescription>Add marks for students</CardDescription>
          </CardHeader>
          <CardContent>
            <MarkForm onStudentSelect={setSelectedStudentId} />
          </CardContent>
        </Card>

        <Card className="shadow-lg border-blue-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Marks History</CardTitle>
            <CardDescription>View student performance</CardDescription>
          </CardHeader>
          <CardContent>
            <MarksHistory studentId={selectedStudentId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
