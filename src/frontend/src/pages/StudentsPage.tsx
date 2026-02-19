import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { UserPlus, Search, AlertCircle, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import StudentForm from '../components/StudentForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function StudentsPage() {
  const { identity } = useInternetIdentity();
  const { isAdmin, isLoading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);

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
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">Student Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Add and manage student records</p>
        </div>
        {!authLoading && isAdmin && (
          <Button onClick={() => setShowAddDialog(true)} className="gap-2 shadow-md">
            <UserPlus className="w-4 h-4" />
            Add New Student
          </Button>
        )}
      </div>

      <Card className="shadow-lg border-blue-100 dark:border-gray-700">
        <CardHeader>
          <CardTitle>Search Students</CardTitle>
          <CardDescription>Find students by name or roll number</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              placeholder="Search by name or roll number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-800 dark:text-blue-300">
          <strong>Note:</strong> The backend is missing getAllStudents(), updateStudent(), and deleteStudent() methods.
          Student list display and edit/delete functionality cannot be implemented until these methods are added.
        </AlertDescription>
      </Alert>

      <Card className="shadow-lg border-blue-100 dark:border-gray-700">
        <CardHeader>
          <CardTitle>All Students</CardTitle>
          <CardDescription>Complete list of registered students</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
            <p>Student list will appear here once backend methods are implemented</p>
          </div>
        </CardContent>
      </Card>

      {isAdmin && (
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Add New Student</DialogTitle>
            </DialogHeader>
            <StudentForm onSuccess={() => setShowAddDialog(false)} />
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
