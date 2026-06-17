import { createContext, useContext, useState, useEffect } from "react";

const HotelContext = createContext(null);

const INITIAL_ROOMS = [
  { id: "1", number: "101", type: "Standart", capacity: 2, pricePerNight: 800, status: "available", floor: 1 },
  { id: "2", number: "102", type: "Standart", capacity: 2, pricePerNight: 800, status: "occupied", floor: 1 },
  { id: "3", number: "201", type: "Deluxe", capacity: 2, pricePerNight: 1200, status: "available", floor: 2 },
  { id: "4", number: "202", type: "Deluxe", capacity: 3, pricePerNight: 1400, status: "reserved", floor: 2 },
  { id: "5", number: "301", type: "Suite", capacity: 4, pricePerNight: 2500, status: "available", floor: 3 },
  { id: "6", number: "302", type: "Suite", capacity: 4, pricePerNight: 2500, status: "cleaning", floor: 3 },
];

const INITIAL_RESERVATIONS = [
  { id: "r1", guestName: "Ahmet Yılmaz", guestPhone: "0532 111 2233", roomId: "2", roomNumber: "102", checkIn: "2026-06-15", checkOut: "2026-06-18", status: "checked-in", totalPrice: 2400, notes: "" },
  { id: "r2", guestName: "Elif Kaya", guestPhone: "0541 222 3344", roomId: "4", roomNumber: "202", checkIn: "2026-06-17", checkOut: "2026-06-20", status: "confirmed", totalPrice: 4200, notes: "Deniz manzaralı oda talep etti" },
  { id: "r3", guestName: "Mehmet Demir", guestPhone: "0555 333 4455", roomId: "1", roomNumber: "101", checkIn: "2026-06-20", checkOut: "2026-06-22", status: "confirmed", totalPrice: 1600, notes: "" },
];

function load(key, fallback) {
  try {
    const s = localStorage.getItem(key);
    return s ? JSON.parse(s) : fallback;
  } catch { return fallback; }
}

export function HotelProvider({ children }) {
  const [rooms, setRooms] = useState(() => load("hotel_rooms", INITIAL_ROOMS));
  const [reservations, setReservations] = useState(() => load("hotel_reservations", INITIAL_RESERVATIONS));

  useEffect(() => { localStorage.setItem("hotel_rooms", JSON.stringify(rooms)); }, [rooms]);
  useEffect(() => { localStorage.setItem("hotel_reservations", JSON.stringify(reservations)); }, [reservations]);

  const addRoom = (room) => setRooms(r => [...r, { ...room, id: Date.now().toString() }]);
  const updateRoom = (id, data) => setRooms(r => r.map(x => x.id === id ? { ...x, ...data } : x));
  const deleteRoom = (id) => setRooms(r => r.filter(x => x.id !== id));

  const addReservation = (res) => {
    const newRes = { ...res, id: "r" + Date.now(), status: "confirmed" };
    setReservations(r => [...r, newRes]);
    updateRoom(res.roomId, { status: "reserved" });
  };
  const updateReservation = (id, data) => setReservations(r => r.map(x => x.id === id ? { ...x, ...data } : x));
  const deleteReservation = (id) => {
    const res = reservations.find(r => r.id === id);
    if (res) updateRoom(res.roomId, { status: "available" });
    setReservations(r => r.filter(x => x.id !== id));
  };
  const checkIn = (resId) => {
    const res = reservations.find(r => r.id === resId);
    if (res) {
      updateReservation(resId, { status: "checked-in" });
      updateRoom(res.roomId, { status: "occupied" });
    }
  };
  const checkOut = (resId) => {
    const res = reservations.find(r => r.id === resId);
    if (res) {
      updateReservation(resId, { status: "checked-out" });
      updateRoom(res.roomId, { status: "cleaning" });
    }
  };

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
