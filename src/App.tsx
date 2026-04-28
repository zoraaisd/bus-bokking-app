import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useAuthStore } from './store/authStore';

// Lazy-loaded pages
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));

// User App
const HomePage = lazy(() => import('./pages/user/HomePage'));
const BookingsPage = lazy(() => import('./pages/user/BookingsPage'));
const AccountPage = lazy(() => import('./pages/user/AccountPage'));

// Bus Flow
const BusResultsPage = lazy(() => import('./pages/user/bus/BusResultsPage'));
const SeatSelectionPage = lazy(() => import('./pages/user/bus/SeatSelectionPage'));
const BoardingPage = lazy(() => import('./pages/user/bus/BoardingPage'));
const PassengerDetailsPage = lazy(() => import('./pages/user/bus/PassengerDetailsPage'));
const BusPaymentPage = lazy(() => import('./pages/user/bus/BusPaymentPage'));
const BusSuccessPage = lazy(() => import('./pages/user/bus/BusSuccessPage'));

// Flight Flow
const FlightResultsPage = lazy(() => import('./pages/user/flight/FlightResultsPage'));
const FlightReviewPage = lazy(() => import('./pages/user/flight/FlightReviewPage'));
const TravellerDetailsPage = lazy(() => import('./pages/user/flight/TravellerDetailsPage'));
const FlightPaymentPage = lazy(() => import('./pages/user/flight/FlightPaymentPage'));
const FlightSuccessPage = lazy(() => import('./pages/user/flight/FlightSuccessPage'));

// Admin
const AdminDashboardPage = lazy(() => import('./pages/admin/AdminDashboardPage'));
const AdminBookingsPage = lazy(() => import('./pages/admin/AdminBookingsPage'));
const AdminUsersPage = lazy(() => import('./pages/admin/AdminUsersPage'));

// Fallback
function PageLoader() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="flex flex-col items-center gap-3">
        <div className="w-10 h-10 border-3 border-red-600 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-gray-500 font-inter">Loading...</p>
      </div>
    </div>
  );
}

// Route Guards
function RequireAuth({ children, requiredRole }: { children: React.ReactNode; requiredRole?: 'admin' | 'client' }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (requiredRole && user?.role !== requiredRole) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/home'} replace />;
  }

  return <>{children}</>;
}

function RedirectIfAuthenticated({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, user } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to={user?.role === 'admin' ? '/admin' : '/home'} replace />;
  }
  return <>{children}</>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" toastOptions={{
        style: { fontFamily: 'Inter', fontWeight: 500, borderRadius: 12 },
        duration: 3000,
      }} />
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Root redirect */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Auth */}
          <Route path="/login" element={
            <RedirectIfAuthenticated>
              <LoginPage />
            </RedirectIfAuthenticated>
          } />

          {/* User App */}
          <Route path="/home" element={
            <RequireAuth requiredRole="client"><HomePage /></RequireAuth>
          } />
          <Route path="/bookings" element={
            <RequireAuth requiredRole="client"><BookingsPage /></RequireAuth>
          } />
          <Route path="/account" element={
            <RequireAuth requiredRole="client"><AccountPage /></RequireAuth>
          } />

          {/* Bus Flow */}
          <Route path="/bus/results" element={
            <RequireAuth requiredRole="client"><BusResultsPage /></RequireAuth>
          } />
          <Route path="/bus/seats" element={
            <RequireAuth requiredRole="client"><SeatSelectionPage /></RequireAuth>
          } />
          <Route path="/bus/boarding" element={
            <RequireAuth requiredRole="client"><BoardingPage /></RequireAuth>
          } />
          <Route path="/bus/passenger" element={
            <RequireAuth requiredRole="client"><PassengerDetailsPage /></RequireAuth>
          } />
          <Route path="/bus/payment" element={
            <RequireAuth requiredRole="client"><BusPaymentPage /></RequireAuth>
          } />
          <Route path="/bus/success" element={
            <RequireAuth requiredRole="client"><BusSuccessPage /></RequireAuth>
          } />

          {/* Flight Flow */}
          <Route path="/flight/results" element={
            <RequireAuth requiredRole="client"><FlightResultsPage /></RequireAuth>
          } />
          <Route path="/flight/review" element={
            <RequireAuth requiredRole="client"><FlightReviewPage /></RequireAuth>
          } />
          <Route path="/flight/traveller" element={
            <RequireAuth requiredRole="client"><TravellerDetailsPage /></RequireAuth>
          } />
          <Route path="/flight/payment" element={
            <RequireAuth requiredRole="client"><FlightPaymentPage /></RequireAuth>
          } />
          <Route path="/flight/success" element={
            <RequireAuth requiredRole="client"><FlightSuccessPage /></RequireAuth>
          } />

          {/* Admin Panel */}
          <Route path="/admin" element={
            <RequireAuth requiredRole="admin"><AdminDashboardPage /></RequireAuth>
          } />
          <Route path="/admin/bookings" element={
            <RequireAuth requiredRole="admin"><AdminBookingsPage /></RequireAuth>
          } />
          <Route path="/admin/users" element={
            <RequireAuth requiredRole="admin"><AdminUsersPage /></RequireAuth>
          } />

          {/* 404 */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
