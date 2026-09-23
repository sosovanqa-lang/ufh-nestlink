const nodemailer = require('nodemailer');

const EMAIL_MODE =
  String(process.env.EMAIL_MODE || 'development')
    .trim()
    .toLowerCase();

const EMAIL_FROM =
  process.env.EMAIL_FROM ||
  'UFH NestLink <no-reply@ufh.ac.za>';


let transporter = null;


/* =========================================================
   CREATE EMAIL TRANSPORT
========================================================= */

function getTransporter() {

  if (transporter) {
    return transporter;
  }

  if (EMAIL_MODE !== 'production') {
    return null;
  }

  const host = process.env.SMTP_HOST;
  const port = Number(process.env.SMTP_PORT || 587);
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!host || !user || !pass) {

    throw new Error(
      'SMTP email configuration is incomplete.'
    );

  }

  transporter = nodemailer.createTransport({

    host,

    port,

    secure: port === 465,

    auth: {
      user,
      pass
    }

  });

  return transporter;
}


/* =========================================================
   SEND EMAIL
========================================================= */

async function sendEmail({
  to,
  subject,
  text,
  html
}) {

  if (!to) {

    console.warn(
      '[EMAIL] No recipient supplied.'
    );

    return {
      sent: false
    };

  }


  /*
     DEVELOPMENT MODE

     Emails are printed to the terminal instead of
     being sent to a real mailbox.
  */

  if (EMAIL_MODE !== 'production') {

    console.log('\n========================================');
    console.log('UFH NESTLINK EMAIL — DEVELOPMENT MODE');
    console.log('========================================');
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log('----------------------------------------');
    console.log(text || 'HTML email generated.');
    console.log('========================================\n');

    return {
      sent: false,
      development: true
    };
  }


  const mailer = getTransporter();


  const result = await mailer.sendMail({

    from: EMAIL_FROM,

    to,

    subject,

    text,

    html

  });


  return {
    sent: true,
    messageId: result.messageId
  };
}


/* =========================================================
   STANDARD UFH NESTLINK EMAIL TEMPLATE
========================================================= */

function emailTemplate({
  title,
  studentName,
  message,
  details = []
}) {

  const detailText = details
    .filter(Boolean)
    .map(item => `${item.label}: ${item.value}`)
    .join('\n');


  const text = `
UFH NestLink

${title}

Hello ${studentName || 'Student'},

${message}

${detailText}

You can sign in to UFH NestLink to view the latest status.

Regards,
UFH NestLink
Student Residence Management System
`.trim();


  const rows = details
    .filter(Boolean)
    .map(item => `
      <tr>
        <td style="
          padding:8px;
          font-weight:bold;
          border-bottom:1px solid #e5e7eb;
        ">
          ${escapeHtml(item.label)}
        </td>

        <td style="
          padding:8px;
          border-bottom:1px solid #e5e7eb;
        ">
          ${escapeHtml(item.value)}
        </td>
      </tr>
    `)
    .join('');


  const html = `
<!DOCTYPE html>

<html>

<body style="
  margin:0;
  padding:0;
  background:#f4f6f9;
  font-family:Arial,sans-serif;
  color:#1f2937;
">

  <div style="
    max-width:650px;
    margin:30px auto;
    background:#ffffff;
    border-radius:12px;
    overflow:hidden;
    border:1px solid #d9e0ea;
  ">

    <div style="
      background:#002147;
      color:#ffffff;
      padding:24px;
      border-bottom:5px solid #D4AF37;
    ">

      <div style="
        font-size:24px;
        font-weight:bold;
      ">
        UFH <span style="color:#D4AF37;">NestLink</span>
      </div>

      <div style="
        margin-top:5px;
        opacity:.85;
      ">
        Student Residence Management System
      </div>

    </div>


    <div style="padding:28px;">

      <h2 style="
        color:#002147;
        margin-top:0;
      ">
        ${escapeHtml(title)}
      </h2>

      <p>
        Hello ${escapeHtml(studentName || 'Student')},
      </p>

      <p style="line-height:1.6;">
        ${escapeHtml(message)}
      </p>


      ${
        rows
          ? `
            <table style="
              width:100%;
              border-collapse:collapse;
              margin:22px 0;
              background:#f8fafc;
            ">
              ${rows}
            </table>
          `
          : ''
      }


      <p style="
        line-height:1.6;
        color:#475467;
      ">
        Sign in to UFH NestLink to view the latest
        information about your residence request.
      </p>

    </div>


    <div style="
      background:#002147;
      color:#ffffff;
      padding:18px 28px;
      font-size:12px;
    ">

      UFH NestLink · Student Residence Management System

    </div>

  </div>

</body>

</html>
`.trim();


  return {
    text,
    html
  };
}


