import { createContext, useContext, useState, useEffect } from 'react';
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc,
} from 'firebase/firestore';
import { db } from '../firebase';
import { MOCK_ROOMS } from '../data/mockRooms';
import { MOCK_RESERVATIONS } from '../data/mockReservations';

const HotelContext = createContext(null);

export function HotelProvider({ children }) {
  const [rooms, setRooms]             = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading]         = useState(true);

  // ── Firebase real-time listeners + initial seed ───────────────────────────────
  useEffect(() => {
    let roomsReady = false;

    const unsubRooms = onSnapshot(collection(db, 'rooms'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (data.length === 0 && !roomsReady) {
        // Seed initial rooms on first run
        roomsReady = true;
        MOCK_ROOMS.forEach(r => addDoc(collection(db, 'rooms'), r));
      } else {
        setRooms(data);
      }
    });

    let resReady = false;
    const unsubRes = onSnapshot(collection(db, 'reservations'), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (data.length === 0 && !resReady) {
        // Seed initial reservations on first run
        resReady = true;
        MOCK_RESERVATIONS.forEach(r => addDoc(collection(db, 'reservations'), r));
      } else {
        setReservations(data);
        setLoading(false);
      }
    });

    return () => { unsubRooms(); unsubRes(); };
  }, []);

  // ── Helpers ───────────────────────────────────────────────────────────────────
  const getRoomByNumber = (num) => rooms.find(r => r.number === num);

  // ── Room CRUD ─────────────────────────────────────────────────────────────────
  const addRoom    = (room)       => addDoc(collection(db, 'rooms'), room);
  const updateRoom = (id, data)   => updateDoc(doc(db, 'rooms', id), data);
  const deleteRoom = (id)         => deleteDoc(doc(db, 'rooms', id));

  // ── Reservation CRUD ──────────────────────────────────────────────────────────
  /**
   * Creates a new reservation with status 'pending'.
   * Called from both admin panel and public reservation form.
   */
  const addReservation = (resData) =>
    addDoc(collection(db, 'reservations'), {
      ...resData,
      status: 'pending',
      createdAt: new Date().toISOString(),
    });

  const updateReservation = (id, data) =>
    updateDoc(doc(db, 'reservations', id), data);

  const deleteReservation = (id) =>
    deleteDoc(doc(db, 'reservations', id));

  /**
   * Admin approves a pending reservation.
   * Reservation → approved | Room → reserved
   */
  const approveReservation = async (id) => {
    const res = reservations.find(r => r.id === id);
    if (!res) return;
    await updateReservation(id, { status: 'approved' });
    const room = getRoomByNumber(res.roomNumber);
    if (room) await updateRoom(room.id, { status: 'reserved' });
  };

  /**
   * Admin cancels a reservation.
   * Reservation → cancelled | Room → available (if was reserved/occupied)
   */
  const cancelReservation = async (id) => {
    const res = reservations.find(r => r.id === id);
    if (!res) return;
    await updateReservation(id, { status: 'cancelled' });
    const room = getRoomByNumber(res.roomNumber);
    if (room && ['reserved', 'occupied'].includes(room.status)) {
      await updateRoom(room.id, { status: 'available' });
    }
  };

  /**
   * Guest checks in.
   * Reservation → checked-in | Room → occupied
   */
  const checkIn = async (id) => {
    const res = reservations.find(r => r.id === id);
    if (!res) return;
    await updateReservation(id, { status: 'checked-in' });
    const room = getRoomByNumber(res.roomNumber);
    if (room) await updateRoom(room.id, { status: 'occupied' });
  };

  /**
   * Guest checks out.
   * Reservation → checked-out | Room → cleaning
   */
  const checkOut = async (id) => {
    const res = reservations.find(r => r.id === id);
    if (!res) return;
    await updateReservation(id, { status: 'checked-out' });
    const room = getRoomByNumber(res.roomNumber);
    if (room) await updateRoom(room.id, { status: 'cleaning' });
  };

  // ── Loading screen ────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '100vh', background: '#0a0f1e', fontFamily: 'Inter, sans-serif',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg, #1e3a5f, #2563eb)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 20px',
            boxShadow: '0 20px 40px rgba(37,99,235,0.3)',
          }}>
            <i className="ti ti-building-hotel" style={{ fontSize: 36, color: '#fff' }} />
          </div>
          <h1 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 700, color: '#e2e8f0' }}>
            Antalya Hotel Systems
          </h1>
          <p style={{ margin: '0 0 20px', fontSize: 13, color: '#94a3b8' }}>
            Yükleniyor, lütfen bekleyin...
          </p>
          <div style={{
            width: 40, height: 40, border: '3px solid rgba(59,130,246,0.2)',
            borderTop: '3px solid #3b82f6', borderRadius: '50%',
            animation: 'spin 0.8s linear infinite', margin: '0 auto',
          }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    );
  }

  return (
    <HotelContext.Provider value={{
      rooms, reservations, loading,
      addRoom, updateRoom, deleteRoom,
      addReservation, updateReservation, deleteReservation,
      approveReservation, cancelReservation,
      checkIn, checkOut,
    }}>
      {children}
    </HotelContext.Provider>
  );
}

export const useHotel = () => useContext(HotelContext);