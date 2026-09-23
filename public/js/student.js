window.Student = {
  nav: [
    ['dashboard', 'Overview'],
    ['inventory', 'Inventory Check'],
    ['maintenance', 'Maintenance'],
    ['notifications', 'Notifications']
  ],

  async render(page) {
    if (page === 'inventory') return this.inventory();
    if (page === 'maintenance') return this.maintenance();
    if (page === 'notifications') return this.notifications();

    const d = await API('/api/student/dashboard');

    const maintenanceTotal = d.reports.reduce(
      (total, report) => total + Number(report.count || 0),
      0
    );

    const residenceName = d.room
      ? esc(d.room.res_name)
      : 'Awaiting allocation';

    const roomNumber = d.room
      ? esc(d.room.room_number)
      : 'Not assigned';

    App.view.innerHTML = `
      <div class="studentDashboard">

        <!-- WELCOME HERO -->
        <section class="studentWelcome">
          <div class="welcomeContent">

            <span class="welcomeEyebrow">
              UFH-NESTLINK STUDENT PORTAL
            </span>

            <h1>
              Welcome back,
              <span>${esc(App.user.fullName)}</span>
            </h1>

            <p>
              Manage your residence, room inventory, maintenance
              requests and important notifications from one place.
            </p>

            <div class="welcomeActions">

              <button
                class="btn"
                onclick="App.go('inventory')"
              >
                Check Room Inventory
              </button>

              <button
                class="btn btnOutline"
                onclick="App.go('maintenance')"
              >
                Report a Fault
              </button>

            </div>
          </div>


          <div class="residenceSummary">

            <div class="residenceIcon">
              ⌂
            </div>

            <div>
              <span class="summaryLabel">
                YOUR RESIDENCE
              </span>

              <h3>${residenceName}</h3>

              <div class="roomNumber">
                ${
                  d.room
                    ? `Room ${roomNumber}`
                    : 'Room not allocated'
                }
              </div>
            </div>

          </div>
        </section>


        <!-- OVERVIEW -->
        <section class="dashboardSection">

          <div class="sectionHeading">

            <div>
              <span class="sectionEyebrow">
                OVERVIEW
              </span>

              <h2>Your Residence</h2>
            </div>

            <span class="academicBadge">
              Academic Year 2026
            </span>

          </div>


          <div class="studentStats">

            <!-- ROOM -->
            <article class="studentStatCard">

              <div class="statIcon">
                ⌂
              </div>

              <div class="statContent">

                <span class="statLabel">
                  Room Allocation
                </span>

                <h3>
                  ${d.room ? 'Active' : 'Pending'}
                </h3>

                <p>
                  ${
                    d.room
                      ? `${residenceName} · Room ${roomNumber}`
                      : 'Waiting for residence assignment'
                  }
                </p>

              </div>

              <span
                class="statusDot ${d.room ? 'active' : ''}"
              ></span>

            </article>


            <!-- INVENTORY -->
            <article
              class="studentStatCard clickable"
              onclick="App.go('inventory')"
            >

              <div class="statIcon">
                ✓
              </div>

              <div class="statContent">

                <span class="statLabel">
                  Inventory
                </span>

                <h3>Room Check</h3>

                <p>
                  Inspect and digitally sign your room inventory.
                </p>

              </div>

              <span class="cardArrow">
                →
              </span>

            </article>


            <!-- MAINTENANCE -->
            <article
              class="studentStatCard clickable"
              onclick="App.go('maintenance')"
            >

              <div class="statIcon">
                ⚒
              </div>

              <div class="statContent">

                <span class="statLabel">
                  Maintenance
                </span>

                <h3>${maintenanceTotal}</h3>

                <p>
                  Maintenance reports linked to your room.
                </p>

              </div>

              <span class="cardArrow">
                →
              </span>

            </article>


            <!-- NOTIFICATIONS -->
            <article
              class="studentStatCard clickable"
              onclick="App.go('notifications')"
            >

              <div class="statIcon">
                ♢
              </div>

              <div class="statContent">

                <span class="statLabel">
                  Notifications
                </span>

                <h3>${d.unread}</h3>

                <p>
                  ${
                    d.unread === 1
                      ? 'Unread residence notification'
                      : 'Unread residence notifications'
                  }
                </p>

              </div>

              <span class="cardArrow">
                →
              </span>

            </article>

          </div>
        </section>


        <!-- QUICK ACCESS -->
        <section class="studentQuickActions">

          <div class="sectionHeading">

            <div>
              <span class="sectionEyebrow">
                QUICK ACCESS
              </span>

              <h2>Residence Services</h2>
            </div>

          </div>


          <div class="quickActionGrid">

            <button
              class="quickAction"
              onclick="App.go('inventory')"
            >

              <span class="quickIcon">
                ☑
              </span>

              <span class="quickText">

                <strong>
                  Inventory Check
                </strong>

                <small>
                  Inspect and digitally sign your room inventory
                </small>

              </span>

              <b>→</b>

            </button>


            <button
              class="quickAction"
              onclick="App.go('maintenance')"
            >

              <span class="quickIcon">
                ⚒
              </span>

              <span class="quickText">

                <strong>
                  Report Maintenance
                </strong>

                <small>
                  Report damaged items or residence faults
                </small>

              </span>

              <b>→</b>

            </button>


            <button
              class="quickAction"
              onclick="App.go('notifications')"
            >

              <span class="quickIcon">
                ♢
              </span>

              <span class="quickText">

                <strong>
                  Notifications
                </strong>

                <small>
                  View important residence announcements
                </small>

              </span>

              <b>→</b>

            </button>

          </div>

        </section>


        <!-- SUPPORT -->
        <section class="studentSupport">

          <div>

            <span class="sectionEyebrow gold">
              STUDENT RESIDENCE SUPPORT
            </span>

            <h2>
              Need help with your residence?
            </h2>

            <p>
              Report maintenance problems through UFH-NestLink
              so residence staff can track and resolve them.
            </p>

          </div>

          <button
            class="supportButton"
            onclick="App.go('maintenance')"
          >
            Report a Problem →
          </button>

        </section>

      </div>
    `;
  },


  /* =========================================================
     INVENTORY
  ========================================================= */

  async inventory() {
    const d = await API('/api/student/inventory');

    if (!d.room) {
      App.view.innerHTML = `
        <div class="pageShell">

          <section class="pageHeader">

            <div>
              <span class="pageEyebrow">
                ROOM MANAGEMENT
              </span>

              <h1>Inventory Check</h1>

              <p>
                Review and confirm the condition of items
                allocated to your room.
              </p>
            </div>

          </section>


          <div class="emptyState">

            <div class="emptyIcon">
              ⌂
            </div>

            <h2>No Room Allocation</h2>

            <p>
              You need an active room allocation before
              completing an inventory check.
            </p>

          </div>

        </div>
      `;

      return;
    }


    const locked = d.check.status !== 'draft';


    App.view.innerHTML = `
      <div class="pageShell">

        <section class="pageHeader">

          <div>

            <span class="pageEyebrow">
              ROOM MANAGEMENT
            </span>

            <h1>Digital Inventory Check</h1>

            <p>
              Inspect your allocated room items and confirm
              their current condition.
            </p>

          </div>


          <div class="pageHeaderMeta">

            <span class="headerMetaLabel">
              ROOM
            </span>

            <strong>
              ${esc(d.room.res_name)}
            </strong>

            <span>
              Room ${esc(d.room.room_number)}
            </span>

          </div>

        </section>


        <div class="inventoryStatus">

          <div>
            <span class="statusLabel">
              INVENTORY STATUS
            </span>

            <h3>
              ${
                locked
                  ? 'Inventory Submitted'
                  : 'Inventory Check Required'
              }
            </h3>
          </div>

          <span class="badge">
            ${esc(d.check.status)}
          </span>

        </div>


        <form id="inv">

          <div class="modernTable">

            <div class="tableTitle">

              <div>
                <h2>Room Inventory</h2>

                <p>
                  Check each item and record its current condition.
                </p>
              </div>

              <span>
                ${d.items.length} items
              </span>

            </div>


            <div class="tableWrap">

              <table>

                <thead>
                  <tr>
                    <th>Item</th>
                    <th>Expected</th>
                    <th>Condition</th>
                    <th>Comment</th>
                  </tr>
                </thead>

                <tbody>

                  ${d.items.map(i => `
                    <tr data-id="${i.check_item_id}">

                      <td>

                        <div class="inventoryItem">

                          <span class="itemIcon">
                            ▣
                          </span>

                          <div>

                            <strong>
                              ${esc(i.item_name)}
                            </strong>

                            ${
                              i.report_reference
                                ? `
                                  <small>
                                    Maintenance:
                                    ${esc(i.report_reference)}
                                  </small>
                                `
                                : ''
                            }

                          </div>

                        </div>

                      </td>


                      <td>
                        <span class="quantityBadge">
                          ${i.quantity_expected}
                        </span>
                      </td>


                      <td>

                        <select
                          class="cond"
                          ${locked ? 'disabled' : ''}
                        >

                          <option value="">
                            Select condition
                          </option>

                          ${[
                            'good',
                            'fair',
                            'damaged',
                            'missing'
                          ].map(x => `
                            <option
                              value="${x}"
                              ${
                                i.condition_rating === x
                                  ? 'selected'
                                  : ''
                              }
                            >
                              ${
                                x.charAt(0).toUpperCase() +
                                x.slice(1)
                              }
                            </option>
                          `).join('')}

                        </select>

                      </td>


                      <td>

                        <input
                          class="comment"
                          placeholder="Optional comment"
                          value="${esc(i.student_comment || '')}"
                          ${locked ? 'disabled' : ''}
                        >

                      </td>

                    </tr>
                  `).join('')}

                </tbody>

              </table>

            </div>

          </div>


          ${
            locked
              ? `
                <div class="submittedNotice">

                  <div class="submittedIcon">
                    ✓
                  </div>

                  <div>

                    <strong>
                      Inventory successfully submitted
                    </strong>

                    <p>
                      This inventory check has been digitally
                      signed and can no longer be edited.
                    </p>

                  </div>

                </div>
              `
              : `
                <div class="signatureCard">

                  <div class="signatureHeader">

                    <div class="signatureIcon">
                      ✎
                    </div>

                    <div>

                      <h2>Electronic Signature</h2>

                      <p>
                        Confirm that the inventory information
                        above accurately reflects your room.
                      </p>

                    </div>

                  </div>


                  <div class="field">

                    <label>
                      Type your full name to sign
                    </label>

                    <input
                      id="signature"
                      autocomplete="off"
                      placeholder="${esc(App.user.fullName)}"
                    >

                  </div>


                  <div class="signatureAgreement">

                    By signing, you confirm that this inventory
                    accurately reflects the condition of your
                    allocated room.

                    Damaged or missing items will automatically
                    create maintenance reports for residence staff.
                  </div>


                  <button class="btn submitInventory">
                    Sign & Submit Inventory
                  </button>

                </div>
              `
          }

        </form>

      </div>
    `;


    if (!locked) {
      document.getElementById('inv').onsubmit = async e => {
        e.preventDefault();

        const items = [
          ...document.querySelectorAll('tbody tr')
        ].map(r => ({
          checkItemId: r.dataset.id,
          condition: r.querySelector('.cond').value,
          comment: r.querySelector('.comment').value
        }));


        const signatureInput =
          document.getElementById('signature');


        try {

          await API(
            '/api/student/inventory/sign',
            {
              method: 'POST',

              body: JSON.stringify({
                signature: signatureInput.value,
                items
              })
            }
          );

          this.inventory();

        } catch (err) {
          alert(err.message);
        }
      };
    }
  },


  /* =========================================================
     MAINTENANCE
  ========================================================= */

  async maintenance() {

    const [rows, cats] = await Promise.all([
      API('/api/student/maintenance?sort=newest'),
      API('/api/student/categories')
    ]);


    const openCount = rows.filter(
      r =>
        r.status !== 'resolved' &&
        r.status !== 'closed'
    ).length;


    const resolvedCount = rows.filter(
      r =>
        r.status === 'resolved' ||
        r.status === 'closed'
    ).length;


    App.view.innerHTML = `
      <div class="pageShell">

        <section class="pageHeader">

          <div>

            <span class="pageEyebrow">
              RESIDENCE SERVICES
            </span>

            <h1>Maintenance</h1>

            <p>
              Report residence faults and follow their
              progress from submission to resolution.
            </p>

          </div>

          <button
            class="btn"
            id="scrollFault"
          >
            + Report New Fault
          </button>

        </section>


        <div class="maintenanceStats">

          <div class="miniStat">

            <span>
              TOTAL REPORTS
            </span>

            <strong>
              ${rows.length}
            </strong>

          </div>


          <div class="miniStat">

            <span>
              OPEN
            </span>

            <strong>
              ${openCount}
            </strong>

          </div>


          <div class="miniStat">

            <span>
              RESOLVED
            </span>

            <strong>
              ${resolvedCount}
            </strong>

          </div>

        </div>


        <section
          class="faultFormCard"
          id="newFault"
        >

          <div class="cardHeading">

            <div>

              <span class="sectionEyebrow">
                NEW REQUEST
              </span>

              <h2>Report a Maintenance Fault</h2>

              <p>
                Give residence staff enough information to
                identify and resolve the problem.
              </p>

            </div>

          </div>


          <form id="fault">

            <div class="formGrid">

              <div class="field">

                <label>
                  Maintenance Category
                </label>

                <select id="cat">

                  ${cats.map(c => `
                    <option value="${c.category_id}">
                      ${esc(c.category_name)}
                    </option>
                  `).join('')}

                </select>

              </div>


              <div class="field">

                <label>
                  Priority
                </label>

                <select id="prio">
                  <option value="low">Low</option>
                  <option value="normal" selected>
                    Normal
                  </option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>

              </div>


              <div class="field">

                <label>
                  Fault Title
                </label>

                <input
                  id="title"
                  required
                  placeholder="e.g. Broken room light"
                >

              </div>

            </div>


            <div class="field">

              <label>
                Description
              </label>

              <textarea
                id="desc"
                required
                placeholder="Describe the problem in detail..."
              ></textarea>

            </div>


            <button class="btn">
              Submit Maintenance Report
            </button>

          </form>

        </section>


        <section class="maintenanceHistory">

          <div class="sectionHeading">

            <div>

              <span class="sectionEyebrow">
                TRACKING
              </span>

              <h2>Maintenance History</h2>

            </div>

          </div>


          ${
            rows.length
              ? `
                <div class="maintenanceList">

                  ${rows.map(r => `
                    <article class="maintenanceTicket">

                      <div class="ticketTop">

                        <div>

                          <span class="ticketReference">
                            ${esc(r.reference_code)}
                          </span>

                          <h3>
                            ${esc(r.title)}
                          </h3>

                        </div>

                        <span class="badge">
                          ${esc(r.status)}
                        </span>

                      </div>


                      <div class="ticketMeta">

                        <span>
                          ${esc(r.category_name)}
                        </span>

                        <span>
                          Priority:
                          <strong>
                            ${esc(r.priority)}
                          </strong>
                        </span>

                        <span>
                          ${esc(r.created_at)}
                        </span>

                      </div>

                    </article>
                  `).join('')}

                </div>
              `
              : `
                <div class="emptyState">

                  <div class="emptyIcon">
                    ✓
                  </div>

                  <h2>No Maintenance Reports</h2>

                  <p>
                    You haven't submitted any maintenance
                    faults yet.
                  </p>

                </div>
              `
          }

        </section>

      </div>
    `;


    const scrollButton =
      document.getElementById('scrollFault');


    if (scrollButton) {
      scrollButton.onclick = () => {
        document
          .getElementById('newFault')
          .scrollIntoView({
            behavior: 'smooth'
          });
      };
    }


    document.getElementById('fault').onsubmit =
      async e => {

        e.preventDefault();

        try {

          await API(
            '/api/student/maintenance',
            {
              method: 'POST',

              body: JSON.stringify({
                categoryId:
                  document.getElementById('cat').value,

                priority:
                  document.getElementById('prio').value,

                title:
                  document.getElementById('title').value,

                description:
                  document.getElementById('desc').value
              })
            }
          );

          this.maintenance();

        } catch (err) {
          alert(err.message);
        }
      };
  },


  /* =========================================================
     NOTIFICATIONS
  ========================================================= */

  async notifications() {

    const rows =
      await API('/api/student/notifications');


    App.view.innerHTML = `
      <div class="pageShell">

        <section class="pageHeader">

          <div>

            <span class="pageEyebrow">
              COMMUNICATION
            </span>

            <h1>Notifications</h1>

            <p>
              Stay updated with important residence
              announcements and system activity.
            </p>

          </div>


          ${
            rows.length
              ? `
                <button
                  class="btn"
                  id="read"
                >
                  Mark All as Read
                </button>
              `
              : ''
          }

        </section>


        <section class="notificationSection">

          ${
            rows.length
              ? `
                <div class="notificationList">

                  ${rows.map(n => `
                    <article
                      class="notificationCard
                      ${n.is_read ? 'read' : 'unread'}"
                    >

                      <div class="notificationIcon">
                        ${
                          n.is_read
                            ? '✓'
                            : '!'
                        }
                      </div>


                      <div class="notificationContent">

                        <div class="notificationHeading">

                          <h3>
                            ${esc(n.title)}
                          </h3>

                          ${
                            !n.is_read
                              ? `
                                <span class="newBadge">
                                  NEW
                                </span>
                              `
                              : ''
                          }

                        </div>

                        <p>
                          ${esc(n.message)}
                        </p>

                        <small>
                          ${esc(n.created_at)}
                        </small>

                      </div>

                    </article>
                  `).join('')}

                </div>
              `
              : `
                <div class="emptyState">

                  <div class="emptyIcon">
                    ♢
                  </div>

                  <h2>You're All Caught Up</h2>

                  <p>
                    There are no notifications to display.
                  </p>

                </div>
              `
          }

        </section>

      </div>
    `;


    const readButton =
      document.getElementById('read');


    if (readButton) {

      readButton.onclick = async () => {

        await API(
          '/api/student/notifications/read',
          {
            method: 'POST'
          }
        );

        this.notifications();
      };
    }
  }
};