import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Wraps admin-only routes.
 * Redirects to /admin/login if the admin session is not active.
 * To later integrate Firebase Auth: replace `isAdminAuthenticated`
 * with a Firebase auth state check in AuthContext.
 */
export default function AdminRoute({ children }) {
  const { isAdminAuthenticated } = useAuth();
  return isAdminAuthenticated ? children : <Navigate to="/admin/login" replace />;
}
