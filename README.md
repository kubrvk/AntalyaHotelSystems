# ANTALYA HOTEL MANAGEMENT

<img align="left" width="40%" src="https://github.com/kubrvk/portfolio/blob/main/img/galeri/antalyahotel1.PNG?raw=true"/>
<h3> <img src="https://img.shields.io/badge/Live Demo: https://antalyahotelsystems.firebaseapp.com-0c2b23?style=&logo=codecrafters&logoColor=white" height="25"/></a></h3>

![](https://img.shields.io/badge/Web_App-09090b?style=) ![](https://img.shields.io/badge/Management-1e3a8a?style=) ![](https://img.shields.io/badge/Dashboard-047857?style=) ![React](https://img.shields.io/badge/React_18-61DAFB?style=logo=react&logoColor=black)  ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=for-the-badges&logo=firebas1&logoColor=black)  ![Status](https://img.shields.io/badge/Status-Shipped-success?style=for-the-badges) 
<br>
Antalya Hotel Management is a full-stack web application built entirely with React 18 and Firebase. The project features a public-facing customer website and a secure, real-time admin dashboard for managing boutique and mid-sized hotels.

The application serves two distinct domains. The core engineering challenge was integrating real-time Firebase synchronization with offline persistence (IndexedDB), ensuring receptionists experience near-zero latency while managing room states, reservations, and customer check-ins during daily operations.
<br clear="left"/>
<p align="center">
<img src="https://github.com/kubrvk/portfolio/blob/main/img/galeri/antalyahotel2.PNG?raw=true" width="24%"/><img src="https://github.com/kubrvk/portfolio/blob/main/img/galeri/antalyahotel3.PNG?raw=true" width="24%"/><img src="https://github.com/kubrvk/portfolio/blob/main/img/galeri/antalyahotel4.PNG?raw=true" width="24%"/><img src="https://github.com/kubrvk/portfolio/blob/main/img/galeri/antalyahotel5.PNG?raw=true" width="24%"/>
</p>

---

## Technical Details:

| Layer | Technology |
|---|---|
| Core Framework | React 18, Vite |
| Routing | React Router v7 |
| State Management | React Context API |
| Backend & Database | Firebase Firestore (Real-time NoSQL) |
| Authentication | Firebase Auth |
| Styling | Vanilla CSS, Flexbox/Grid, CSS Animations |
| Icons | Tabler Icons |

---

## Code Overview

The codebase is structured around a domain-driven architecture separating the public customer site from the internal admin tools. Global state is managed via Context API, and database interactions are optimized for local caching.

```text
AntalyaHotelSystems/
├── src/
│   ├── components/        # Reusable UI (Buttons, Modals, Cards)
│   ├── context/           # Global State (HotelContext, AuthContext)
│   ├── data/              # Mock data & initial seeding scripts
│   ├── layouts/           # Main Wrappers (AdminLayout, PublicLayout)
│   ├── pages/             # Route views separated by domain
│   │   ├── admin/         # Dashboard, Rooms, Reservations
│   │   └── public/        # Landing page, Room listing, Booking
│   ├── routes/            # Protected route wrappers & config
│   ├── firebase.js        # Firebase initialization & persistence
│   └── index.css          # Global design tokens and utilities
```

---

## Core Systems:

### 1. Admin Dashboard & Analytics:

![image](https://github.com/kubrvk/portfolio/blob/main/img/galeri/antalyahotel6.PNG?raw=true)

The central hub for hotel staff and receptionists. It provides a comprehensive overview of the hotel's daily operations.

**Features:**
- Quick overview of key metrics: Occupancy rates, today's check-ins, check-outs, and pending tasks.
- Real-time updates pushed directly from Firestore.
- Intuitive navigation tailored for fast reception desk operations.

---

### 2. Room Management Module:

![image](https://github.com/kubrvk/portfolio/blob/main/img/galeri/antalyahotel7.PNG?raw=true)

A comprehensive CRUD system for handling the hotel's physical inventory.

- **Status Tracking**: Rooms can be toggled between Available, Occupied, and Cleaning in real-time.
- **Inventory Detail**: Staff can add new rooms, upload images, define bed types, and set pricing per night.
- Designed with robust data tables and quick-action menus for efficient management.

---

### 3. Reservation & Booking Engine:

![image](https://github.com/kubrvk/portfolio/blob/main/img/galeri/antalyahotel8.PNG?raw=true)

Handles the full lifecycle of a booking from customer request to final check-out.

- **Customer Workflow**: Seamless booking process on the public site allowing users to filter by dates and room capacity.
- **Admin Workflow**: Receptionists can approve, reject, or modify incoming reservations.
- **Dedicated Check-in/out**: Focused modules for handling the daily arrival and departure queues effortlessly.

---

### 4. Public-Facing Website:

<p align="center">
<img src="https://github.com/kubrvk/portfolio/blob/main/img/galeri/antalyahotel9.PNG?raw=true" width="49%"/>
<img src="https://github.com/kubrvk/portfolio/blob/main/img/galeri/antalyahotel10.PNG?raw=true" width="49%"/>
</p>

The customer experience begins here. A highly polished, responsive interface designed to convert visitors into guests.

- **Modern Landing Page**: High-quality UI with dynamic hero sections and curated hotel highlights.
- **Room Browsing**: Interactive catalogs where users can filter and view available rooms with detailed descriptions and image galleries.
- **Customer Portal**: Authenticated users can log in to view their active reservations and booking history.

---

### 5. Offline-First Firebase Integration:

The application utilizes Firebase's **Offline Persistence** via IndexedDB.

- Initial page loads cache the Firestore database locally.
- Subsequent visits and page navigation execute with near-zero latency.
- Changes made while offline (or under poor network conditions) are queued and synchronized seamlessly in the background once connectivity is restored.

---

## Getting Started

Follow these instructions to run the project locally.

### Prerequisites
- Node.js (v18 or higher recommended)
- A Firebase account (if connecting your own database)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kubrvk/AntalyaHotelSystems.git
   cd AntalyaHotelSystems
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Firebase:**
   Update `src/firebase.js` with your own Firebase project configuration.

4. **Run the development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   - Public Site: [http://localhost:5173](http://localhost:5173)
   - Admin Panel: Navigate to `/admin/login`
   - Default Admin Credentials: `admin@hotel.com` / `admin123`

---

## Performance Targets & Optimization:

| Target | Approach |
|---|---|
| Loading Latency | Offline persistence caches DB locally; near-instant route transitions. |
| Bundle Size | Vite provides optimized, minified production bundles. |
| State Consistency | React Context provides predictable global state updates synced with Firestore. |
| UI Responsiveness | CSS Grid/Flexbox used exclusively. Fully responsive on mobile and tablet displays. |

---

## Developer

**Kubrik** , Developer  

[GitHub](https://github.com/kubrvk) · [Portfolio](https://github.com/kubrvk/portfolio) 

---

*Distributed under the MIT License.*
