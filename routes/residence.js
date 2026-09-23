const express = require('express');

const {
  all,
  one,
  run,
  db
} = require('../lib/db');

const {
  requireResidenceAccess,
  allowedSort,
  allowedValue,
  notify
} = require('../lib/helpers');

const {
  sendFaultForwardedEmail
} = require('../lib/email');

const router = express.Router();

router.use(requireResidenceAccess);


/* =========================================================
   RESIDENCE DASHBOARD
========================================================= */

router.get('/dashboard', (req, res) => {

  const residenceId =
    req.session.user.residenceId;


  const rooms = one(
    `
      SELECT
        COUNT(*) AS total,

        COALESCE(
          SUM(status = 'occupied'),
          0
        ) AS occupied,

        COALESCE(
          SUM(status = 'maintenance'),
          0
        ) AS maintenance

      FROM Rooms

      WHERE residence_id = ?
    `,
    [residenceId]
  );


  const reports = one(
    `
      SELECT
        COUNT(*) AS total,

        COALESCE(
          SUM(mr.status = 'submitted'),
          0
        ) AS submitted,

        COALESCE(
          SUM(mr.status = 'forwarded'),
          0
        ) AS forwarded,

        COALESCE(
          SUM(
            mr.status IN(
              'acknowledged',
              'scheduled',
              'in_progress'
            )
          ),
          0
        ) AS with_maintenance

      FROM MaintenanceReports mr

      JOIN Rooms r
        ON r.room_id =
           mr.room_id

      WHERE
        r.residence_id = ?
        AND mr.status != 'closed'
    `,
    [residenceId]
  );


  const checks = one(
    `
      SELECT
        COUNT(*) AS signed_pending_review

      FROM InventoryChecks ic

      JOIN Rooms r
        ON r.room_id =
           ic.room_id

      WHERE
        r.residence_id = ?
        AND ic.status = 'submitted'
    `,
    [residenceId]
  );


  const urgentRooms = one(
    `
      SELECT COUNT(*) AS count

      FROM (
        SELECT
          mr.room_id

        FROM MaintenanceReports mr

        JOIN Rooms r
          ON r.room_id =
             mr.room_id

        WHERE
          r.residence_id = ?
          AND mr.status = 'submitted'

        GROUP BY mr.room_id

        HAVING COUNT(*) >= 3
      )
    `,
    [residenceId]
  ).count;


  res.json({
    rooms,
    reports,
    checks,
    urgentRooms
  });
});


/* =========================================================
   STUDENTS
========================================================= */

router.get('/students', (req, res) => {

  const sort = allowedSort(
    req.query.sort,
    {
      name:
        'u.full_name COLLATE NOCASE',

      room:
        'r.room_number',

      newest:
        'u.created_at DESC'
    },
    'name'
  );


  const rows = all(
    `
      SELECT
        u.user_id,
        u.full_name,
        u.email,

        r.room_number,

        ra.allocation_id

      FROM Users u

      LEFT JOIN RoomAllocations ra
        ON ra.student_user_id =
           u.user_id
       AND ra.status = 'active'

      LEFT JOIN Rooms r
        ON r.room_id =
           ra.room_id

      WHERE
        u.role = 'student'

        AND (
          r.residence_id = ?
          OR r.residence_id IS NULL
        )

      ORDER BY ${sort}
    `,
    [req.session.user.residenceId]
  );


  res.json(rows);
});


/* =========================================================
   ROOMS
========================================================= */

router.get('/rooms', (req, res) => {

  res.json(
    all(
      `
        SELECT
          r.*,

          u.full_name
            AS student_name,

          u.email
            AS student_email

        FROM Rooms r

        LEFT JOIN RoomAllocations ra
          ON ra.room_id =
             r.room_id
         AND ra.status = 'active'

        LEFT JOIN Users u
          ON u.user_id =
             ra.student_user_id

        WHERE r.residence_id = ?

        ORDER BY r.room_number
      `,
      [req.session.user.residenceId]
    )
  );
});


/* =========================================================
   ROOM ALLOCATION
========================================================= */

