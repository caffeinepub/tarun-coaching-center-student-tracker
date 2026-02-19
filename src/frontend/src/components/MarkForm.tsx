import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAddMark, useGetAllSubjects } from '../hooks/useQueries';
import { useAuth } from '../hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, ShieldAlert } from 'lucide-react';

interface MarkFormProps {
  onStudentSelect?: (studentId: bigint | null) => void;
}

export default function MarkForm({ onStudentSelect }: MarkFormProps) {
  const { isAdmin, isLoading: authLoading } = useAuth();
  const { data: subjects, isLoading: subjectsLoading } = useGetAllSubjects();
  const [studentId, setStudentId] = useState('');
  const [subject, setSubject] = useState('');
  const [examType, setExamType] = useState('');
  const [score, setScore] = useState('');

  const addMark = useAddMark();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = BigInt(studentId);
    const scoreValue = BigInt(score);

    if (subject && examType.trim()) {
      addMark.mutate(
        {
          studentId: id,
          subject,
          examType: examType.trim(),
          score: scoreValue,
        },
        {
          onSuccess: () => {
            setSubject('');
            setExamType('');
            setScore('');
            onStudentSelect?.(id);
          },
        }
      );
    }
  };

  if (authLoading) {
    return (
      <div className="text-center py-8">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Loading...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <ShieldAlert className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertDescription className="text-amber-800 dark:text-amber-300">
          Only administrators can add or update marks. Please contact your administrator if you need to record marks.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      <Alert className="bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800">
        <Info className="h-4 w-4 text-blue-600 dark:text-blue-400" />
        <AlertDescription className="text-blue-800 dark:text-blue-300 text-sm">
          <strong>Daily Updates:</strong> Enter marks for today's tests. The backend automatically handles both new entries and updates for existing student-subject-exam combinations.
        </AlertDescription>
      </Alert>

      <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertDescription className="text-amber-800 dark:text-amber-300 text-sm">
          Enter student ID manually. A dropdown will be available once getAllStudents() is implemented.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="studentId">Student ID *</Label>
          <Input
            id="studentId"
            type="number"
            placeholder="Enter student ID"
            value={studentId}
            onChange={(e) => setStudentId(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="subject">Subject *</Label>
          {subjectsLoading ? (
            <div className="flex items-center gap-2 p-2 text-sm text-gray-500">
              <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
              Loading subjects...
            </div>
          ) : !subjects || subjects.length === 0 ? (
            <div className="p-3 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-md text-sm text-amber-800 dark:text-amber-300">
              No subjects available. Please add subjects in the Subjects page first.
            </div>
          ) : (
            <Select value={subject} onValueChange={setSubject} required>
              <SelectTrigger>
                <SelectValue placeholder="Select a subject" />
              </SelectTrigger>
              <SelectContent>
                {subjects.map((subj) => (
                  <SelectItem key={subj} value={subj}>
                    {subj}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="examType">Exam Type *</Label>
          <Input
            id="examType"
            placeholder="e.g., Mid-term, Final, Quiz"
            value={examType}
            onChange={(e) => setExamType(e.target.value)}
            required
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="score">Score *</Label>
          <Input
            id="score"
            type="number"
            min="0"
            max="100"
            placeholder="Enter score (0-100)"
            value={score}
            onChange={(e) => setScore(e.target.value)}
            required
          />
        </div>
        <Button type="submit" className="w-full" disabled={addMark.isPending || !subjects || subjects.length === 0}>
          {addMark.isPending ? 'Adding...' : 'Add Mark'}
        </Button>
      </form>
    </div>
  );
}
