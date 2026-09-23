const { one, run } = require('./db');


/* =========================================================
   SYSTEM ROLE EMAILS

   These addresses are reserved for authorised staff accounts.
========================================================= */

const RESIDENCE_STAFF_EMAIL =
  '202249895@ufh.ac.za';

const MAINTENANCE_STAFF_EMAIL =
  'maintenance@ufh.ac.za';


/* =========================================================
   EMAIL HELPERS
========================================================= */

const normalizeEmail = value => {
  return String(value || '')
    .trim()
    .toLowerCase();
};


const isUFHEmail = email => {
  return normalizeEmail(email)
    .endsWith('@ufh.ac.za');
};


/* =========================================================
   ROLE RESOLUTION
========================================================= */

function roleForEmail(email) {

  email = normalizeEmail(email);

  if (!isUFHEmail(email)) {
    return null;
  }

  if (email === RESIDENCE_STAFF_EMAIL) {
    return 'residence_staff';
  }

  if (email === MAINTENANCE_STAFF_EMAIL) {
    return 'maintenance_staff';
  }

  return 'student';
}


/* =========================================================
   PUBLIC REGISTRATION

   Only students may create their own account.

   Staff accounts must be provisioned separately.
========================================================= */

function canSelfRegister(email) {

  const role = roleForEmail(email);

  return role === 'student';
}


/* =========================================================
   AUTHENTICATION MIDDLEWARE
========================================================= */

function requireAuth(req, res, next) {

  if (!req.session?.user) {

    return res.status(401).json({
      error: 'Please sign in first.'
    });

  }

  next();
}


/* =========================================================
   GENERIC ROLE AUTHORISATION
========================================================= */

function requireRole(...roles) {

  return (req, res, next) => {

    const user = req.session?.user;

    if (!user) {

      return res.status(401).json({
        error: 'Please sign in first.'
      });

    }

    if (!roles.includes(user.role)) {

      return res.status(403).json({
        error:
          'You are not authorised for this action.'
      });

    }

    next();
  };
}


/* =========================================================
   STUDENT ACCESS
========================================================= */

function requireStudent(req, res, next) {

  const user = req.session?.user;

  if (!user) {

    return res.status(401).json({
      error: 'Please sign in first.'
    });

  }

  if (user.role !== 'student') {

    return res.status(403).json({
      error: 'Student access required.'
    });

  }

  next();
}


/* =========================================================
   RESIDENCE STAFF ACCESS
========================================================= */

function requireResidenceStaff(req, res, next) {

  const user = req.session?.user;

  if (!user) {

    return res.status(401).json({
      error: 'Please sign in first.'
    });

  }

  if (user.role !== 'residence_staff') {

    return res.status(403).json({
      error: 'Residence staff access required.'
    });

  }

  if (!user.residenceId) {

    return res.status(403).json({
      error:
        'Your staff account is not assigned to a residence.'
    });

  }

  next();
}


/* =========================================================
   RESIDENCE DATA ISOLATION

   Residence staff may only access their assigned residence.
========================================================= */

function requireResidenceAccess(req, res, next) {

  const user = req.session?.user;

  if (!user) {

    return res.status(401).json({
      error: 'Please sign in first.'
    });

  }


  if (user.role !== 'residence_staff') {

    return res.status(403).json({
      error: 'Residence staff access required.'
    });

  }


  if (!user.residenceId) {

    return res.status(403).json({
      error:
        'Your staff account is not assigned to a residence.'
    });

  }


  const requestedResidenceIds = [

    req.params?.residenceId,

    req.query?.residenceId,

    req.body?.residenceId

  ].filter(
    value =>
      value !== undefined &&
      value !== null &&
      value !== ''
  );


  const invalidAccess =
    requestedResidenceIds.some(
      id =>
        Number(id) !==
        Number(user.residenceId)
    );


  if (invalidAccess) {

    return res.status(403).json({
      error:
        'You may only access your assigned residence.'
    });

  }

  next();
}


/* =========================================================
   MAINTENANCE DEPARTMENT ACCESS
========================================================= */

