import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useRecordAttendance } from '../hooks/useQueries';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info } from 'lucide-react';

interface AttendanceFormProps {
  onDateSelect?: (date: string | null) => void;
  onStudentSelect?: (studentId: bigint | null) => void;
}

export default function AttendanceForm({ onDateSelect, onStudentSelect }: AttendanceFormProps) {
  const [studentId, setStudentId] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [present, setPresent] = useState(true);

  const recordAttendance = useRecordAttendance();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = BigInt(studentId);
    
    recordAttendance.mutate(
      {
        studentId: id,
        date,
        present,
      },
      {
        onSuccess: () => {
          setStudentId('');
          setPresent(true);
          onDateSelect?.(date);
          onStudentSelect?.(id);
        },
      }
    );
  };

  return (
    <div className="space-y-4">
      <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        <AlertDescription className="text-amber-800 dark:text-amber-300 text-sm">
          Enter student ID manually. Bulk attendance marking will be available once getAllStudents() is implemented.
        </AlertDescription>
      </Alert>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="date">Date *</Label>
          <Input
            id="date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
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
        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <Label htmlFor="present" className="cursor-pointer">
            Mark as Present
          </Label>
          <Switch
            id="present"
            checked={present}
            onCheckedChange={setPresent}
          />
        </div>
        <Button type="submit" className="w-full" disabled={recordAttendance.isPending}>
          {recordAttendance.isPending ? 'Recording...' : 'Record Attendance'}
        </Button>
      </form>
    </div>
  );
}
