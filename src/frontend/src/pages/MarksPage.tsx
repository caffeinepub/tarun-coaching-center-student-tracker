import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle } from 'lucide-react';
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
        <p className="text-gray-600 dark:text-gray-400 mt-1">Record and track student performance</p>
      </div>

      <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-800 dark:text-blue-300">
          <strong>Note:</strong> Student selection requires getAllStudents() backend method to populate the dropdown.
        </AlertDescription>
      </Alert>

      <div className="grid lg:grid-cols-2 gap-6">
        <Card className="shadow-lg border-blue-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Add Marks</CardTitle>
            <CardDescription>Record marks for a student</CardDescription>
          </CardHeader>
          <CardContent>
            <MarkForm onStudentSelect={setSelectedStudentId} />
          </CardContent>
        </Card>

        <Card className="shadow-lg border-blue-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle>Marks History</CardTitle>
            <CardDescription>View student performance records</CardDescription>
          </CardHeader>
          <CardContent>
            <MarksHistory studentId={selectedStudentId} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