function requireMaintenance(req, res, next) {

  const user = req.session?.user;

  if (!user) {

    return res.status(401).json({
      error: 'Please sign in first.'
    });

  }


  if (user.role !== 'maintenance_staff') {

    return res.status(403).json({
      error:
        'Maintenance Department access required.'
    });

  }

  next();
}


/* =========================================================
   RESIDENCE OR MAINTENANCE ACCESS

   Useful for endpoints both departments need to view.
========================================================= */

function requireOperationalStaff(
  req,
  res,
  next
) {

  const user = req.session?.user;

  if (!user) {

    return res.status(401).json({
      error: 'Please sign in first.'
    });

  }


  const allowedRoles = [
    'residence_staff',
    'maintenance_staff'
  ];


  if (!allowedRoles.includes(user.role)) {

    return res.status(403).json({
      error: 'Staff access required.'
    });

  }

  next();
}


/* =========================================================
   SAFE SORTING
========================================================= */

const allowedSort = (
  value,
  map,
  fallback
) => {

  return map[value] || map[fallback];

};


/* =========================================================
   SAFE ALLOWLIST VALUE
========================================================= */

const allowedValue = (
  value,
  values,
  fallback = null
) => {

  return values.includes(value)
    ? value
    : fallback;

};


/* =========================================================
   REFERENCE NUMBER GENERATOR
========================================================= */

function ref(prefix) {

  const year =
    new Date().getFullYear();

  const time =
    String(Date.now()).slice(-6);

  const random =
    Math.floor(
      100 + Math.random() * 900
    );

  return `${prefix}-${year}-${time}${random}`;
}


/* =========================================================
   IN-APP NOTIFICATION
========================================================= */

function notify(
  userId,
  title,
  message,
  type = 'general',
  linkId = null
) {

  return run(
    `
      INSERT INTO Notifications(
        user_id,
        title,
        message,
        type,
        link_id
      )
      VALUES(?,?,?,?,?)
    `,
    [
      userId,
      title,
      message,
      type,
      linkId
    ]
  );
}


/* =========================================================
   STUDENT ROOM LOOKUP
========================================================= */

function roomForStudent(userId) {

  return one(
    `
      SELECT
        ra.allocation_id,
        r.room_id,
        r.room_number,
        r.floor_no,
        r.residence_id,
        rs.res_name

      FROM RoomAllocations ra

      JOIN Rooms r
        ON r.room_id = ra.room_id

      JOIN Residences rs
        ON rs.residence_id =
           r.residence_id

      WHERE
        ra.student_user_id = ?
        AND ra.status = 'active'

      ORDER BY
        ra.allocated_on DESC

      LIMIT 1
    `,
    [userId]
  );
}


/* =========================================================
   STUDENT DETAILS FOR A MAINTENANCE REPORT

   Later used by the email service and scheduling system.
========================================================= */

function studentForReport(reportId) {

  return one(
    `
      SELECT
        u.user_id,
        u.full_name,
        u.email,

        r.room_id,
        r.room_number,

        res.residence_id,
        res.res_name,

        mr.report_id,
        mr.reference_code,
        mr.title,
        mr.status

      FROM MaintenanceReports mr

      JOIN Rooms r
        ON r.room_id = mr.room_id

      JOIN Residences res
        ON res.residence_id =
           r.residence_id

      JOIN RoomAllocations ra
        ON ra.room_id = r.room_id
       AND ra.status = 'active'

      JOIN Users u
        ON u.user_id =
           ra.student_user_id

      WHERE mr.report_id = ?

      LIMIT 1
    `,
    [reportId]
  );
}


/* =========================================================
   EXPORTS
========================================================= */

module.exports = {

  RESIDENCE_STAFF_EMAIL,

  MAINTENANCE_STAFF_EMAIL,

  normalizeEmail,

  isUFHEmail,

  roleForEmail,

  canSelfRegister,

  requireAuth,

  requireRole,

  requireStudent,

  requireResidenceStaff,

  requireResidenceAccess,

  requireMaintenance,

  requireOperationalStaff,

  allowedSort,

  allowedValue,

  ref,

  notify,

  roomForStudent,

  studentForReport

};