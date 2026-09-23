const express = require('express');

const {
  all,
  one,
  run,
  db
} = require('../lib/db');

const {
  requireMaintenance,
  notify
} = require('../lib/helpers');

const {
  sendFaultAcceptedEmail,
  sendVisitScheduledEmail,
  sendWorkStartedEmail,
  sendWorkCompletedEmail
} = require('../lib/email');

const router = express.Router();

router.use(requireMaintenance);


/* =========================================================
   MAINTENANCE DASHBOARD
========================================================= */

router.get('/dashboard', (req, res) => {

  const counts = one(
    `
      SELECT
        COUNT(*) AS total,

        COALESCE(
          SUM(assignment_status = 'forwarded'),
          0
        ) AS waiting,

        COALESCE(
          SUM(assignment_status = 'accepted'),
          0
        ) AS accepted,

        COALESCE(
          SUM(assignment_status = 'scheduled'),
          0
        ) AS scheduled,

        COALESCE(
          SUM(assignment_status = 'in_progress'),
          0
        ) AS in_progress,

        COALESCE(
          SUM(assignment_status = 'completed'),
          0
        ) AS completed

      FROM MaintenanceAssignments
    `
  );

  const todayVisits = one(
    `
      SELECT COUNT(*) AS count

      FROM MaintenanceVisits

      WHERE
        scheduled_date =
          DATE('now','localtime')

        AND status IN(
          'scheduled',
          'rescheduled'
        )
    `
  ).count;

  res.json({
    counts,
    todayVisits
  });
});


/* =========================================================
   INCOMING / ACTIVE JOB QUEUE
========================================================= */

router.get('/jobs', (req, res) => {

  const rows = all(
    `
      SELECT
        ma.assignment_id,
        ma.assignment_status,
        ma.forwarded_at,
        ma.forwarding_note,
        ma.accepted_at,
        ma.acceptance_note,

        mr.report_id,
        mr.reference_code,
        mr.title,
        mr.description,
        mr.priority,
        mr.status,
        mr.created_at,

        mc.category_name,
        mc.target_hours,

        r.room_number,

        rs.res_name,

        student.full_name
          AS student_name,

        student.email
          AS student_email,

        forwarder.full_name
          AS forwarded_by_name,

        technician.full_name
          AS maintenance_staff_name,

        (
          SELECT mv.scheduled_date

          FROM MaintenanceVisits mv

          WHERE
            mv.assignment_id =
              ma.assignment_id

            AND mv.status IN(
              'scheduled',
              'rescheduled'
            )

          ORDER BY
            mv.created_at DESC

          LIMIT 1
        ) AS scheduled_date,

        (
          SELECT mv.scheduled_time

          FROM MaintenanceVisits mv

          WHERE
            mv.assignment_id =
              ma.assignment_id

            AND mv.status IN(
              'scheduled',
              'rescheduled'
            )

          ORDER BY
            mv.created_at DESC

          LIMIT 1
        ) AS scheduled_time

      FROM MaintenanceAssignments ma

      JOIN MaintenanceReports mr
        ON mr.report_id =
           ma.report_id

      JOIN MaintenanceCategories mc
        ON mc.category_id =
           mr.category_id

      JOIN Rooms r
        ON r.room_id =
           mr.room_id

      JOIN Residences rs
        ON rs.residence_id =
           r.residence_id

      JOIN Users student
        ON student.user_id =
           mr.reported_by

      JOIN Users forwarder
        ON forwarder.user_id =
           ma.forwarded_by

      LEFT JOIN Users technician
        ON technician.user_id =
           ma.maintenance_user_id

      WHERE
        ma.assignment_status !=
          'cancelled'

      ORDER BY
        CASE ma.assignment_status
          WHEN 'forwarded' THEN 1
          WHEN 'accepted' THEN 2
          WHEN 'scheduled' THEN 3
          WHEN 'in_progress' THEN 4
          WHEN 'completed' THEN 5
          ELSE 6
        END,

        CASE mr.priority
          WHEN 'urgent' THEN 1
          WHEN 'high' THEN 2
          WHEN 'normal' THEN 3
          ELSE 4
        END,

        ma.forwarded_at ASC
    `
  );

  res.json(rows);
});


/* =========================================================
   JOB DETAILS
========================================================= */

