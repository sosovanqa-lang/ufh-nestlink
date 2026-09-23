injectStyles({

  /* =========================================================
     DASHBOARD HEADER / NAVIGATION
  ========================================================= */

  '.dashHeader': {
    position: 'sticky',
    top: 0,
    zIndex: 100,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '24px',
    padding: '13px max(24px,4vw)',
    background: '#002147',
    color: '#fff',
    borderBottom: '3px solid #D4AF37',
    boxShadow: '0 5px 20px rgba(0,33,71,.18)'
  },

  '.dashBrand': {
    display: 'flex',
    alignItems: 'center',
    gap: '13px',
    minWidth: '220px'
  },

  '.crestMini': {
    width: '46px',
    height: '49px',
    flexShrink: 0,
    display: 'grid',
    placeItems: 'center',
    background: '#D4AF37',
    color: '#002147',
    border: '2px solid rgba(255,255,255,.95)',
    borderRadius: '6px',
    fontWeight: '900',
    boxShadow: '0 3px 10px rgba(0,0,0,.16)'
  },

  '.dashBrand b': {
    display: 'block',
    fontSize: '20px',
    lineHeight: 1.1,
    letterSpacing: '-.3px'
  },

  '.dashBrand b span': {
    color: '#D4AF37'
  },

  '.dashBrand small': {
    display: 'block',
    marginTop: '4px',
    fontSize: '11px',
    color: 'rgba(255,255,255,.72)'
  },

  '.dashUser': {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    textAlign: 'right'
  },

  '.dashUser small': {
    display: 'block',
    marginTop: '3px',
    color: 'rgba(255,255,255,.65)'
  },

  '.nav': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '4px',
    flexWrap: 'wrap'
  },

  '.nav button': {
    position: 'relative',
    border: 0,
    background: 'transparent',
    color: 'rgba(255,255,255,.85)',
    padding: '10px 14px',
    borderRadius: '7px',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '13px',
    transition: 'all .2s ease'
  },

  '.nav button:hover': {
    background: 'rgba(255,255,255,.09)',
    color: '#fff'
  },

  '.nav button.active': {
    background: '#D4AF37',
    color: '#002147',
    boxShadow: '0 3px 9px rgba(0,0,0,.15)'
  },


  /* =========================================================
     MAIN CONTAINER
  ========================================================= */

  '.container': {
    width: 'min(1240px,calc(100% - 38px))',
    margin: '28px auto 60px'
  },

  '.studentDashboard': {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px'
  },

  '.pageShell': {
    display: 'flex',
    flexDirection: 'column',
    gap: '25px'
  },


  /* =========================================================
     STUDENT WELCOME HERO
  ========================================================= */

  '.studentWelcome': {
    position: 'relative',
    overflow: 'hidden',
    display: 'grid',
    gridTemplateColumns: '1.5fr .75fr',
    gap: '40px',
    alignItems: 'center',
    minHeight: '285px',
    padding: '42px',
    background:
      'linear-gradient(115deg,#002147 0%,#063963 65%,#0A4D7E 100%)',
    borderRadius: '18px',
    color: '#fff',
    boxShadow: '0 16px 38px rgba(0,33,71,.18)'
  },

  '.studentWelcome::after': {
    content: '""',
    position: 'absolute',
    width: '260px',
    height: '260px',
    right: '-75px',
    bottom: '-130px',
    borderRadius: '50%',
    border: '42px solid rgba(212,175,55,.13)'
  },

  '.welcomeContent': {
    position: 'relative',
    zIndex: 2
  },

  '.welcomeEyebrow': {
    display: 'inline-block',
    marginBottom: '13px',
    color: '#F5C518',
    fontWeight: '800',
    fontSize: '12px',
    letterSpacing: '1.5px'
  },

  '.welcomeContent h1': {
    margin: '0 0 13px',
    maxWidth: '700px',
    fontSize: 'clamp(30px,4vw,47px)',
    lineHeight: '1.08',
    letterSpacing: '-1.5px',
    color: '#fff'
  },

  '.welcomeContent h1 span': {
    color: '#D4AF37'
  },

  '.welcomeContent p': {
    maxWidth: '650px',
    margin: '0',
    color: 'rgba(255,255,255,.82)',
    lineHeight: '1.7',
    fontSize: '15px'
  },

  '.welcomeActions': {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '12px',
    marginTop: '25px'
  },

  '.welcomeActions .btn': {
    background: '#D4AF37',
    color: '#002147'
  },

  '.welcomeActions .btnOutline': {
    background: 'transparent',
    color: '#fff',
    border: '1px solid rgba(255,255,255,.7)'
  },

  '.welcomeActions .btnOutline:hover': {
    background: '#fff',
    color: '#002147'
  },


  /* =========================================================
     RESIDENCE HERO CARD
  ========================================================= */

  '.residenceSummary': {
    position: 'relative',
    zIndex: 2,
    display: 'flex',
    alignItems: 'center',
    gap: '18px',
    padding: '25px',
    background: 'rgba(255,255,255,.1)',
    border: '1px solid rgba(255,255,255,.2)',
    borderRadius: '16px',
    backdropFilter: 'blur(8px)'
  },

  '.residenceIcon': {
    width: '60px',
    height: '60px',
    flexShrink: 0,
    display: 'grid',
    placeItems: 'center',
    borderRadius: '14px',
    background: '#D4AF37',
    color: '#002147',
    fontSize: '30px',
    fontWeight: '900'
  },

  '.summaryLabel': {
    display: 'block',
    marginBottom: '7px',
    color: 'rgba(255,255,255,.62)',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '1.2px'
  },

  '.residenceSummary h3': {
    margin: '0 0 5px',
    color: '#fff',
    fontSize: '18px'
  },

  '.roomNumber': {
    color: '#D4AF37',
    fontWeight: '700',
    fontSize: '14px'
  },


  /* =========================================================
     SECTION HEADINGS
  ========================================================= */

  '.dashboardSection': {
    display: 'flex',
    flexDirection: 'column',
    gap: '17px'
  },

  '.studentQuickActions': {
    display: 'flex',
    flexDirection: 'column',
    gap: '17px'
  },

  '.sectionHeading': {
    display: 'flex',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    gap: '20px'
  },

  '.sectionHeading h2': {
    margin: '4px 0 0',
    color: '#002147',
    fontSize: '25px',
    letterSpacing: '-.5px'
  },

  '.sectionEyebrow': {
    color: '#B28B13',
    fontSize: '10px',
    fontWeight: '900',
    letterSpacing: '1.5px'
  },

  '.sectionEyebrow.gold': {
    color: '#D4AF37'
  },

  '.academicBadge': {
    display: 'inline-flex',
    padding: '7px 12px',
    borderRadius: '999px',
    background: '#EEF3F8',
    color: '#002147',
    fontSize: '11px',
    fontWeight: '800'
  },


  /* =========================================================
     STUDENT OVERVIEW STAT CARDS
  ========================================================= */

  '.studentStats': {
    display: 'grid',
    gridTemplateColumns: 'repeat(4,1fr)',
    gap: '15px'
  },

  '.studentStatCard': {
    position: 'relative',
    display: 'flex',
    alignItems: 'flex-start',
    gap: '15px',
    minHeight: '135px',
    padding: '21px',
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: '15px',
    boxShadow: '0 7px 22px rgba(0,33,71,.055)',
    transition: 'transform .2s ease,box-shadow .2s ease,border-color .2s ease'
  },

  '.studentStatCard.clickable': {
    cursor: 'pointer'
  },

  '.studentStatCard.clickable:hover': {
    transform: 'translateY(-4px)',
    borderColor: 'rgba(212,175,55,.65)',
    boxShadow: '0 13px 28px rgba(0,33,71,.11)'
  },

  '.statIcon': {
    width: '43px',
    height: '43px',
    flexShrink: 0,
    display: 'grid',
    placeItems: 'center',
    borderRadius: '11px',
    background: '#EEF4FA',
    color: '#003B73',
    fontWeight: '900',
    fontSize: '20px'
  },

  '.statContent': {
    minWidth: 0
  },

  '.statLabel': {
    display: 'block',
    marginBottom: '5px',
    color: '#7A8699',
    fontSize: '10px',
    fontWeight: '800',
    letterSpacing: '.8px',
    textTransform: 'uppercase'
  },

  '.statContent h3': {
    margin: '0 0 5px',
    color: '#002147',
    fontSize: '20px'
  },

  '.statContent p': {
    margin: 0,
    color: '#667085',
    lineHeight: '1.45',
    fontSize: '12px'
  },

  '.cardArrow': {
    position: 'absolute',
    top: '18px',
    right: '17px',
    color: '#B28B13',
    fontSize: '19px',
    fontWeight: '900'
  },

  '.statusDot': {
    position: 'absolute',
    top: '19px',
    right: '18px',
    width: '9px',
    height: '9px',
    borderRadius: '50%',
    background: '#CBD5E1'
  },

  '.statusDot.active': {
    background: '#16A34A',
    boxShadow: '0 0 0 4px rgba(22,163,74,.12)'
  },


  /* =========================================================
     QUICK ACTIONS
  ========================================================= */

  '.quickActionGrid': {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: '15px'
  },

  '.quickAction': {
    width: '100%',
    display: 'grid',
    gridTemplateColumns: '48px 1fr auto',
    alignItems: 'center',
    gap: '14px',
    padding: '20px',
    border: '1px solid #E2E8F0',
    borderRadius: '14px',
    background: '#fff',
    textAlign: 'left',
    cursor: 'pointer',
    transition: 'all .2s ease'
  },

  '.quickAction:hover': {
    transform: 'translateY(-3px)',
    borderColor: '#D4AF37',
    boxShadow: '0 10px 25px rgba(0,33,71,.08)'
  },

  '.quickIcon': {
    width: '48px',
    height: '48px',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '12px',
    background: '#EEF4FA',
    color: '#002147',
    fontSize: '20px'
  },

  '.quickText': {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },

  '.quickText strong': {
    color: '#002147',
    fontSize: '14px'
  },

  '.quickText small': {
    color: '#7A8699',
    lineHeight: '1.4'
  },

  '.quickAction b': {
    color: '#B28B13',
    fontSize: '18px'
  },


  /* =========================================================
     SUPPORT PANEL
  ========================================================= */

  '.studentSupport': {
    position: 'relative',
    overflow: 'hidden',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '30px',
    padding: '30px 34px',
    borderRadius: '16px',
    background: '#002147',
    color: '#fff',
    borderRight: '7px solid #D4AF37'
  },

  '.studentSupport h2': {
    margin: '7px 0 8px',
    color: '#fff',
    fontSize: '25px'
  },

  '.studentSupport p': {
    maxWidth: '700px',
    margin: 0,
    color: 'rgba(255,255,255,.72)',
    lineHeight: '1.6'
  },

  '.supportButton': {
    flexShrink: 0,
    border: 0,
    padding: '13px 19px',
    borderRadius: '9px',
    background: '#D4AF37',
    color: '#002147',
    fontWeight: '800',
    cursor: 'pointer'
  },


  /* =========================================================
     GENERAL PAGE HEADER
  ========================================================= */

  '.pageHeader': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '30px',
    padding: '29px 32px',
    background: 'linear-gradient(115deg,#002147,#06416F)',
    color: '#fff',
    borderRadius: '16px',
    borderBottom: '4px solid #D4AF37',
    boxShadow: '0 11px 28px rgba(0,33,71,.13)'
  },

  '.pageHeader h1': {
    margin: '4px 0 7px',
    color: '#fff',
    fontSize: '32px'
  },

  '.pageHeader p': {
    maxWidth: '680px',
    margin: 0,
    color: 'rgba(255,255,255,.75)',
    lineHeight: '1.6'
  },

  '.pageEyebrow': {
    color: '#D4AF37',
    fontSize: '10px',
    fontWeight: '900',
    letterSpacing: '1.4px'
  },

  '.pageHeaderMeta': {
    minWidth: '200px',
    padding: '15px 18px',
    background: 'rgba(255,255,255,.1)',
    border: '1px solid rgba(255,255,255,.16)',
    borderRadius: '12px'
  },

  '.pageHeaderMeta strong': {
    display: 'block',
    margin: '4px 0',
    color: '#fff'
  },

  '.pageHeaderMeta span': {
    color: 'rgba(255,255,255,.72)',
    fontSize: '12px'
  },

  '.headerMetaLabel': {
    color: '#D4AF37 !important',
    fontWeight: '900',
    letterSpacing: '1px'
  },


  /* =========================================================
     BUTTONS
  ========================================================= */

  '.btn': {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '7px',
    border: 0,
    padding: '11px 17px',
    borderRadius: '9px',
    background: '#D4AF37',
    color: '#002147',
    fontWeight: '800',
    cursor: 'pointer',
    transition: 'transform .18s ease,box-shadow .18s ease,background .18s ease'
  },

  '.btn:hover': {
    transform: 'translateY(-1px)',
    background: '#E1BC42',
    boxShadow: '0 6px 15px rgba(0,0,0,.12)'
  },


  /* =========================================================
     INVENTORY STATUS
  ========================================================= */

  '.inventoryStatus': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    padding: '18px 21px',
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: '13px'
  },

  '.inventoryStatus h3': {
    margin: '4px 0 0',
    color: '#002147'
  },

  '.statusLabel': {
    color: '#7A8699',
    fontSize: '9px',
    fontWeight: '900',
    letterSpacing: '1px'
  },

  '.badge': {
    display: 'inline-flex',
    alignItems: 'center',
    padding: '6px 10px',
    borderRadius: '999px',
    background: '#EEF4FA',
    color: '#002147',
    fontSize: '11px',
    fontWeight: '800',
    textTransform: 'capitalize'
  },


  /* =========================================================
     MODERN TABLE
  ========================================================= */

  '.modernTable': {
    overflow: 'hidden',
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: '15px',
    boxShadow: '0 6px 20px rgba(0,33,71,.04)'
  },

  '.tableTitle': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    padding: '20px 22px',
    borderBottom: '1px solid #E8EDF3'
  },

  '.tableTitle h2': {
    margin: '0 0 4px',
    color: '#002147',
    fontSize: '19px'
  },

  '.tableTitle p': {
    margin: 0,
    color: '#7A8699',
    fontSize: '12px'
  },

  '.tableTitle > span': {
    padding: '6px 10px',
    borderRadius: '999px',
    background: '#F4F6F9',
    color: '#002147',
    fontSize: '11px',
    fontWeight: '800'
  },

  '.tableWrap': {
    overflowX: 'auto',
    background: '#fff'
  },

  'table': {
    width: '100%',
    borderCollapse: 'collapse'
  },

  'th,td': {
    padding: '14px 16px',
    borderBottom: '1px solid #EDF1F5',
    textAlign: 'left',
    verticalAlign: 'middle',
    fontSize: '13px'
  },

  'th': {
    background: '#F8FAFC',
    color: '#526174',
    fontSize: '10px',
    fontWeight: '900',
    letterSpacing: '.7px',
    textTransform: 'uppercase'
  },

  'tbody tr:hover': {
    background: '#FBFCFE'
  },

  '.inventoryItem': {
    display: 'flex',
    alignItems: 'center',
    gap: '11px'
  },

  '.inventoryItem strong': {
    display: 'block',
    color: '#002147'
  },

  '.inventoryItem small': {
    display: 'block',
    marginTop: '4px',
    color: '#B45309'
  },

  '.itemIcon': {
    width: '34px',
    height: '34px',
    display: 'grid',
    placeItems: 'center',
    borderRadius: '8px',
    background: '#EEF4FA',
    color: '#003B73'
  },

  '.quantityBadge': {
    display: 'inline-grid',
    placeItems: 'center',
    minWidth: '29px',
    height: '29px',
    borderRadius: '8px',
    background: '#F4F6F9',
    color: '#002147',
    fontWeight: '800'
  },


  /* =========================================================
     INPUTS / FORMS
  ========================================================= */

  '.field': {
    display: 'flex',
    flexDirection: 'column',
    gap: '7px'
  },

  '.field label': {
    color: '#344054',
    fontSize: '12px',
    fontWeight: '700'
  },

  'input,select,textarea': {
    width: '100%',
    boxSizing: 'border-box',
    padding: '11px 12px',
    border: '1px solid #D6DEE8',
    borderRadius: '9px',
    outline: 'none',
    background: '#fff',
    color: '#1D2939',
    fontFamily: 'inherit',
    fontSize: '13px',
    transition: 'border-color .18s ease,box-shadow .18s ease'
  },

  'input:focus,select:focus,textarea:focus': {
    borderColor: '#B28B13',
    boxShadow: '0 0 0 3px rgba(212,175,55,.12)'
  },

  'textarea': {
    minHeight: '110px',
    resize: 'vertical'
  },

  '.formGrid': {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: '14px'
  },


  /* =========================================================
     SIGNATURE
  ========================================================= */

  '.signatureCard': {
    marginTop: '18px',
    padding: '24px',
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: '15px',
    boxShadow: '0 6px 20px rgba(0,33,71,.04)'
  },

  '.signatureHeader': {
    display: 'flex',
    gap: '14px',
    alignItems: 'center',
    marginBottom: '20px'
  },

  '.signatureIcon': {
    width: '46px',
    height: '46px',
    flexShrink: 0,
    display: 'grid',
    placeItems: 'center',
    borderRadius: '11px',
    background: '#FFF8DF',
    color: '#9A7410',
    fontSize: '21px'
  },

  '.signatureHeader h2': {
    margin: '0 0 4px',
    color: '#002147',
    fontSize: '19px'
  },

  '.signatureHeader p': {
    margin: 0,
    color: '#667085',
    fontSize: '12px'
  },

  '.signatureAgreement': {
    margin: '15px 0',
    padding: '13px 15px',
    borderRadius: '9px',
    background: '#F8FAFC',
    color: '#667085',
    lineHeight: '1.55',
    fontSize: '11px'
  },

  '.submitInventory': {
    marginTop: '3px'
  },

  '.submittedNotice': {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
    marginTop: '18px',
    padding: '20px',
    border: '1px solid #BBE3C5',
    borderRadius: '13px',
    background: '#F0FDF4'
  },

  '.submittedIcon': {
    width: '43px',
    height: '43px',
    flexShrink: 0,
    display: 'grid',
    placeItems: 'center',
    borderRadius: '50%',
    background: '#16A34A',
    color: '#fff',
    fontWeight: '900'
  },

  '.submittedNotice strong': {
    color: '#166534'
  },

  '.submittedNotice p': {
    margin: '4px 0 0',
    color: '#4B6351',
    fontSize: '12px'
  },


  /* =========================================================
     MAINTENANCE
  ========================================================= */

  '.maintenanceStats': {
    display: 'grid',
    gridTemplateColumns: 'repeat(3,1fr)',
    gap: '14px'
  },

  '.miniStat': {
    padding: '18px 20px',
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: '13px'
  },

  '.miniStat span': {
    display: 'block',
    marginBottom: '5px',
    color: '#7A8699',
    fontSize: '9px',
    fontWeight: '900',
    letterSpacing: '1px'
  },

  '.miniStat strong': {
    color: '#002147',
    fontSize: '27px'
  },

  '.faultFormCard': {
    padding: '25px',
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: '15px',
    boxShadow: '0 6px 20px rgba(0,33,71,.04)'
  },

  '.cardHeading': {
    marginBottom: '20px'
  },

  '.cardHeading h2': {
    margin: '5px 0',
    color: '#002147',
    fontSize: '21px'
  },

  '.cardHeading p': {
    margin: 0,
    color: '#667085',
    fontSize: '12px'
  },

  '.faultFormCard form': {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },

  '.faultFormCard .btn': {
    alignSelf: 'flex-start'
  },

  '.maintenanceHistory': {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px'
  },

  '.maintenanceList': {
    display: 'flex',
    flexDirection: 'column',
    gap: '10px'
  },

  '.maintenanceTicket': {
    padding: '18px 20px',
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderLeft: '4px solid #D4AF37',
    borderRadius: '12px'
  },

  '.ticketTop': {
    display: 'flex',
    justifyContent: 'space-between',
    gap: '20px'
  },

  '.ticketReference': {
    color: '#B28B13',
    fontSize: '10px',
    fontWeight: '900'
  },

  '.ticketTop h3': {
    margin: '4px 0 0',
    color: '#002147',
    fontSize: '16px'
  },

  '.ticketMeta': {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '18px',
    marginTop: '12px',
    paddingTop: '11px',
    borderTop: '1px solid #EEF1F5',
    color: '#667085',
    fontSize: '11px'
  },


  /* =========================================================
     NOTIFICATIONS
  ========================================================= */

  '.notificationList': {
    display: 'flex',
    flexDirection: 'column',
    gap: '11px'
  },

  '.notificationCard': {
    display: 'flex',
    gap: '15px',
    padding: '19px 20px',
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: '13px'
  },

  '.notificationCard.unread': {
    borderLeft: '4px solid #D4AF37',
    background: '#FFFEF9'
  },

  '.notificationCard.read': {
    opacity: '.8'
  },

  '.notificationIcon': {
    width: '40px',
    height: '40px',
    flexShrink: 0,
    display: 'grid',
    placeItems: 'center',
    borderRadius: '10px',
    background: '#EEF4FA',
    color: '#002147',
    fontWeight: '900'
  },

  '.notificationContent': {
    flex: 1
  },

  '.notificationHeading': {
    display: 'flex',
    alignItems: 'center',
    gap: '9px'
  },

  '.notificationHeading h3': {
    margin: 0,
    color: '#002147',
    fontSize: '15px'
  },

  '.notificationContent p': {
    margin: '7px 0',
    color: '#667085',
    lineHeight: '1.55',
    fontSize: '13px'
  },

  '.notificationContent small': {
    color: '#98A2B3'
  },

  '.newBadge': {
    padding: '3px 7px',
    borderRadius: '999px',
    background: '#D4AF37',
    color: '#002147',
    fontSize: '8px',
    fontWeight: '900'
  },


  /* =========================================================
     EMPTY STATE
  ========================================================= */

  '.emptyState': {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '280px',
    padding: '40px',
    background: '#fff',
    border: '1px solid #E2E8F0',
    borderRadius: '15px',
    textAlign: 'center'
  },

  '.emptyIcon': {
    width: '62px',
    height: '62px',
    display: 'grid',
    placeItems: 'center',
    marginBottom: '14px',
    borderRadius: '50%',
    background: '#EEF4FA',
    color: '#002147',
    fontSize: '27px'
  },

  '.emptyState h2': {
    margin: '0 0 7px',
    color: '#002147'
  },

  '.emptyState p': {
    maxWidth: '460px',
    margin: 0,
    color: '#667085',
    lineHeight: '1.6'
  },


  /* =========================================================
     LEGACY COMPONENT SUPPORT
     Keeps residence/staff pages working
  ========================================================= */

  '.hero': {
    background: 'linear-gradient(120deg,#002147,#0B4B82)',
    color: '#fff',
    padding: '28px',
    borderRadius: '16px',
    borderBottom: '4px solid #D4AF37',
    marginBottom: '18px',
    boxShadow: '0 10px 26px rgba(0,33,71,.1)'
  },

  '.hero h1': {
    marginTop: 0,
    color: '#fff'
  },

  '.grid': {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit,minmax(210px,1fr))',
    gap: '14px'
  },

  '.card': {
    background: '#fff',
    border: '1px solid #D9E0EA',
    borderRadius: '14px',
    padding: '18px',
    boxShadow: '0 6px 20px rgba(0,33,71,.04)'
  },

  '.stat': {
    fontSize: '30px',
    fontWeight: '900',
    color: '#002147'
  },

  '.actions': {
    display: 'flex',
    gap: '8px',
    flexWrap: 'wrap'
  },


  /* =========================================================
     RESPONSIVE
  ========================================================= */

  '@media(max-width:1050px)': {

    '.studentWelcome': {
      gridTemplateColumns: '1fr'
    },

    '.residenceSummary': {
      maxWidth: '450px'
    },

    '.studentStats': {
      gridTemplateColumns: 'repeat(2,1fr)'
    },

    '.quickActionGrid': {
      gridTemplateColumns: '1fr'
    }

  },


  '@media(max-width:850px)': {

    '.dashHeader': {
      position: 'relative',
      alignItems: 'flex-start',
      flexDirection: 'column'
    },

    '.nav': {
      width: '100%',
      justifyContent: 'flex-start'
    },

    '.dashUser': {
      width: '100%',
      justifyContent: 'space-between',
      textAlign: 'left'
    },

    '.formGrid': {
      gridTemplateColumns: '1fr'
    },

    '.pageHeader': {
      alignItems: 'flex-start',
      flexDirection: 'column'
    },

    '.pageHeaderMeta': {
      width: '100%',
      boxSizing: 'border-box'
    }

  },


  '@media(max-width:650px)': {

    '.container': {
      width: 'min(100% - 22px,1240px)',
      marginTop: '15px'
    },

    '.studentWelcome': {
      padding: '27px 22px',
      borderRadius: '14px'
    },

    '.welcomeContent h1': {
      fontSize: '31px'
    },

    '.studentStats': {
      gridTemplateColumns: '1fr'
    },

    '.sectionHeading': {
      alignItems: 'flex-start',
      flexDirection: 'column'
    },

    '.studentSupport': {
      alignItems: 'flex-start',
      flexDirection: 'column',
      padding: '25px'
    },

    '.pageHeader': {
      padding: '24px 21px'
    },

    '.pageHeader h1': {
      fontSize: '27px'
    },

    '.maintenanceStats': {
      gridTemplateColumns: '1fr'
    },

    '.ticketTop': {
      flexDirection: 'column'
    },

    '.welcomeActions': {
      flexDirection: 'column'
    },

    '.welcomeActions .btn': {
      width: '100%'
    }

  }

});

