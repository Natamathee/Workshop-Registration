import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import RegistrationsPage from './pages/RegistrationsPage';
import RegistrationDetailPage from './pages/RegistrationDetailPage';
import WorkshopDetailPage from './pages/WorkshopDetailPage';
import WorkshopFormPage from './pages/WorkshopFormPage';
import WorkshopsPage from './pages/WorkshopsPage';

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="app-shell min-h-screen">
          <Navbar />
          <main>
            <Routes>
              {/* Public */}
              <Route path="/" element={<Navigate to="/workshops" replace />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/workshops" element={<WorkshopsPage />} />
              <Route path="/workshops/:id" element={<WorkshopDetailPage />} />

              {/* Admin only */}
              <Route path="/workshops/new" element={
                <ProtectedRoute role="admin"><WorkshopFormPage /></ProtectedRoute>
              } />
              <Route path="/workshops/:id/edit" element={
                <ProtectedRoute role="admin"><WorkshopFormPage /></ProtectedRoute>
              } />

              {/* Authenticated */}
              <Route path="/registrations" element={
                <ProtectedRoute><RegistrationsPage /></ProtectedRoute>
              } />
              <Route path="/registrations/:id" element={
                <ProtectedRoute><RegistrationDetailPage /></ProtectedRoute>
              } />
            </Routes>
          </main>
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}