router.get(
  '/jobs/:assignmentId',
  (req, res) => {

    const job = one(
      `
        SELECT
          ma.*,

          mr.reference_code,
          mr.title,
          mr.description,
          mr.priority,

          mr.status
            AS report_status,

          mr.resolution_note,

          mr.created_at
            AS report_created_at,

          mc.category_name,

          r.room_id,
          r.room_number,

          rs.res_name,

          student.user_id
            AS student_user_id,

          student.full_name
            AS student_name,

          student.email
            AS student_email

        FROM MaintenanceAssignments ma

        JOIN MaintenanceReports mr
          ON mr.report_id =
             ma.report_id

        JOIN MaintenanceCategories mc
          ON mc.category_id =
             mr.category_id

        JOIN Rooms r
          ON r.room_id =
             mr.room_id

        JOIN Residences rs
          ON rs.residence_id =
             r.residence_id

        JOIN Users student
          ON student.user_id =
             mr.reported_by

        WHERE ma.assignment_id = ?
      `,
      [Number(req.params.assignmentId)]
    );

    if (!job) {
      return res.status(404).json({
        error:
          'Maintenance job not found.'
      });
    }

    const visits = all(
      `
        SELECT
          mv.*,

          u.full_name
            AS scheduled_by_name

        FROM MaintenanceVisits mv

        JOIN Users u
          ON u.user_id =
             mv.scheduled_by

        WHERE mv.assignment_id = ?

        ORDER BY
          mv.created_at DESC
      `,
      [job.assignment_id]
    );

    const history = all(
      `
        SELECT
          msh.*,

          u.full_name
            AS changed_by_name

        FROM MaintenanceStatusHistory msh

        LEFT JOIN Users u
          ON u.user_id =
             msh.changed_by

        WHERE msh.report_id = ?

        ORDER BY
          msh.created_at ASC,
          msh.history_id ASC
      `,
      [job.report_id]
    );

    res.json({
      job,
      visits,
      history
    });
  }
);


/* =========================================================
   ACCEPT FORWARDED FAULT
========================================================= */

