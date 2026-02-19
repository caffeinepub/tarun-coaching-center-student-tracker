import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddMark } from '../hooks/useQueries';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface MarkFormProps {
  onStudentSelect?: (studentId: bigint | null) => void;
}

export default function MarkForm({ onStudentSelect }: MarkFormProps) {
  const [studentId, setStudentId] = useState('');
  const [subject, setSubject] = useState('');
  const [examType, setExamType] = useState('');
  const [score, setScore] = useState('');

  const addMark = useAddMark();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = BigInt(studentId);
    const scoreValue = BigInt(score);
    
    if (subject.trim() && examType.trim()) {
      addMark.mutate(
        {
          studentId: id,
          subject: subject.trim(),
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

  return (
    <div className="space-y-4">
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
          <Input
            id="subject"
            placeholder="e.g., Mathematics, Physics"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
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
        <Button type="submit" className="w-full" disabled={addMark.isPending}>
          {addMark.isPending ? 'Adding...' : 'Add Mark'}
        </Button>
      </form>
    </div>
  );
}