/* =========================================================
   HTML SAFETY
========================================================= */

function escapeHtml(value) {

  return String(value ?? '')

    .replaceAll('&', '&amp;')

    .replaceAll('<', '&lt;')

    .replaceAll('>', '&gt;')

    .replaceAll('"', '&quot;')

    .replaceAll("'", '&#039;');

}


/* =========================================================
   WORKFLOW EMAILS
========================================================= */

async function sendFaultForwardedEmail({
  studentEmail,
  studentName,
  reference,
  title
}) {

  const content = emailTemplate({

    title: 'Fault Forwarded to Maintenance',

    studentName,

    message:
      'Your residence has forwarded your fault to the Maintenance Department for attention.',

    details: [

      {
        label: 'Reference',
        value: reference
      },

      {
        label: 'Fault',
        value: title
      },

      {
        label: 'Status',
        value: 'Forwarded to Maintenance'
      }

    ]

  });


  return sendEmail({

    to: studentEmail,

    subject:
      `UFH NestLink: ${reference} forwarded to Maintenance`,

    ...content

  });

}


/* --------------------------------------------------------- */

async function sendFaultAcceptedEmail({
  studentEmail,
  studentName,
  reference,
  title
}) {

  const content = emailTemplate({

    title: 'Maintenance Fault Accepted',

    studentName,

    message:
      'The Maintenance Department has confirmed that your fault was received and accepted.',

    details: [

      {
        label: 'Reference',
        value: reference
      },

      {
        label: 'Fault',
        value: title
      },

      {
        label: 'Status',
        value: 'Accepted'
      }

    ]

  });


  return sendEmail({

    to: studentEmail,

    subject:
      `UFH NestLink: ${reference} accepted`,

    ...content

  });

}


/* --------------------------------------------------------- */

async function sendVisitScheduledEmail({
  studentEmail,
  studentName,
  reference,
  title,
  residence,
  room,
  date,
  time
}) {

  const content = emailTemplate({

    title: 'Maintenance Visit Scheduled',

    studentName,

    message:
      'The Maintenance Department has scheduled a visit to your room.',

    details: [

      {
        label: 'Reference',
        value: reference
      },

      {
        label: 'Fault',
        value: title
      },

      {
        label: 'Residence',
        value: residence
      },

      {
        label: 'Room',
        value: room
      },

      {
        label: 'Visit date',
        value: date
      },

      {
        label: 'Visit time',
        value: time
      }

    ]

  });


  return sendEmail({

    to: studentEmail,

    subject:
      `UFH NestLink: Maintenance visit scheduled for ${date}`,

    ...content

  });

}


/* --------------------------------------------------------- */

async function sendWorkStartedEmail({
  studentEmail,
  studentName,
  reference,
  title
}) {

  const content = emailTemplate({

    title: 'Maintenance Work Started',

    studentName,

    message:
      'Maintenance has started attending to your reported fault.',

    details: [

      {
        label: 'Reference',
        value: reference
      },

      {
        label: 'Fault',
        value: title
      },

      {
        label: 'Status',
        value: 'In progress'
      }

    ]

  });


  return sendEmail({

    to: studentEmail,

    subject:
      `UFH NestLink: ${reference} maintenance started`,

    ...content

  });

}


/* --------------------------------------------------------- */

async function sendWorkCompletedEmail({
  studentEmail,
  studentName,
  reference,
  title,
  resolution
}) {

  const content = emailTemplate({

    title: 'Maintenance Work Completed',

    studentName,

    message:
      'Maintenance has marked your reported fault as completed.',

    details: [

      {
        label: 'Reference',
        value: reference
      },

      {
        label: 'Fault',
        value: title
      },

      {
        label: 'Resolution',
        value: resolution
      },

      {
        label: 'Status',
        value: 'Completed'
      }

    ]

  });


  return sendEmail({

    to: studentEmail,

    subject:
      `UFH NestLink: ${reference} completed`,

    ...content

  });

}


module.exports = {

  sendEmail,

  emailTemplate,

  sendFaultForwardedEmail,

  sendFaultAcceptedEmail,

  sendVisitScheduledEmail,

  sendWorkStartedEmail,

  sendWorkCompletedEmail

};