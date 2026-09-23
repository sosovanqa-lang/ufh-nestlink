require('dotenv').config();

const path = require('path');
const express = require('express');
const session = require('express-session');
const SQLiteStore = require('connect-sqlite3')(session);

const { one } = require('./lib/db');

const app = express();

const PORT = Number(
  process.env.PORT || 3000
);

const isProduction =
  process.env.NODE_ENV === 'production';


/* =========================================================
   PRODUCTION SECURITY CHECK
========================================================= */

if (
  isProduction &&
  !process.env.SESSION_SECRET
) {
  throw new Error(
    'SESSION_SECRET is required in production.'
  );
}


/* =========================================================
   BASIC EXPRESS SECURITY
========================================================= */

app.disable('x-powered-by');


/* =========================================================
   REQUEST BODY PARSING
========================================================= */

app.use(
  express.json({
    limit: '250kb'
  })
);

app.use(
  express.urlencoded({
    extended: false
  })
);


/* =========================================================
   SESSION STORAGE
========================================================= */

app.use(
  session({

    name: 'nestlink.sid',

    store: new SQLiteStore({

      db: 'sessions.db',

      dir: path.join(
        __dirname,
        'data'
      ),

      createDirIfNotExists: true

    }),

    secret:
      process.env.SESSION_SECRET ||
      'dev-only-change-this-secret',

    resave: false,

    saveUninitialized: false,

    cookie: {

      httpOnly: true,

      sameSite: 'lax',

      secure: isProduction,

      maxAge:
        1000 *
        60 *
        60 *
        8

    }

  })
);


/* =========================================================
   HEALTH CHECK
========================================================= */

app.get(
  '/api/health',
  (req, res) => {

    try {

      one(
        'SELECT 1 AS ok'
      );

      res.json({
        ok: true,
        database: 'sqlite',
        application: 'UFH NestLink'
      });

    } catch (error) {

      console.error(
        'Health check failed:',
        error
      );

      res.status(500).json({
        ok: false,
        database: 'unavailable'
      });

    }
  }
);


/* =========================================================
   API ROUTES
========================================================= */


/* =========================================================
   AUTHENTICATION

   Login
   Student registration
   Logout
   Current session
========================================================= */

app.use(
  '/api/auth',
  require('./routes/auth')
);


/* =========================================================
   STUDENT

   Student dashboard
   Inventory signing
   Fault reporting
   Notifications
   Maintenance tracking
========================================================= */

app.use(
  '/api/student',
  require('./routes/student')
);


/* =========================================================
   RESIDENCE STAFF

   Student management
   Room allocation
   Signed inventories
   Fault ranking
   Inventory verification
   Forwarding faults to Maintenance
========================================================= */

app.use(
  '/api/residence',
  require('./routes/residence')
);


/* =========================================================
   MAINTENANCE DEPARTMENT

   Incoming jobs
   Accept faults
   Schedule visits
   Start work
   Complete work
========================================================= */

app.use(
  '/api/maintenance',
  require('./routes/maintenance')
);


/* =========================================================
   STAFF ACCOUNT MANAGEMENT

   View staff accounts
   Create Residence Staff accounts
   Create Maintenance Staff accounts
   Assign Residence Staff to residences
   Activate staff accounts
   Deactivate staff accounts
========================================================= */

app.use(
  '/api/staff',
  require('./routes/staff')
);


/* =========================================================
   API 404

   Prevent unknown /api requests from being sent
   to index.html.
========================================================= */

app.use(
  '/api',
  (req, res) => {

    res.status(404).json({
      error:
        'API endpoint not found.'
    });

  }
);


/* =========================================================
   FRONTEND STATIC FILES
========================================================= */

app.use(
  express.static(
    path.join(
      __dirname,
      'public'
    )
  )
);


/* =========================================================
   SINGLE PAGE APPLICATION FALLBACK
========================================================= */

app.get(
  /^\/(?!api).*/,
  (req, res) => {

    res.sendFile(
      path.join(
        __dirname,
        'public',
        'index.html'
      )
    );

  }
);


/* =========================================================
   GLOBAL ERROR HANDLER
========================================================= */

app.use(
  (err, req, res, next) => {

    console.error(
      'UFH NestLink server error:',
      err
    );


    if (res.headersSent) {

      return next(err);

    }


    res.status(500).json({
      error:
        'Server error. Please try again.'
    });

  }
);


/* =========================================================
   START SERVER
========================================================= */

app.listen(
  PORT,
  () => {

    console.log(
      `UFH NestLink running at http://localhost:${PORT}`
    );

    console.log(
      'Student API: /api/student'
    );

    console.log(
      'Residence API: /api/residence'
    );

    console.log(
      'Maintenance API: /api/maintenance'
    );

    console.log(
      'Staff API: /api/staff'
    );

  }
);