router.post('/allocations', (req, res) => {

  const staff =
    req.session.user;


  const student = one(
    `
      SELECT user_id

      FROM Users

      WHERE
        user_id = ?
        AND role = 'student'
        AND is_active = 1
    `,
    [Number(req.body.studentId)]
  );


  const room = one(
    `
      SELECT *

      FROM Rooms

      WHERE
        room_id = ?
        AND residence_id = ?
    `,
    [
      Number(req.body.roomId),
      staff.residenceId
    ]
  );


  if (!student || !room) {

    return res.status(400).json({
      error:
        'Invalid student or room.'
    });
  }


  try {

    const allocate =
      db.transaction(() => {

        const oldAllocation = one(
          `
            SELECT room_id

            FROM RoomAllocations

            WHERE
              student_user_id = ?
              AND status = 'active'
          `,
          [student.user_id]
        );


        run(
          `
            UPDATE RoomAllocations

            SET
              status = 'ended',
              ended_on = CURRENT_DATE

            WHERE
              student_user_id = ?
              AND status = 'active'
          `,
          [student.user_id]
        );


        if (oldAllocation) {

          run(
            `
              UPDATE Rooms

              SET status = 'available'

              WHERE room_id = ?
            `,
            [oldAllocation.room_id]
          );
        }


        const occupied = one(
          `
            SELECT allocation_id

            FROM RoomAllocations

            WHERE
              room_id = ?
              AND status = 'active'
          `,
          [room.room_id]
        );


        if (occupied) {

          throw new Error(
            'This room is already allocated.'
          );
        }


        run(
          `
            INSERT INTO RoomAllocations(
              room_id,
              student_user_id,
              academic_year,
              status,
              allocated_by
            )

            VALUES(
              ?,
              ?,
              ?,
              'active',
              ?
            )
          `,
          [
            room.room_id,
            student.user_id,
            new Date().getFullYear(),
            staff.id
          ]
        );


        run(
          `
            UPDATE Rooms

            SET status = 'occupied'

            WHERE room_id = ?
          `,
          [room.room_id]
        );


        notify(
          student.user_id,
          'Room allocated',
          `You have been allocated room ${room.room_number}.`,
          'allocation',
          room.room_id
        );
      });


    allocate();


    res.status(201).json({
      ok: true
    });

  } catch (error) {

    res.status(409).json({
      error:
        error.message ||
        'That allocation could not be completed.'
    });
  }
});


/* =========================================================
   SIGNED INVENTORY QUEUE

   INVENTORIES WITH THE MOST FAULTS APPEAR FIRST.
========================================================= */

router.get(
  '/inventory-checks',
  (req, res) => {

    const rows = all(
      `
        SELECT
          ic.check_id,
          ic.status,
          ic.signature_name,
          ic.signed_at,
          ic.opened_at,
          ic.verified_at,

          u.user_id
            AS student_user_id,

          u.full_name,
          u.email,

          r.room_id,
          r.room_number,

          COUNT(ici.check_item_id)
            AS total_items,

          COALESCE(
            SUM(
              CASE
                WHEN ici.condition_rating =
                     'damaged'
                THEN 1
                ELSE 0
              END
            ),
            0
          ) AS damaged_count,

          COALESCE(
            SUM(
              CASE
                WHEN ici.condition_rating =
                     'missing'
                THEN 1
                ELSE 0
              END
            ),
            0
          ) AS missing_count,

          COALESCE(
            SUM(
              CASE
                WHEN ici.condition_rating
                     IN(
                       'damaged',
                       'missing'
                     )
                THEN 1
                ELSE 0
              END
            ),
            0
          ) AS fault_count,

          COALESCE(
            SUM(
              CASE
                WHEN
                  ici.report_id IS NOT NULL
                  AND mr.status =
                      'submitted'
                THEN 1
                ELSE 0
              END
            ),
            0
          ) AS ready_to_forward,

          COALESCE(
            SUM(
              CASE
                WHEN mr.status IN(
                  'forwarded',
                  'acknowledged',
                  'scheduled',
                  'in_progress',
                  'completed',
                  'closed'
                )
                THEN 1
                ELSE 0
              END
            ),
            0
          ) AS forwarded_count

        FROM InventoryChecks ic

        JOIN Users u
          ON u.user_id =
             ic.student_user_id

        JOIN Rooms r
          ON r.room_id =
             ic.room_id

        LEFT JOIN InventoryCheckItems ici
          ON ici.check_id =
             ic.check_id

        LEFT JOIN MaintenanceReports mr
          ON mr.report_id =
             ici.report_id

        WHERE
          r.residence_id = ?

          AND ic.status IN(
            'submitted',
            'verified'
          )

        GROUP BY
          ic.check_id,
          u.user_id,
          r.room_id

        ORDER BY
          fault_count DESC,
          missing_count DESC,
          ic.signed_at ASC,
          r.room_number ASC
      `,
      [req.session.user.residenceId]
    );


    res.json(rows);
  }
);


/* =========================================================
   INVENTORY DETAILS
========================================================= */

