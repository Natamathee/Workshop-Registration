import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// role: 'member' | 'admin' | undefined (any authenticated user)
export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="text-gray-400">Loading...</span>
      </div>
    );
  }

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
}
