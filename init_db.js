const fs = require('fs');
const path = require('path');
const Database = require('better-sqlite3');

const dir = path.join(__dirname, 'data');

fs.mkdirSync(dir, { recursive: true });

const db = new Database(
  path.join(dir, 'nestlink.db')
);

db.pragma('foreign_keys = ON');
db.pragma('journal_mode = WAL');
db.pragma('busy_timeout = 5000');


/* =========================================================
   DATABASE SCHEMA
========================================================= */

const schema = `

CREATE TABLE IF NOT EXISTS Residences (
  residence_id INTEGER PRIMARY KEY AUTOINCREMENT,

  res_name TEXT NOT NULL UNIQUE,

  is_active INTEGER NOT NULL DEFAULT 1
    CHECK(is_active IN(0,1))
);


/* =========================================================
   USERS

   Roles:
   - student
   - residence_staff
   - maintenance_staff
========================================================= */

CREATE TABLE IF NOT EXISTS Users (
  user_id INTEGER PRIMARY KEY AUTOINCREMENT,

  email TEXT NOT NULL UNIQUE,

  password_hash TEXT NOT NULL,

  full_name TEXT NOT NULL,

  role TEXT NOT NULL
    CHECK(
      role IN(
        'student',
        'residence_staff',
        'maintenance_staff'
      )
    ),

  residence_id INTEGER,

  is_active INTEGER NOT NULL DEFAULT 1,

  last_login TEXT,

  created_at TEXT NOT NULL
    DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(residence_id)
    REFERENCES Residences(residence_id)
);


/* =========================================================
   ROOMS
========================================================= */

CREATE TABLE IF NOT EXISTS Rooms (
  room_id INTEGER PRIMARY KEY AUTOINCREMENT,

  residence_id INTEGER NOT NULL,

  room_number TEXT NOT NULL,

  floor_no INTEGER NOT NULL DEFAULT 0,

  capacity INTEGER NOT NULL DEFAULT 1,

  status TEXT NOT NULL DEFAULT 'available'
    CHECK(
      status IN(
        'available',
        'occupied',
        'maintenance'
      )
    ),

  UNIQUE(residence_id, room_number),

  FOREIGN KEY(residence_id)
    REFERENCES Residences(residence_id)
    ON DELETE CASCADE
);


/* =========================================================
   ROOM ALLOCATIONS
========================================================= */

CREATE TABLE IF NOT EXISTS RoomAllocations (
  allocation_id INTEGER PRIMARY KEY AUTOINCREMENT,

  room_id INTEGER NOT NULL,

  student_user_id INTEGER NOT NULL,

  academic_year INTEGER NOT NULL,

  status TEXT NOT NULL DEFAULT 'active'
    CHECK(status IN('active','ended')),

  allocated_on TEXT NOT NULL
    DEFAULT CURRENT_DATE,

  ended_on TEXT,

  allocated_by INTEGER,

  FOREIGN KEY(room_id)
    REFERENCES Rooms(room_id),

  FOREIGN KEY(student_user_id)
    REFERENCES Users(user_id),

  FOREIGN KEY(allocated_by)
    REFERENCES Users(user_id)
);

CREATE UNIQUE INDEX IF NOT EXISTS
uq_active_student_allocation
ON RoomAllocations(student_user_id)
WHERE status = 'active';


/* =========================================================
   MAINTENANCE CATEGORIES
========================================================= */

CREATE TABLE IF NOT EXISTS MaintenanceCategories (
  category_id INTEGER PRIMARY KEY AUTOINCREMENT,

  category_name TEXT NOT NULL UNIQUE,

  target_hours INTEGER NOT NULL DEFAULT 72
);


/* =========================================================
   ITEM CATALOG
========================================================= */

CREATE TABLE IF NOT EXISTS ItemCatalog (
  item_id INTEGER PRIMARY KEY AUTOINCREMENT,

  item_name TEXT NOT NULL UNIQUE,

  item_group TEXT NOT NULL,

  description TEXT,

  default_quantity INTEGER NOT NULL DEFAULT 1,

  replacement_cost REAL NOT NULL DEFAULT 0
);


/* =========================================================
   ROOM INVENTORY
========================================================= */

CREATE TABLE IF NOT EXISTS RoomInventory (
  room_item_id INTEGER PRIMARY KEY AUTOINCREMENT,

  room_id INTEGER NOT NULL,

  item_id INTEGER NOT NULL,

  quantity_expected INTEGER NOT NULL DEFAULT 1,

  current_condition TEXT NOT NULL DEFAULT 'good'
    CHECK(
      current_condition IN(
        'good',
        'fair',
        'damaged',
        'missing'
      )
    ),

  UNIQUE(room_id,item_id),

  FOREIGN KEY(room_id)
    REFERENCES Rooms(room_id)
    ON DELETE CASCADE,

  FOREIGN KEY(item_id)
    REFERENCES ItemCatalog(item_id)
);


/* =========================================================
   INVENTORY CHECKS
========================================================= */

CREATE TABLE IF NOT EXISTS InventoryChecks (
  check_id INTEGER PRIMARY KEY AUTOINCREMENT,

  allocation_id INTEGER NOT NULL,

  room_id INTEGER NOT NULL,

  student_user_id INTEGER NOT NULL,

  status TEXT NOT NULL DEFAULT 'draft'
    CHECK(
      status IN(
        'draft',
        'submitted',
        'verified',
        'disputed'
      )
    ),

  signature_name TEXT,

  signed_at TEXT,

  verified_by INTEGER,

  verified_at TEXT,

  verifier_note TEXT,

  opened_at TEXT NOT NULL
    DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(allocation_id)
    REFERENCES RoomAllocations(allocation_id),

  FOREIGN KEY(room_id)
    REFERENCES Rooms(room_id),

  FOREIGN KEY(student_user_id)
    REFERENCES Users(user_id),

  FOREIGN KEY(verified_by)
    REFERENCES Users(user_id)
);


/* =========================================================
   MAINTENANCE REPORTS
========================================================= */

CREATE TABLE IF NOT EXISTS MaintenanceReports (
  report_id INTEGER PRIMARY KEY AUTOINCREMENT,

  reference_code TEXT NOT NULL UNIQUE,

  room_id INTEGER NOT NULL,

  reported_by INTEGER NOT NULL,

  category_id INTEGER NOT NULL,

  item_id INTEGER,

  title TEXT NOT NULL,

  description TEXT NOT NULL,

  priority TEXT NOT NULL DEFAULT 'normal'
    CHECK(
      priority IN(
        'low',
        'normal',
        'high',
        'urgent'
      )
    ),

  source TEXT NOT NULL DEFAULT 'student'
    CHECK(
      source IN(
        'student',
        'inventory',
        'residence'
      )
    ),

  status TEXT NOT NULL DEFAULT 'submitted'
    CHECK(
      status IN(
        'submitted',
        'forwarded',
        'acknowledged',
        'scheduled',
        'in_progress',
        'completed',
        'closed'
      )
    ),

  resolution_note TEXT,

  created_at TEXT NOT NULL
    DEFAULT CURRENT_TIMESTAMP,

  updated_at TEXT NOT NULL
    DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(room_id)
    REFERENCES Rooms(room_id),

  FOREIGN KEY(reported_by)
    REFERENCES Users(user_id),

  FOREIGN KEY(category_id)
    REFERENCES MaintenanceCategories(category_id),

  FOREIGN KEY(item_id)
    REFERENCES ItemCatalog(item_id)
);


/* =========================================================
   INVENTORY CHECK ITEMS
========================================================= */

CREATE TABLE IF NOT EXISTS InventoryCheckItems (
  check_item_id INTEGER PRIMARY KEY AUTOINCREMENT,

  check_id INTEGER NOT NULL,

  room_item_id INTEGER NOT NULL,

  item_id INTEGER NOT NULL,

  quantity_found INTEGER NOT NULL DEFAULT 1,

  condition_rating TEXT
    CHECK(
      condition_rating IN(
        'good',
        'fair',
        'damaged',
        'missing'
      )
    ),

  student_comment TEXT,

  raise_report INTEGER NOT NULL DEFAULT 0,

  report_id INTEGER,

  UNIQUE(check_id,room_item_id),

  FOREIGN KEY(check_id)
    REFERENCES InventoryChecks(check_id)
    ON DELETE CASCADE,

  FOREIGN KEY(room_item_id)
    REFERENCES RoomInventory(room_item_id),

  FOREIGN KEY(item_id)
    REFERENCES ItemCatalog(item_id),

  FOREIGN KEY(report_id)
    REFERENCES MaintenanceReports(report_id)
);


/* =========================================================
   MAINTENANCE ASSIGNMENTS

   Created when Residence Staff forwards a fault to
   the Maintenance Department.
========================================================= */

CREATE TABLE IF NOT EXISTS MaintenanceAssignments (
  assignment_id INTEGER PRIMARY KEY AUTOINCREMENT,

  report_id INTEGER NOT NULL UNIQUE,

  forwarded_by INTEGER NOT NULL,

  forwarded_at TEXT NOT NULL
    DEFAULT CURRENT_TIMESTAMP,

  forwarding_note TEXT,

  maintenance_user_id INTEGER,

  accepted_at TEXT,

  acceptance_note TEXT,

  assignment_status TEXT NOT NULL
    DEFAULT 'forwarded'
    CHECK(
      assignment_status IN(
        'forwarded',
        'accepted',
        'scheduled',
        'in_progress',
        'completed',
        'cancelled'
      )
    ),

  completed_at TEXT,

  FOREIGN KEY(report_id)
    REFERENCES MaintenanceReports(report_id)
    ON DELETE CASCADE,

  FOREIGN KEY(forwarded_by)
    REFERENCES Users(user_id),

  FOREIGN KEY(maintenance_user_id)
    REFERENCES Users(user_id)
);


/* =========================================================
   MAINTENANCE VISITS

   Maintenance can schedule and reschedule room visits.
========================================================= */

CREATE TABLE IF NOT EXISTS MaintenanceVisits (
  visit_id INTEGER PRIMARY KEY AUTOINCREMENT,

  assignment_id INTEGER NOT NULL,

  scheduled_by INTEGER NOT NULL,

  scheduled_date TEXT NOT NULL,

  scheduled_time TEXT NOT NULL,

  estimated_minutes INTEGER NOT NULL DEFAULT 60,

  visit_note TEXT,

  status TEXT NOT NULL DEFAULT 'scheduled'
    CHECK(
      status IN(
        'scheduled',
        'rescheduled',
        'in_progress',
        'completed',
        'cancelled',
        'missed'
      )
    ),

  created_at TEXT NOT NULL
    DEFAULT CURRENT_TIMESTAMP,

  updated_at TEXT NOT NULL
    DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(assignment_id)
    REFERENCES MaintenanceAssignments(assignment_id)
    ON DELETE CASCADE,

  FOREIGN KEY(scheduled_by)
    REFERENCES Users(user_id)
);


/* =========================================================
   MAINTENANCE STATUS HISTORY

   Gives us a complete audit trail.
========================================================= */

CREATE TABLE IF NOT EXISTS MaintenanceStatusHistory (
  history_id INTEGER PRIMARY KEY AUTOINCREMENT,

  report_id INTEGER NOT NULL,

  changed_by INTEGER,

  old_status TEXT,

  new_status TEXT NOT NULL,

  note TEXT,

  created_at TEXT NOT NULL
    DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(report_id)
    REFERENCES MaintenanceReports(report_id)
    ON DELETE CASCADE,

  FOREIGN KEY(changed_by)
    REFERENCES Users(user_id)
);


/* =========================================================
   NOTIFICATIONS
========================================================= */

CREATE TABLE IF NOT EXISTS Notifications (
  notification_id INTEGER PRIMARY KEY AUTOINCREMENT,

  user_id INTEGER NOT NULL,

  title TEXT NOT NULL,

  message TEXT NOT NULL,

  type TEXT NOT NULL DEFAULT 'general',

  link_id INTEGER,

  is_read INTEGER NOT NULL DEFAULT 0,

  created_at TEXT NOT NULL
    DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY(user_id)
    REFERENCES Users(user_id)
    ON DELETE CASCADE
);


/* =========================================================
   EMAIL LOG

   Records emails generated by NestLink.
========================================================= */

CREATE TABLE IF NOT EXISTS EmailLog (
  email_id INTEGER PRIMARY KEY AUTOINCREMENT,

  user_id INTEGER,

  report_id INTEGER,

  recipient_email TEXT NOT NULL,

  subject TEXT NOT NULL,

  message_type TEXT NOT NULL,

  delivery_status TEXT NOT NULL DEFAULT 'pending'
    CHECK(
      delivery_status IN(
        'pending',
        'sent',
        'failed'
      )
    ),

  provider_message_id TEXT,

  error_message TEXT,

  created_at TEXT NOT NULL
    DEFAULT CURRENT_TIMESTAMP,

  sent_at TEXT,

  FOREIGN KEY(user_id)
    REFERENCES Users(user_id)
    ON DELETE SET NULL,

  FOREIGN KEY(report_id)
    REFERENCES MaintenanceReports(report_id)
    ON DELETE SET NULL
);


/* =========================================================
   INDEXES
========================================================= */

CREATE INDEX IF NOT EXISTS
idx_rooms_residence
ON Rooms(residence_id);

CREATE INDEX IF NOT EXISTS
idx_allocations_room
ON RoomAllocations(room_id,status);

CREATE INDEX IF NOT EXISTS
idx_inventory_student
ON InventoryChecks(student_user_id,status);

CREATE INDEX IF NOT EXISTS
idx_inventory_room
ON InventoryChecks(room_id,status);

CREATE INDEX IF NOT EXISTS
idx_inventory_signed
ON InventoryChecks(status,signed_at);

CREATE INDEX IF NOT EXISTS
idx_reports_room
ON MaintenanceReports(room_id);

CREATE INDEX IF NOT EXISTS
idx_reports_status
ON MaintenanceReports(status);

CREATE INDEX IF NOT EXISTS
idx_reports_priority
ON MaintenanceReports(priority);

CREATE INDEX IF NOT EXISTS
idx_assignments_status
ON MaintenanceAssignments(assignment_status);

CREATE INDEX IF NOT EXISTS
idx_assignments_maintenance
ON MaintenanceAssignments(
  maintenance_user_id,
  assignment_status
);

CREATE INDEX IF NOT EXISTS
idx_visits_assignment
ON MaintenanceVisits(assignment_id,status);

CREATE INDEX IF NOT EXISTS
idx_visits_schedule
ON MaintenanceVisits(
  scheduled_date,
  scheduled_time
);

CREATE INDEX IF NOT EXISTS
idx_history_report
ON MaintenanceStatusHistory(
  report_id,
  created_at
);

CREATE INDEX IF NOT EXISTS
idx_notifications_user
ON Notifications(user_id,is_read);

CREATE INDEX IF NOT EXISTS
idx_email_status
ON EmailLog(delivery_status);

CREATE INDEX IF NOT EXISTS
idx_email_report
ON EmailLog(report_id);

`;


