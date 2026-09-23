window.Theme = {
  primary: '#002147',
  primaryDark: '#00172F',
  primaryLight: '#0B3A68',

  gold: '#D4AF37',
  goldDark: '#B8941F',
  goldLight: '#F4E7AD',

  bg: '#F4F6F9',
  surface: '#FFFFFF',
  surfaceSoft: '#F8FAFC',

  text: '#172033',
  heading: '#0F172A',
  muted: '#667085',

  danger: '#B42318',
  dangerBg: '#FEF3F2',

  success: '#067647',
  successBg: '#ECFDF3',

  warning: '#B54708',
  warningBg: '#FFFAEB',

  info: '#175CD3',
  infoBg: '#EFF8FF',

  border: '#D9E0EA',
  borderSoft: '#EAECF0',

  shadow:
    '0 1px 3px rgba(16,24,40,.06), 0 1px 2px rgba(16,24,40,.04)',

  shadowMd:
    '0 8px 24px rgba(16,24,40,.08)',

  radius: '12px',
  radiusLg: '18px'
};


window.injectStyles = function (styles) {
  const style = document.createElement('style');

  style.textContent = Object.entries(styles)
    .map(([selector, rules]) => {
      const css = Object.entries(rules)
        .map(([property, value]) => {
          const cssProperty = property.replace(
            /[A-Z]/g,
            match => '-' + match.toLowerCase()
          );

          return `${cssProperty}:${value}`;
        })
        .join(';');

      return `${selector}{${css}}`;
    })
    .join('\n');

  document.head.appendChild(style);
};


