import { useInternetIdentity } from './useInternetIdentity';
import { useGetCallerUserProfile, useIsCallerAdmin } from './useQueries';

export function useAuth() {
  const { identity, isInitializing, loginStatus, login, clear } = useInternetIdentity();
  const { data: userProfile, isLoading: profileLoading } = useGetCallerUserProfile();
  const { data: isAdmin, isLoading: adminLoading } = useIsCallerAdmin();

  const isAuthenticated = !!identity;
  const isLoading = isInitializing || profileLoading || adminLoading;

  return {
    identity,
    isAuthenticated,
    isAdmin: isAdmin ?? false,
    isLoading,
    userProfile,
    loginStatus,
    login,
    logout: clear,
  };
}
