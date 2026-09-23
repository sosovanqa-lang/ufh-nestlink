const express = require('express');

const {
  all,
  one,
  run,
  db
} = require('../lib/db');

const {
  requireStudent,
  roomForStudent,
  ref,
  notify,
  allowedSort,
  allowedValue
} = require('../lib/helpers');

const router = express.Router();

router.use(requireStudent);


/* =========================================================
   STUDENT DASHBOARD
========================================================= */

router.get('/dashboard', (req, res) => {

  const userId = req.session.user.id;

  const room = roomForStudent(userId);

  const reports = all(
    `
      SELECT
        status,
        COUNT(*) AS count

      FROM MaintenanceReports

      WHERE reported_by = ?

      GROUP BY status
    `,
    [userId]
  );

  const unread = one(
    `
      SELECT COUNT(*) AS count

      FROM Notifications

      WHERE user_id = ?
        AND is_read = 0
    `,
    [userId]
  ).count;

  const nextVisit = one(
    `
      SELECT
        mv.visit_id,
        mv.scheduled_date,
        mv.scheduled_time,
        mv.estimated_minutes,
        mv.visit_note,

        mr.report_id,
        mr.reference_code,
        mr.title,

        r.room_number,
        rs.res_name

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

      JOIN RoomAllocations ra
        ON ra.room_id = r.room_id
       AND ra.status = 'active'

      WHERE
        ra.student_user_id = ?
        AND mv.status IN(
          'scheduled',
          'rescheduled'
        )

      ORDER BY
        mv.scheduled_date ASC,
        mv.scheduled_time ASC

      LIMIT 1
    `,
    [userId]
  );

  res.json({
    room,
    reports,
    unread,
    nextVisit
  });
});


/* =========================================================
   INVENTORY
========================================================= */

router.get('/inventory', (req, res) => {

  const room =
    roomForStudent(req.session.user.id);

  if (!room) {

    return res.json({
      room: null,
      check: null,
      items: []
    });
  }


  let check = one(
    `
      SELECT *

      FROM InventoryChecks

      WHERE allocation_id = ?

      ORDER BY check_id DESC

      LIMIT 1
    `,
    [room.allocation_id]
  );


  if (!check) {

    const createCheck =
      db.transaction(() => {

        const result = run(
          `
            INSERT INTO InventoryChecks(
              allocation_id,
              room_id,
              student_user_id
            )
            VALUES(?,?,?)
          `,
          [
            room.allocation_id,
            room.room_id,
            req.session.user.id
          ]
        );


        const checkId =
          Number(result.lastInsertRowid);


        run(
          `
            INSERT INTO InventoryCheckItems(
              check_id,
              room_item_id,
              item_id,
              quantity_found
            )

            SELECT
              ?,
              room_item_id,
              item_id,
              quantity_expected

            FROM RoomInventory

            WHERE room_id = ?
          `,
          [
            checkId,
            room.room_id
          ]
        );


        return checkId;
      });


    const checkId =
      createCheck();


    check = one(
      `
        SELECT *

        FROM InventoryChecks

        WHERE check_id = ?
      `,
      [checkId]
    );
  }


  const items = all(
    `
      SELECT
        ici.*,

        ic.item_name,
        ic.item_group,

        ri.quantity_expected,

        mr.reference_code
          AS report_reference,

        mr.status
          AS report_status

      FROM InventoryCheckItems ici

      JOIN ItemCatalog ic
        ON ic.item_id =
           ici.item_id

      JOIN RoomInventory ri
        ON ri.room_item_id =
           ici.room_item_id

      LEFT JOIN MaintenanceReports mr
        ON mr.report_id =
           ici.report_id

      WHERE ici.check_id = ?

      ORDER BY
        ic.item_group,
        ic.item_name
    `,
    [check.check_id]
  );


  res.json({
    room,
    check,
    items
  });
});


/* =========================================================
   SIGN INVENTORY

   Damaged / missing items automatically create faults.
========================================================= */

