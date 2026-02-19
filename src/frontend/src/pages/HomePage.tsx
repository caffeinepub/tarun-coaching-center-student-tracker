import { useInternetIdentity } from '../hooks/useInternetIdentity';
import { useGetCallerUserProfile } from '../hooks/useQueries';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, ClipboardList, Calendar, TrendingUp } from 'lucide-react';
import { Link, useNavigate } from '@tanstack/react-router';
import { useEffect } from 'react';

export default function HomePage() {
  const { identity } = useInternetIdentity();
  const { data: userProfile } = useGetCallerUserProfile();
  const navigate = useNavigate();

  useEffect(() => {
    if (!identity) {
      navigate({ to: '/login' });
    }
  }, [identity, navigate]);

  if (!identity) {
    return null;
  }

  const features = [
    {
      title: 'Student Management',
      description: 'Add, view, and manage student records with complete information',
      icon: Users,
      link: '/students',
      color: 'from-blue-500 to-blue-600',
    },
    {
      title: 'Marks Tracking',
      description: 'Record and monitor student performance across subjects and exams',
      icon: ClipboardList,
      link: '/marks',
      color: 'from-green-500 to-green-600',
    },
    {
      title: 'Attendance Records',
      description: 'Track daily attendance and generate comprehensive reports',
      icon: Calendar,
      link: '/attendance',
      color: 'from-orange-500 to-orange-600',
    },
  ];

  return (
    <div className="space-y-8">
      <div className="relative rounded-2xl overflow-hidden shadow-2xl">
        <img src="/assets/generated/hero-banner.dim_1200x400.png" alt="Coaching Center" className="w-full h-64 object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-900/90 to-green-900/90 flex items-center">
          <div className="container mx-auto px-8">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Welcome{userProfile ? `, ${userProfile.name}` : ''}!
            </h1>
            <p className="text-xl text-blue-100 max-w-2xl">
              Manage your students' academic journey with our comprehensive tracking system
            </p>
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature) => {
          const Icon = feature.icon;
          return (
            <Link key={feature.title} to={feature.link}>
              <Card className="h-full hover:shadow-xl transition-all duration-300 hover:-translate-y-1 cursor-pointer border-blue-100 dark:border-gray-700 group">
                <CardHeader>
                  <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                    <Icon className="w-7 h-7 text-white" />
                  </div>
                  <CardTitle className="text-xl text-blue-900 dark:text-blue-100">{feature.title}</CardTitle>
                  <CardDescription className="text-base">{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            </Link>
          );
        })}
      </div>

      <Card className="bg-gradient-to-br from-blue-50 to-green-50 dark:from-gray-800 dark:to-gray-700 border-blue-200 dark:border-gray-600 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-blue-900 dark:text-blue-100">
            <TrendingUp className="w-6 h-6" />
            Quick Stats
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-700 dark:text-gray-300">
            Your comprehensive dashboard for tracking student progress, attendance patterns, and academic performance. Navigate using the menu above to get started.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
