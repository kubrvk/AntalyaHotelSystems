import { createContext, useContext, useState, useEffect } from "react";
import {
  collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc
} from "firebase/firestore";
import { db } from "../firebase";

const HotelContext = createContext(null);

const INITIAL_ROOMS = [
  { number: "101", type: "Standart", capacity: 2, pricePerNight: 800, status: "available", floor: 1 },
  { number: "102", type: "Standart", capacity: 2, pricePerNight: 800, status: "occupied", floor: 1 },
  { number: "201", type: "Deluxe", capacity: 2, pricePerNight: 1200, status: "available", floor: 2 },
  { number: "202", type: "Deluxe", capacity: 3, pricePerNight: 1400, status: "reserved", floor: 2 },
  { number: "301", type: "Suite", capacity: 4, pricePerNight: 2500, status: "available", floor: 3 },
  { number: "302", type: "Suite", capacity: 4, pricePerNight: 2500, status: "cleaning", floor: 3 },
];

const INITIAL_RESERVATIONS = [
  { guestName: "Ahmet Yılmaz", guestPhone: "0532 111 2233", roomId: "", roomNumber: "102", checkIn: "2026-06-15", checkOut: "2026-06-18", status: "checked-in", totalPrice: 2400, notes: "" },
  { guestName: "Elif Kaya", guestPhone: "0541 222 3344", roomId: "", roomNumber: "202", checkIn: "2026-06-17", checkOut: "2026-06-20", status: "confirmed", totalPrice: 4200, notes: "Deniz manzaralı oda talep etti" },
];

export function HotelProvider({ children }) {
  const [rooms, setRooms] = useState([]);
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubRooms = onSnapshot(collection(db, "rooms"), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (data.length === 0) {
        INITIAL_ROOMS.forEach(r => addDoc(collection(db, "rooms"), r));
      } else {
        setRooms(data);
      }
    });

    const unsubRes = onSnapshot(collection(db, "reservations"), (snap) => {
      const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      if (data.length === 0) {
        INITIAL_RESERVATIONS.forEach(r => addDoc(collection(db, "reservations"), r));
      } else {
        setReservations(data);
      }
      setLoading(false);
    });

    return () => { unsubRooms(); unsubRes(); };
  }, []);

  const addRoom = (room) => addDoc(collection(db, "rooms"), room);
  const updateRoom = (id, data) => updateDoc(doc(db, "rooms", id), data);
  const deleteRoom = (id) => deleteDoc(doc(db, "rooms", id));

  const addReservation = (res) => {
    const newRes = { ...res, status: "confirmed" };
    addDoc(collection(db, "reservations"), newRes);
    updateRoom(res.roomId, { status: "reserved" });
  };
  const updateReservation = (id, data) => updateDoc(doc(db, "reservations", id), data);
  const deleteReservation = (id) => {
    const res = reservations.find(r => r.id === id);
    if (res && res.roomId) updateRoom(res.roomId, { status: "available" });
    deleteDoc(doc(db, "reservations", id));
  };
  const checkIn = (resId) => {
    const res = reservations.find(r => r.id === resId);
    if (res) {
      updateReservation(resId, { status: "checked-in" });
      if (res.roomId) updateRoom(res.roomId, { status: "occupied" });
    }
  };
  const checkOut = (resId) => {
    const res = reservations.find(r => r.id === resId);
    if (res) {
      updateReservation(resId, { status: "checked-out" });
      if (res.roomId) updateRoom(res.roomId, { status: "cleaning" });
    }
  };

  if (loading) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "100vh", fontFamily: "Inter, sans-serif", color: "#64748b" }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: 32, marginBottom: 12 }}>🏨</div>
          <p>Yükleniyor...</p>
        </div>
      </div>
    );
  }

  return (
    <HotelContext.Provider value={{
      rooms, reservations,
      addRoom, updateRoom, deleteRoom,
      addReservation, updateReservation, deleteReservation,
      checkIn, checkOut,
    }}>
      {children}
    </HotelContext.Provider>
  );
}

export const useHotel = () => useContext(HotelContext);