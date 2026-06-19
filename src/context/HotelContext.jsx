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
  // Removed global blocking loading screen to allow immediate render.
  // Child components handle their own loading states.

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