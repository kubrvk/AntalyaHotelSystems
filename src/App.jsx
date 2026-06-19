import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { HotelProvider } from './context/HotelContext';
import AdminRoute from './routes/AdminRoute';
import UserRoute from './routes/UserRoute';
import AdminLayout from './layouts/AdminLayout';
import PublicLayout from './layouts/PublicLayout';

// Admin pages
import AdminLogin        from './pages/admin/AdminLogin';
import Dashboard         from './pages/admin/Dashboard';
import Rooms             from './pages/admin/Rooms';
import Reservations      from './pages/admin/Reservations';
import CheckInOut        from './pages/admin/CheckInOut';

// Public pages
import Home              from './pages/public/Home';
import RoomList          from './pages/public/RoomList';
import RoomDetail        from './pages/public/RoomDetail';
import ReservationForm   from './pages/public/ReservationForm';

// Auth pages
import UserLogin         from './pages/auth/UserLogin';
import UserRegister      from './pages/auth/UserRegister';
import UserProfile       from './pages/auth/UserProfile';

export default function App() {
  return (
    <AuthProvider>
      <HotelProvider>
        <BrowserRouter>
          <Routes>
            {/* ── Public website ──────────────────────────────────────── */}
            <Route element={<PublicLayout />}>
              <Route path="/"            element={<Home />} />
              <Route path="/rooms"       element={<RoomList />} />
              <Route path="/rooms/:id"   element={<RoomDetail />} />
              <Route path="/reservation" element={<ReservationForm />} />
              <Route path="/login"       element={<UserLogin />} />
              <Route path="/register"    element={<UserRegister />} />
              <Route path="/profile"     element={
                <UserRoute><UserProfile /></UserRoute>
              } />
            </Route>

            {/* ── Admin auth (no layout) ──────────────────────────────── */}
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* ── Protected admin panel ──────────────────────────────── */}
            <Route
              path="/admin"
              element={<AdminRoute><AdminLayout /></AdminRoute>}
            >
              <Route index element={<Navigate to="dashboard" replace />} />
              <Route path="dashboard"        element={<Dashboard />} />
              <Route path="rooms"            element={<Rooms />} />
              <Route path="reservations"     element={<Reservations />} />
              <Route path="checkin-checkout" element={<CheckInOut />} />
            </Route>

            {/* ── Catch-all ───────────────────────────────────────────── */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </HotelProvider>
    </AuthProvider>
  );
}
