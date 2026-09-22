# UFH NestLink Student Residence Management System

Full-stack Node.js + Express + SQLite residence management application for the University of Fort Hare.

## Requirements
- Node.js 18+
- npm

## Run
1. Copy `.env.example` to `.env` and set a strong `SESSION_SECRET`.
2. Install dependencies: `npm install`
3. Initialize/reset required schema and seed reference data: `npm run init-db`
4. Start: `npm start`
5. Open `http://localhost:3000`

`init_db.js` creates the required tables and seeds only reference data (four Student Village residences, maintenance categories, catalogue items, rooms and room inventories). It deliberately creates **no user accounts**.

## Authentication rules
- `202249895@ufh.ac.za` is always registered as `residence_staff`.
- Every other valid `@ufh.ac.za` address is registered as `student`.
- Roles are calculated server-side and are never accepted from the browser.
- Residence staff select their assigned residence during registration; all residence routes enforce that assignment with `requireResidenceAccess`.

## Security / data integrity
- Passwords use bcrypt hashes.
- Sessions are persistent in SQLite through `connect-sqlite3`.
- Session cookies are HttpOnly + SameSite=Lax, and Secure in production.
- Inventory signing + automatic fault creation runs in one atomic SQLite transaction.
- Room allocation is transactional.
- Sort/filter inputs use server-side allowlists before any dynamic SQL fragment is used.
- SQLite foreign keys and WAL mode are enabled.

## Main source layout
- `server.js`
- `init_db.js`
- `lib/db.js`, `lib/helpers.js`
- `routes/auth.js`, `routes/student.js`, `routes/residence.js`
- `public/jss/*` programmatic CSS-in-JS/JSS modules
- `public/js/*` frontend modules