router.post(
  '/jobs/:assignmentId/accept',
  async (req, res) => {

    const assignment = one(
      `
        SELECT
          ma.*,

          mr.reference_code,
          mr.reported_by,
          mr.title,

          student.full_name
            AS student_name,

          student.email
            AS student_email

        FROM MaintenanceAssignments ma

        JOIN MaintenanceReports mr
          ON mr.report_id =
             ma.report_id

        JOIN Users student
          ON student.user_id =
             mr.reported_by

        WHERE ma.assignment_id = ?
      `,
      [Number(req.params.assignmentId)]
    );

    if (!assignment) {
      return res.status(404).json({
        error:
          'Maintenance job not found.'
      });
    }

    if (
      assignment.assignment_status !==
      'forwarded'
    ) {
      return res.status(409).json({
        error:
          'Only newly forwarded faults can be accepted.'
      });
    }

    const note =
      String(
        req.body.note || ''
      )
        .trim()
        .slice(0, 500);

    try {

      const accept =
        db.transaction(() => {

          run(
            `
              UPDATE MaintenanceAssignments

              SET
                maintenance_user_id = ?,
                accepted_at =
                  CURRENT_TIMESTAMP,
                acceptance_note = ?,
                assignment_status =
                  'accepted'

              WHERE assignment_id = ?
            `,
            [
              req.session.user.id,
              note,
              assignment.assignment_id
            ]
          );

          run(
            `
              UPDATE MaintenanceReports

              SET
                status = 'acknowledged',
                updated_at =
                  CURRENT_TIMESTAMP

              WHERE report_id = ?
            `,
            [assignment.report_id]
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
                'forwarded',
                'acknowledged',
                ?
              )
            `,
            [
              assignment.report_id,
              req.session.user.id,
              note ||
                'Maintenance Department confirmed receipt of the fault.'
            ]
          );

          notify(
            assignment.reported_by,
            'Maintenance accepted your fault',

            `${assignment.reference_code} has been received and accepted by the Maintenance Department.`,

            'maintenance_accepted',
            assignment.report_id
          );
        });

      accept();

      try {

        await sendFaultAcceptedEmail({
          studentEmail:
            assignment.student_email,

          studentName:
            assignment.student_name,

          reference:
            assignment.reference_code,

          title:
            assignment.title
        });

      } catch (emailError) {

        console.error(
          'Maintenance accepted email failed:',
          emailError.message
        );
      }

      res.json({
        ok: true,
        status: 'accepted'
      });

    } catch (error) {

      console.error(
        'Accept maintenance job error:',
        error
      );

      res.status(400).json({
        error: error.message
      });
    }
  }
);


/* =========================================================
   SCHEDULE ROOM VISIT
========================================================= */

router.post(
  '/jobs/:assignmentId/schedule',
  async (req, res) => {

    const assignment = one(
      `
        SELECT
          ma.*,

          mr.reference_code,
          mr.reported_by,
          mr.title,

          r.room_number,

          rs.res_name,

          student.full_name
            AS student_name,

          student.email
            AS student_email

        FROM MaintenanceAssignments ma

        JOIN MaintenanceReports mr
          ON mr.report_id =
             ma.report_id

        JOIN Rooms r
          ON r.room_id =
             mr.room_id

        JOIN Residences rs
          ON rs.residence_id =
             r.residence_id

        JOIN Users student
          ON student.user_id =
             mr.reported_by

        WHERE ma.assignment_id = ?
      `,
      [Number(req.params.assignmentId)]
    );

    if (!assignment) {
      return res.status(404).json({
        error:
          'Maintenance job not found.'
      });
    }

    if (
      ![
        'accepted',
        'scheduled'
      ].includes(
        assignment.assignment_status
      )
    ) {
      return res.status(409).json({
        error:
          'Accept the fault before scheduling a visit.'
      });
    }

    if (
      assignment.maintenance_user_id &&
      Number(
        assignment.maintenance_user_id
      ) !==
      Number(
        req.session.user.id
      )
    ) {
      return res.status(403).json({
        error:
          'This job is assigned to another maintenance staff member.'
      });
    }

    const scheduledDate =
      String(
        req.body.date || ''
      ).trim();

    const scheduledTime =
      String(
        req.body.time || ''
      ).trim();

    const estimatedMinutes =
      Number(
        req.body.estimatedMinutes || 60
      );

    const note =
      String(
        req.body.note || ''
      )
        .trim()
        .slice(0, 500);

    if (
      !/^\d{4}-\d{2}-\d{2}$/.test(
        scheduledDate
      )
    ) {
      return res.status(400).json({
        error:
          'Enter a valid visit date.'
      });
    }

    if (
      !/^([01]\d|2[0-3]):[0-5]\d$/.test(
        scheduledTime
      )
    ) {
      return res.status(400).json({
        error:
          'Enter a valid visit time.'
      });
    }

    if (
      !Number.isInteger(
        estimatedMinutes
      ) ||
      estimatedMinutes < 15 ||
      estimatedMinutes > 480
    ) {
      return res.status(400).json({
        error:
          'Estimated visit duration must be between 15 and 480 minutes.'
      });
    }

    const appointment =
      new Date(
        `${scheduledDate}T${scheduledTime}:00`
      );

    if (
      Number.isNaN(
        appointment.getTime()
      ) ||
      appointment.getTime() <=
        Date.now()
    ) {
      return res.status(400).json({
        error:
          'The maintenance visit must be scheduled for a future date and time.'
      });
    }

    try {

      const schedule =
        db.transaction(() => {

          run(
            `
              UPDATE MaintenanceVisits

              SET
                status = 'rescheduled',
                updated_at =
                  CURRENT_TIMESTAMP

              WHERE
                assignment_id = ?
                AND status = 'scheduled'
            `,
            [assignment.assignment_id]
          );

          const result = run(
            `
              INSERT INTO MaintenanceVisits(
                assignment_id,
                scheduled_by,
                scheduled_date,
                scheduled_time,
                estimated_minutes,
                visit_note,
                status
              )

              VALUES(
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                'scheduled'
              )
            `,
            [
              assignment.assignment_id,
              req.session.user.id,
              scheduledDate,
              scheduledTime,
              estimatedMinutes,
              note
            ]
          );

          run(
            `
              UPDATE MaintenanceAssignments

              SET
                maintenance_user_id = ?,
                assignment_status =
                  'scheduled'

              WHERE assignment_id = ?
            `,
            [
              req.session.user.id,
              assignment.assignment_id
            ]
          );

          const oldStatus =
            assignment.assignment_status ===
              'scheduled'
              ? 'scheduled'
              : 'acknowledged';

          run(
            `
              UPDATE MaintenanceReports

              SET
                status = 'scheduled',
                updated_at =
                  CURRENT_TIMESTAMP

              WHERE report_id = ?
            `,
            [assignment.report_id]
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
                ?,
                'scheduled',
                ?
              )
            `,
            [
              assignment.report_id,
              req.session.user.id,
              oldStatus,

              `Maintenance visit scheduled for ${scheduledDate} at ${scheduledTime}.`
            ]
          );

          notify(
            assignment.reported_by,
            'Maintenance visit scheduled',

            `${assignment.reference_code}: Maintenance will visit ${assignment.res_name}, Room ${assignment.room_number} on ${scheduledDate} at ${scheduledTime}.`,

            'maintenance_scheduled',
            assignment.report_id
          );

          return Number(
            result.lastInsertRowid
          );
        });

      const visitId =
        schedule();

      try {

        await sendVisitScheduledEmail({
          studentEmail:
            assignment.student_email,

          studentName:
            assignment.student_name,

          reference:
            assignment.reference_code,

          title:
            assignment.title,

          residence:
            assignment.res_name,

          room:
            assignment.room_number,

          date:
            scheduledDate,

          time:
            scheduledTime
        });

      } catch (emailError) {

        console.error(
          'Maintenance scheduled email failed:',
          emailError.message
        );
      }

      res.status(201).json({
        ok: true,
        visitId,
        status: 'scheduled'
      });

    } catch (error) {

      console.error(
        'Schedule maintenance visit error:',
        error
      );

      res.status(400).json({
        error: error.message
      });
    }
  }
);


