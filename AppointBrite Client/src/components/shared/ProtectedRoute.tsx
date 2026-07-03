/**
 * ProtectedRoute — wraps routes that require authentication.
 * Optionally restricts by user role.
 */
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/config/routes';
import type { UserRole } from '@/types/user.types';
import LoadingScreen from './LoadingScreen';

interface ProtectedRouteProps {
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />;
  }

  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return <Navigate to={ROUTES.HOME} replace />;
  }

  // Intercept BUSINESS_OWNER who hasn't completed onboarding
  if (user?.role === 'BUSINESS_OWNER') {
    const step = user.businessProfile?.onboardingStep || 1;
    if (step < 4 && location.pathname !== ROUTES.DASHBOARD.ONBOARDING) {
      return <Navigate to={ROUTES.DASHBOARD.ONBOARDING} replace />;
    }
  }

  return <Outlet />;
}