router.get(
  '/inventory-checks/:checkId',
  (req, res) => {

    const check = one(
      `
        SELECT
          ic.*,

          u.full_name,
          u.email,

          r.room_number,

          rs.res_name

        FROM InventoryChecks ic

        JOIN Users u
          ON u.user_id =
             ic.student_user_id

        JOIN Rooms r
          ON r.room_id =
             ic.room_id

        JOIN Residences rs
          ON rs.residence_id =
             r.residence_id

        WHERE
          ic.check_id = ?
          AND r.residence_id = ?
      `,
      [
        Number(req.params.checkId),
        req.session.user.residenceId
      ]
    );


    if (!check) {

      return res.status(404).json({
        error:
          'Inventory check not found.'
      });
    }


    const items = all(
      `
        SELECT
          ici.check_item_id,
          ici.quantity_found,
          ici.condition_rating,
          ici.student_comment,
          ici.raise_report,
          ici.report_id,

          item.item_name,
          item.item_group,

          ri.quantity_expected,

          mr.reference_code,
          mr.status
            AS report_status,
          mr.priority

        FROM InventoryCheckItems ici

        JOIN ItemCatalog item
          ON item.item_id =
             ici.item_id

        JOIN RoomInventory ri
          ON ri.room_item_id =
             ici.room_item_id

        LEFT JOIN MaintenanceReports mr
          ON mr.report_id =
             ici.report_id

        WHERE ici.check_id = ?

        ORDER BY
          CASE
            ici.condition_rating

            WHEN 'missing'
              THEN 1

            WHEN 'damaged'
              THEN 2

            WHEN 'fair'
              THEN 3

            ELSE 4
          END,

          item.item_name
      `,
      [check.check_id]
    );


    res.json({
      check,
      items
    });
  }
);


/* =========================================================
   VERIFY INVENTORY
========================================================= */

router.post(
  '/inventory-checks/:checkId/verify',
  (req, res) => {

    const check = one(
      `
        SELECT
          ic.*,
          r.residence_id

        FROM InventoryChecks ic

        JOIN Rooms r
          ON r.room_id =
             ic.room_id

        WHERE
          ic.check_id = ?
          AND r.residence_id = ?
      `,
      [
        Number(req.params.checkId),
        req.session.user.residenceId
      ]
    );


    if (!check) {

      return res.status(404).json({
        error:
          'Inventory check not found.'
      });
    }


    if (check.status !== 'submitted') {

      return res.status(409).json({
        error:
          'Only submitted checks can be verified.'
      });
    }


    run(
      `
        UPDATE InventoryChecks

        SET
          status = 'verified',
          verified_by = ?,
          verified_at =
            CURRENT_TIMESTAMP,
          verifier_note = ?

        WHERE check_id = ?
      `,
      [
        req.session.user.id,

        String(
          req.body.note || ''
        ).slice(0, 500),

        check.check_id
      ]
    );


    notify(
      check.student_user_id,
      'Inventory verified',
      'Residence staff verified your digital inventory check.',
      'inventory',
      check.check_id
    );


    res.json({
      ok: true
    });
  }
);


/* =========================================================
   RESIDENCE MAINTENANCE QUEUE
========================================================= */

router.get('/maintenance', (req, res) => {

  const sort = allowedSort(
    req.query.sort,
    {
      newest:
        'mr.created_at DESC',

      oldest:
        'mr.created_at ASC',

      priority: `
        CASE mr.priority
          WHEN 'urgent' THEN 1
          WHEN 'high' THEN 2
          WHEN 'normal' THEN 3
          ELSE 4
        END,
        mr.created_at ASC
      `
    },
    'newest'
  );


  const status =
    allowedValue(
      req.query.status,
      [
        'submitted',
        'forwarded',
        'acknowledged',
        'scheduled',
        'in_progress',
        'completed',
        'closed'
      ]
    );


  let sql = `
    SELECT
      mr.*,

      u.full_name
        AS reporter,

      u.email
        AS student_email,

      r.room_number,

      mc.category_name,

      ma.assignment_id,
      ma.forwarded_at,
      ma.accepted_at,
      ma.assignment_status,

      mu.full_name
        AS maintenance_staff_name

    FROM MaintenanceReports mr

    JOIN Rooms r
      ON r.room_id =
         mr.room_id

    JOIN Users u
      ON u.user_id =
         mr.reported_by

    JOIN MaintenanceCategories mc
      ON mc.category_id =
         mr.category_id

    LEFT JOIN MaintenanceAssignments ma
      ON ma.report_id =
         mr.report_id

    LEFT JOIN Users mu
      ON mu.user_id =
         ma.maintenance_user_id

    WHERE r.residence_id = ?
  `;


  const params = [
    req.session.user.residenceId
  ];


  if (status) {

    sql += `
      AND mr.status = ?
    `;

    params.push(status);
  }


  sql += `
    ORDER BY ${sort}
  `;


  res.json(
    all(sql, params)
  );
});


