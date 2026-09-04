# LankaRide 🚌

> **Register the Bus. Track the Seats. Keep Sri Lanka Moving.**

LankaRide is a role-based web platform that digitises the day-to-day operation of a bus
service in Sri Lanka. The system supports four types of accounts — Admin, Bus Driver,
Conductor, and Passenger — with staff onboarding, bus registration, live trip-status
tracking, and a manual free-seat count that Passengers can check before they even reach the
stop.

---

## ⚠️ The Problem

Public transport is the primary way most Sri Lankans travel, but the day-to-day operation of
a bus service is still almost entirely manual: conductors track seat availability by eye,
passengers have no way of knowing how full a bus is or whether it has even started its trip
before they reach the stop, and bus companies have no simple digital record of which driver
or conductor is assigned to which vehicle.

This becomes worse during peak hours, where overcrowding, wasted waiting time, and no
visibility into a bus's current trip status affect thousands of commuters every day.

LankaRide addresses this problem by providing a centralized platform where:

* An Admin can onboard Drivers and Conductors with controlled, trustworthy accounts.
* Drivers can register their bus and keep its trip status up to date.
* Conductors can manually keep the free-seat count accurate as passengers board and alight.
* Passengers can search buses by route and see live seat availability and trip status
  before they travel — no login required to search.

---

# 💡 Proposed Solution

LankaRide provides a simple, role-based platform for managing bus operations end-to-end.

The system supports four user roles:

### 👤 Admin

An Admin can:

* Log in to the system.
* Register Bus Driver accounts.
* Register Conductor accounts.
* View the list of all registered staff.

### 🚍 Bus Driver

A Bus Driver can:

* Log in to the system (account created by the Admin).
* Add a bus to the system (bus number, route, capacity, fare).
* Update the bus's trip status — Not Started / En Route / Arrived.
* View their own registered bus(es).

### 🎫 Conductor

A Conductor can:

* Log in to the system (account created by the Admin).
* Edit bus details (route, fare, capacity).
* Manually update the free-seat count as passengers board and alight.
* Rely on built-in validation that stops the count going below 0 or above capacity.

### 🔍 Passenger (User)

A Passenger can:

* Search buses by From/To route — no account required.
* View each matching bus's live seat count and current trip status tag.
* Register an account to keep using the platform going forward.

```text
Passenger Search
       ↓
Enter From / To
       ↓
Search Buses
       ↓
View Matching Buses
       ↓
See Live Free-Seat Count
       ↓
See Trip Status Tag
```

This gives commuters a faster, more reliable way to decide which bus to wait for.

---

# ✨ Main Features

## 1. User Registration

Accounts on the platform are created in two ways:

* **Admin-managed:** Drivers and Conductors are registered directly by the Admin — nobody
  can self-register into those roles. This keeps workforce data controlled and trustworthy.
* **Self-registration:** Passengers can create their own account.

Driver registration additionally captures:

* NIC / ID
* Contact number
* License number

Conductor registration additionally captures:

* NIC / ID
* Contact number

---

## 2. User Login

Registered users log in using their email address and password.

The backend uses **bcrypt password hashing** rather than storing plain-text passwords, and
issues a **JWT** on successful login.

---

## 3. Admin — Staff Management

Admins can maintain a list of all registered staff, including:

* Full name
* Role (Driver / Conductor)
* Contact number

Duplicate email and duplicate NIC/ID registrations are rejected with a friendly error
message.

---

## 4. Bus Registration

Registered Drivers can add a bus containing:

* Bus number / plate
* Route (From / To)
* Total seat capacity
* Fare

Each bus is uniquely identified by its **bus number** — duplicate bus numbers are rejected.

---

## 5. Trip Status Tracking

Drivers can update their bus's live trip status:

```text
Not Started
     ↓
En Route
     ↓
Arrived
```

This status tag is shown live to both the Conductor and any Passenger searching that route.

---

## 6. Manual Seat-Count Management

There is **no automated e-ticketing** — the Conductor is the sole source of truth for how
many free seats a bus has, updated directly from their dashboard:

```text
Passenger Boards
       ↓
Conductor clicks "− Passenger Boarded"
       ↓
Free-seat count decreases
       ↓
Updated count shown live to Passengers
```

