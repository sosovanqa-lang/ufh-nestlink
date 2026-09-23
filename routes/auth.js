const express = require('express');
const bcrypt = require('bcryptjs');

const {
  all,
  one,
  run
} = require('../lib/db');

const {
  RESIDENCE_STAFF_EMAIL,
  normalizeEmail,
  roleForEmail,
  canSelfRegister,
  requireAuth
} = require('../lib/helpers');


const router = express.Router();


/* =========================================================
   ACTIVE RESIDENCES

   Used by:
   - Student registration interface
   - Initial Residence Staff setup
========================================================= */

router.get(
  '/residences',
  (req, res) => {

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
  }
);


/* =========================================================
   REGISTRATION

   Normal public registration:
   - Students may register themselves.

   Initial system bootstrap:
   - Only the designated Residence Staff email may create
     the initial Residence Staff account.
   - A valid residence must be selected.

   Maintenance Staff and additional Residence Staff accounts
   must later be created through Staff Account Management.
========================================================= */

router.post(
  '/register',
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
        roleForEmail(email);


      /* =====================================================
         UFH EMAIL VALIDATION
      ===================================================== */

      if (!role) {

        return res.status(400).json({
          error:
            'Use a valid @ufh.ac.za email address.'
        });

      }


      /* =====================================================
         DETERMINE REGISTRATION TYPE
      ===================================================== */

      const isStudent =
        canSelfRegister(email);


      const isInitialResidenceStaff =
        email ===
        normalizeEmail(
          RESIDENCE_STAFF_EMAIL
        );


      /*
         Public registration is blocked for all staff except
         the single designated Residence Staff bootstrap
         account.
      */

      if (
        !isStudent &&
        !isInitialResidenceStaff
      ) {

        return res.status(403).json({
          error:
            'Staff accounts cannot be created through public registration.'
        });

      }


      /* =====================================================
         NAME VALIDATION
      ===================================================== */

      if (fullName.length < 2) {

        return res.status(400).json({
          error:
            'Enter your full name.'
        });

      }


      /* =====================================================
         PASSWORD VALIDATION
      ===================================================== */

      if (password.length < 8) {

        return res.status(400).json({
          error:
            'Password must be at least 8 characters.'
        });

      }


      /* =====================================================
         DUPLICATE ACCOUNT
      ===================================================== */

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


      /* =====================================================
         RESIDENCE ASSIGNMENT

         Students:
         - Start without a residence.
         - Residence Staff later allocate them to rooms.

         Initial Residence Staff:
         - Must select an active residence.
      ===================================================== */

      let residenceId = null;


      if (isInitialResidenceStaff) {

        residenceId =
          Number(
            req.body.residenceId
          );


        if (
          !Number.isInteger(
            residenceId
          ) ||
          residenceId <= 0
        ) {

          return res.status(400).json({
            error:
              'Select a residence for the Residence Staff account.'
          });

        }


        const residence = one(
          `
            SELECT
              residence_id,
              res_name

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

      }


      /* =====================================================
         PASSWORD HASH
      ===================================================== */

      const passwordHash =
        await bcrypt.hash(
          password,
          12
        );


      /* =====================================================
         CREATE ACCOUNT
      ===================================================== */

      const accountRole =
        isInitialResidenceStaff
          ? 'residence_staff'
          : 'student';


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
          accountRole,
          residenceId
        ]
      );


      /* =====================================================
         SUCCESS RESPONSE
      ===================================================== */

      res.status(201).json({

        userId:
          Number(
            result.lastInsertRowid
          ),

        role:
          accountRole,

        message:
          isInitialResidenceStaff
            ? 'Residence Staff account created successfully.'
            : 'Student account created successfully.'

      });


    } catch (error) {

      next(error);

    }
  }
);


/* =========================================================
   LOGIN

   The account role always comes from the database.
   The browser cannot choose or change its own role.
========================================================= */

router.post(
  '/login',
  async (req, res, next) => {

    try {

      const email =
        normalizeEmail(
          req.body.email
        );


      const password =
        String(
          req.body.password || ''
        );


      /* =====================================================
         REQUIRED FIELDS
      ===================================================== */

      if (
        !email ||
        !password
      ) {

        return res.status(400).json({
          error:
            'Email and password are required.'
        });

      }


      /* =====================================================
         FIND USER
      ===================================================== */

      const user = one(
        `
          SELECT
            u.user_id,
            u.email,
            u.password_hash,
            u.full_name,
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

          WHERE u.email = ?
        `,
        [email]
      );


      /*
         Use the same response for an unknown account and
         an incorrect password.
      */

      if (!user) {

        return res.status(401).json({
          error:
            'Invalid email or password.'
        });

      }


      /* =====================================================
         PASSWORD CHECK
      ===================================================== */

      const passwordMatches =
        await bcrypt.compare(
          password,
          user.password_hash
        );


      if (!passwordMatches) {

        return res.status(401).json({
          error:
            'Invalid email or password.'
        });

      }


      /* =====================================================
         ACTIVE ACCOUNT CHECK
      ===================================================== */

      if (!user.is_active) {

        return res.status(403).json({
          error:
            'This account is inactive.'
        });

      }


      /* =====================================================
         SUPPORTED ROLE CHECK
      ===================================================== */

      const supportedRoles = [
        'student',
        'residence_staff',
        'maintenance_staff'
      ];


      if (
        !supportedRoles.includes(
          user.role
        )
      ) {

        return res.status(403).json({
          error:
            'This account does not have a valid system role.'
        });

      }


      /* =====================================================
         RESIDENCE STAFF ASSIGNMENT CHECK
      ===================================================== */

      if (
        user.role ===
          'residence_staff' &&
        !user.residence_id
      ) {

        return res.status(403).json({
          error:
            'Your Residence Staff account has not been assigned to a residence.'
        });

      }


      /* =====================================================
         UPDATE LOGIN TIME
      ===================================================== */

      run(
        `
          UPDATE Users

          SET last_login =
              CURRENT_TIMESTAMP

          WHERE user_id = ?
        `,
        [user.user_id]
      );


      /* =====================================================
         CREATE SESSION

         Only trusted database values are stored here.
      ===================================================== */

      req.session.user = {

        id:
          user.user_id,

        email:
          user.email,

        fullName:
          user.full_name,

        role:
          user.role,

        residenceId:
          user.residence_id,

        residenceName:
          user.res_name || null

      };


      req.session.save(
        error => {

          if (error) {

            return next(error);

          }


          res.json({
            user:
              req.session.user
          });

        }
      );


    } catch (error) {

      next(error);

    }
  }
);


/* =========================================================
   CURRENT SESSION
========================================================= */

router.get(
  '/me',
  requireAuth,
  (req, res) => {

    res.json({
      user:
        req.session.user
    });

  }
);


/* =========================================================
   LOGOUT
========================================================= */

router.post(
  '/logout',
  (req, res, next) => {

    req.session.destroy(
      error => {

        if (error) {

          return next(error);

        }


        /*
           server.js uses the custom session cookie name
           "nestlink.sid".
        */

        res.clearCookie(
          'nestlink.sid'
        );


        res.json({
          ok: true
        });

      }
    );

  }
);


module.exports = router;