router.post(
  '/inventory/sign',
  (req, res) => {

    const me =
      req.session.user;


    const room =
      roomForStudent(me.id);


    if (!room) {

      return res.status(400).json({
        error:
          'You do not have an active room allocation.'
      });
    }


    const check = one(
      `
        SELECT *

        FROM InventoryChecks

        WHERE allocation_id = ?
          AND status = 'draft'

        ORDER BY check_id DESC

        LIMIT 1
      `,
      [room.allocation_id]
    );


    if (!check) {

      return res.status(409).json({
        error:
          'No draft inventory check is available.'
      });
    }


    const signature =
      String(
        req.body.signature || ''
      ).trim();


    const items =
      Array.isArray(req.body.items)
        ? req.body.items
        : [];


    if (
      signature.toLowerCase() !==
      me.fullName.trim().toLowerCase()
    ) {

      return res.status(400).json({
        error:
          'Type your full account name as the electronic signature.'
      });
    }


    const validConditions = [
      'good',
      'fair',
      'damaged',
      'missing'
    ];


    const generalCategory = one(
      `
        SELECT category_id

        FROM MaintenanceCategories

        WHERE category_name = 'General'
      `
    );


    if (!generalCategory) {

      return res.status(500).json({
        error:
          'General maintenance category is missing.'
      });
    }


    try {

      const signInventory =
        db.transaction(() => {

          const expectedItems = all(
            `
              SELECT
                check_item_id

              FROM InventoryCheckItems

              WHERE check_id = ?
            `,
            [check.check_id]
          );


          if (
            items.length !==
            expectedItems.length
          ) {

            throw new Error(
              'Every inventory item must be checked before signing.'
            );
          }


          for (const item of items) {

            const row = one(
              `
                SELECT
                  ici.*,
                  ic.item_name

                FROM InventoryCheckItems ici

                JOIN ItemCatalog ic
                  ON ic.item_id =
                     ici.item_id

                WHERE
                  ici.check_item_id = ?
                  AND ici.check_id = ?
              `,
              [
                Number(item.checkItemId),
                check.check_id
              ]
            );


            if (!row) {

              throw new Error(
                'Invalid inventory item.'
              );
            }


            const condition =
              allowedValue(
                item.condition,
                validConditions
              );


            if (!condition) {

              throw new Error(
                'Every inventory item needs a valid condition.'
              );
            }


            const comment =
              String(
                item.comment || ''
              )
                .trim()
                .slice(0, 400);


            const hasFault =
              condition === 'damaged' ||
              condition === 'missing';


            run(
              `
                UPDATE InventoryCheckItems

                SET
                  condition_rating = ?,
                  student_comment = ?,
                  raise_report = ?

                WHERE check_item_id = ?
              `,
              [
                condition,
                comment,
                hasFault ? 1 : 0,
                row.check_item_id
              ]
            );


            run(
              `
                UPDATE RoomInventory

                SET current_condition = ?

                WHERE room_item_id = ?
              `,
              [
                condition,
                row.room_item_id
              ]
            );


            if (
              hasFault &&
              !row.report_id
            ) {

              const code =
                ref('FLT');


              const result = run(
                `
                  INSERT INTO MaintenanceReports(
                    reference_code,
                    room_id,
                    reported_by,
                    category_id,
                    item_id,
                    title,
                    description,
                    priority,
                    source,
                    status
                  )

                  VALUES(
                    ?,?,?,?,?,?,?,?,
                    'inventory',
                    'submitted'
                  )
                `,
                [
                  code,
                  room.room_id,
                  me.id,
                  generalCategory.category_id,
                  row.item_id,

                  `${row.item_name}: ${condition}`,

                  comment ||
                    `Reported as ${condition} during inventory check.`,

                  condition === 'missing'
                    ? 'high'
                    : 'normal'
                ]
              );


              const reportId =
                Number(
                  result.lastInsertRowid
                );


              run(
                `
                  UPDATE InventoryCheckItems

                  SET report_id = ?

                  WHERE check_item_id = ?
                `,
                [
                  reportId,
                  row.check_item_id
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
                    NULL,
                    'submitted',
                    ?
                  )
                `,
                [
                  reportId,
                  me.id,
                  'Fault created automatically from signed inventory.'
                ]
              );


              const staff = all(
                `
                  SELECT user_id

                  FROM Users

                  WHERE
                    role = 'residence_staff'
                    AND residence_id = ?
                    AND is_active = 1
                `,
                [room.residence_id]
              );


              for (const member of staff) {

                notify(
                  member.user_id,
                  'Inventory fault raised',
                  `${me.fullName} reported ${row.item_name} as ${condition}.`,
                  'report',
                  reportId
                );
              }
            }
          }


          run(
            `
              UPDATE InventoryChecks

              SET
                status = 'submitted',
                signature_name = ?,
                signed_at =
                  CURRENT_TIMESTAMP

              WHERE check_id = ?
            `,
            [
              signature,
              check.check_id
            ]
          );


          const faultCount = one(
            `
              SELECT COUNT(*) AS count

              FROM InventoryCheckItems

              WHERE
                check_id = ?
                AND raise_report = 1
            `,
            [check.check_id]
          ).count;


          return faultCount;
        });


      const faultCount =
        signInventory();


      res.json({
        ok: true,
        checkId: check.check_id,
        faultCount
      });

    } catch (error) {

      res.status(400).json({
        error: error.message
      });
    }
  }
);


/* =========================================================
   STUDENT MAINTENANCE REPORTS
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
        mr.created_at DESC
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

      mc.category_name,

      r.room_number,

      rs.res_name,

      ma.assignment_id,
      ma.forwarded_at,
      ma.accepted_at,
      ma.assignment_status,

      mu.full_name
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

    FROM MaintenanceReports mr

    JOIN MaintenanceCategories mc
      ON mc.category_id =
         mr.category_id

    JOIN Rooms r
      ON r.room_id =
         mr.room_id

    JOIN Residences rs
      ON rs.residence_id =
         r.residence_id

    LEFT JOIN MaintenanceAssignments ma
      ON ma.report_id =
         mr.report_id

    LEFT JOIN Users mu
      ON mu.user_id =
         ma.maintenance_user_id

    WHERE mr.reported_by = ?
  `;


  const params = [
    req.session.user.id
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
   STUDENT CREATES MAINTENANCE REPORT
========================================================= */

router.post(
  '/maintenance',
  (req, res) => {

    const room =
      roomForStudent(
        req.session.user.id
      );


    if (!room) {

      return res.status(400).json({
        error:
          'You need an active room allocation.'
      });
    }


    const category = one(
      `
        SELECT category_id

        FROM MaintenanceCategories

        WHERE category_id = ?
      `,
      [Number(req.body.categoryId)]
    );


    const title =
      String(
        req.body.title || ''
      ).trim();


    const description =
      String(
        req.body.description || ''
      ).trim();


    const priority =
      allowedValue(
        req.body.priority,
        [
          'low',
          'normal',
          'high',
          'urgent'
        ],
        'normal'
      );


    if (
      !category ||
      !title ||
      !description
    ) {

      return res.status(400).json({
        error:
          'Category, title and description are required.'
      });
    }


    const code =
      ref('FLT');


    const result = run(
      `
        INSERT INTO MaintenanceReports(
          reference_code,
          room_id,
          reported_by,
          category_id,
          title,
          description,
          priority,
          source,
          status
        )

        VALUES(
          ?,?,?,?,?,?,?,
          'student',
          'submitted'
        )
      `,
      [
        code,
        room.room_id,
        req.session.user.id,
        category.category_id,
        title,
        description,
        priority
      ]
    );


    const reportId =
      Number(
        result.lastInsertRowid
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
          NULL,
          'submitted',
          ?
        )
      `,
      [
        reportId,
        req.session.user.id,
        'Maintenance fault submitted by student.'
      ]
    );


    const residenceStaff = all(
      `
        SELECT user_id

        FROM Users

        WHERE
          role = 'residence_staff'
          AND residence_id = ?
          AND is_active = 1
      `,
      [room.residence_id]
    );


    for (
      const staff of residenceStaff
    ) {

      notify(
        staff.user_id,
        'New maintenance fault',
        `${code}: ${title}`,
        'report',
        reportId
      );
    }


    res.status(201).json({
      reportId,
      reference: code
    });
  }
);


/* =========================================================
   MAINTENANCE REPORT TIMELINE
========================================================= */

router.get(
  '/maintenance/:reportId/history',
  (req, res) => {

    const report = one(
      `
        SELECT mr.report_id

        FROM MaintenanceReports mr

        WHERE
          mr.report_id = ?
          AND mr.reported_by = ?
      `,
      [
        Number(req.params.reportId),
        req.session.user.id
      ]
    );


    if (!report) {

      return res.status(404).json({
        error:
          'Maintenance report not found.'
      });
    }


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
      [report.report_id]
    );


    res.json(history);
  }
);


/* =========================================================
   CATEGORIES
========================================================= */

router.get('/categories', (req, res) => {

  res.json(
    all(
      `
        SELECT *

        FROM MaintenanceCategories

        ORDER BY category_name
      `
    )
  );
});


/* =========================================================
   NOTIFICATIONS
========================================================= */

router.get('/notifications', (req, res) => {

  res.json(
    all(
      `
        SELECT *

        FROM Notifications

        WHERE user_id = ?

        ORDER BY
          created_at DESC,
          notification_id DESC

        LIMIT 50
      `,
      [req.session.user.id]
    )
  );
});


router.post(
  '/notifications/read',
  (req, res) => {

    run(
      `
        UPDATE Notifications

        SET is_read = 1

        WHERE user_id = ?
      `,
      [req.session.user.id]
    );


    res.json({
      ok: true
    });
  }
);


module.exports = router;