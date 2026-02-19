import { useState, useEffect } from 'react';
import { useActor } from './useActor';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import type { UserRole } from '../backend';

const TOKEN_KEY = 'auth_token';

interface AuthUser {
  username: string;
  name: string;
  role: UserRole;
}

export function useAuth() {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem(TOKEN_KEY);
  });
  const { actor } = useActor();
  const queryClient = useQueryClient();

  // Fetch user info using the token
  const { data: user, isLoading, refetch } = useQuery<AuthUser | null>({
    queryKey: ['authUser', token],
    queryFn: async () => {
      if (!actor || !token) return null;
      const userInfo = await actor.getUserByToken(token);
      return userInfo;
    },
    enabled: !!actor && !!token,
    retry: false,
  });

  const login = async (username: string, password: string) => {
    if (!actor) throw new Error('Actor not available');
    
    try {
      const sessionToken = await actor.authenticate(username, password);
      localStorage.setItem(TOKEN_KEY, sessionToken);
      setToken(sessionToken);
      await refetch();
    } catch (error) {
      throw error;
    }
  };

  const logout = async () => {
    if (actor && token) {
      try {
        await actor.logout(token);
      } catch (error) {
        console.error('Logout error:', error);
      }
    }
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
    queryClient.clear();
  };

  const isAuthenticated = !!token && !!user;
  const isAdmin = user?.role === 'admin';

  const userProfile = user ? {
    name: user.name,
    role: user.role === 'admin' ? 'Administrator' : user.role === 'staff' ? 'Staff' : 'Student'
  } : null;

  return {
    isAuthenticated,
    isAdmin,
    isLoading,
    userProfile,
    user,
    login,
    logout,
    token,
  };
}
