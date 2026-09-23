injectStyles({

  /* =========================================================
     PUBLIC SITE
  ========================================================= */

  '.publicSite': {
    minHeight: '100vh',
    background: '#F6F8FB',
    color: '#172033'
  },


  /* =========================================================
     HEADER
  ========================================================= */

  '.nestHeader': {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '30px',
    minHeight: '82px',
    padding: '12px max(24px,5vw)',
    background: '#FFFFFF',
    borderBottom: '1px solid #E5EAF0',
    boxShadow: '0 4px 18px rgba(0,33,71,.06)'
  },

  '.nestBrand': {
    display: 'flex',
    alignItems: 'center',
    gap: '13px'
  },

  '.nestCrest': {
    width: '48px',
    height: '52px',
    flexShrink: 0,
    display: 'grid',
    placeItems: 'center',
    background: '#D4AF37',
    color: '#002147',
    border: '2px solid #002147',
    borderRadius: '7px',
    fontSize: '14px',
    fontWeight: '900',
    boxShadow: 'inset 0 0 0 2px rgba(255,255,255,.75)'
  },

  '.nestBrandText strong': {
    display: 'block',
    color: '#002147',
    fontSize: '21px',
    lineHeight: '1.1',
    letterSpacing: '-.4px'
  },

  '.nestBrandText strong span': {
    color: '#B28B13'
  },

  '.nestBrandText small': {
    display: 'block',
    marginTop: '4px',
    color: '#667085',
    fontSize: '11px'
  },

  '.nestNav': {
    display: 'flex',
    alignItems: 'center',
    gap: '28px'
  },

  '.nestNav a': {
    color: '#344054',
    fontSize: '13px',
    fontWeight: '700',
    textDecoration: 'none',
    transition: 'color .18s ease'
  },

  '.nestNav a:hover': {
    color: '#002147'
  },

  '.headerLogin': {
    minHeight: '42px',
    padding: '10px 20px',
    border: 0,
    borderRadius: '9px',
    background: '#002147',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'background .18s ease,transform .18s ease'
  },

  '.headerLogin:hover': {
    background: '#0B3A68',
    transform: 'translateY(-1px)'
  },


  /* =========================================================
     HERO
  ========================================================= */

  '.nestHero': {
    position: 'relative',
    overflow: 'hidden',
    display: 'grid',
    gridTemplateColumns: 'minmax(0,1.15fr) minmax(360px,.85fr)',
    gap: '70px',
    alignItems: 'center',
    minHeight: '590px',
    padding: '70px max(28px,7vw)',
    background: 'linear-gradient(120deg,#001A38 0%,#002147 52%,#073B68 100%)',
    borderBottom: '4px solid #D4AF37'
  },

  '.nestHero::before': {
    content: '""',
    position: 'absolute',
    width: '430px',
    height: '430px',
    right: '-150px',
    top: '-210px',
    border: '70px solid rgba(212,175,55,.07)',
    borderRadius: '50%'
  },

  '.nestHero::after': {
    content: '""',
    position: 'absolute',
    width: '330px',
    height: '330px',
    left: '-170px',
    bottom: '-220px',
    border: '60px solid rgba(255,255,255,.035)',
    borderRadius: '50%'
  },

  '.heroContent': {
    position: 'relative',
    zIndex: 2,
    maxWidth: '690px'
  },

  '.heroEyebrow': {
    display: 'inline-flex',
    alignItems: 'center',
    marginBottom: '19px',
    padding: '7px 11px',
    border: '1px solid rgba(212,175,55,.35)',
    borderRadius: '999px',
    background: 'rgba(212,175,55,.08)',
    color: '#E5C456',
    fontSize: '10px',
    fontWeight: '900',
    letterSpacing: '1.5px'
  },

  '.heroContent h1': {
    maxWidth: '680px',
    margin: '0 0 20px',
    color: '#FFFFFF',
    fontSize: 'clamp(42px,5vw,68px)',
    lineHeight: '1.02',
    letterSpacing: '-2.3px'
  },

  '.heroContent h1 span': {
    display: 'block',
    color: '#D4AF37'
  },

  '.heroLead': {
    maxWidth: '600px',
    margin: '0',
    color: 'rgba(255,255,255,.76)',
    fontSize: '17px',
    lineHeight: '1.7'
  },

  '.heroActions': {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '29px'
  },

  '.heroPrimary,.heroSecondary': {
    minHeight: '48px',
    padding: '12px 22px',
    borderRadius: '9px',
    fontSize: '13px',
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'all .18s ease'
  },

  '.heroPrimary': {
    border: '1px solid #D4AF37',
    background: '#D4AF37',
    color: '#002147'
  },

  '.heroPrimary:hover': {
    background: '#E2BD40',
    borderColor: '#E2BD40',
    transform: 'translateY(-1px)'
  },

  '.heroSecondary': {
    border: '1px solid rgba(255,255,255,.4)',
    background: 'transparent',
    color: '#FFFFFF'
  },

  '.heroSecondary:hover': {
    background: 'rgba(255,255,255,.08)',
    borderColor: '#FFFFFF'
  },

  '.heroTrust': {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '30px',
    color: 'rgba(255,255,255,.56)',
    fontSize: '11px',
    fontWeight: '600'
  },

  '.heroTrust i': {
    width: '4px',
    height: '4px',
    borderRadius: '50%',
    background: '#D4AF37'
  },


  /* =========================================================
     HERO SERVICES PANEL
  ========================================================= */

  '.heroPanel': {
    position: 'relative',
    zIndex: 2,
    overflow: 'hidden',
    padding: '27px',
    background: '#FFFFFF',
    border: '1px solid rgba(255,255,255,.5)',
    borderRadius: '18px',
    boxShadow: '0 28px 60px rgba(0,0,0,.22)'
  },

  '.heroPanelHeader': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    paddingBottom: '19px',
    marginBottom: '3px',
    borderBottom: '1px solid #E8ECF1'
  },

  '.heroPanelHeader small': {
    display: 'block',
    marginBottom: '4px',
    color: '#B28B13',
    fontSize: '9px',
    fontWeight: '900',
    letterSpacing: '1.3px'
  },

  '.heroPanelHeader h2': {
    margin: 0,
    color: '#002147',
    fontSize: '20px'
  },

  '.systemStatus': {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 10px',
    borderRadius: '999px',
    background: '#ECFDF3',
    color: '#067647',
    fontSize: '10px',
    fontWeight: '800'
  },

  '.heroService': {
    display: 'grid',
    gridTemplateColumns: '42px 1fr',
    gap: '14px',
    alignItems: 'start',
    padding: '17px 0',
    borderBottom: '1px solid #EDF0F4'
  },

  '.heroService:last-child': {
    borderBottom: '0',
    paddingBottom: 0
  },

  '.serviceNumber': {
    width: '39px',
    height: '39px',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '9px',
    background: '#EEF3F8',
    color: '#002147',
    fontSize: '11px',
    fontWeight: '900'
  },

  '.heroService strong': {
    display: 'block',
    marginBottom: '4px',
    color: '#002147',
    fontSize: '14px'
  },

  '.heroService p': {
    margin: 0,
    color: '#667085',
    fontSize: '12px',
    lineHeight: '1.5'
  },


  /* =========================================================
     SECTION HEADINGS
  ========================================================= */

  '.landingSectionHeading': {
    maxWidth: '720px',
    margin: '0 auto 38px',
    textAlign: 'center'
  },

  '.landingSectionHeading > span': {
    display: 'block',
    marginBottom: '9px',
    color: '#A37E10',
    fontSize: '10px',
    fontWeight: '900',
    letterSpacing: '1.6px'
  },

  '.landingSectionHeading h2': {
    margin: '0 0 12px',
    color: '#002147',
    fontSize: 'clamp(29px,4vw,40px)',
    letterSpacing: '-1px'
  },

  '.landingSectionHeading p': {
    margin: 0,
    color: '#667085',
    fontSize: '14px',
    lineHeight: '1.7'
  },

  '.landingSectionHeading.light h2': {
    color: '#FFFFFF'
  },

  '.landingSectionHeading.light p': {
    color: 'rgba(255,255,255,.68)'
  },

  '.landingSectionHeading.light > span': {
    color: '#D4AF37'
  },


  /* =========================================================
     SERVICES
  ========================================================= */

  '.nestServices': {
    padding: '80px max(28px,6vw)',
    background: '#F6F8FB'
  },

  '.serviceGrid': {
    width: 'min(1200px,100%)',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(4,1fr)',
    gap: '17px'
  },

  '.serviceCard': {
    position: 'relative',
    minHeight: '265px',
    padding: '25px',
    background: '#FFFFFF',
    border: '1px solid #E1E7EE',
    borderRadius: '14px',
    boxShadow: '0 7px 22px rgba(0,33,71,.05)',
    transition: 'transform .2s ease,box-shadow .2s ease,border-color .2s ease'
  },

  '.serviceCard:hover': {
    transform: 'translateY(-4px)',
    borderColor: 'rgba(212,175,55,.65)',
    boxShadow: '0 14px 30px rgba(0,33,71,.09)'
  },

  '.serviceCardTop': {
    marginBottom: '25px'
  },

  '.serviceCardTop span': {
    display: 'inline-grid',
    placeItems: 'center',
    width: '42px',
    height: '42px',
    borderRadius: '10px',
    background: '#EEF3F8',
    color: '#002147',
    fontSize: '11px',
    fontWeight: '900'
  },

  '.serviceCard h3': {
    margin: '0 0 10px',
    color: '#002147',
    fontSize: '18px'
  },

  '.serviceCard p': {
    margin: '0 0 22px',
    color: '#667085',
    fontSize: '13px',
    lineHeight: '1.65'
  },

  '.serviceLink': {
    position: 'absolute',
    left: '25px',
    bottom: '24px',
    padding: 0,
    border: 0,
    background: 'transparent',
    color: '#003B73',
    fontSize: '12px',
    fontWeight: '800',
    cursor: 'pointer'
  },

  '.serviceLink:hover': {
    color: '#B28B13'
  },


  /* =========================================================
     PORTALS
  ========================================================= */

  '.portalSection': {
    padding: '80px max(28px,6vw)',
    background: '#002147'
  },

  '.portalGrid': {
    width: 'min(1120px,100%)',
    margin: '0 auto',
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: '18px',
    alignItems: 'stretch'
  },

  '.portalCard': {
    position: 'relative',
    padding: '30px',
    background: '#FFFFFF',
    border: '1px solid rgba(255,255,255,.12)',
    borderRadius: '15px'
  },

  '.portalCard.featured': {
    borderTop: '5px solid #D4AF37'
  },

  '.portalRole': {
    display: 'inline-block',
    marginBottom: '15px',
    color: '#A37E10',
    fontSize: '9px',
    fontWeight: '900',
    letterSpacing: '1.3px'
  },

  '.portalCard h3': {
    margin: '0 0 10px',
    color: '#002147',
    fontSize: '21px'
  },

  '.portalCard > p': {
    minHeight: '63px',
    margin: 0,
    color: '#667085',
    fontSize: '13px',
    lineHeight: '1.6'
  },

  '.portalCard ul': {
    display: 'grid',
    gap: '10px',
    margin: '22px 0 27px',
    padding: 0,
    listStyle: 'none'
  },

  '.portalCard li': {
    position: 'relative',
    paddingLeft: '20px',
    color: '#475467',
    fontSize: '12px'
  },

  '.portalCard li::before': {
    content: '"✓"',
    position: 'absolute',
    left: 0,
    color: '#067647',
    fontWeight: '900'
  },

  '.portalButton': {
    width: '100%',
    minHeight: '43px',
    border: '1px solid #002147',
    borderRadius: '9px',
    background: '#002147',
    color: '#FFFFFF',
    fontSize: '12px',
    fontWeight: '800',
    cursor: 'pointer'
  },

  '.portalButton:hover': {
    background: '#0B3A68'
  },

  '.portalCard.featured .portalButton': {
    borderColor: '#D4AF37',
    background: '#D4AF37',
    color: '#002147'
  },


  /* =========================================================
     RESIDENCES
  ========================================================= */

  '.connectedResidences': {
    display: 'grid',
    gridTemplateColumns: '.8fr 1.2fr',
    gap: '60px',
    alignItems: 'center',
    padding: '70px max(28px,7vw)',
    background: '#FFFFFF'
  },

  '.residenceEyebrow': {
    display: 'block',
    marginBottom: '9px',
    color: '#A37E10',
    fontSize: '10px',
    fontWeight: '900',
    letterSpacing: '1.5px'
  },

  '.connectedIntro h2': {
    margin: '0 0 10px',
    color: '#002147',
    fontSize: '32px',
    letterSpacing: '-.7px'
  },

  '.connectedIntro p': {
    maxWidth: '470px',
    margin: 0,
    color: '#667085',
    fontSize: '13px',
    lineHeight: '1.65'
  },

  '.residenceList': {
    display: 'grid',
    gridTemplateColumns: 'repeat(2,1fr)',
    gap: '12px'
  },

  '.residenceItem': {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    minHeight: '70px',
    padding: '14px 17px',
    border: '1px solid #E1E7EE',
    borderRadius: '11px',
    background: '#F8FAFC'
  },

  '.residenceItem span': {
    color: '#D4AF37',
    fontSize: '20px',
    fontWeight: '900'
  },

  '.residenceItem strong': {
    color: '#002147',
    fontSize: '13px'
  },


  /* =========================================================
     FOOTER
  ========================================================= */

  '.nestFooter': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '30px',
    padding: '25px max(28px,5vw)',
    background: '#071E35',
    color: '#FFFFFF'
  },

  '.footerBrand': {
    display: 'flex',
    alignItems: 'center',
    gap: '11px'
  },

  '.footerCrest': {
    width: '37px',
    height: '40px',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '5px',
    background: '#D4AF37',
    color: '#002147',
    fontSize: '10px',
    fontWeight: '900'
  },

  '.footerBrand strong': {
    display: 'block',
    fontSize: '14px'
  },

  '.footerBrand strong span': {
    color: '#D4AF37'
  },

  '.footerBrand small': {
    display: 'block',
    marginTop: '2px',
    color: 'rgba(255,255,255,.55)',
    fontSize: '9px'
  },

  '.footerText': {
    color: 'rgba(255,255,255,.6)',
    fontSize: '11px'
  },


  /* =========================================================
     AUTH MODAL
  ========================================================= */

  '.modalBackdrop': {
    position: 'fixed',
    inset: 0,
    zIndex: 2000,
    display: 'grid',
    placeItems: 'center',
    padding: '20px',
    background: 'rgba(0,18,39,.78)',
    backdropFilter: 'blur(6px)'
  },

  '.modalBackdrop[hidden]': {
    display: 'none'
  },

  '.authModal': {
    position: 'relative',
    width: 'min(440px,100%)',
    maxHeight: '92vh',
    overflowY: 'auto',
    padding: '31px',
    background: '#FFFFFF',
    border: '1px solid #E2E8F0',
    borderRadius: '17px',
    boxShadow: '0 30px 80px rgba(0,0,0,.3)'
  },

  '.modalClose': {
    position: 'absolute',
    top: '13px',
    right: '15px',
    width: '35px',
    height: '35px',
    display: 'grid',
    placeItems: 'center',
    padding: 0,
    border: 0,
    borderRadius: '50%',
    background: '#F4F6F9',
    color: '#667085',
    fontSize: '22px',
    cursor: 'pointer'
  },

  '.modalClose:hover': {
    background: '#EAECF0',
    color: '#002147'
  },

  '.modalBrand': {
    marginBottom: '24px',
    textAlign: 'center'
  },

  '.modalCrest': {
    width: '49px',
    height: '53px',
    display: 'grid',
    placeItems: 'center',
    margin: '0 auto 11px',
    border: '2px solid #002147',
    borderRadius: '7px',
    background: '#D4AF37',
    color: '#002147',
    fontSize: '12px',
    fontWeight: '900'
  },

  '.modalSystemName': {
    marginBottom: '17px',
    color: '#002147',
    fontSize: '12px',
    fontWeight: '900'
  },

  '.modalSystemName span': {
    color: '#B28B13'
  },

  '.modalBrand h2': {
    margin: '0 0 7px',
    color: '#002147',
    fontSize: '25px'
  },

  '.modalBrand p': {
    margin: 0,
    color: '#667085',
    fontSize: '12px'
  },


  /* =========================================================
     AUTH FORM
  ========================================================= */

  '.authModal .field': {
    display: 'grid',
    gap: '7px',
    marginBottom: '15px'
  },

  '.authModal .field label': {
    color: '#344054',
    fontSize: '12px',
    fontWeight: '700'
  },

  '.authModal input,.authModal select': {
    width: '100%',
    minHeight: '45px',
    padding: '10px 12px',
    border: '1px solid #D6DEE8',
    borderRadius: '9px',
    outline: 'none',
    background: '#FFFFFF',
    color: '#172033',
    fontFamily: 'inherit',
    fontSize: '13px',
    transition: 'border-color .18s ease,box-shadow .18s ease'
  },

  '.authModal input:focus,.authModal select:focus': {
    borderColor: '#B28B13',
    boxShadow: '0 0 0 3px rgba(212,175,55,.13)'
  },

  '.authSubmit': {
    width: '100%',
    minHeight: '46px',
    marginTop: '4px',
    border: 0,
    borderRadius: '9px',
    background: '#002147',
    color: '#FFFFFF',
    fontSize: '13px',
    fontWeight: '800',
    cursor: 'pointer'
  },

  '.authSubmit:hover': {
    background: '#0B3A68'
  },

  '.authSubmit.gold': {
    background: '#D4AF37',
    color: '#002147'
  },

  '.authSubmit.gold:hover': {
    background: '#E2BD40'
  },

  '.switchAuth': {
    margin: '18px 0 0',
    color: '#667085',
    fontSize: '12px',
    textAlign: 'center'
  },

  '.linkBtn': {
    padding: 0,
    border: 0,
    background: 'transparent',
    color: '#003B73',
    fontSize: '12px',
    fontWeight: '800',
    cursor: 'pointer'
  },

  '.linkBtn:hover': {
    color: '#B28B13'
  },

  '.hint': {
    color: '#667085',
    fontSize: '10px',
    lineHeight: '1.5'
  },

  '.error': {
    margin: '0 0 15px',
    padding: '11px 12px',
    border: '1px solid #FECDCA',
    borderRadius: '8px',
    background: '#FEF3F2',
    color: '#B42318',
    fontSize: '12px'
  },

  '.successBox': {
    margin: '0 0 15px',
    padding: '11px 12px',
    border: '1px solid #ABEFC6',
    borderRadius: '8px',
    background: '#ECFDF3',
    color: '#067647',
    fontSize: '12px'
  }

});


