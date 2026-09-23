window.Residence = {

  nav: [
    ['dashboard', 'Overview'],
    ['rooms', 'Rooms & Students'],
    ['inventory', 'Inventory Reviews'],
    ['maintenance', 'Maintenance Log'],
    ['staff', 'Staff Management']
  ],


  /* =========================================================
     PAGE ROUTER
  ========================================================= */

  async render(page) {

    if (page === 'rooms') {
      return this.rooms();
    }

    if (page === 'inventory') {
      return this.inventory();
    }

    if (page === 'maintenance') {
      return this.maintenance();
    }

    if (page === 'staff') {
      return this.staff();
    }

    return this.dashboard();
  },


  /* =========================================================
     DASHBOARD
  ========================================================= */

  async dashboard() {

    try {

      const d =
        await API(
          '/api/residence/dashboard'
        );


      App.view.innerHTML = `

        <section class="hero">

          <h1>
            ${esc(
              App.user.residenceName ||
              'Residence'
            )}
            Staff Dashboard
          </h1>

          <p>
            Manage room allocations,
            signed inventories and
            maintenance faults.
          </p>

        </section>


        <section class="grid">

          <div class="card">

            <div class="stat">
              ${d.rooms.total || 0}
            </div>

            <b>
              Total rooms
            </b>

          </div>


          <div class="card">

            <div class="stat">
              ${d.rooms.occupied || 0}
            </div>

            <b>
              Occupied
            </b>

          </div>


          <div class="card">

            <div class="stat">
              ${d.reports.submitted || 0}
            </div>

            <b>
              New faults
            </b>

          </div>


          <div class="card">

            <div class="stat">
              ${
                d.checks
                  .signed_pending_review ||
                0
              }
            </div>

            <b>
              Inventory checks awaiting review
            </b>

          </div>

        </section>

      `;

    } catch (error) {

      this.showPageError(
        error.message
      );

    }
  },


  /* =========================================================
     ROOMS & STUDENTS
  ========================================================= */

  async rooms() {

    try {

      const [
        rooms,
        students
      ] = await Promise.all([

        API(
          '/api/residence/rooms'
        ),

        API(
          '/api/residence/students'
        )

      ]);


      App.view.innerHTML = `

        <section class="hero">

          <h1>
            Rooms & Students
          </h1>

          <p>
            Allocate registered students
            to rooms in your assigned
            residence.
          </p>

        </section>


        <div class="card">

          <form
            id="alloc"
            class="formGrid"
          >

            <div class="field">

              <label>
                Student
              </label>

              <select
                id="student"
                required
              >

                ${
                  students.length

                    ? students.map(
                        student => `

                          <option
                            value="${student.user_id}"
                          >
                            ${esc(
                              student.full_name
                            )}
                            ·
                            ${esc(
                              student.email
                            )}
                          </option>

                        `
                      ).join('')

                    : `
                        <option value="">
                          No registered students available
                        </option>
                      `
                }

              </select>

            </div>


            <div class="field">

              <label>
                Room
              </label>

              <select
                id="room"
                required
              >

                ${
                  rooms.map(
                    room => `

                      <option
                        value="${room.room_id}"
                      >
                        ${esc(
                          room.room_number
                        )}

                        ${
                          room.student_name
                            ? ' · occupied'
                            : ''
                        }
                      </option>

                    `
                  ).join('')
                }

              </select>

            </div>


            <div class="field">

              <label>
                &nbsp;
              </label>

              <button
                class="btn"
                ${
                  !students.length
                    ? 'disabled'
                    : ''
                }
              >
                Allocate room
              </button>

            </div>

          </form>

        </div>


        <div
          class="tableWrap"
          style="margin-top:16px"
        >

          <table>

            <thead>

              <tr>
                <th>Room</th>
                <th>Status</th>
                <th>Student</th>
              </tr>

            </thead>

            <tbody>

              ${
                rooms.map(
                  room => `

                    <tr>

                      <td>
                        ${esc(
                          room.room_number
                        )}
                      </td>

                      <td>
                        <span class="badge">
                          ${esc(
                            room.status
                          )}
                        </span>
                      </td>

                      <td>
                        ${esc(
                          room.student_name ||
                          '—'
                        )}
                      </td>

                    </tr>

                  `
                ).join('')
              }

            </tbody>

          </table>

        </div>

      `;


      const form =
        document.getElementById(
          'alloc'
        );


      form.onsubmit =
        async event => {

          event.preventDefault();

          try {

            await API(
              '/api/residence/allocations',
              {
                method: 'POST',

                body:
                  JSON.stringify({
                    studentId:
                      document
                        .getElementById(
                          'student'
                        )
                        .value,

                    roomId:
                      document
                        .getElementById(
                          'room'
                        )
                        .value
                  })
              }
            );


            await this.rooms();

          } catch (error) {

            alert(
              error.message
            );

          }
        };


    } catch (error) {

      this.showPageError(
        error.message
      );

    }
  },


  /* =========================================================
     INVENTORY REVIEWS
  ========================================================= */

  async inventory() {

    try {

      const rows =
        await API(
          '/api/residence/inventory-checks'
        );


      App.view.innerHTML = `

        <section class="hero">

          <h1>
            Inventory Reviews
          </h1>

          <p>
            Review signed room inventories.
            Inventories with the most faults
            appear first.
          </p>

        </section>


        <div class="tableWrap">

          <table>

            <thead>

              <tr>

                <th>
                  Student
                </th>

                <th>
                  Room
                </th>

                <th>
                  Faults
                </th>

                <th>
                  Status
                </th>

                <th>
                  Signed
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              ${
                rows.length

                  ? rows.map(
                      row => `

                        <tr>

                          <td>

                            <b>
                              ${esc(
                                row.full_name
                              )}
                            </b>

                            <br>

                            <small>
                              ${esc(
                                row.email
                              )}
                            </small>

                          </td>


                          <td>
                            ${esc(
                              row.room_number
                            )}
                          </td>


                          <td>

                            <b>
                              ${
                                row.fault_count ||
                                0
                              }
                            </b>

                            <br>

                            <small>
                              ${
                                row.damaged_count ||
                                0
                              }
                              damaged ·
                              ${
                                row.missing_count ||
                                0
                              }
                              missing
                            </small>

                          </td>


                          <td>

                            <span class="badge">

                              ${esc(
                                row.status
                              )}

                            </span>

                          </td>


                          <td>

                            ${esc(
                              row.signed_at ||
                              '—'
                            )}

                          </td>


                          <td>

                            ${
                              row.status ===
                              'submitted'

                                ? `

                                  <button
                                    class="btn verify"
                                    data-id="${row.check_id}"
                                  >
                                    Verify
                                  </button>

                                `

                                : '—'
                            }

                          </td>

                        </tr>

                      `
                    ).join('')

                  : `

                    <tr>

                      <td
                        colspan="6"
                        style="
                          text-align:center;
                          padding:32px;
                        "
                      >
                        No signed inventories
                        are waiting for review.
                      </td>

                    </tr>

                  `
              }

            </tbody>

          </table>

        </div>

      `;


      document
        .querySelectorAll(
          '.verify'
        )
        .forEach(
          button => {

            button.onclick =
              async () => {

                try {

                  await API(
                    `/api/residence/inventory-checks/${button.dataset.id}/verify`,
                    {
                      method: 'POST',

                      body:
                        JSON.stringify({
                          note:
                            'Verified by residence staff.'
                        })
                    }
                  );


                  await this.inventory();

                } catch (error) {

                  alert(
                    error.message
                  );

                }
              };

          }
        );


    } catch (error) {

      this.showPageError(
        error.message
      );

    }
  },


  /* =========================================================
     MAINTENANCE LOG
  ========================================================= */

  async maintenance() {

    try {

      const rows =
        await API(
          '/api/residence/maintenance?sort=priority'
        );


      App.view.innerHTML = `

        <section class="hero">

          <h1>
            Maintenance Fault Tracking
          </h1>

          <p>
            Review faults reported from
            ${esc(
              App.user.residenceName ||
              'your residence'
            )}
            and forward new faults to the
            Maintenance Department.
          </p>

        </section>


        <div class="tableWrap">

          <table>

            <thead>

              <tr>

                <th>
                  Reference
                </th>

                <th>
                  Room / Student
                </th>

                <th>
                  Fault
                </th>

                <th>
                  Priority
                </th>

                <th>
                  Status
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              ${
                rows.length

                  ? rows.map(
                      row => `

                        <tr>

                          <td>

                            <b>
                              ${esc(
                                row.reference_code
                              )}
                            </b>

                          </td>


                          <td>

                            Room
                            ${esc(
                              row.room_number
                            )}

                            <br>

                            <small>
                              ${esc(
                                row.reporter
                              )}
                            </small>

                          </td>


                          <td>

                            <b>
                              ${esc(
                                row.title
                              )}
                            </b>

                            <br>

                            <small>
                              ${esc(
                                row.category_name
                              )}
                            </small>

                          </td>


                          <td>

                            <span class="badge">
                              ${esc(
                                row.priority
                              )}
                            </span>

                          </td>


                          <td>

                            <span class="badge">
                              ${esc(
                                row.status
                              )}
                            </span>

                          </td>


                          <td>

                            ${
                              row.status ===
                              'submitted'

                                ? `

                                  <button
                                    class="btn forwardFault"
                                    data-id="${row.report_id}"
                                  >
                                    Forward
                                  </button>

                                `

                                : `

                                  <small>
                                    ${
                                      row
                                        .maintenance_staff_name

                                        ? `Assigned to ${esc(
                                            row
                                              .maintenance_staff_name
                                          )}`

                                        : esc(
                                            row.status
                                          )
                                    }
                                  </small>

                                `
                            }

                          </td>

                        </tr>

                      `
                    ).join('')

                  : `

                    <tr>

                      <td
                        colspan="6"
                        style="
                          text-align:center;
                          padding:32px;
                        "
                      >
                        No maintenance faults
                        have been reported.
                      </td>

                    </tr>

                  `
              }

            </tbody>

          </table>

        </div>

      `;


      document
        .querySelectorAll(
          '.forwardFault'
        )
        .forEach(
          button => {

            button.onclick =
              async () => {

                const confirmed =
                  confirm(
                    'Forward this fault to the Maintenance Department?'
                  );


                if (!confirmed) {
                  return;
                }


                try {

                  await API(
                    `/api/residence/maintenance/${button.dataset.id}/forward`,
                    {
                      method: 'POST',

                      body:
                        JSON.stringify({
                          note:
                            'Forwarded by Residence Staff.'
                        })
                    }
                  );


                  await this.maintenance();

                } catch (error) {

                  alert(
                    error.message
                  );

                }
              };

          }
        );


    } catch (error) {

      this.showPageError(
        error.message
      );

    }
  },


  /* =========================================================
     STAFF ACCOUNT MANAGEMENT
  ========================================================= */

  async staff() {

    try {

      const [
        staff,
        residences
      ] = await Promise.all([

        API(
          '/api/staff'
        ),

        API(
          '/api/staff/residences'
        )

      ]);


      App.view.innerHTML = `

        <section class="hero">

          <h1>
            Staff Account Management
          </h1>

          <p>
            Create and manage authorised
            Residence Staff and Maintenance
            Staff accounts.
          </p>

        </section>


        <div
          id="staffMessage"
          style="margin-bottom:16px"
        ></div>


        <div class="card">

          <h2>
            Create Staff Account
          </h2>

          <p>
            Staff accounts created here are
            saved directly to the NestLink
            database.
          </p>


          <form
            id="createStaff"
            class="formGrid"
          >

            <div class="field">

              <label>
                Full name
              </label>

              <input
                id="staffFullName"
                type="text"
                required
                minlength="2"
                placeholder="Staff member full name"
              >

            </div>


            <div class="field">

              <label>
                UFH email
              </label>

              <input
                id="staffEmail"
                type="email"
                required
                placeholder="staff@ufh.ac.za"
              >

            </div>


            <div class="field">

              <label>
                Role
              </label>

              <select
                id="staffRole"
                required
              >

                <option
                  value="maintenance_staff"
                >
                  Maintenance Staff
                </option>

                <option
                  value="residence_staff"
                >
                  Residence Staff
                </option>

              </select>

            </div>


            <div
              class="field"
              id="staffResidenceField"
              hidden
            >

              <label>
                Assigned residence
              </label>

              <select
                id="staffResidence"
              >

                ${
                  residences.map(
                    residence => `

                      <option
                        value="${residence.residence_id}"
                      >
                        ${esc(
                          residence.res_name
                        )}
                      </option>

                    `
                  ).join('')
                }

              </select>

            </div>


            <div class="field">

              <label>
                Temporary password
              </label>

              <input
                id="staffPassword"
                type="password"
                required
                minlength="8"
                placeholder="Minimum 8 characters"
              >

            </div>


            <div class="field">

              <label>
                &nbsp;
              </label>

              <button
                class="btn"
                type="submit"
              >
                Create Staff Account
              </button>

            </div>

          </form>

        </div>


        <div
          class="tableWrap"
          style="margin-top:20px"
        >

          <table>

            <thead>

              <tr>

                <th>
                  Staff Member
                </th>

                <th>
                  Role
                </th>

                <th>
                  Residence
                </th>

                <th>
                  Status
                </th>

                <th>
                  Last Login
                </th>

                <th>
                  Action
                </th>

              </tr>

            </thead>


            <tbody>

              ${
                staff.length

                  ? staff.map(
                      user => `

                        <tr>

                          <td>

                            <b>
                              ${esc(
                                user.full_name
                              )}
                            </b>

                            <br>

                            <small>
                              ${esc(
                                user.email
                              )}
                            </small>

                          </td>


                          <td>

                            <span class="badge">

                              ${
                                user.role ===
                                'residence_staff'
                                  ? 'Residence Staff'
                                  : 'Maintenance Staff'
                              }

                            </span>

                          </td>


                          <td>

                            ${esc(
                              user.res_name ||
                              'All residences'
                            )}

                          </td>


                          <td>

                            <span class="badge">

                              ${
                                Number(
                                  user.is_active
                                ) === 1
                                  ? 'Active'
                                  : 'Inactive'
                              }

                            </span>

                          </td>


                          <td>

                            ${esc(
                              user.last_login ||
                              'Never'
                            )}

                          </td>


                          <td>

                            ${
                              Number(
                                user.user_id
                              ) ===
                              Number(
                                App.user.id
                              )

                                ? `

                                  <small>
                                    Current account
                                  </small>

                                `

                                : `

                                  <button
                                    class="btn staffStatus"
                                    data-id="${user.user_id}"
                                    data-active="${
                                      Number(
                                        user.is_active
                                      ) === 1
                                        ? 0
                                        : 1
                                    }"
                                  >

                                    ${
                                      Number(
                                        user.is_active
                                      ) === 1
                                        ? 'Deactivate'
                                        : 'Activate'
                                    }

                                  </button>

                                `
                            }

                          </td>

                        </tr>

                      `
                    ).join('')

                  : `

                    <tr>

                      <td
                        colspan="6"
                        style="
                          text-align:center;
                          padding:32px;
                        "
                      >
                        No staff accounts found.
                      </td>

                    </tr>

                  `
              }

            </tbody>

          </table>

        </div>

      `;


      /* =====================================================
         ROLE / RESIDENCE SELECTOR
      ===================================================== */

      const roleSelect =
        document.getElementById(
          'staffRole'
        );


      const residenceField =
        document.getElementById(
          'staffResidenceField'
        );


      const updateResidenceField =
        () => {

          residenceField.hidden =
            roleSelect.value !==
            'residence_staff';

        };


      roleSelect.onchange =
        updateResidenceField;


      updateResidenceField();


      /* =====================================================
         CREATE STAFF ACCOUNT
      ===================================================== */

      document
        .getElementById(
          'createStaff'
        )
        .onsubmit =
          async event => {

            event.preventDefault();


            const message =
              document.getElementById(
                'staffMessage'
              );


            message.innerHTML = '';


            try {

              const role =
                roleSelect.value;


              const payload = {

                fullName:
                  document
                    .getElementById(
                      'staffFullName'
                    )
                    .value,

                email:
                  document
                    .getElementById(
                      'staffEmail'
                    )
                    .value,

                password:
                  document
                    .getElementById(
                      'staffPassword'
                    )
                    .value,

                role,

                residenceId:
                  role ===
                  'residence_staff'

                    ? document
                        .getElementById(
                          'staffResidence'
                        )
                        .value

                    : null

              };


              await API(
                '/api/staff',
                {
                  method: 'POST',

                  body:
                    JSON.stringify(
                      payload
                    )
                }
              );


              message.innerHTML = `

                <div class="successBox">

                  Staff account created
                  successfully.

                </div>

              `;


              setTimeout(
                () => {
                  this.staff();
                },
                700
              );


            } catch (error) {

              message.innerHTML = `

                <div class="error">

                  ${esc(
                    error.message
                  )}

                </div>

              `;

            }
          };


      /* =====================================================
         ACTIVATE / DEACTIVATE STAFF
      ===================================================== */

      document
        .querySelectorAll(
          '.staffStatus'
        )
        .forEach(
          button => {

            button.onclick =
              async () => {

                const isActive =
                  Number(
                    button.dataset.active
                  );


                const action =
                  isActive === 1
                    ? 'activate'
                    : 'deactivate';


                const confirmed =
                  confirm(
                    `Are you sure you want to ${action} this staff account?`
                  );


                if (!confirmed) {
                  return;
                }


                try {

                  await API(
                    `/api/staff/${button.dataset.id}/status`,
                    {
                      method: 'PATCH',

                      body:
                        JSON.stringify({
                          isActive
                        })
                    }
                  );


                  await this.staff();


                } catch (error) {

                  alert(
                    error.message
                  );

                }
              };

          }
        );


    } catch (error) {

      this.showPageError(
        error.message
      );

    }
  },


  /* =========================================================
     PAGE ERROR
  ========================================================= */

  showPageError(message) {

    App.view.innerHTML = `

      <section class="hero">

        <h1>
          Something went wrong
        </h1>

        <p>
          ${esc(
            message ||
            'The page could not be loaded.'
          )}
        </p>

      </section>

    `;

  }

};