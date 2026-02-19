import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useActor } from '../hooks/useActor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Eye, EyeOff, UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { UserRole } from '../backend';
import AdminGuard from '../components/AdminGuard';

export default function AccountCreationPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [role, setRole] = useState<UserRole>(UserRole.student);
  const [showPassword, setShowPassword] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { actor } = useActor();
  const { isAdmin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!username.trim() || !password.trim() || !name.trim()) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!actor) {
      toast.error('System not ready. Please try again.');
      return;
    }

    setIsCreating(true);
    try {
      await actor.registerUser(username.trim(), password, role, name.trim());
      toast.success(`Account created successfully for ${name}`);
      
      // Reset form
      setUsername('');
      setPassword('');
      setName('');
      setRole(UserRole.student);
    } catch (error: any) {
      toast.error(error.message || 'Failed to create account');
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <AdminGuard>
      <div className="max-w-2xl mx-auto">
        <Card className="shadow-xl border-blue-100 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="text-2xl font-bold text-blue-900 dark:text-blue-100 flex items-center gap-2">
              <UserPlus className="w-6 h-6" />
              Create New Account
            </CardTitle>
            <CardDescription>
              Create accounts for students, staff, or administrators. Provide username and password for each account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input
                  id="name"
                  type="text"
                  placeholder="Enter full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={isCreating}
                  className="h-11"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username / ID</Label>
                <Input
                  id="username"
                  type="text"
                  placeholder="Enter username or ID"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isCreating}
                  className="h-11"
                />
                <p className="text-xs text-muted-foreground">
                  This will be used to log in to the system
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={isCreating}
                    className="h-11 pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Provide this password to the user securely
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={role} onValueChange={(value) => setRole(value as UserRole)}>
                  <SelectTrigger id="role" className="h-11">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={UserRole.student}>Student</SelectItem>
                    <SelectItem value={UserRole.staff}>Staff</SelectItem>
                    <SelectItem value={UserRole.admin}>Admin</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground">
                  Admins have full access, staff can view data, students have limited access
                </p>
              </div>

              <Button
                type="submit"
                disabled={isCreating || !username.trim() || !password.trim() || !name.trim()}
                className="w-full h-11 text-base gap-2"
                size="lg"
              >
                <UserPlus className="w-5 h-5" />
                {isCreating ? 'Creating Account...' : 'Create Account'}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </AdminGuard>
  );
}