/* =========================================================
   FORWARD ONE FAULT TO MAINTENANCE

   DATABASE UPDATE HAPPENS FIRST.
   EMAIL FAILURE DOES NOT CANCEL THE FORWARDING.
========================================================= */

router.post(
  '/maintenance/:reportId/forward',
  async (req, res) => {

    const report = one(
      `
        SELECT
          mr.*,

          r.residence_id,
          r.room_number,

          rs.res_name,

          u.full_name
            AS student_name,

          u.email
            AS student_email

        FROM MaintenanceReports mr

        JOIN Rooms r
          ON r.room_id =
             mr.room_id

        JOIN Residences rs
          ON rs.residence_id =
             r.residence_id

        JOIN Users u
          ON u.user_id =
             mr.reported_by

        WHERE
          mr.report_id = ?
          AND r.residence_id = ?
      `,
      [
        Number(req.params.reportId),
        req.session.user.residenceId
      ]
    );


    if (!report) {

      return res.status(404).json({
        error:
          'Maintenance report not found.'
      });
    }


    if (report.status !== 'submitted') {

      return res.status(409).json({
        error:
          'Only submitted faults can be forwarded.'
      });
    }


    const existingAssignment = one(
      `
        SELECT assignment_id

        FROM MaintenanceAssignments

        WHERE report_id = ?
      `,
      [report.report_id]
    );


    if (existingAssignment) {

      return res.status(409).json({
        error:
          'This fault has already been forwarded.'
      });
    }


    const note =
      String(
        req.body.note || ''
      )
        .trim()
        .slice(0, 500);


    try {

      const forward =
        db.transaction(() => {

          const assignment = run(
            `
              INSERT INTO MaintenanceAssignments(
                report_id,
                forwarded_by,
                forwarding_note,
                assignment_status
              )

              VALUES(
                ?,
                ?,
                ?,
                'forwarded'
              )
            `,
            [
              report.report_id,
              req.session.user.id,
              note
            ]
          );


          const assignmentId =
            Number(
              assignment.lastInsertRowid
            );


          run(
            `
              UPDATE MaintenanceReports

              SET
                status = 'forwarded',
                updated_at =
                  CURRENT_TIMESTAMP

              WHERE report_id = ?
            `,
            [report.report_id]
          );


          run(
            `
              INSERT INTO MaintenanceStatusHistory(
                report_id,
                changed_by,
                old_status,
                new_status,
                note
              )

              VALUES(
                ?,
                ?,
                'submitted',
                'forwarded',
                ?
              )
            `,
            [
              report.report_id,
              req.session.user.id,
              note ||
                'Fault forwarded to Maintenance Department.'
            ]
          );


          notify(
            report.reported_by,
            'Fault forwarded to Maintenance',
            `${report.reference_code} has been forwarded to the Maintenance Department.`,
            'maintenance_forwarded',
            report.report_id
          );


          const maintenanceUsers = all(
            `
              SELECT user_id

              FROM Users

              WHERE
                role =
                  'maintenance_staff'
                AND is_active = 1
            `
          );


          for (
            const user of
            maintenanceUsers
          ) {

            notify(
              user.user_id,
              'New maintenance fault received',
              `${report.reference_code}: ${report.res_name}, Room ${report.room_number} — ${report.title}`,
              'maintenance_assignment',
              report.report_id
            );
          }


          return assignmentId;
        });


      const assignmentId =
        forward();


      /*
         Email is deliberately sent AFTER the
         database transaction succeeds.
      */

      try {

        await sendFaultForwardedEmail({

          studentEmail:
            report.student_email,

          studentName:
            report.student_name,

          reference:
            report.reference_code,

          title:
            report.title

        });

      } catch (emailError) {

        console.error(
          'Fault forwarded email failed:',
          emailError.message
        );

      }


      res.json({
        ok: true,
        assignmentId,
        status: 'forwarded'
      });

    } catch (error) {

      res.status(400).json({
        error: error.message
      });
    }
  }
);


/* =========================================================
   FORWARD ALL FAULTS FROM A SIGNED INVENTORY
========================================================= */

