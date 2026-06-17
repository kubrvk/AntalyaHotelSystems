import { useState } from "react";
import Dashboard from "./pages/Dashboard";
import Rooms from "./pages/Rooms";
import Reservations from "./pages/Reservations";
import CheckInOut from "./pages/CheckInOut";
import { HotelProvider } from "./context/HotelContext";

const NAV = [
  { id: "dashboard", label: "Dashboard", icon: "ti-layout-dashboard" },
  { id: "rooms", label: "Odalar", icon: "ti-building" },
  { id: "reservations", label: "Rezervasyonlar", icon: "ti-calendar" },
  { id: "checkinout", label: "Check-in / Out", icon: "ti-door-enter" },
];

export default function App() {
  const [page, setPage] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <HotelProvider>
      <div style={{ display: "flex", minHeight: "100vh", background: "#f0f4f8", fontFamily: "Inter, sans-serif" }}>
        {/* Sidebar */}
        <aside style={{
          width: sidebarOpen ? 220 : 64,
          background: "#0c2340",
          display: "flex",
          flexDirection: "column",
          transition: "width 0.2s",
          overflow: "hidden",
          flexShrink: 0,
        }}>
          {/* Logo */}
          <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid #1a3a5c", display: "flex", alignItems: "center", gap: 10 }}>
            <i className="ti ti-building-hotel" style={{ fontSize: 22, color: "#60a5fa", flexShrink: 0 }} />
            {sidebarOpen && <span style={{ color: "#e2e8f0", fontWeight: 600, fontSize: 15, whiteSpace: "nowrap" }}>HotelPanel</span>}
          </div>

          {/* Nav */}
          <nav style={{ flex: 1, padding: "12px 0" }}>
            {NAV.map(n => (
              <button key={n.id} onClick={() => setPage(n.id)} style={{
                width: "100%", display: "flex", alignItems: "center", gap: 10,
                padding: "10px 16px", border: "none", cursor: "pointer",
                background: page === n.id ? "#1a3a5c" : "transparent",
                borderLeft: page === n.id ? "3px solid #60a5fa" : "3px solid transparent",
                color: page === n.id ? "#60a5fa" : "#94a3b8",
                fontSize: 14, fontWeight: page === n.id ? 500 : 400,
                transition: "all 0.15s", textAlign: "left",
              }}>
                <i className={`ti ${n.icon}`} style={{ fontSize: 18, flexShrink: 0 }} />
                {sidebarOpen && <span style={{ whiteSpace: "nowrap" }}>{n.label}</span>}
              </button>
            ))}
          </nav>

          {/* Collapse toggle */}
          <button onClick={() => setSidebarOpen(o => !o)} style={{
            margin: "12px 16px", border: "1px solid #1a3a5c", borderRadius: 6,
            background: "transparent", color: "#94a3b8", cursor: "pointer",
            padding: "8px", display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <i className={`ti ${sidebarOpen ? "ti-layout-sidebar-left-collapse" : "ti-layout-sidebar-right-collapse"}`} style={{ fontSize: 16 }} />
          </button>
        </aside>

        {/* Main content */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          {/* Topbar */}
          <header style={{
            background: "#fff", borderBottom: "1px solid #e2e8f0",
            padding: "0 24px", height: 56, display: "flex", alignItems: "center",
            justifyContent: "space-between",
          }}>
            <h1 style={{ fontSize: 16, fontWeight: 500, color: "#0c2340", margin: 0 }}>
              {NAV.find(n => n.id === page)?.label}
            </h1>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%",
                background: "#1e40af", color: "#fff",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 600,
              }}>A</div>
              <span style={{ fontSize: 13, color: "#475569" }}>Admin</span>
            </div>
          </header>

          {/* Page */}
          <main style={{ flex: 1, padding: 24, overflowY: "auto" }}>
            {page === "dashboard" && <Dashboard />}
            {page === "rooms" && <Rooms />}
            {page === "reservations" && <Reservations />}
            {page === "checkinout" && <CheckInOut />}
          </main>
        </div>
      </div>
    </HotelProvider>
  );
}
