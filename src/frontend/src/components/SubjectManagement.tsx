import { useState } from 'react';
import { useGetAllSubjects, useAddSubject, useEditSubject } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Plus, Edit2, Check, X } from 'lucide-react';
import AdminGuard from './AdminGuard';

export default function SubjectManagement() {
  const { data: subjects, isLoading } = useGetAllSubjects();
  const addSubject = useAddSubject();
  const editSubject = useEditSubject();

  const [newSubjectName, setNewSubjectName] = useState('');
  const [editingSubject, setEditingSubject] = useState<string | null>(null);
  const [editedName, setEditedName] = useState('');

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubjectName.trim()) {
      addSubject.mutate(newSubjectName.trim(), {
        onSuccess: () => {
          setNewSubjectName('');
        },
      });
    }
  };

  const handleStartEdit = (subject: string) => {
    setEditingSubject(subject);
    setEditedName(subject);
  };

  const handleSaveEdit = () => {
    if (editingSubject && editedName.trim() && editedName !== editingSubject) {
      editSubject.mutate(
        { oldSubject: editingSubject, newSubject: editedName.trim() },
        {
          onSuccess: () => {
            setEditingSubject(null);
            setEditedName('');
          },
        }
      );
    } else {
      setEditingSubject(null);
      setEditedName('');
    }
  };

  const handleCancelEdit = () => {
    setEditingSubject(null);
    setEditedName('');
  };

  return (
    <AdminGuard>
      <div className="space-y-6">
        <Card className="shadow-lg border-blue-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              Add New Subject
            </CardTitle>
            <CardDescription>Create a new test subject for marks tracking</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddSubject} className="flex gap-3">
              <div className="flex-1">
                <Label htmlFor="newSubject" className="sr-only">
                  Subject Name
                </Label>
                <Input
                  id="newSubject"
                  placeholder="Enter subject name (e.g., Mathematics, Physics)"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={addSubject.isPending || !newSubjectName.trim()}>
                {addSubject.isPending ? 'Adding...' : 'Add Subject'}
              </Button>
            </form>
          </CardContent>
        </Card>

        <Card className="shadow-lg border-blue-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              All Subjects
            </CardTitle>
            <CardDescription>Manage existing test subjects</CardDescription>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="text-center py-8">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Loading subjects...</p>
              </div>
            ) : !subjects || subjects.length === 0 ? (
              <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No subjects added yet. Create your first subject above.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                {subjects.map((subject) => (
                  <div
                    key={subject}
                    className="flex items-center justify-between p-3 bg-blue-50 dark:bg-gray-800 rounded-lg border border-blue-100 dark:border-gray-700"
                  >
                    {editingSubject === subject ? (
                      <div className="flex items-center gap-2 flex-1">
                        <Input
                          value={editedName}
                          onChange={(e) => setEditedName(e.target.value)}
                          className="h-8 text-sm"
                          autoFocus
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleSaveEdit}
                          disabled={editSubject.isPending}
                          className="h-8 w-8 p-0"
                        >
                          <Check className="w-4 h-4 text-green-600" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={handleCancelEdit}
                          disabled={editSubject.isPending}
                          className="h-8 w-8 p-0"
                        >
                          <X className="w-4 h-4 text-red-600" />
                        </Button>
                      </div>
                    ) : (
                      <>
                        <Badge variant="secondary" className="font-medium">
                          {subject}
                        </Badge>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleStartEdit(subject)}
                          className="h-8 w-8 p-0"
                        >
                          <Edit2 className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                        </Button>
                      </>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </AdminGuard>
  );
}