```text
Passenger Alights
       ↓
Conductor clicks "+ Passenger Alighted"
       ↓
Free-seat count increases
```

The count can never go below `0` or above the bus's total `capacity` — both are enforced on
the backend with friendly error messages ("No free seats left" / "Cannot exceed total
capacity").

---

## 7. Bus Details Editing

Conductors can edit a bus's route, fare, and capacity directly from their dashboard. Editing
capacity down is blocked if it would drop below the number of seats already occupied.

---

## 8. Bus Search

Passengers (and anyone, without logging in) can search buses by:

* From location
* To location

Only matching buses are returned, each showing live seat count, fare, driver/conductor name,
and trip status.

---

## 9. Role-Based Access Control (RBAC)

Every protected action is enforced on the **backend**, not just hidden in the frontend UI:

| Role      | Can access |
|-----------|------------|
| Admin     | `/api/users/register-staff`, `/api/users/staff` |
| Driver    | `/api/buses` (create), `/api/buses/mine`, `/api/buses/:id/status` |
| Conductor | `/api/buses/:id/details`, `/api/buses/:id/seats` |
| Passenger / Public | `/api/buses/search`, `/api/buses/:id` |

A request from the wrong role receives a `403 Forbidden`, even if the frontend link were
never shown to them.

---

## 10. Responsive User Interface

The application is designed to work across:

* Desktop
* Tablet
* Mobile

Every dashboard (Admin, Driver, Conductor, Passenger) uses a responsive layout.

---

## 11. Input Validation with Friendly Errors

Every form validates required fields before submitting, and the backend returns clear error
messages for issues like:

* Missing required fields
* Duplicate email / NIC / bus number
* Seat count going below 0 or above capacity
* No matching bus found for a search

---

## 12. Sample / Seeded Data

The platform ships with a seed script that creates sample Drivers, Conductors, a sample
Passenger, and sample buses on real Sri Lankan routes (e.g. Malabe → Colombo) so the app can
be demoed immediately.

---

# 🏗️ System Architecture

LankaRide uses a separate frontend and backend architecture (MERN stack).

```text
┌─────────────────────────────────┐
│          React Frontend         │
│                                 │
│  Home                           │
│  About the Problem              │
│  Search Buses                   │
│  Login / Register               │
│  Admin Dashboard                │
│  Driver Dashboard               │
│  Conductor Dashboard            │
└───────────────┬─────────────────┘
                │
                │ REST API
                ▼
┌─────────────────────────────────┐
│      Node.js + Express API      │
│                                 │
│  Authentication (JWT)           │
│  Staff Management (Admin)       │
│  Bus Management (Driver)        │
│  Seat & Details Mgmt (Conductor)│
│  Bus Search (Public)            │
└───────────────┬─────────────────┘
                │
                │ Mongoose
                ▼
┌─────────────────────────────────┐
│             MongoDB              │
└─────────────────────────────────┘
```

---

# 🛠️ Technologies Used

## Frontend

* React 18
* Vite
* React Router DOM
* Axios
* JavaScript / JSX
* CSS

## Backend

* Node.js
* Express
* Mongoose (MongoDB ODM)
* jsonwebtoken (JWT)
* bcryptjs
* cors
* dotenv

## Development Tools

* Git
* GitHub
* Visual Studio Code
* MongoDB Compass / Atlas
* Postman (API testing)

---

# 📂 Project Structure

```text
lankaride/
│
├── frontend/
│   └── src/
│       ├── components/
│       │   ├── Navbar.jsx
│       │   ├── BusCard.jsx
│       │   ├── StatusTag.jsx
│       │   ├── Loading.jsx
│       │   └── ErrorMessage.jsx
│       │
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── AboutPage.jsx
│       │   ├── LoginPage.jsx
│       │   ├── RegisterPassengerPage.jsx
│       │   ├── admin/
│       │   │   └── AdminDashboard.jsx
│       │   ├── driver/
│       │   │   └── DriverDashboard.jsx
│       │   ├── conductor/
│       │   │   └── ConductorDashboard.jsx
│       │   └── passenger/
│       │       └── SearchBusesPage.jsx
│       │
│       ├── services/
│       │   ├── api.js
│       │   ├── authService.js
│       │   ├── userService.js
│       │   └── busService.js
│       │
│       ├── context/
│       │   └── AuthContext.jsx
│       │
│       ├── hooks/
│       │   └── useAuth.js
│       │
│       ├── routes/
│       │   └── ProtectedRoute.jsx
│       │
│       ├── App.jsx
│       ├── index.css
│       └── main.jsx
│
├── backend/
│   ├── config/
│   │   └── db.js
│   │
│   ├── models/
│   │   ├── User.js
│   │   └── Bus.js
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── roleMiddleware.js
│   │
│   ├── services/
│   │   ├── authService.js
│   │   ├── userService.js
│   │   └── busService.js
│   │
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── userController.js
│   │   └── busController.js
│   │
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── userRoutes.js
│   │   └── busRoutes.js
│   │
│   ├── utils/
│   │   ├── generateToken.js
│   │   └── ensureAdmin.js
│   │
│   ├── seed.js
│   ├── server.js
│   └── .env.example
│
└── AGENT_INSTRUCTIONS.md
```

---

# 👥 Team Members & Contributions

| Member ID       | Role Owned         | Contribution |
| --------------- | ------------------ | ------------- |
| **IT24100962**  | Admin               | Register Driver/Conductor forms + validation, staff list view, Admin-only API endpoints & RBAC enforcement |
| **IT24101297**  | Bus Driver          | Add Bus form, trip status toggle, driver dashboard |
| **IT24101236**  | Conductor           | Edit Bus Details form, manual free-seat update controls with min/max validation |
| **IT24101252**  | Passenger (User)    | Bus search with live seat count & status tag, bus details view |

---

# 🚀 Installation & Execution

## Prerequisites

Make sure the following are installed:

* Node.js 18+
* npm
* MongoDB (local `mongod`, or a free MongoDB Atlas cluster)
* Git
* Visual Studio Code

Check the installed versions:

```bash
node --version
npm --version
```

---

# ⚙️ Backend Setup

Navigate to the backend:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Copy the environment file:

```bash
cp .env.example .env
```

---

# 🔐 Environment Configuration

Edit `backend/.env`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/lankaride
JWT_SECRET=replace_with_a_long_random_secret

# Admin account — auto-created on every server start
ADMIN_NAME=System Admin
ADMIN_EMAIL=admin@lankaride.lk
ADMIN_PASSWORD=Admin@123
```

### ⚠️ Important

Do not commit the real `.env` file to GitHub.

The `.gitignore` file should contain:

```gitignore
.env
.env.*
!.env.example
```

---

# 🗄️ Database Setup

Make sure MongoDB is running locally, or that your MongoDB Atlas cluster is reachable
(Atlas → Network Access → your current IP is allowed).

No manual schema/migration step is required — Mongoose creates collections automatically.
Start the server once to auto-create the Admin account (see below), or run the seed script
for full sample data.

---

# ▶️ Run the Backend

```bash
npm run dev
```

The Admin account is **created automatically on every server start** from the `ADMIN_*`
values in `.env` — no separate seed step is required just to get an Admin login working.

Terminal output should look like:

```text
MongoDB connected
Admin account ready: admin@lankaride.lk
LankaRide API running on port 5000
```

To also load sample Driver/Conductor/Passenger accounts and sample buses for a demo:

```bash
npm run seed
```

⚠️ `npm run seed` wipes and recreates *all* users, including the Admin — the next
`npm run dev` restart will restore the Admin from `.env` regardless.

---

# 🎨 Frontend Setup

Navigate to the frontend:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Copy the environment file:

```bash
cp .env.example .env
```

`.env` should point at your backend:

```env
VITE_API_URL=http://localhost:5000/api
```

Start the frontend development server:

```bash
npm run dev
```

The terminal will display the local development URL, for example:

```text
http://localhost:5173
```

---

## Frontend Build

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

# 🔄 Development Workflow

## Frontend

After frontend changes:

```bash
npm run build
npm run dev
```

## Backend

After backend changes, `nodemon` restarts automatically — or manually:

```bash
npm run dev
```

---

# 🔌 Main API Endpoints

## Authentication

### Login

```http
POST /api/auth/login
```

Authenticates any registered user (Admin, Driver, Conductor, Passenger).

### Register Passenger

```http
POST /api/auth/register-passenger
```

Self-registration — Passenger role only.

---

## Users (Admin only)

### Register staff

```http
POST /api/users/register-staff
```

Creates a Driver or Conductor account.

### Get staff list

```http
GET /api/users/staff
```

---

## Buses

### Search buses (public)

```http
GET /api/buses/search?from=Malabe&to=Colombo
```

### Get bus by ID (public)

```http
GET /api/buses/:id
```

### Get my buses (Driver)

```http
GET /api/buses/mine
```

### Add a bus (Driver)

```http
POST /api/buses
```

### Update trip status (Driver)

```http
PUT /api/buses/:id/status
```

### Edit bus details (Conductor)

```http
PUT /api/buses/:id/details
```

### Update free-seat count (Conductor)

```http
PUT /api/buses/:id/seats
```

Body: `{ "action": "increment" | "decrement" | "set", "value": number }`

---

# 🔁 Application Workflow

## Admin

```text
Login
   ↓
Register Bus Driver
   ↓
Register Conductor
   ↓
View Staff List
```

---

## Bus Driver

```text
Login
   ↓
Add Bus
   ↓
Set Route / Capacity / Fare
   ↓
Update Trip Status
   ↓
View My Buses
```

---

## Conductor

```text
Login
   ↓
Select a Bus
   ↓
Edit Bus Details
   ↓
Update Free Seats Manually
   ↓
See Validation if Limits Exceeded
```

---

## Passenger

```text
Search Buses
       ↓
No Registration Required
       ↓
Enter From / To
       ↓
View Matching Buses
       ↓
See Live Seat Count
       ↓
See Trip Status Tag
```

---

# 🗃️ Database Models

## User

Stores Admin, Driver, Conductor, and Passenger accounts.

```text
_id
name
email
password (hashed)
role          → admin | driver | conductor | passenger
nic
contact
licenseNo     → drivers only
createdAt
updatedAt
```

---

## Bus

Stores bus registration and live status information.

```text
_id
busNumber
from
to
capacity
freeSeats     → manually updated by the Conductor
fare
status        → Not Started | En Route | Arrived
driver        → ref User
conductor     → ref User
createdAt
updatedAt
```

---

# ✅ Validation

The application validates important user input, including:

* Required fields
* Duplicate email / NIC / bus number
* Free-seat count never below 0 or above capacity
* Bus capacity cannot drop below currently-occupied seats
* Password minimum length
* Valid trip status values (Not Started / En Route / Arrived)
* Valid seat-update actions (increment / decrement / set)

---

# 🔒 Security Considerations

LankaRide uses **bcryptjs** for password hashing instead of storing plain-text passwords,
and **JWT** for stateless authentication.

Every role-restricted endpoint is protected by backend middleware
(`authMiddleware` + `roleMiddleware`) — hiding a button in the React UI is never treated as
sufficient security on its own.

For a production deployment, additional security measures would be required, including:

* Refresh tokens / shorter-lived access tokens
* Rate limiting
* HTTPS
* Stronger password policies
* Audit logging
* IP allowlisting / VPC-restricted database access
* Verification of driver/conductor identity documents

---

# ⚠️ Project Scope

LankaRide is a software-engineering prototype developed for the SE3090 Mini Hackathon.

The application is designed to demonstrate a role-based platform for bus staff onboarding,
bus registration, and live seat-availability tracking.

It is **not** intended to:

* Replace an official transport authority's systems
* Provide GPS-verified, sensor-based seat counts
* Guarantee real-time bus location or arrival times
* Be used for actual public deployment without further security and reliability work

Seat counts are entered manually by the Conductor in this prototype. In a real-world
deployment, seat tracking would ideally be automated (e.g. via ticketing hardware or
sensors) rather than relying purely on manual entry.

---

# 🤖 AI Tools Used

The following AI tools were used during development:

claude
antigravity
chatgpt

LankaRide combines a responsive React frontend, a Node.js + Express REST API backend, and
MongoDB to provide a practical Sri Lanka-focused bus management and seat-availability
platform.