/* =========================================================
   RESPONSIVE PUBLIC SITE
========================================================= */

const nestLoginResponsiveStyles =
  document.createElement('style');

nestLoginResponsiveStyles.textContent = `

  @media (max-width: 1050px) {

    .nestHero {
      grid-template-columns: 1fr 380px;
      gap: 40px;
      padding-left: 5vw;
      padding-right: 5vw;
    }

    .serviceGrid {
      grid-template-columns: repeat(2, 1fr);
    }

    .portalGrid {
      grid-template-columns: 1fr;
      max-width: 680px;
    }

    .portalCard > p {
      min-height: auto;
    }

  }


  @media (max-width: 850px) {

    .nestHeader {
      min-height: 74px;
    }

    .nestNav a {
      display: none;
    }

    .nestHero {
      grid-template-columns: 1fr;
      min-height: auto;
      gap: 45px;
      padding-top: 65px;
      padding-bottom: 65px;
    }

    .heroContent {
      max-width: 720px;
    }

    .heroPanel {
      width: min(560px, 100%);
    }

    .connectedResidences {
      grid-template-columns: 1fr;
      gap: 30px;
    }

  }


  @media (max-width: 650px) {

    .nestHeader {
      padding: 11px 15px;
    }

    .nestCrest {
      width: 41px;
      height: 44px;
      font-size: 12px;
    }

    .nestBrandText strong {
      font-size: 17px;
    }

    .nestBrandText small {
      max-width: 190px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      font-size: 9px;
    }

    .headerLogin {
      min-height: 39px;
      padding: 8px 13px;
      font-size: 11px;
    }

    .nestHero {
      padding: 52px 20px;
    }

    .heroContent h1 {
      font-size: 42px;
      letter-spacing: -1.5px;
    }

    .heroLead {
      font-size: 14px;
    }

    .heroActions {
      flex-direction: column;
    }

    .heroPrimary,
    .heroSecondary {
      width: 100%;
    }

    .heroTrust {
      gap: 8px;
      font-size: 9px;
    }

    .heroPanel {
      padding: 21px;
    }

    .nestServices,
    .portalSection {
      padding: 58px 20px;
    }

    .serviceGrid {
      grid-template-columns: 1fr;
    }

    .serviceCard {
      min-height: 235px;
    }

    .connectedResidences {
      padding: 55px 20px;
    }

    .residenceList {
      grid-template-columns: 1fr;
    }

    .nestFooter {
      align-items: flex-start;
      flex-direction: column;
      padding: 23px 20px;
    }

    .authModal {
      padding: 27px 21px;
    }

  }


  @media (max-width: 430px) {

    .nestBrandText small {
      display: none;
    }

    .nestBrandText strong {
      font-size: 15px;
    }

    .heroContent h1 {
      font-size: 36px;
    }

    .heroTrust i {
      display: none;
    }

    .heroTrust {
      align-items: flex-start;
      flex-direction: column;
    }

  }

`;