injectStyles({

  /* =====================================================
     RESET
  ====================================================== */

  '*': {
    boxSizing: 'border-box'
  },

  'html': {
    minHeight: '100%',
    background: Theme.bg
  },

  'body': {
    margin: '0',
    minHeight: '100vh',
    fontFamily:
      'Inter, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    background: Theme.bg,
    color: Theme.text,
    lineHeight: '1.5',
    WebkitFontSmoothing: 'antialiased'
  },

  '#app': {
    minHeight: '100vh'
  },


  /* =====================================================
     TYPOGRAPHY
  ====================================================== */

  'h1,h2,h3,h4,h5,h6': {
    marginTop: '0',
    color: Theme.heading,
    lineHeight: '1.2',
    fontWeight: '700'
  },

  'h1': {
    fontSize: 'clamp(1.75rem,3vw,2.25rem)',
    letterSpacing: '-.03em'
  },

  'h2': {
    fontSize: '1.35rem',
    letterSpacing: '-.015em'
  },

  'h3': {
    fontSize: '1.05rem'
  },

  'p': {
    lineHeight: '1.65'
  },

  'a': {
    color: Theme.primary,
    textDecoration: 'none'
  },

  '.muted': {
    color: Theme.muted,
    fontSize: '.9rem'
  },

  '.eyebrow': {
    margin: '0 0 8px',
    color: Theme.primary,
    fontSize: '.78rem',
    fontWeight: '800',
    letterSpacing: '.08em',
    textTransform: 'uppercase'
  },


  /* =====================================================
     BUTTONS
  ====================================================== */

  'button': {
    font: 'inherit'
  },

  '.btn': {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
    minHeight: '40px',
    padding: '9px 16px',
    border: `1px solid ${Theme.border}`,
    borderRadius: '9px',
    background: Theme.white || Theme.surface,
    color: Theme.primary,
    fontSize: '.9rem',
    fontWeight: '700',
    lineHeight: '1',
    cursor: 'pointer',
    transition:
      'background .18s ease,border-color .18s ease,transform .18s ease,box-shadow .18s ease'
  },

  '.btn:hover': {
    borderColor: Theme.primary,
    background: '#F8FAFC'
  },

  '.btn:active': {
    transform: 'translateY(1px)'
  },

  '.btn.primary': {
    borderColor: Theme.primary,
    background: Theme.primary,
    color: '#FFFFFF'
  },

  '.btn.primary:hover': {
    borderColor: Theme.primaryLight,
    background: Theme.primaryLight
  },

  '.btn.gold': {
    borderColor: Theme.gold,
    background: Theme.gold,
    color: Theme.primaryDark
  },

  '.btn.gold:hover': {
    borderColor: Theme.goldDark,
    background: Theme.goldDark
  },

  '.btn.danger': {
    borderColor: '#FDA29B',
    background: Theme.dangerBg,
    color: Theme.danger
  },

  '.actions': {
    display: 'flex',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '10px'
  },


  /* =====================================================
     FORMS
  ====================================================== */

  'input,select,textarea': {
    width: '100%',
    font: 'inherit',
    color: Theme.text,
    background: '#FFFFFF',
    border: `1px solid ${Theme.border}`,
    borderRadius: '9px',
    outline: 'none',
    transition:
      'border-color .18s ease,box-shadow .18s ease'
  },

  'input,select': {
    minHeight: '44px',
    padding: '9px 12px'
  },

  'textarea': {
    padding: '11px 12px',
    resize: 'vertical',
    lineHeight: '1.5'
  },

  'input:focus,select:focus,textarea:focus': {
    borderColor: Theme.primaryLight,
    boxShadow: '0 0 0 3px rgba(0,33,71,.10)'
  },

  'label': {
    display: 'grid',
    gap: '7px',
    color: Theme.text,
    fontSize: '.88rem',
    fontWeight: '650'
  },

  '.form-grid': {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit,minmax(180px,1fr))',
    gap: '16px'
  },


  /* =====================================================
     PAGE STRUCTURE
  ====================================================== */

  '.page-head': {
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: '24px',
    marginBottom: '24px'
  },

  '.page-head h1': {
    margin: '0 0 8px'
  },

  '.page-head p:not(.eyebrow)': {
    maxWidth: '720px',
    margin: '0',
    color: Theme.muted
  },

  '.section-head': {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: '20px',
    marginBottom: '20px'
  },

  '.section-head h2': {
    margin: '0 0 5px'
  },

  '.section-head p': {
    margin: '0',
    color: Theme.muted
  },


  /* =====================================================
     CARDS
  ====================================================== */

  '.card': {
    marginBottom: '20px',
    padding: '24px',
    background: Theme.surface,
    border: `1px solid ${Theme.borderSoft}`,
    borderRadius: Theme.radiusLg,
    boxShadow: Theme.shadow
  },

  '.card h2': {
    marginBottom: '8px'
  },

  '.content-grid': {
    display: 'grid',
    gridTemplateColumns:
      'minmax(0,1.65fr) minmax(280px,.85fr)',
    gap: '20px',
    alignItems: 'start'
  },


  /* =====================================================
     DASHBOARD STATISTICS
  ====================================================== */

  '.stats': {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit,minmax(170px,1fr))',
    gap: '16px',
    marginBottom: '24px'
  },

  '.stat': {
    position: 'relative',
    minHeight: '135px',
    padding: '20px',
    overflow: 'hidden',
    background: Theme.surface,
    border: `1px solid ${Theme.borderSoft}`,
    borderRadius: Theme.radius,
    boxShadow: Theme.shadow
  },

  '.stat::before': {
    content: '""',
    position: 'absolute',
    top: '0',
    left: '0',
    width: '4px',
    height: '100%',
    background: Theme.gold
  },

  '.stat span': {
    display: 'block',
    marginBottom: '12px',
    color: Theme.muted,
    fontSize: '.82rem',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '.035em'
  },

  '.stat strong': {
    display: 'block',
    marginBottom: '6px',
    color: Theme.primary,
    fontSize: '2rem',
    lineHeight: '1',
    fontWeight: '800'
  },

  '.stat small': {
    color: Theme.muted,
    fontSize: '.82rem'
  },


  /* =====================================================
     QUICK ACTION / WORKFLOW CARDS
  ====================================================== */

  '.quick-grid': {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit,minmax(190px,1fr))',
    gap: '14px'
  },

  '.quick-card': {
    padding: '18px',
    background: Theme.surfaceSoft,
    border: `1px solid ${Theme.borderSoft}`,
    borderRadius: Theme.radius
  },

  '.quick-card strong': {
    display: 'block',
    marginBottom: '7px',
    color: Theme.primary,
    fontSize: '.95rem'
  },

  '.quick-card p': {
    margin: '0',
    color: Theme.muted,
    fontSize: '.88rem',
    lineHeight: '1.55'
  },


  /* =====================================================
     TABLES
  ====================================================== */

  '.table-wrap': {
    width: '100%',
    overflowX: 'auto',
    border: `1px solid ${Theme.borderSoft}`,
    borderRadius: Theme.radius
  },

  'table': {
    width: '100%',
    borderCollapse: 'collapse',
    background: '#FFFFFF'
  },

  'thead': {
    background: '#F8FAFC'
  },

  'th': {
    padding: '12px 14px',
    borderBottom: `1px solid ${Theme.border}`,
    color: '#475467',
    fontSize: '.75rem',
    fontWeight: '800',
    textAlign: 'left',
    textTransform: 'uppercase',
    letterSpacing: '.035em',
    whiteSpace: 'nowrap'
  },

  'td': {
    padding: '14px',
    borderBottom: `1px solid ${Theme.borderSoft}`,
    color: Theme.text,
    fontSize: '.88rem',
    verticalAlign: 'middle'
  },

  'tbody tr:last-child td': {
    borderBottom: '0'
  },

  'tbody tr:hover': {
    background: '#FAFBFC'
  },


  /* =====================================================
     BADGES
  ====================================================== */

  '.badge': {
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '5px 9px',
    border: '1px solid #D6E4F0',
    borderRadius: '999px',
    background: '#EFF6FC',
    color: Theme.primary,
    fontSize: '.72rem',
    fontWeight: '800',
    lineHeight: '1',
    textTransform: 'capitalize',
    whiteSpace: 'nowrap'
  },


  /* =====================================================
     DETAILS
  ====================================================== */

  '.detail-grid': {
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fit,minmax(180px,1fr))',
    gap: '12px',
    marginTop: '20px',
    marginBottom: '20px'
  },

  '.detail-grid > div': {
    padding: '14px',
    background: Theme.surfaceSoft,
    border: `1px solid ${Theme.borderSoft}`,
    borderRadius: '10px'
  },

  '.detail-grid span': {
    display: 'block',
    marginBottom: '5px',
    color: Theme.muted,
    fontSize: '.75rem',
    fontWeight: '700'
  },

  '.detail-grid strong': {
    display: 'block',
    color: Theme.heading,
    fontSize: '.9rem',
    overflowWrap: 'anywhere'
  },

  '.detail-block': {
    marginTop: '14px',
    padding: '16px',
    background: Theme.surfaceSoft,
    border: `1px solid ${Theme.borderSoft}`,
    borderRadius: '10px'
  },

  '.detail-block span': {
    display: 'block',
    marginBottom: '6px',
    color: Theme.muted,
    fontSize: '.76rem',
    fontWeight: '800',
    textTransform: 'uppercase',
    letterSpacing: '.035em'
  },

  '.detail-block p': {
    margin: '0'
  },


  /* =====================================================
     ACTION BOX
  ====================================================== */

  '.action-box': {
    marginTop: '22px',
    padding: '20px',
    background: '#FBFCFE',
    border: `1px solid ${Theme.border}`,
    borderRadius: Theme.radius
  },

  '.action-box h3': {
    marginBottom: '16px'
  },

  '.action-box label': {
    marginBottom: '14px'
  },


  /* =====================================================
     TIMELINE
  ====================================================== */

  '.timeline': {
    display: 'grid',
    gap: '0'
  },

  '.timeline-item': {
    position: 'relative',
    marginTop: '14px',
    padding: '0 0 18px 20px',
    borderLeft: `2px solid ${Theme.border}`
  },

  '.timeline-item::before': {
    content: '""',
    position: 'absolute',
    top: '3px',
    left: '-6px',
    width: '10px',
    height: '10px',
    borderRadius: '50%',
    background: Theme.gold,
    boxShadow: '0 0 0 3px #FFFFFF'
  },

  '.timeline-item strong': {
    display: 'block',
    color: Theme.heading,
    fontSize: '.9rem'
  },

  '.timeline-item p': {
    margin: '5px 0',
    color: Theme.text,
    fontSize: '.88rem'
  },

  '.timeline-item small': {
    color: Theme.muted
  },


  /* =====================================================
     EMPTY STATES
  ====================================================== */

  '.empty-state': {
    padding: '48px 20px',
    textAlign: 'center'
  },

  '.empty-state h3': {
    marginBottom: '8px',
    color: Theme.primary
  },

  '.empty-state p': {
    maxWidth: '460px',
    margin: '0 auto',
    color: Theme.muted
  },


  /* =====================================================
     FEEDBACK
  ====================================================== */

  '.success': {
    padding: '12px 14px',
    border: '1px solid #ABEFC6',
    borderRadius: '9px',
    background: Theme.successBg,
    color: Theme.success
  },

  '.error': {
    padding: '12px 14px',
    border: '1px solid #FECDCA',
    borderRadius: '9px',
    background: Theme.dangerBg,
    color: Theme.danger
  },


  /* =====================================================
     MOBILE
  ====================================================== */

  '@media (max-width:900px)': {
    display: 'none'
  }

});


/*
  injectStyles handles normal selectors.
  Responsive rules are added separately because an @media rule
  cannot be represented correctly by the simple object converter.
*/

const responsiveStyles = document.createElement('style');

responsiveStyles.textContent = `

  @media (max-width: 900px) {

    .content-grid {
      grid-template-columns: 1fr;
    }

    .page-head,
    .section-head {
      align-items: stretch;
      flex-direction: column;
    }

    .page-head .btn,
    .section-head .btn {
      align-self: flex-start;
    }

  }


  @media (max-width: 640px) {

    .card {
      padding: 18px;
      border-radius: 12px;
    }

    .stats {
      grid-template-columns: repeat(2, minmax(0, 1fr));
      gap: 10px;
    }

    .stat {
      min-height: 120px;
      padding: 16px;
    }

    .stat strong {
      font-size: 1.7rem;
    }

    .quick-grid,
    .detail-grid,
    .form-grid {
      grid-template-columns: 1fr;
    }

    .actions {
      align-items: stretch;
      flex-direction: column;
    }

    .actions .btn {
      width: 100%;
    }

  }


  @media (max-width: 420px) {

    .stats {
      grid-template-columns: 1fr;
    }

  }

`;

document.head.appendChild(responsiveStyles);