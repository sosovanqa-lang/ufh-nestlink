window.App = {

  user: null,

  view: null,


  /* =========================================================
     APPLICATION BOOT
  ========================================================= */

  async boot() {

    try {

      const response =
        await API(
          '/api/auth/me'
        );

      this.start(
        response.user
      );

    } catch (error) {

      Auth.landingPage();

    }
  },


  /* =========================================================
     START AUTHENTICATED APPLICATION
  ========================================================= */

  start(user) {

    this.user = user;


    /* =======================================================
       ROLE ROUTING

       student
         -> Student Portal

       residence_staff
         -> Residence Staff Portal

       maintenance_staff
         -> Maintenance Department Portal
    ======================================================= */

    let mod;

    let portalName;


    if (
      user.role ===
      'residence_staff'
    ) {

      mod =
        Residence;

      portalName =
        'Residence Staff Portal';

    } else if (
      user.role ===
      'maintenance_staff'
    ) {

      mod =
        Maintenance;

      portalName =
        'Maintenance Department Portal';

    } else if (
      user.role ===
      'student'
    ) {

      mod =
        Student;

      portalName =
        'Student Residence Portal';

    } else {

      document
        .getElementById(
          'app'
        )
        .innerHTML = `

          <main class="container">

            <section class="hero">

              <h1>
                Access unavailable
              </h1>

              <p>
                Your account does not have
                a supported NestLink role.
              </p>

            </section>

          </main>

        `;

      return;

    }


    /* =======================================================
       DASHBOARD SHELL
    ======================================================= */

    document
      .getElementById(
        'app'
      )
      .innerHTML = `

        <header class="dashHeader">

          <div class="dashBrand">

            <div class="crestMini">
              UFH
            </div>


            <div>

              <b>
                UFH-<span>NestLink</span>
              </b>

              <small>
                ${esc(
                  portalName
                )}
              </small>

            </div>

          </div>


          <nav
            class="nav"
            id="nav"
          ></nav>


          <div class="dashUser">

            <div>

              <b>
                ${esc(
                  user.fullName
                )}
              </b>

              <small>

                ${esc(
                  user.role ===
                  'maintenance_staff'

                    ? 'Maintenance Department'

                    : (
                        user.residenceName ||
                        user.email
                      )
                )}

              </small>

            </div>


            <button
              class="btn btnGold"
              id="logout"
            >
              Sign out
            </button>

          </div>

        </header>


        <main
          class="container"
          id="view"
        ></main>

      `;


    this.view =
      document.getElementById(
        'view'
      );


    /* =======================================================
       NAVIGATION
    ======================================================= */

    const nav =
      document.getElementById(
        'nav'
      );


    mod.nav.forEach(
      (
        [id, label],
        index
      ) => {

        const button =
          document.createElement(
            'button'
          );


        button.textContent =
          label;


        button.onclick =
          () => {

            [
              ...nav.children
            ].forEach(
              item =>
                item.classList.remove(
                  'active'
                )
            );


            button
              .classList
              .add(
                'active'
              );


            mod.render(
              id
            );

          };


        if (index === 0) {

          button
            .classList
            .add(
              'active'
            );

        }


        nav.appendChild(
          button
        );

      }
    );


    /* =======================================================
       LOGOUT
    ======================================================= */

    document
      .getElementById(
        'logout'
      )
      .onclick =
        async () => {

          try {

            await API(
              '/api/auth/logout',
              {
                method:
                  'POST'
              }
            );

          } finally {

            location.reload();

          }

        };


    /* =======================================================
       LOAD DEFAULT DASHBOARD
    ======================================================= */

    mod.render(
      'dashboard'
    );

  }

};


/* =========================================================
   START NESTLINK
========================================================= */

App.boot();