/* =========================================================
   CREATE DATABASE
========================================================= */

db.exec(schema);


/* =========================================================
   SEED REQUIRED SYSTEM DATA
========================================================= */

const seed = db.transaction(() => {

  /* -------------------------
     RESIDENCES
  ------------------------- */

  const insertResidence = db.prepare(`
    INSERT OR IGNORE INTO Residences(res_name)
    VALUES(?)
  `);

  [
    'STUDENT VILLAGE 1',
    'STUDENT VILLAGE 2',
    'STUDENT VILLAGE 3',
    'STUDENT VILLAGE 4'
  ].forEach(name => {
    insertResidence.run(name);
  });


  /* -------------------------
     MAINTENANCE CATEGORIES
  ------------------------- */

  const insertCategory = db.prepare(`
    INSERT OR IGNORE INTO
    MaintenanceCategories(
      category_name,
      target_hours
    )
    VALUES(?,?)
  `);

  [
    ['Electrical', 24],
    ['Plumbing', 24],
    ['Furniture', 72],
    ['Doors & Windows', 48],
    ['General', 72]
  ].forEach(category => {
    insertCategory.run(...category);
  });


  /* -------------------------
     INVENTORY ITEMS
  ------------------------- */

  const insertItem = db.prepare(`
    INSERT OR IGNORE INTO ItemCatalog(
      item_name,
      item_group,
      description,
      default_quantity,
      replacement_cost
    )
    VALUES(?,?,?,?,?)
  `);

  const itemsToSeed = [

    [
      'Study Desk',
      'furniture',
      'Student study desk',
      1,
      1200
    ],

    [
      'Chair',
      'furniture',
      'Study chair',
      1,
      650
    ],

    [
      'Bed',
      'furniture',
      'Residence bed frame',
      1,
      1800
    ],

    [
      'Mattress',
      'soft_furnishing',
      'Single mattress',
      1,
      1400
    ],

    [
      'Wardrobe',
      'furniture',
      'Built-in or freestanding wardrobe',
      1,
      2200
    ],

    [
      'Light',
      'electrical',
      'Room light fitting',
      1,
      300
    ],

    [
      'Power Outlet',
      'electrical',
      'Wall power outlet',
      2,
      250
    ]

  ];

  itemsToSeed.forEach(item => {
    insertItem.run(...item);
  });


  /* -------------------------
     ROOMS + ROOM INVENTORY
  ------------------------- */

  const residences = db.prepare(`
    SELECT residence_id
    FROM Residences
  `).all();


  const catalogItems = db.prepare(`
    SELECT
      item_id,
      default_quantity
    FROM ItemCatalog
  `).all();


  const insertRoom = db.prepare(`
    INSERT OR IGNORE INTO Rooms(
      residence_id,
      room_number,
      floor_no,
      capacity
    )
    VALUES(?,?,?,?)
  `);


  const findRoom = db.prepare(`
    SELECT room_id
    FROM Rooms
    WHERE residence_id = ?
      AND room_number = ?
  `);


  const insertInventory = db.prepare(`
    INSERT OR IGNORE INTO RoomInventory(
      room_id,
      item_id,
      quantity_expected
    )
    VALUES(?,?,?)
  `);


  for (const residence of residences) {

    for (let number = 101; number <= 106; number++) {

      insertRoom.run(
        residence.residence_id,
        String(number),
        1,
        1
      );


      const room = findRoom.get(
        residence.residence_id,
        String(number)
      );


      for (const item of catalogItems) {

        insertInventory.run(
          room.room_id,
          item.item_id,
          item.default_quantity
        );

      }
    }
  }

});


seed();

db.close();


console.log(
  'UFH NestLink database initialized successfully.'
);

console.log(
  'Roles supported: student, residence_staff, maintenance_staff.'
);

console.log(
  'Maintenance workflow tables are ready.'
);

console.log(
  'No user accounts were seeded.'
);