import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogIn } from 'lucide-react';
import { useEffect } from 'react';
import { useNavigate } from '@tanstack/react-router';

export default function LoginPage() {
  const { login, loginStatus, identity, clear } = useInternetIdentity();
  const navigate = useNavigate();

  useEffect(() => {
    if (identity) {
      navigate({ to: '/' });
    }
  }, [identity, navigate]);

  const handleLogin = async () => {
    try {
      await login();
    } catch (error: any) {
      console.error('Login error:', error);
      if (error.message === 'User is already authenticated') {
        await clear();
        setTimeout(() => login(), 300);
      }
    }
  };

  const isLoggingIn = loginStatus === 'logging-in';

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-2xl border-blue-100 dark:border-gray-700">
        <CardHeader className="text-center space-y-4">
          <img src="/assets/generated/logo.dim_200x200.png" alt="Tarun Coaching Center" className="h-24 w-24 mx-auto rounded-2xl shadow-lg" />
          <CardTitle className="text-3xl font-bold text-blue-900 dark:text-blue-100">Tarun Coaching Center</CardTitle>
          <CardDescription className="text-base">Student Marks & Attendance Tracker</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="bg-blue-50 dark:bg-gray-700 p-4 rounded-lg">
            <p className="text-sm text-gray-700 dark:text-gray-300 text-center">
              Secure login powered by Internet Identity. Your data is protected and private.
            </p>
          </div>
          <Button onClick={handleLogin} disabled={isLoggingIn} className="w-full h-12 text-lg gap-2 shadow-md" size="lg">
            <LogIn className="w-5 h-5" />
            {isLoggingIn ? 'Logging in...' : 'Login with Internet Identity'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
