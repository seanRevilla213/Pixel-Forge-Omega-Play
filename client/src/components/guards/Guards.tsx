import { type ReactNode } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

/** Shared full-screen spinner for auth loading states */
const AuthLoader = ({ color = 'border-luxury-cyan' }: { color?: string }) => (
  <div className="min-h-screen flex items-center justify-center bg-matte-black">
    <div className={`w-12 h-12 border-2 ${color} border-t-transparent rounded-full animate-spin`} />
  </div>
);

export const AuthGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <AuthLoader />;
  if (!isAuthenticated) return <Navigate to="/login" state={{ from: location }} replace />;
  return <>{children}</>;
};

export const AdminGuard = ({ children }: { children: ReactNode }) => {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) return <AuthLoader color="border-luxury-violet" />;
  if (!user || user.role !== 'admin') return <Navigate to="/" state={{ from: location }} replace />;
  return <>{children}</>;
};

export const GuestGuard = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) return <AuthLoader />;
  if (isAuthenticated) return <Navigate to="/" replace />;
  return <>{children}</>;
};
