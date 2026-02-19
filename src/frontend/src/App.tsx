import { createRouter, RouterProvider, createRoute, createRootRoute, Outlet, useNavigate } from '@tanstack/react-router';
import { useAuth } from './hooks/useAuth';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import StudentsPage from './pages/StudentsPage';
import MarksPage from './pages/MarksPage';
import AttendancePage from './pages/AttendancePage';
import SubjectsPage from './pages/SubjectsPage';
import AccountCreationPage from './pages/AccountCreationPage';
import LoginPage from './pages/LoginPage';
import { Toaster } from '@/components/ui/sonner';
import { useEffect } from 'react';

function LayoutWrapper() {
  return (
    <Layout>
      <Outlet />
    </Layout>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/login' });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

function RootComponent() {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Outlet />;
  }
  
  return <LayoutWrapper />;
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: LoginPage,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <ProtectedRoute>
      <HomePage />
    </ProtectedRoute>
  ),
});

const studentsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/students',
  component: () => (
    <ProtectedRoute>
      <StudentsPage />
    </ProtectedRoute>
  ),
});

const marksRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/marks',
  component: () => (
    <ProtectedRoute>
      <MarksPage />
    </ProtectedRoute>
  ),
});

const attendanceRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/attendance',
  component: () => (
    <ProtectedRoute>
      <AttendancePage />
    </ProtectedRoute>
  ),
});

const subjectsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/subjects',
  component: () => (
    <ProtectedRoute>
      <SubjectsPage />
    </ProtectedRoute>
  ),
});

const accountsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/accounts',
  component: () => (
    <ProtectedRoute>
      <AccountCreationPage />
    </ProtectedRoute>
  ),
});

const routeTree = rootRoute.addChildren([
  loginRoute,
  indexRoute,
  studentsRoute,
  marksRoute,
  attendanceRoute,
  subjectsRoute,
  accountsRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster />
    </>
  );
}