/* =========================================================
   NESTLINK DASHBOARD SHELL UPGRADE
   Shared header improvements for all portals
========================================================= */

const dashboardShellStyles = document.createElement('style');

dashboardShellStyles.textContent = `

  /* =====================================================
     MAIN DASHBOARD HEADER
  ====================================================== */

  .dashHeader {
    position: sticky;
    top: 0;
    z-index: 1000;

    display: grid;
    grid-template-columns: auto minmax(0, 1fr) auto;
    align-items: center;

    min-height: 78px;

    padding: 12px clamp(20px, 4vw, 56px);

    background: #002147;
    color: #ffffff;

    border-bottom: 3px solid #D4AF37;

    box-shadow:
      0 4px 18px rgba(0, 33, 71, 0.18);
  }


  /* =====================================================
     BRAND
  ====================================================== */

  .dashBrand {
    display: flex;
    align-items: center;
    gap: 12px;

    min-width: 230px;
  }

  .crestMini {
    width: 46px;
    height: 48px;

    flex-shrink: 0;

    display: grid;
    place-items: center;

    background: #D4AF37;
    color: #002147;

    border: 2px solid rgba(255,255,255,.95);
    border-radius: 7px;

    font-size: 15px;
    font-weight: 900;

    box-shadow:
      0 3px 10px rgba(0,0,0,.15);
  }

  .dashBrand b {
    display: block;

    color: #ffffff;

    font-size: 19px;
    font-weight: 800;

    line-height: 1.1;

    white-space: nowrap;
  }

  .dashBrand b span {
    color: #D4AF37;
  }

  .dashBrand small {
    display: block;

    margin-top: 4px;

    color: rgba(255,255,255,.68);

    font-size: 10px;

    white-space: nowrap;
  }


  /* =====================================================
     NAVIGATION
  ====================================================== */

  .nav {
    min-width: 0;

    display: flex;
    align-items: center;
    justify-content: center;

    gap: 5px;

    padding: 0 18px;

    flex-wrap: nowrap;
  }

  .nav button {
    flex-shrink: 0;

    min-height: 40px;

    padding: 9px 13px;

    border: 0;
    border-radius: 8px;

    background: transparent;

    color: rgba(255,255,255,.78);

    font-size: 12px;
    font-weight: 700;

    white-space: nowrap;

    cursor: pointer;

    transition:
      background .18s ease,
      color .18s ease,
      transform .18s ease;
  }

  .nav button:hover {
    background: rgba(255,255,255,.09);
    color: #ffffff;
  }

  .nav button.active {
    background: #D4AF37;
    color: #002147;

    box-shadow:
      0 3px 10px rgba(0,0,0,.14);
  }


  /* =====================================================
     USER AREA
  ====================================================== */

  .dashUser {
    display: flex;
    align-items: center;
    justify-content: flex-end;

    gap: 14px;

    min-width: 215px;

    text-align: right;
  }

  .dashUser > div {
    min-width: 0;
  }

  .dashUser strong {
    display: block;

    color: #ffffff;

    font-size: 13px;

    white-space: nowrap;
  }

  .dashUser small {
    display: block;

    max-width: 145px;

    margin-top: 2px;

    overflow: hidden;

    color: rgba(255,255,255,.62);

    font-size: 10px;

    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .dashUser .btn {
    flex-shrink: 0;

    min-height: 38px;

    padding: 8px 14px;

    border: 0;

    background: #D4AF37;
    color: #002147;

    font-size: 12px;
    font-weight: 800;

    box-shadow: none;
  }

  .dashUser .btn:hover {
    background: #E2BD40;

    transform: none;

    box-shadow: none;
  }


  /* =====================================================
     MAIN CONTENT
  ====================================================== */

  .container {
    width: min(1240px, calc(100% - 40px));

    margin: 30px auto 60px;
  }


  /* =====================================================
     TABLET
  ====================================================== */

  @media (max-width: 1050px) {

    .dashHeader {
      grid-template-columns: auto 1fr;
      gap: 10px 20px;

      padding: 12px 24px;
    }

    .dashBrand {
      min-width: 0;
    }

    .dashUser {
      min-width: 0;
    }

    .nav {
      grid-column: 1 / -1;
      grid-row: 2;

      justify-content: flex-start;

      width: 100%;

      padding: 4px 0 0;

      overflow-x: auto;

      scrollbar-width: none;
    }

    .nav::-webkit-scrollbar {
      display: none;
    }

  }


  /* =====================================================
     MOBILE
  ====================================================== */

  @media (max-width: 650px) {

    .dashHeader {
      position: relative;

      grid-template-columns: 1fr auto;

      padding: 12px 16px;
    }

    .dashBrand {
      min-width: 0;
    }

    .crestMini {
      width: 40px;
      height: 42px;

      font-size: 13px;
    }

    .dashBrand b {
      font-size: 17px;
    }

    .dashBrand small {
      max-width: 170px;

      overflow: hidden;

      text-overflow: ellipsis;
    }

    .dashUser {
      min-width: 0;
    }

    .dashUser > div {
      display: none;
    }

    .dashUser .btn {
      padding: 8px 11px;

      font-size: 11px;
    }

    .nav {
      margin-top: 3px;
    }

    .nav button {
      min-height: 37px;

      padding: 8px 11px;

      font-size: 11px;
    }

    .container {
      width: min(100% - 24px, 1240px);

      margin-top: 20px;
    }

  }


  /* =====================================================
     VERY SMALL PHONES
  ====================================================== */

  @media (max-width: 420px) {

    .dashHeader {
      padding-left: 12px;
      padding-right: 12px;
    }

    .dashBrand small {
      display: none;
    }

    .crestMini {
      width: 37px;
      height: 39px;
    }

    .dashBrand b {
      font-size: 15px;
    }

  }

`;

document.head.appendChild(dashboardShellStyles);