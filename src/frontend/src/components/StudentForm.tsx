import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAddStudent } from '../hooks/useQueries';

interface StudentFormProps {
  onSuccess?: () => void;
}

export default function StudentForm({ onSuccess }: StudentFormProps) {
  const [name, setName] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [grade, setGrade] = useState('');
  const [contact, setContact] = useState('');

  const addStudent = useAddStudent();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim() && rollNumber.trim() && grade.trim() && contact.trim()) {
      addStudent.mutate(
        {
          name: name.trim(),
          rollNumber: rollNumber.trim(),
          grade: grade.trim(),
          contact: contact.trim(),
        },
        {
          onSuccess: () => {
            setName('');
            setRollNumber('');
            setGrade('');
            setContact('');
            onSuccess?.();
          },
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Student Name *</Label>
        <Input
          id="name"
          placeholder="Enter full name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="rollNumber">Roll Number *</Label>
        <Input
          id="rollNumber"
          placeholder="Enter roll number"
          value={rollNumber}
          onChange={(e) => setRollNumber(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="grade">Grade/Class *</Label>
        <Input
          id="grade"
          placeholder="e.g., 10th, 12th Science"
          value={grade}
          onChange={(e) => setGrade(e.target.value)}
          required
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="contact">Contact Number *</Label>
        <Input
          id="contact"
          type="tel"
          placeholder="Enter contact number"
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          required
        />
      </div>
      <Button type="submit" className="w-full" disabled={addStudent.isPending}>
        {addStudent.isPending ? 'Adding...' : 'Add Student'}
      </Button>
    </form>
  );
}
