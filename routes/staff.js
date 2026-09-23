const express = require('express');
const bcrypt = require('bcryptjs');

const {
  all,
  one,
  run
} = require('../lib/db');

const {
  normalizeEmail,
  requireAuth
} = require('../lib/helpers');

const router = express.Router();


/* =========================================================
   STAFF ROUTE SECURITY

   User must be logged in and must be residence staff.
========================================================= */

router.use(requireAuth);

router.use((req, res, next) => {

  if (
    !req.session.user ||
    req.session.user.role !== 'residence_staff'
  ) {
    return res.status(403).json({
      error:
        'Only authorised residence staff can manage staff accounts.'
    });
  }

  next();
});


/* =========================================================
   GET ACTIVE RESIDENCES

   Used when creating a residence staff account.
========================================================= */

router.get('/residences', (req, res) => {

  const residences = all(
    `
      SELECT
        residence_id,
        res_name

      FROM Residences

      WHERE is_active = 1

      ORDER BY res_name
    `
  );

  res.json(residences);
});


/* =========================================================
   GET STAFF ACCOUNTS
========================================================= */

router.get('/', (req, res) => {

  const staff = all(
    `
      SELECT
        u.user_id,
        u.full_name,
        u.email,
        u.role,
        u.residence_id,
        u.is_active,
        u.last_login,
        u.created_at,

        r.res_name

      FROM Users u

      LEFT JOIN Residences r
        ON r.residence_id =
           u.residence_id

      WHERE u.role IN(
        'residence_staff',
        'maintenance_staff'
      )

      ORDER BY
        u.role,
        u.full_name COLLATE NOCASE
    `
  );

  res.json(staff);
});


/* =========================================================
   CREATE STAFF ACCOUNT
========================================================= */

router.post(
  '/',
  async (req, res, next) => {

    try {

      const email =
        normalizeEmail(
          req.body.email
        );

      const fullName =
        String(
          req.body.fullName || ''
        ).trim();

      const password =
        String(
          req.body.password || ''
        );

      const role =
        String(
          req.body.role || ''
        ).trim();

      let residenceId =
        req.body.residenceId
          ? Number(req.body.residenceId)
          : null;


      /* -------------------------
         EMAIL VALIDATION
      ------------------------- */

      if (
        !email ||
        !email.endsWith('@ufh.ac.za')
      ) {
        return res.status(400).json({
          error:
            'Use a valid @ufh.ac.za email address.'
        });
      }


      /* -------------------------
         NAME VALIDATION
      ------------------------- */

      if (fullName.length < 2) {
        return res.status(400).json({
          error:
            'Enter the staff member full name.'
        });
      }


      /* -------------------------
         PASSWORD VALIDATION
      ------------------------- */

      if (password.length < 8) {
        return res.status(400).json({
          error:
            'Password must be at least 8 characters.'
        });
      }


      /* -------------------------
         ROLE VALIDATION
      ------------------------- */

      const allowedRoles = [
        'residence_staff',
        'maintenance_staff'
      ];

      if (!allowedRoles.includes(role)) {
        return res.status(400).json({
          error:
            'Select a valid staff role.'
        });
      }


      /* -------------------------
         RESIDENCE STAFF

         Must belong to a valid residence.
      ------------------------- */

      if (role === 'residence_staff') {

        if (
          !Number.isInteger(residenceId) ||
          residenceId <= 0
        ) {
          return res.status(400).json({
            error:
              'Select a residence for this residence staff account.'
          });
        }

        const residence = one(
          `
            SELECT
              residence_id

            FROM Residences

            WHERE
              residence_id = ?
              AND is_active = 1
          `,
          [residenceId]
        );

        if (!residence) {
          return res.status(400).json({
            error:
              'The selected residence is invalid or inactive.'
          });
        }

      } else {

        /*
           Maintenance staff are not tied
           to one residence.
        */

        residenceId = null;
      }


      /* -------------------------
         DUPLICATE EMAIL
      ------------------------- */

      const existingUser = one(
        `
          SELECT
            user_id

          FROM Users

          WHERE email = ?
        `,
        [email]
      );

      if (existingUser) {
        return res.status(409).json({
          error:
            'An account already exists for this email.'
        });
      }


      /* -------------------------
         HASH PASSWORD
      ------------------------- */

      const passwordHash =
        await bcrypt.hash(
          password,
          12
        );


      /* -------------------------
         CREATE STAFF ACCOUNT
      ------------------------- */

      const result = run(
        `
          INSERT INTO Users(
            email,
            password_hash,
            full_name,
            role,
            residence_id,
            is_active
          )

          VALUES(
            ?,
            ?,
            ?,
            ?,
            ?,
            1
          )
        `,
        [
          email,
          passwordHash,
          fullName,
          role,
          residenceId
        ]
      );


      /* -------------------------
         RETURN CREATED ACCOUNT
      ------------------------- */

      const createdUser = one(
        `
          SELECT
            u.user_id,
            u.full_name,
            u.email,
            u.role,
            u.residence_id,
            u.is_active,
            u.created_at,

            r.res_name

          FROM Users u

          LEFT JOIN Residences r
            ON r.residence_id =
               u.residence_id

          WHERE u.user_id = ?
        `,
        [
          Number(
            result.lastInsertRowid
          )
        ]
      );


      res.status(201).json({
        message:
          'Staff account created successfully.',

        user:
          createdUser
      });

    } catch (error) {

      next(error);
    }
  }
);


/* =========================================================
   ACTIVATE / DEACTIVATE STAFF ACCOUNT
========================================================= */

router.patch(
  '/:userId/status',
  (req, res) => {

    const userId =
      Number(
        req.params.userId
      );

    const isActive =
      Number(
        req.body.isActive
      );


    if (
      !Number.isInteger(userId) ||
      userId <= 0
    ) {
      return res.status(400).json({
        error:
          'Invalid staff account.'
      });
    }


    if (
      ![0, 1].includes(isActive)
    ) {
      return res.status(400).json({
        error:
          'Invalid account status.'
      });
    }


    const staff = one(
      `
        SELECT
          user_id,
          role

        FROM Users

        WHERE
          user_id = ?

          AND role IN(
            'residence_staff',
            'maintenance_staff'
          )
      `,
      [userId]
    );


    if (!staff) {
      return res.status(404).json({
        error:
          'Staff account not found.'
      });
    }


    /*
       Prevent the logged-in residence staff
       member from disabling their own account.
    */

    if (
      Number(req.session.user.id) ===
        userId &&
      isActive === 0
    ) {
      return res.status(409).json({
        error:
          'You cannot deactivate your own account.'
      });
    }


    run(
      `
        UPDATE Users

        SET is_active = ?

        WHERE user_id = ?
      `,
      [
        isActive,
        userId
      ]
    );


    res.json({
      ok: true,

      userId,

      isActive
    });
  }
);


module.exports = router;