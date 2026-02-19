import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';
import SubjectManagement from '../components/SubjectManagement';

export default function SubjectsPage() {
  const { identity } = useInternetIdentity();
  const navigate = useNavigate();

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
        <h1 className="text-3xl font-bold text-blue-900 dark:text-blue-100">Subject Management</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Add and manage test subjects for marks tracking</p>
      </div>
      <SubjectManagement />
    </div>
  );
}
