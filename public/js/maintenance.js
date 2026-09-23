const Maintenance = {
  nav: [
    ['dashboard', 'Overview'],
    ['jobs', 'Maintenance Jobs'],
    ['visits', 'Scheduled Visits']
  ],

  async render(view) {
    const root = document.getElementById('view');

    if (!root) return;

    root.innerHTML = `
      <div class="card">
        <p>Loading Maintenance Department...</p>
      </div>
    `;

    try {
      if (view === 'dashboard') {
        await this.dashboard(root);
      } else if (view === 'jobs') {
        await this.jobs(root);
      } else if (view === 'visits') {
        await this.visits(root);
      } else {
        await this.dashboard(root);
      }
    } catch (error) {
      this.showError(root, error);
    }
  },

  showError(root, error) {
    root.innerHTML = `
      <div class="card">
        <h2>Unable to load page</h2>
        <p>${this.escape(error?.message || 'Something went wrong.')}</p>
      </div>
    `;
  },

  escape(value) {
    return String(value ?? '')
      .replaceAll('&', '&amp;')
      .replaceAll('<', '&lt;')
      .replaceAll('>', '&gt;')
      .replaceAll('"', '&quot;')
      .replaceAll("'", '&#039;');
  },

  status(value) {
    const text = String(value || 'unknown')
      .replaceAll('_', ' ');

    return `
      <span class="badge">
        ${this.escape(text)}
      </span>
    `;
  },

  formatDate(value) {
    if (!value) return '—';

    const date = new Date(`${value}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return this.escape(value);
    }

    return date.toLocaleDateString('en-ZA', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  },

  async dashboard(root) {
    const data = await API('/api/maintenance/dashboard');

    const counts = data.counts || {};

    root.innerHTML = `
      <section class="page-head">
        <div>
          <p class="eyebrow">UFH NestLink</p>
          <h1>Maintenance Department</h1>
          <p>
            Manage forwarded residence faults, scheduled visits
            and maintenance work.
          </p>
        </div>
      </section>

      <section class="stats">
        <div class="stat">
          <span>Waiting</span>
          <strong>${Number(counts.waiting || 0)}</strong>
          <small>Forwarded faults</small>
        </div>

        <div class="stat">
          <span>Accepted</span>
          <strong>${Number(counts.accepted || 0)}</strong>
          <small>Accepted jobs</small>
        </div>

        <div class="stat">
          <span>Scheduled</span>
          <strong>${Number(counts.scheduled || 0)}</strong>
          <small>Upcoming work</small>
        </div>

        <div class="stat">
          <span>In Progress</span>
          <strong>${Number(counts.in_progress || 0)}</strong>
          <small>Active jobs</small>
        </div>

        <div class="stat">
          <span>Completed</span>
          <strong>${Number(counts.completed || 0)}</strong>
          <small>Completed jobs</small>
        </div>

        <div class="stat">
          <span>Today's Visits</span>
          <strong>${Number(data.todayVisits || 0)}</strong>
          <small>Visits scheduled today</small>
        </div>
      </section>

      <section class="card">
        <div class="section-head">
          <div>
            <h2>Maintenance Workflow</h2>
            <p>
              Faults forwarded by Residence Staff will appear
              in your maintenance queue.
            </p>
          </div>

          <button
            class="btn primary"
            onclick="App.go('jobs')"
          >
            View Maintenance Jobs
          </button>
        </div>

        <div class="quick-grid">
          <div class="quick-card">
            <strong>1. Receive</strong>
            <p>
              Review faults forwarded by Residence Staff.
            </p>
          </div>

          <div class="quick-card">
            <strong>2. Accept</strong>
            <p>
              Accept responsibility for the maintenance job.
            </p>
          </div>

          <div class="quick-card">
            <strong>3. Schedule</strong>
            <p>
              Arrange a date and time to visit the student's room.
            </p>
          </div>

          <div class="quick-card">
            <strong>4. Complete</strong>
            <p>
              Start the work and record the final resolution.
            </p>
          </div>
        </div>
      </section>
    `;
  },

  async jobs(root) {
    const jobs = await API('/api/maintenance/jobs');

    root.innerHTML = `
      <section class="page-head">
        <div>
          <p class="eyebrow">Maintenance Department</p>
          <h1>Maintenance Jobs</h1>
          <p>
            Review and manage faults forwarded from UFH residences.
          </p>
        </div>
      </section>

      <section class="card">
        ${
          !jobs.length
            ? `
              <div class="empty-state">
                <h3>No maintenance jobs</h3>
                <p>
                  Forwarded residence faults will appear here.
                </p>
              </div>
            `
            : `
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Reference</th>
                      <th>Fault</th>
                      <th>Residence</th>
                      <th>Room</th>
                      <th>Priority</th>
                      <th>Status</th>
                      <th>Visit</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    ${jobs.map(job => `
                      <tr>
                        <td>
                          <strong>
                            ${this.escape(job.reference_code)}
                          </strong>
                        </td>

                        <td>
                          <strong>
                            ${this.escape(job.title)}
                          </strong>

                          <div class="muted">
                            ${this.escape(job.category_name)}
                          </div>
                        </td>

                        <td>
                          ${this.escape(job.res_name)}
                        </td>

                        <td>
                          ${this.escape(job.room_number)}
                        </td>

                        <td>
                          ${this.escape(job.priority)}
                        </td>

                        <td>
                          ${this.status(job.assignment_status)}
                        </td>

                        <td>
                          ${
                            job.scheduled_date
                              ? `
                                ${this.formatDate(job.scheduled_date)}
                                <div class="muted">
                                  ${this.escape(job.scheduled_time)}
                                </div>
                              `
                              : '—'
                          }
                        </td>

                        <td>
                          <button
                            class="btn"
                            onclick="Maintenance.openJob(${Number(job.assignment_id)})"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `
        }
      </section>
    `;
  },

  async openJob(assignmentId) {
    const root = document.getElementById('view');

    if (!root) return;

    root.innerHTML = `
      <div class="card">
        <p>Loading maintenance job...</p>
      </div>
    `;

    try {
      const data = await API(
        `/api/maintenance/jobs/${assignmentId}`
      );

      const job = data.job;
      const visits = data.visits || [];
      const history = data.history || [];

      root.innerHTML = `
        <section class="page-head">
          <div>
            <p class="eyebrow">
              ${this.escape(job.reference_code)}
            </p>

            <h1>
              ${this.escape(job.title)}
            </h1>

            <p>
              ${this.escape(job.category_name)}
            </p>
          </div>

          <button
            class="btn"
            onclick="App.go('jobs')"
          >
            Back to Jobs
          </button>
        </section>

        <div class="content-grid">
          <section class="card">
            <div class="section-head">
              <div>
                <h2>Fault Details</h2>
                <p>
                  Information submitted for this maintenance job.
                </p>
              </div>

              ${this.status(job.assignment_status)}
            </div>

            <div class="detail-grid">
              <div>
                <span>Residence</span>
                <strong>${this.escape(job.res_name)}</strong>
              </div>

              <div>
                <span>Room</span>
                <strong>${this.escape(job.room_number)}</strong>
              </div>

              <div>
                <span>Student</span>
                <strong>${this.escape(job.student_name)}</strong>
              </div>

              <div>
                <span>Student Email</span>
                <strong>${this.escape(job.student_email)}</strong>
              </div>

              <div>
                <span>Priority</span>
                <strong>${this.escape(job.priority)}</strong>
              </div>

              <div>
                <span>Report Status</span>
                <strong>
                  ${this.escape(job.report_status)}
                </strong>
              </div>
            </div>

            <div class="detail-block">
              <span>Description</span>
              <p>${this.escape(job.description)}</p>
            </div>

            ${
              job.forwarding_note
                ? `
                  <div class="detail-block">
                    <span>Residence Staff Note</span>
                    <p>
                      ${this.escape(job.forwarding_note)}
                    </p>
                  </div>
                `
                : ''
            }

            ${
              job.resolution_note
                ? `
                  <div class="detail-block">
                    <span>Resolution</span>
                    <p>
                      ${this.escape(job.resolution_note)}
                    </p>
                  </div>
                `
                : ''
            }

            ${this.jobActions(job)}
          </section>

          <section class="card">
            <h2>Visit History</h2>

            ${
              !visits.length
                ? `
                  <p class="muted">
                    No maintenance visits have been scheduled yet.
                  </p>
                `
                : visits.map(visit => `
                    <div class="timeline-item">
                      <strong>
                        ${this.formatDate(visit.scheduled_date)}
                        at
                        ${this.escape(visit.scheduled_time)}
                      </strong>

                      <p>
                        ${this.escape(
                          visit.visit_note ||
                          'Maintenance room visit'
                        )}
                      </p>

                      <small>
                        ${this.escape(visit.status)}
                      </small>
                    </div>
                  `).join('')
            }
          </section>
        </div>

        <section class="card">
          <h2>Status History</h2>

          ${
            !history.length
              ? `
                <p class="muted">
                  No status history is available.
                </p>
              `
              : `
                <div class="timeline">
                  ${history.map(item => `
                    <div class="timeline-item">
                      <strong>
                        ${this.escape(item.new_status)}
                      </strong>

                      <p>
                        ${this.escape(
                          item.note ||
                          'Status updated.'
                        )}
                      </p>

                      <small>
                        ${
                          item.changed_by_name
                            ? this.escape(item.changed_by_name)
                            : 'System'
                        }
                        ·
                        ${this.escape(item.created_at)}
                      </small>
                    </div>
                  `).join('')}
                </div>
              `
          }
        </section>
      `;
    } catch (error) {
      this.showError(root, error);
    }
  },

  jobActions(job) {
    const id = Number(job.assignment_id);

    if (job.assignment_status === 'forwarded') {
      return `
        <div class="action-box">
          <h3>Accept Maintenance Job</h3>

          <label>
            Acceptance note
            <textarea
              id="acceptNote"
              rows="3"
              placeholder="Optional note..."
            ></textarea>
          </label>

          <button
            class="btn primary"
            onclick="Maintenance.acceptJob(${id})"
          >
            Accept Job
          </button>
        </div>
      `;
    }

    if (
      job.assignment_status === 'accepted' ||
      job.assignment_status === 'scheduled'
    ) {
      return `
        <div class="action-box">
          <h3>
            ${
              job.assignment_status === 'scheduled'
                ? 'Reschedule Room Visit'
                : 'Schedule Room Visit'
            }
          </h3>

          <div class="form-grid">
            <label>
              Visit date
              <input
                id="visitDate"
                type="date"
              >
            </label>

            <label>
              Visit time
              <input
                id="visitTime"
                type="time"
              >
            </label>

            <label>
              Estimated minutes
              <input
                id="visitMinutes"
                type="number"
                min="15"
                max="480"
                value="60"
              >
            </label>
          </div>

          <label>
            Visit note
            <textarea
              id="visitNote"
              rows="3"
              placeholder="Optional visit note..."
            ></textarea>
          </label>

          <div class="actions">
            <button
              class="btn primary"
              onclick="Maintenance.scheduleJob(${id})"
            >
              ${
                job.assignment_status === 'scheduled'
                  ? 'Update Visit'
                  : 'Schedule Visit'
              }
            </button>

            ${
              job.assignment_status === 'scheduled'
                ? `
                  <button
                    class="btn"
                    onclick="Maintenance.startJob(${id})"
                  >
                    Start Work
                  </button>
                `
                : ''
            }
          </div>
        </div>
      `;
    }

    if (job.assignment_status === 'in_progress') {
      return `
        <div class="action-box">
          <h3>Complete Maintenance Job</h3>

          <label>
            Resolution
            <textarea
              id="resolution"
              rows="4"
              placeholder="Describe the work completed..."
            ></textarea>
          </label>

          <button
            class="btn primary"
            onclick="Maintenance.completeJob(${id})"
          >
            Mark as Completed
          </button>
        </div>
      `;
    }

    if (job.assignment_status === 'completed') {
      return `
        <div class="action-box">
          <strong>Maintenance completed</strong>
          <p>
            This maintenance job has been completed.
          </p>
        </div>
      `;
    }

    return '';
  },

  async acceptJob(assignmentId) {
    const note =
      document.getElementById('acceptNote')?.value.trim() || '';

    try {
      await API(
        `/api/maintenance/jobs/${assignmentId}/accept`,
        {
          method: 'POST',
          body: JSON.stringify({ note })
        }
      );

      await this.openJob(assignmentId);
    } catch (error) {
      alert(error.message || 'Unable to accept maintenance job.');
    }
  },

  async scheduleJob(assignmentId) {
    const date =
      document.getElementById('visitDate')?.value || '';

    const time =
      document.getElementById('visitTime')?.value || '';

    const estimatedMinutes = Number(
      document.getElementById('visitMinutes')?.value || 60
    );

    const note =
      document.getElementById('visitNote')?.value.trim() || '';

    if (!date || !time) {
      alert('Please select a visit date and time.');
      return;
    }

    try {
      await API(
        `/api/maintenance/jobs/${assignmentId}/schedule`,
        {
          method: 'POST',
          body: JSON.stringify({
            date,
            time,
            estimatedMinutes,
            note
          })
        }
      );

      await this.openJob(assignmentId);
    } catch (error) {
      alert(error.message || 'Unable to schedule maintenance visit.');
    }
  },

  async startJob(assignmentId) {
    const confirmed = confirm(
      'Start work on this maintenance job?'
    );

    if (!confirmed) return;

    try {
      await API(
        `/api/maintenance/jobs/${assignmentId}/start`,
        {
          method: 'POST',
          body: JSON.stringify({})
        }
      );

      await this.openJob(assignmentId);
    } catch (error) {
      alert(error.message || 'Unable to start maintenance work.');
    }
  },

  async completeJob(assignmentId) {
    const resolution =
      document.getElementById('resolution')?.value.trim() || '';

    if (!resolution) {
      alert('Please enter a resolution note.');
      return;
    }

    const confirmed = confirm(
      'Mark this maintenance job as completed?'
    );

    if (!confirmed) return;

    try {
      await API(
        `/api/maintenance/jobs/${assignmentId}/complete`,
        {
          method: 'POST',
          body: JSON.stringify({ resolution })
        }
      );

      await this.openJob(assignmentId);
    } catch (error) {
      alert(error.message || 'Unable to complete maintenance job.');
    }
  },

  async visits(root) {
    const visits = await API('/api/maintenance/visits');

    root.innerHTML = `
      <section class="page-head">
        <div>
          <p class="eyebrow">Maintenance Department</p>
          <h1>Scheduled Visits</h1>
          <p>
            Upcoming maintenance visits across UFH residences.
          </p>
        </div>
      </section>

      <section class="card">
        ${
          !visits.length
            ? `
              <div class="empty-state">
                <h3>No scheduled visits</h3>
                <p>
                  Scheduled maintenance visits will appear here.
                </p>
              </div>
            `
            : `
              <div class="table-wrap">
                <table>
                  <thead>
                    <tr>
                      <th>Date</th>
                      <th>Time</th>
                      <th>Reference</th>
                      <th>Residence</th>
                      <th>Room</th>
                      <th>Student</th>
                      <th>Status</th>
                      <th></th>
                    </tr>
                  </thead>

                  <tbody>
                    ${visits.map(visit => `
                      <tr>
                        <td>
                          ${this.formatDate(visit.scheduled_date)}
                        </td>

                        <td>
                          ${this.escape(visit.scheduled_time)}
                        </td>

                        <td>
                          <strong>
                            ${this.escape(visit.reference_code)}
                          </strong>
                        </td>

                        <td>
                          ${this.escape(visit.res_name)}
                        </td>

                        <td>
                          ${this.escape(visit.room_number)}
                        </td>

                        <td>
                          ${this.escape(visit.student_name)}
                        </td>

                        <td>
                          ${this.status(visit.status)}
                        </td>

                        <td>
                          <button
                            class="btn"
                            onclick="Maintenance.openJob(${Number(visit.assignment_id)})"
                          >
                            View Job
                          </button>
                        </td>
                      </tr>
                    `).join('')}
                  </tbody>
                </table>
              </div>
            `
        }
      </section>
    `;
  }
};