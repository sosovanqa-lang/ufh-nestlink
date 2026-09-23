window.Auth = {

  async landingPage() {

    const rs = await API('/api/auth/residences');

    document.getElementById('app').innerHTML = `

      <div class="publicSite">

        <!-- =====================================================
             HEADER
        ====================================================== -->

        <header class="nestHeader">

          <div class="nestBrand">

            <div class="nestCrest">
              UFH
            </div>

            <div class="nestBrandText">

              <strong>
                UFH-<span>NestLink</span>
              </strong>

              <small>
                Student Residence Management System
              </small>

            </div>

          </div>


          <nav class="nestNav">

            <a href="#home">
              Home
            </a>

            <a href="#services">
              Services
            </a>

            <a href="#roles">
              Portals
            </a>

            <button
              class="headerLogin"
              id="topLogin"
              type="button"
            >
              Sign in
            </button>

          </nav>

        </header>


        <!-- =====================================================
             HERO
        ====================================================== -->

        <main>

          <section
            class="nestHero"
            id="home"
          >

            <div class="heroContent">

              <div class="heroEyebrow">
                UNIVERSITY OF FORT HARE
              </div>


              <h1>
                Residence management,
                <span>made simpler.</span>
              </h1>


              <p class="heroLead">
                One secure platform for UFH students,
                Residence Staff and Maintenance Staff to
                manage residence services efficiently.
              </p>


              <div class="heroActions">

                <button
                  class="heroPrimary"
                  id="getStarted"
                  type="button"
                >
                  Sign in to NestLink
                </button>


                <button
                  class="heroSecondary"
                  id="createAccount"
                  type="button"
                >
                  Create student account
                </button>

              </div>


              <div class="heroTrust">

                <span>
                  UFH accounts
                </span>

                <i></i>

                <span>
                  Residence services
                </span>

                <i></i>

                <span>
                  Maintenance tracking
                </span>

              </div>

            </div>


            <!-- =================================================
                 HERO SERVICE PANEL
            ================================================== -->

            <div class="heroPanel">

              <div class="heroPanelHeader">

                <div>

                  <small>
                    NESTLINK
                  </small>

                  <h2>
                    Residence Services
                  </h2>

                </div>


                <span class="systemStatus">
                  Active
                </span>

              </div>


              <div class="heroService">

                <div class="serviceNumber">
                  01
                </div>

                <div>

                  <strong>
                    Room Management
                  </strong>

                  <p>
                    View room details and manage
                    student allocations.
                  </p>

                </div>

              </div>


              <div class="heroService">

                <div class="serviceNumber">
                  02
                </div>

                <div>

                  <strong>
                    Inventory Checks
                  </strong>

                  <p>
                    Record, submit and review
                    residence room inventory.
                  </p>

                </div>

              </div>


              <div class="heroService">

                <div class="serviceNumber">
                  03
                </div>

                <div>

                  <strong>
                    Maintenance
                  </strong>

                  <p>
                    Report faults and follow
                    maintenance progress.
                  </p>

                </div>

              </div>


              <div class="heroService">

                <div class="serviceNumber">
                  04
                </div>

                <div>

                  <strong>
                    Notifications
                  </strong>

                  <p>
                    Keep students and staff informed
                    throughout the process.
                  </p>

                </div>

              </div>

            </div>

          </section>


          <!-- =====================================================
               SERVICES
          ====================================================== -->

          <section
            class="nestServices"
            id="services"
          >

            <div class="landingSectionHeading">

              <span>
                WHAT NESTLINK DOES
              </span>

              <h2>
                Residence services in one place
              </h2>

              <p>
                NestLink connects students and residence teams
                through the everyday services required to manage
                student accommodation.
              </p>

            </div>


            <div class="serviceGrid">


              <article class="serviceCard">

                <div class="serviceCardTop">
                  <span>01</span>
                </div>

                <h3>
                  Room Information
                </h3>

                <p>
                  Students can access their residence and room
                  information while staff manage room allocations.
                </p>

                <button
                  class="serviceLink loginTrigger"
                  type="button"
                >
                  Access portal →
                </button>

              </article>


              <article class="serviceCard">

                <div class="serviceCardTop">
                  <span>02</span>
                </div>

                <h3>
                  Inventory Management
                </h3>

                <p>
                  Complete room inventory checks and allow
                  Residence Staff to review submitted records.
                </p>

                <button
                  class="serviceLink loginTrigger"
                  type="button"
                >
                  Open inventory →
                </button>

              </article>


              <article class="serviceCard">

                <div class="serviceCardTop">
                  <span>03</span>
                </div>

                <h3>
                  Maintenance Tracking
                </h3>

                <p>
                  Report residence faults and track them from
                  submission through maintenance completion.
                </p>

                <button
                  class="serviceLink loginTrigger"
                  type="button"
                >
                  View maintenance →
                </button>

              </article>


              <article class="serviceCard">

                <div class="serviceCardTop">
                  <span>04</span>
                </div>

                <h3>
                  Residence Updates
                </h3>

                <p>
                  Receive system notifications as residence and
                  maintenance requests move through the workflow.
                </p>

                <button
                  class="serviceLink loginTrigger"
                  type="button"
                >
                  View updates →
                </button>

              </article>

            </div>

          </section>


          <!-- =====================================================
               PORTALS
          ====================================================== -->

          <section
            class="portalSection"
            id="roles"
          >

            <div class="landingSectionHeading light">

              <span>
                NESTLINK PORTALS
              </span>

              <h2>
                Built around each residence role
              </h2>

              <p>
                Each account receives the tools relevant
                to its responsibilities.
              </p>

            </div>


            <div class="portalGrid">


              <article class="portalCard">

                <div class="portalRole">
                  STUDENT
                </div>

                <h3>
                  Student Portal
                </h3>

                <p>
                  Manage your residence information and
                  communicate residence issues.
                </p>

                <ul>
                  <li>View room details</li>
                  <li>Complete inventory checks</li>
                  <li>Report maintenance faults</li>
                  <li>Track maintenance progress</li>
                  <li>View notifications</li>
                </ul>

                <button
                  class="portalButton loginTrigger"
                  type="button"
                >
                  Student sign in
                </button>

              </article>


              <article class="portalCard featured">

                <div class="portalRole">
                  RESIDENCE STAFF
                </div>

                <h3>
                  Residence Staff Portal
                </h3>

                <p>
                  Manage residence operations and coordinate
                  student accommodation services.
                </p>

                <ul>
                  <li>Manage room allocations</li>
                  <li>Review inventory checks</li>
                  <li>Review reported faults</li>
                  <li>Forward maintenance requests</li>
                  <li>Manage staff accounts</li>
                </ul>

                <button
                  class="portalButton loginTrigger"
                  type="button"
                >
                  Staff sign in
                </button>

              </article>


              <article class="portalCard">

                <div class="portalRole">
                  MAINTENANCE
                </div>

                <h3>
                  Maintenance Portal
                </h3>

                <p>
                  Manage maintenance jobs forwarded by
                  residence teams.
                </p>

                <ul>
                  <li>Receive forwarded jobs</li>
                  <li>Accept maintenance work</li>
                  <li>Schedule room visits</li>
                  <li>Update work progress</li>
                  <li>Complete maintenance jobs</li>
                </ul>

                <button
                  class="portalButton loginTrigger"
                  type="button"
                >
                  Maintenance sign in
                </button>

              </article>

            </div>

          </section>


          <!-- =====================================================
               CONNECTED RESIDENCES
          ====================================================== -->

          <section class="connectedResidences">

            <div class="connectedIntro">

              <span class="residenceEyebrow">
                CONNECTED RESIDENCES
              </span>

              <h2>
                UFH residences on NestLink
              </h2>

              <p>
                Residence information is loaded directly
                from the NestLink system.
              </p>

            </div>


            <div class="residenceList">

              ${
                rs.map((r, i) => `

                  <div class="residenceItem">

                    <span>
                      ${String(i + 1).padStart(2, '0')}
                    </span>

                    <strong>
                      ${esc(r.res_name)}
                    </strong>

                  </div>

                `).join('')
              }

            </div>

          </section>

        </main>


        <!-- =====================================================
             FOOTER
        ====================================================== -->

        <footer class="nestFooter">

          <div class="footerBrand">

            <div class="footerCrest">
              UFH
            </div>

            <div>

              <strong>
                UFH-<span>NestLink</span>
              </strong>

              <small>
                Student Residence Management System
              </small>

            </div>

          </div>


          <div class="footerText">
            University of Fort Hare
          </div>

        </footer>


        <!-- =====================================================
             AUTH MODAL
        ====================================================== -->

        <div
          class="modalBackdrop"
          id="authModal"
          hidden
        >

          <section class="authModal">

            <button
              class="modalClose"
              id="closeAuth"
              type="button"
              aria-label="Close"
            >
              ×
            </button>


            <div class="modalBrand">

              <div class="modalCrest">
                UFH
              </div>

              <div class="modalSystemName">
                UFH-<span>NestLink</span>
              </div>

              <h2 id="authTitle">
                Sign in
              </h2>

              <p id="authDescription">
                Access your UFH NestLink account.
              </p>

            </div>


            <div id="msg"></div>


            <!-- =================================================
                 LOGIN FORM
            ================================================== -->

            <form id="login">

              <div class="field">

                <label for="email">
                  UFH email
                </label>

                <input
                  id="email"
                  type="email"
                  required
                  autocomplete="email"
                  placeholder="student@ufh.ac.za"
                >

              </div>


              <div class="field">

                <label for="password">
                  Password
                </label>

                <input
                  id="password"
                  type="password"
                  required
                  autocomplete="current-password"
                  placeholder="Enter your password"
                >

              </div>


              <button
                class="authSubmit"
                type="submit"
              >
                Sign in
              </button>

            </form>


            <!-- LOGIN-ONLY SWITCH -->

            <p
              class="switchAuth"
              id="loginSwitch"
            >

              New to NestLink?

              <button
                type="button"
                class="linkBtn"
                id="showReg"
              >
                Create student account
              </button>

            </p>


            <!-- =================================================
                 REGISTRATION FORM
            ================================================== -->

            <form
              id="register"
              hidden
            >

              <div class="field">

                <label for="fullName">
                  Full name
                </label>

                <input
                  id="fullName"
                  required
                  autocomplete="name"
                  placeholder="Enter your full name"
                >

              </div>


              <div class="field">

                <label for="regEmail">
                  UFH email
                </label>

                <input
                  id="regEmail"
                  type="email"
                  required
                  autocomplete="email"
                  placeholder="student@ufh.ac.za"
                >

              </div>


              <div class="field">

                <label for="regPassword">
                  Password
                </label>

                <input
                  id="regPassword"
                  type="password"
                  minlength="8"
                  required
                  autocomplete="new-password"
                  placeholder="Minimum 8 characters"
                >

              </div>


              <div
                class="field"
                id="staffRes"
                hidden
              >

                <label for="residenceId">
                  Assigned residence
                </label>

                <select id="residenceId">

                  ${
                    rs.map(r => `

                      <option value="${r.residence_id}">
                        ${esc(r.res_name)}
                      </option>

                    `).join('')
                  }

                </select>


                <span class="hint">
                  Residence assignment applies only to the
                  designated Residence Staff account.
                </span>

              </div>


              <button
                class="authSubmit gold"
                type="submit"
              >
                Create account
              </button>


              <p
                class="switchAuth"
                id="registerSwitch"
              >

                Already registered?

                <button
                  type="button"
                  class="linkBtn"
                  id="showLogin"
                >
                  Back to sign in
                </button>

              </p>

            </form>

          </section>

        </div>

      </div>

    `;


    /* =========================================================
       ELEMENT REFERENCES
    ========================================================= */

    const modal =
      document.getElementById('authModal');

    const msg =
      document.getElementById('msg');

    const login =
      document.getElementById('login');

    const reg =
      document.getElementById('register');

    const loginSwitch =
      document.getElementById('loginSwitch');

    const authTitle =
      document.getElementById('authTitle');

    const authDescription =
      document.getElementById('authDescription');


    /* =========================================================
       AUTH VIEW HELPERS
    ========================================================= */

    const showLogin = () => {

      reg.hidden = true;
      login.hidden = false;

      loginSwitch.hidden = false;

      msg.innerHTML = '';

      authTitle.textContent =
        'Sign in';

      authDescription.textContent =
        'Access your UFH NestLink account.';

    };


    const showRegister = () => {

      login.hidden = true;
      reg.hidden = false;

      loginSwitch.hidden = true;

      msg.innerHTML = '';

      authTitle.textContent =
        'Create student account';

      authDescription.textContent =
        'Register using your University of Fort Hare email address.';

    };


    const openLogin = () => {

      showLogin();

      modal.hidden = false;

    };


    const openRegister = () => {

      showRegister();

      modal.hidden = false;

    };


    /* =========================================================
       OPEN AUTH MODAL
    ========================================================= */

    document.getElementById('topLogin').onclick =
      openLogin;


    document.getElementById('getStarted').onclick =
      openLogin;


    document.getElementById('createAccount').onclick =
      openRegister;


    document
      .querySelectorAll('.loginTrigger')
      .forEach(button => {

        button.onclick =
          openLogin;

      });


    /* =========================================================
       CLOSE AUTH MODAL
    ========================================================= */

    document.getElementById('closeAuth').onclick =
      () => {

        modal.hidden = true;

      };


    modal.onclick =
      event => {

        if (event.target === modal) {

          modal.hidden = true;

        }

      };


    /* =========================================================
       SWITCH LOGIN / REGISTER
    ========================================================= */

    document.getElementById('showReg').onclick =
      showRegister;


    document.getElementById('showLogin').onclick =
      showLogin;


    /* =========================================================
       RESIDENCE STAFF BOOTSTRAP

       Public registration remains student-only except for
       the designated Residence Staff bootstrap account.
    ========================================================= */

    document.getElementById('regEmail').oninput =
      event => {

        const email =
          event.target.value
            .trim()
            .toLowerCase();


        document.getElementById('staffRes').hidden =
          email !== '202249895@ufh.ac.za';

      };


    /* =========================================================
       LOGIN
    ========================================================= */

    login.onsubmit =
      async event => {

        event.preventDefault();

        msg.innerHTML = '';


        try {

          const result =
            await API(
              '/api/auth/login',
              {

                method: 'POST',

                body: JSON.stringify({

                  email:
                    document
                      .getElementById('email')
                      .value,

                  password:
                    document
                      .getElementById('password')
                      .value

                })

              }
            );


          App.start(result.user);


        } catch (error) {

          msg.innerHTML = `

            <div class="error">
              ${esc(error.message)}
            </div>

          `;

        }

      };


    /* =========================================================
       REGISTRATION
    ========================================================= */

    reg.onsubmit =
      async event => {

        event.preventDefault();

        msg.innerHTML = '';


        try {

          await API(
            '/api/auth/register',
            {

              method: 'POST',

              body: JSON.stringify({

                fullName:
                  document
                    .getElementById('fullName')
                    .value,

                email:
                  document
                    .getElementById('regEmail')
                    .value,

                password:
                  document
                    .getElementById('regPassword')
                    .value,

                residenceId:
                  document
                    .getElementById('residenceId')
                    .value

              })

            }
          );


          reg.reset();

          document.getElementById('staffRes').hidden =
            true;


          reg.hidden =
            true;

          login.hidden =
            false;

          loginSwitch.hidden =
            false;


          authTitle.textContent =
            'Sign in';


          authDescription.textContent =
            'Access your UFH NestLink account.';


          msg.innerHTML = `

            <div class="successBox">
              Account created successfully.
              You can sign in now.
            </div>

          `;


        } catch (error) {

          msg.innerHTML = `

            <div class="error">
              ${esc(error.message)}
            </div>

          `;

        }

      };

  }

};