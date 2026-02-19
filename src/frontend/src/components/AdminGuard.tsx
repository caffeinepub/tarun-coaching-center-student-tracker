import { useAuth } from '../hooks/useAuth';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from '@tanstack/react-router';

interface AdminGuardProps {
  children: React.ReactNode;
}

export default function AdminGuard({ children }: AdminGuardProps) {
  const { isAdmin, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Checking permissions...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Alert className="bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
        <ShieldAlert className="h-5 w-5 text-red-600 dark:text-red-400" />
        <AlertDescription className="text-red-800 dark:text-red-300">
          <div className="space-y-3">
            <p className="font-semibold">Authentication Required</p>
            <p>You must be logged in to access this page.</p>
            <Button onClick={() => navigate({ to: '/login' })} variant="outline" size="sm">
              Go to Login
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  if (!isAdmin) {
    return (
      <Alert className="bg-amber-50 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800">
        <ShieldAlert className="h-5 w-5 text-amber-600 dark:text-amber-400" />
        <AlertDescription className="text-amber-800 dark:text-amber-300">
          <div className="space-y-3">
            <p className="font-semibold">Administrator Access Required</p>
            <p>This page is restricted to administrators only. Please contact your system administrator if you believe you should have access.</p>
            <Button onClick={() => navigate({ to: '/' })} variant="outline" size="sm">
              Return to Home
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    );
  }

  return <>{children}</>;
}