/* =========================================================
   START MAINTENANCE WORK
========================================================= */

router.post(
  '/jobs/:assignmentId/start',
  async (req, res) => {

    const assignment = one(
      `
        SELECT
          ma.*,

          mr.reference_code,
          mr.reported_by,
          mr.title,

          student.full_name
            AS student_name,

          student.email
            AS student_email

        FROM MaintenanceAssignments ma

        JOIN MaintenanceReports mr
          ON mr.report_id =
             ma.report_id

        JOIN Users student
          ON student.user_id =
             mr.reported_by

        WHERE ma.assignment_id = ?
      `,
      [Number(req.params.assignmentId)]
    );

    if (!assignment) {
      return res.status(404).json({
        error:
          'Maintenance job not found.'
      });
    }

    if (
      assignment.assignment_status !==
      'scheduled'
    ) {
      return res.status(409).json({
        error:
          'The maintenance visit must be scheduled before work starts.'
      });
    }

    if (
      Number(
        assignment.maintenance_user_id
      ) !==
      Number(
        req.session.user.id
      )
    ) {
      return res.status(403).json({
        error:
          'This job is assigned to another maintenance staff member.'
      });
    }

    try {

      const start =
        db.transaction(() => {

          run(
            `
              UPDATE MaintenanceAssignments

              SET assignment_status =
                  'in_progress'

              WHERE assignment_id = ?
            `,
            [assignment.assignment_id]
          );

          run(
            `
              UPDATE MaintenanceVisits

              SET
                status = 'in_progress',
                updated_at =
                  CURRENT_TIMESTAMP

              WHERE
                assignment_id = ?

                AND status IN(
                  'scheduled',
                  'rescheduled'
                )
            `,
            [assignment.assignment_id]
          );

          run(
            `
              UPDATE MaintenanceReports

              SET
                status = 'in_progress',
                updated_at =
                  CURRENT_TIMESTAMP

              WHERE report_id = ?
            `,
            [assignment.report_id]
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
                'scheduled',
                'in_progress',
                'Maintenance work started.'
              )
            `,
            [
              assignment.report_id,
              req.session.user.id
            ]
          );

          notify(
            assignment.reported_by,
            'Maintenance work started',

            `${assignment.reference_code} is now being attended to.`,

            'maintenance_progress',
            assignment.report_id
          );
        });

      start();

      try {

        await sendWorkStartedEmail({
          studentEmail:
            assignment.student_email,

          studentName:
            assignment.student_name,

          reference:
            assignment.reference_code,

          title:
            assignment.title
        });

      } catch (emailError) {

        console.error(
          'Maintenance work started email failed:',
          emailError.message
        );
      }

      res.json({
        ok: true,
        status: 'in_progress'
      });

    } catch (error) {

      console.error(
        'Start maintenance job error:',
        error
      );

      res.status(400).json({
        error: error.message
      });
    }
  }
);


/* =========================================================
   COMPLETE MAINTENANCE JOB
========================================================= */

router.post(
  '/jobs/:assignmentId/complete',
  async (req, res) => {

    const assignment = one(
      `
        SELECT
          ma.*,

          mr.reference_code,
          mr.reported_by,
          mr.title,

          student.full_name
            AS student_name,

          student.email
            AS student_email

        FROM MaintenanceAssignments ma

        JOIN MaintenanceReports mr
          ON mr.report_id =
             ma.report_id

        JOIN Users student
          ON student.user_id =
             mr.reported_by

        WHERE ma.assignment_id = ?
      `,
      [Number(req.params.assignmentId)]
    );

    if (!assignment) {
      return res.status(404).json({
        error:
          'Maintenance job not found.'
      });
    }

    if (
      assignment.assignment_status !==
      'in_progress'
    ) {
      return res.status(409).json({
        error:
          'Start the maintenance job before completing it.'
      });
    }

    if (
      Number(
        assignment.maintenance_user_id
      ) !==
      Number(
        req.session.user.id
      )
    ) {
      return res.status(403).json({
        error:
          'This job is assigned to another maintenance staff member.'
      });
    }

    const resolution =
      String(
        req.body.resolution || ''
      )
        .trim()
        .slice(0, 1000);

    if (!resolution) {
      return res.status(400).json({
        error:
          'Enter a resolution note before completing the job.'
      });
    }

    try {

      const complete =
        db.transaction(() => {

          run(
            `
              UPDATE MaintenanceAssignments

              SET
                assignment_status =
                  'completed',

                completed_at =
                  CURRENT_TIMESTAMP

              WHERE assignment_id = ?
            `,
            [assignment.assignment_id]
          );

          run(
            `
              UPDATE MaintenanceVisits

              SET
                status = 'completed',
                updated_at =
                  CURRENT_TIMESTAMP

              WHERE
                assignment_id = ?

                AND status =
                  'in_progress'
            `,
            [assignment.assignment_id]
          );

          run(
            `
              UPDATE MaintenanceReports

              SET
                status = 'completed',
                resolution_note = ?,
                updated_at =
                  CURRENT_TIMESTAMP

              WHERE report_id = ?
            `,
            [
              resolution,
              assignment.report_id
            ]
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
                'in_progress',
                'completed',
                ?
              )
            `,
            [
              assignment.report_id,
              req.session.user.id,
              resolution
            ]
          );

          notify(
            assignment.reported_by,
            'Maintenance completed',

            `${assignment.reference_code} has been marked as completed.`,

            'maintenance_completed',
            assignment.report_id
          );
        });

      complete();

      try {

        await sendWorkCompletedEmail({
          studentEmail:
            assignment.student_email,

          studentName:
            assignment.student_name,

          reference:
            assignment.reference_code,

          title:
            assignment.title,

          resolution
        });

      } catch (emailError) {

        console.error(
          'Maintenance completed email failed:',
          emailError.message
        );
      }

      res.json({
        ok: true,
        status: 'completed'
      });

    } catch (error) {

      console.error(
        'Complete maintenance job error:',
        error
      );

      res.status(400).json({
        error: error.message
      });
    }
  }
);


/* =========================================================
   UPCOMING VISITS
========================================================= */

router.get('/visits', (req, res) => {

  res.json(
    all(
      `
        SELECT
          mv.*,

          mr.reference_code,
          mr.title,

          r.room_number,

          rs.res_name,

          student.full_name
            AS student_name,

          student.email
            AS student_email

        FROM MaintenanceVisits mv

        JOIN MaintenanceAssignments ma
          ON ma.assignment_id =
             mv.assignment_id

        JOIN MaintenanceReports mr
          ON mr.report_id =
             ma.report_id

        JOIN Rooms r
          ON r.room_id =
             mr.room_id

        JOIN Residences rs
          ON rs.residence_id =
             r.residence_id

        JOIN Users student
          ON student.user_id =
             mr.reported_by

        WHERE
          mv.status IN(
            'scheduled',
            'rescheduled'
          )

        ORDER BY
          mv.scheduled_date ASC,
          mv.scheduled_time ASC
      `
    )
  );
});


module.exports = router;