router.post(
  '/inventory-checks/:checkId/forward-faults',
  async (req, res) => {

    const check = one(
      `
        SELECT
          ic.check_id,
          ic.student_user_id,

          r.residence_id,
          r.room_number,

          rs.res_name

        FROM InventoryChecks ic

        JOIN Rooms r
          ON r.room_id =
             ic.room_id

        JOIN Residences rs
          ON rs.residence_id =
             r.residence_id

        WHERE
          ic.check_id = ?
          AND r.residence_id = ?
          AND ic.status IN(
            'submitted',
            'verified'
          )
      `,
      [
        Number(req.params.checkId),
        req.session.user.residenceId
      ]
    );


    if (!check) {

      return res.status(404).json({
        error:
          'Signed inventory check not found.'
      });
    }


    /*
       Student details are included here so each
       forwarded report can trigger its own email.
    */

    const reports = all(
      `
        SELECT DISTINCT
          mr.report_id,
          mr.reference_code,
          mr.title,
          mr.reported_by,

          u.full_name
            AS student_name,

          u.email
            AS student_email

        FROM InventoryCheckItems ici

        JOIN MaintenanceReports mr
          ON mr.report_id =
             ici.report_id

        JOIN Users u
          ON u.user_id =
             mr.reported_by

        WHERE
          ici.check_id = ?
          AND ici.raise_report = 1
          AND mr.status = 'submitted'
      `,
      [check.check_id]
    );


    if (!reports.length) {

      return res.status(409).json({
        error:
          'There are no unforwarded faults in this inventory.'
      });
    }


    const note =
      String(
        req.body.note || ''
      )
        .trim()
        .slice(0, 500);


    try {

      /*
         Keep track of exactly which reports were
         forwarded. This prevents an email from being
         sent for a report that was skipped.
      */

      const forwardAll =
        db.transaction(() => {

          const maintenanceUsers = all(
            `
              SELECT user_id

              FROM Users

              WHERE
                role =
                  'maintenance_staff'
                AND is_active = 1
            `
          );


          const forwardedReports = [];


          for (const report of reports) {

            const existing = one(
              `
                SELECT assignment_id

                FROM MaintenanceAssignments

                WHERE report_id = ?
              `,
              [report.report_id]
            );


            if (existing) {

              continue;

            }


            run(
              `
                INSERT INTO MaintenanceAssignments(
                  report_id,
                  forwarded_by,
                  forwarding_note,
                  assignment_status
                )

                VALUES(
                  ?,
                  ?,
                  ?,
                  'forwarded'
                )
              `,
              [
                report.report_id,
                req.session.user.id,
                note
              ]
            );


            run(
              `
                UPDATE MaintenanceReports

                SET
                  status = 'forwarded',
                  updated_at =
                    CURRENT_TIMESTAMP

                WHERE report_id = ?
              `,
              [report.report_id]
            );


            run(
              `
                INSERT INTO MaintenanceStatusHistory(
                  report_id,
                  changed_by,
                  old_status,
                  new_status,
                  note
                )

                VALUES(
                  ?,
                  ?,
                  'submitted',
                  'forwarded',
                  ?
                )
              `,
              [
                report.report_id,
                req.session.user.id,
                note ||
                  'Inventory fault forwarded to Maintenance Department.'
              ]
            );


            notify(
              report.reported_by,
              'Inventory fault forwarded',
              `${report.reference_code} has been forwarded to the Maintenance Department.`,
              'maintenance_forwarded',
              report.report_id
            );


            for (
              const maintenanceUser of
              maintenanceUsers
            ) {

              notify(
                maintenanceUser.user_id,
                'New maintenance fault received',
                `${report.reference_code}: ${check.res_name}, Room ${check.room_number} — ${report.title}`,
                'maintenance_assignment',
                report.report_id
              );
            }


            forwardedReports.push(
              report
            );
          }


          return forwardedReports;
        });


      const forwardedReports =
        forwardAll();


      /*
         Send emails only after all database work
         has committed successfully.
      */

      for (
        const report of
        forwardedReports
      ) {

        try {

          await sendFaultForwardedEmail({

            studentEmail:
              report.student_email,

            studentName:
              report.student_name,

            reference:
              report.reference_code,

            title:
              report.title

          });

        } catch (emailError) {

          console.error(
            `Forward email failed for ${report.reference_code}:`,
            emailError.message
          );

        }
      }


      res.json({
        ok: true,
        forwarded:
          forwardedReports.length
      });

    } catch (error) {

      res.status(400).json({
        error: error.message
      });
    }
  }
);


module.exports = router;