document.head.appendChild(
  nestLoginResponsiveStyles
);
/* =========================================================
   AUTH MODAL POLISH
   Improves login/register experience
========================================================= */

const authPolishStyles = document.createElement('style');

authPolishStyles.textContent = `

  /* =====================================================
     MODAL BACKDROP
  ====================================================== */

  .modalBackdrop {
    background:
      radial-gradient(
        circle at top right,
        rgba(212,175,55,.12),
        transparent 32%
      ),
      rgba(0,18,39,.82);

    backdrop-filter: blur(8px);
  }


  /* =====================================================
     MODAL CONTAINER
  ====================================================== */

  .authModal {
    width: min(460px, 100%);

    padding: 34px;

    border: 1px solid rgba(255,255,255,.6);

    border-radius: 20px;

    background:
      linear-gradient(
        180deg,
        #FFFFFF 0%,
        #FBFCFE 100%
      );

    box-shadow:
      0 35px 90px rgba(0,0,0,.34);

    animation:
      authModalEnter .22s ease-out;
  }


  @keyframes authModalEnter {

    from {
      opacity: 0;
      transform: translateY(12px) scale(.985);
    }

    to {
      opacity: 1;
      transform: translateY(0) scale(1);
    }

  }


  /* =====================================================
     CLOSE BUTTON
  ====================================================== */

  .modalClose {
    top: 14px;
    right: 14px;

    width: 36px;
    height: 36px;

    border: 1px solid #E4E7EC;

    background: #F8FAFC;

    color: #667085;

    font-size: 21px;

    transition:
      background .18s ease,
      color .18s ease,
      transform .18s ease;
  }

  .modalClose:hover {
    background: #EEF2F6;
    color: #002147;

    transform: rotate(4deg);
  }


  /* =====================================================
     BRAND AREA
  ====================================================== */

  .modalBrand {
    margin-bottom: 26px;
  }

  .modalCrest {
    width: 54px;
    height: 58px;

    margin-bottom: 12px;

    border: 2px solid #002147;

    border-radius: 8px;

    background:
      linear-gradient(
        180deg,
        #D4AF37 0%,
        #E2BD40 100%
      );

    box-shadow:
      0 8px 18px rgba(0,33,71,.10);

    font-size: 13px;
  }

  .modalSystemName {
    margin-bottom: 19px;

    font-size: 13px;

    letter-spacing: -.1px;
  }

  .modalBrand h2 {
    margin-bottom: 8px;

    font-size: 27px;

    letter-spacing: -.5px;
  }

  .modalBrand p {
    max-width: 320px;

    margin-left: auto;
    margin-right: auto;

    color: #667085;

    font-size: 12px;
    line-height: 1.55;
  }


  /* =====================================================
     FORM FIELDS
  ====================================================== */

  .authModal .field {
    margin-bottom: 17px;
  }

  .authModal .field label {
    color: #344054;

    font-size: 12px;
    font-weight: 750;
  }

  .authModal input,
  .authModal select {
    min-height: 47px;

    padding: 11px 13px;

    border: 1px solid #D0D7E2;

    border-radius: 10px;

    background: #FFFFFF;

    font-size: 13px;

    transition:
      border-color .18s ease,
      box-shadow .18s ease,
      background .18s ease;
  }

  .authModal input::placeholder {
    color: #98A2B3;
  }

  .authModal input:hover,
  .authModal select:hover {
    border-color: #B8C2CF;
  }

  .authModal input:focus,
  .authModal select:focus {
    border-color: #D4AF37;

    background: #FFFFFF;

    box-shadow:
      0 0 0 4px rgba(212,175,55,.13);
  }


  /* =====================================================
     SUBMIT BUTTON
  ====================================================== */

  .authSubmit {
    min-height: 48px;

    margin-top: 6px;

    border-radius: 10px;

    background:
      linear-gradient(
        180deg,
        #002147 0%,
        #00172F 100%
      );

    box-shadow:
      0 7px 16px rgba(0,33,71,.16);

    font-size: 13px;
    font-weight: 800;

    transition:
      transform .18s ease,
      box-shadow .18s ease,
      background .18s ease;
  }

  .authSubmit:hover {
    background:
      linear-gradient(
        180deg,
        #0B3A68 0%,
        #002147 100%
      );

    transform: translateY(-1px);

    box-shadow:
      0 10px 20px rgba(0,33,71,.20);
  }

  .authSubmit:active {
    transform: translateY(0);
  }


  .authSubmit.gold {
    background:
      linear-gradient(
        180deg,
        #D4AF37 0%,
        #C7A128 100%
      );

    color: #002147;

    box-shadow:
      0 7px 16px rgba(212,175,55,.20);
  }

  .authSubmit.gold:hover {
    background:
      linear-gradient(
        180deg,
        #E1BD45 0%,
        #D4AF37 100%
      );

    box-shadow:
      0 10px 20px rgba(212,175,55,.24);
  }


  /* =====================================================
     SWITCH LOGIN / REGISTER
  ====================================================== */

  .switchAuth {
    margin-top: 20px;

    padding-top: 17px;

    border-top: 1px solid #EAECF0;

    color: #667085;

    font-size: 12px;
  }

  .linkBtn {
    margin-left: 3px;

    color: #002147;

    font-weight: 800;
  }

  .linkBtn:hover {
    color: #B28B13;
  }


  /* =====================================================
     FEEDBACK MESSAGES
  ====================================================== */

  .authModal .error {
    margin-bottom: 17px;

    padding: 12px 13px;

    border: 1px solid #FECDCA;

    border-radius: 9px;

    background: #FEF3F2;

    color: #B42318;

    font-size: 12px;
    line-height: 1.45;
  }

  .authModal .successBox {
    margin-bottom: 17px;

    padding: 12px 13px;

    border: 1px solid #ABEFC6;

    border-radius: 9px;

    background: #ECFDF3;

    color: #067647;

    font-size: 12px;
    line-height: 1.45;
  }


  /* =====================================================
     STAFF RESIDENCE FIELD
  ====================================================== */

  #staffRes {
    padding: 14px;

    border: 1px solid #E6DFC6;

    border-radius: 10px;

    background: #FFFCF2;
  }

  #staffRes .hint {
    margin-top: 2px;

    color: #7A6A31;
  }


  /* =====================================================
     SMALL MOBILE
  ====================================================== */

  @media (max-width: 520px) {

    .modalBackdrop {
      padding: 12px;
    }

    .authModal {
      width: 100%;

      max-height: 95vh;

      padding: 28px 20px;

      border-radius: 16px;
    }

    .modalBrand h2 {
      font-size: 24px;
    }

    .modalBrand p {
      font-size: 11px;
    }

    .authSubmit {
      min-height: 46px;
    }

  }

`;

document.head.appendChild(authPolishStyles);