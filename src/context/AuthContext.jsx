import { createContext, useContext, useState } from 'react';

const AuthContext = createContext(null);

// ── Admin credentials (hardcoded, swap with Firebase Auth later) ──────────────
const ADMIN = { email: 'admin@hotel.com', password: 'admin123', name: 'Admin', role: 'admin' };

// ── localStorage keys ─────────────────────────────────────────────────────────
const LS_ADMIN = 'ahs_admin_session';
const LS_USER  = 'ahs_user_session';
const LS_USERS = 'ahs_registered_users';

function readLS(key) {
  try { return JSON.parse(localStorage.getItem(key)); } catch { return null; }
}
function writeLS(key, val) {
  localStorage.setItem(key, JSON.stringify(val));
}

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser]   = useState(() => readLS(LS_ADMIN));
  const [currentUser, setCurrentUser] = useState(() => readLS(LS_USER));

  // ── Admin auth ───────────────────────────────────────────────────────────────
  const adminLogin = (email, password) => {
    if (email.trim() === ADMIN.email && password === ADMIN.password) {
      const u = { email: ADMIN.email, name: ADMIN.name, role: 'admin' };
      setAdminUser(u);
      writeLS(LS_ADMIN, u);
      return { success: true };
    }
    return { success: false, error: 'E-posta veya şifre hatalı.' };
  };

  const adminLogout = () => {
    setAdminUser(null);
    localStorage.removeItem(LS_ADMIN);
  };

  // ── User auth (localStorage based — swap with Firebase Auth later) ────────────
  const getUsers = () => readLS(LS_USERS) || [];

  const userRegister = (name, email, password, phone = '') => {
    const users = getUsers();
    if (users.find(u => u.email === email)) {
      return { success: false, error: 'Bu e-posta adresi zaten kayıtlı.' };
    }
    const newUser = {
      id: `user-${Date.now()}`,
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      phone,
      createdAt: new Date().toISOString(),
    };
    writeLS(LS_USERS, [...users, newUser]);
    const session = { id: newUser.id, name: newUser.name, email: newUser.email, phone: newUser.phone };
    setCurrentUser(session);
    writeLS(LS_USER, session);
    return { success: true };
  };

  const userLogin = (email, password) => {
    const users = getUsers();
    const found = users.find(
      u => u.email === email.trim().toLowerCase() && u.password === password
    );
    if (found) {
      const session = { id: found.id, name: found.name, email: found.email, phone: found.phone };
      setCurrentUser(session);
      writeLS(LS_USER, session);
      return { success: true };
    }
    return { success: false, error: 'E-posta veya şifre hatalı.' };
  };

  const userLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem(LS_USER);
  };

  return (
    <AuthContext.Provider value={{
      adminUser,
      isAdminAuthenticated: !!adminUser,
      adminLogin,
      adminLogout,
      currentUser,
      userLogin,
      userRegister,
      userLogout,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
