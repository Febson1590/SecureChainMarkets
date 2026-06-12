/* One-off generator for the client handover manual (.docx). */
const fs = require("fs");
const {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, LevelFormat, HeadingLevel, BorderStyle, WidthType,
  ShadingType, Header, Footer, PageNumber, PageBreak, ExternalHyperlink,
} = require("docx");

const BRAND = "2B6BFF";
const border = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const borders = { top: border, bottom: border, left: border, right: border };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

const P = (text, opts = {}) =>
  new Paragraph({ spacing: { after: 120 }, ...opts, children: [new TextRun({ text, ...opts.run })] });

const H1 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun(text)] });
const H2 = (text) => new Paragraph({ heading: HeadingLevel.HEADING_2, children: [new TextRun(text)] });

const bullet = (text, bold = null) =>
  new Paragraph({
    numbering: { reference: "bullets", level: 0 },
    spacing: { after: 60 },
    children: bold
      ? [new TextRun({ text: bold + " — ", bold: true }), new TextRun(text)]
      : [new TextRun(text)],
  });

function headerCell(text, width) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA },
    shading: { fill: "EAF1FF", type: ShadingType.CLEAR }, margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text, bold: true })] })],
  });
}
function cell(text, width, mono = false) {
  return new TableCell({
    borders, width: { size: width, type: WidthType.DXA }, margins: cellMargins,
    children: [new Paragraph({ children: [new TextRun({ text, font: mono ? "Consolas" : undefined, size: mono ? 20 : undefined })] })],
  });
}

/* ── Accounts table ──────────────────────────────────────────────── */
const colW = [2100, 2600, 2660, 2000]; // sums to 9360
const accountsRows = [
  new TableRow({ children: [headerCell("Service", colW[0]), headerCell("Where", colW[1]), headerCell("Login / Identifier", colW[2]), headerCell("Password", colW[3])] }),
  ...[
    ["Website Admin Panel", "securechainmarkets.com/login", "admin@securechainmarkets.com", ""],
    ["Support Mailbox (Zoho Mail)", "mail.zoho.eu", "support@securechainmarkets.com", ""],
    ["Live Chat (tawk.to)", "dashboard.tawk.to", "support@securechainmarkets.com", ""],
    ["Transactional Email (Resend)", "resend.com", "securechainmarkets@proton.me", ""],
    ["Hosting, Domain & DNS (Vercel)", "vercel.com", "GitHub login: Febson1590", ""],
    ["Source Code (GitHub)", "github.com/Febson1590/SecureChainMarkets", "Febson1590", ""],
    ["Database (Neon Postgres)", "neon.tech", "(connection string in Vercel env vars)", ""],
    ["Master Email (Proton Mail)", "proton.me", "securechainmarkets@proton.me", ""],
  ].map(([a, b, c, d]) => new TableRow({ children: [cell(a, colW[0]), cell(b, colW[1], true), cell(c, colW[2], true), cell(d, colW[3])] })),
];

/* ── Admin sections ──────────────────────────────────────────────── */
const sections = [
  ["Dashboard (Overview)", "The landing page after login. Shows live platform statistics at a glance: total and active users, pending deposits, pending withdrawals, open support tickets, and pending KYC checks. Use it each morning to see what needs attention."],
  ["Users", "The full member list with search. Click any user to open their profile: adjust wallet balances (add, subtract or set, with a reason that appears on the user's statement), change account status (Active / Restricted / Frozen / Suspended), send the user a notification, or review their activity. This is the page you will use most."],
  ["Investments", "Two tabs. 'Plans' is the catalogue of investment products users can buy (create, edit, activate or deactivate plans, set profit ranges and durations). 'Users' lists every running investment: edit terms, add funds, pause or resume, book a manual profit or loss with the amber P/L button, and End Trade to close it and release principal plus profit to the user's balance."],
  ["Copy Traders", "Manage the expert traders users can copy: create or edit trader profiles (photo, country, win rate, profit ranges), assign a copy trade to a user, book a manual profit or loss with the P/L button, and End Trade to close a copy and pay the user out."],
  ["Transactions", "A read-only ledger of every money movement on the platform — deposits, withdrawals, adjustments, profits. Use it to investigate any balance question."],
  ["Deposits", "The review queue for user deposits. Each request shows the amount, payment proof and user. Approve to credit the user's balance, or Reject with a reason (the user is emailed either way). A request can only be processed once."],
  ["Deposit Wallets", "The crypto addresses shown to users when they deposit. Add one wallet per asset and network (BTC, ETH, USDT...). IMPORTANT: these must be real addresses you control — users send funds to them."],
  ["Withdrawals", "The review queue for withdrawal requests. The requested amount is already reserved from the user's balance when the request is made. Approve to confirm (then send the funds externally to the user's wallet or bank details shown), or Reject to automatically refund the reservation."],
  ["Limits", "Platform-wide financial settings: minimum and maximum deposit and withdrawal amounts, withdrawal fees (percent and fixed), and the processing-time text users see."],
  ["KYC / Verification", "Identity document review queue. Open a submission to view the document, then Approve or Reject with a note. Users must be approved here before they can deposit, invest or withdraw."],
  ["Support", "Legacy ticket view (historic tickets only). Day-to-day support now happens in the Zoho inbox (support@securechainmarkets.com) and the tawk.to live chat dashboard."],
  ["Notifications", "Broadcast a notification to one user or every user at once (shown in their dashboard bell menu). Use for maintenance notices and announcements."],
  ["Security", "Change the admin account password. Do this immediately after handover."],
];

const sectionContent = sections.flatMap(([name, desc]) => [
  new Paragraph({
    spacing: { before: 160, after: 60 },
    children: [new TextRun({ text: name, bold: true, color: BRAND, size: 24 })],
  }),
  P(desc),
]);

/* ── Document ────────────────────────────────────────────────────── */
const doc = new Document({
  styles: {
    default: { document: { run: { font: "Arial", size: 22 } } },
    paragraphStyles: [
      { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 32, bold: true, font: "Arial", color: "0A1A3A" },
        paragraph: { spacing: { before: 280, after: 160 }, outlineLevel: 0 } },
      { id: "Heading2", name: "Heading 2", basedOn: "Normal", next: "Normal", quickFormat: true,
        run: { size: 26, bold: true, font: "Arial", color: "0A1A3A" },
        paragraph: { spacing: { before: 200, after: 120 }, outlineLevel: 1 } },
    ],
  },
  numbering: {
    config: [
      { reference: "bullets",
        levels: [{ level: 0, format: LevelFormat.BULLET, text: "•", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
      { reference: "steps",
        levels: [{ level: 0, format: LevelFormat.DECIMAL, text: "%1.", alignment: AlignmentType.LEFT,
          style: { paragraph: { indent: { left: 720, hanging: 360 } } } }] },
    ],
  },
  sections: [{
    properties: {
      page: { size: { width: 12240, height: 15840 }, margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 } },
    },
    headers: {
      default: new Header({ children: [new Paragraph({
        children: [
          new TextRun({ text: "SecureChainMarkets — Operations Manual (Confidential)", bold: true, color: BRAND, size: 18 }),
        ],
      })] }),
    },
    footers: {
      default: new Footer({ children: [new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "SecureChainMarkets · June 2026", size: 18, color: "64748B" })],
      })] }),
    },
    children: [
      /* Title */
      new Paragraph({ spacing: { before: 2400, after: 200 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "SecureChainMarkets", bold: true, size: 56, color: "0A1A3A" })] }),
      new Paragraph({ spacing: { after: 120 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Platform Handover & Admin Operations Manual", size: 30, color: BRAND })] }),
      new Paragraph({ spacing: { after: 80 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "June 2026 · Version 1.0", size: 22, color: "64748B" })] }),
      new Paragraph({ spacing: { before: 1200 }, alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "CONFIDENTIAL — contains account access information.", italics: true, size: 20, color: "B91C1C" })] }),
      new Paragraph({ alignment: AlignmentType.CENTER,
        children: [new TextRun({ text: "Share only with authorised platform operators.", italics: true, size: 20, color: "B91C1C" })] }),
      new Paragraph({ children: [new PageBreak()] }),

      /* 1. Accounts */
      H1("1. Accounts & Login Details"),
      P("Everything that runs the platform is listed below. Passwords are intentionally left blank in this document — fill them in by hand or share them through a password manager, never by plain email or chat."),
      new Table({ width: { size: 9360, type: WidthType.DXA }, columnWidths: colW, rows: accountsRows }),
      new Paragraph({ spacing: { before: 160, after: 60 }, children: [new TextRun({ text: "What each account is for", bold: true })] }),
      bullet("Day-to-day platform management (users, deposits, withdrawals, KYC).", "Website Admin Panel"),
      bullet("Receives all customer email and the automated admin alerts (new registration, new deposit, new withdrawal, new KYC). Check it daily.", "Zoho Mail"),
      bullet("Answer website live-chat messages. Install the free tawk.to mobile app for push notifications on the go.", "tawk.to"),
      bullet("Sends the platform's automated emails (login codes, deposit/withdrawal confirmations). Rarely needs touching.", "Resend"),
      bullet("Hosting, the securechainmarkets.com domain, DNS and environment variables. The site deploys automatically when code is pushed to GitHub.", "Vercel"),
      bullet("The website source code.", "GitHub"),
      bullet("The platform database. Accessed via the connection string stored in Vercel; no separate login needed day-to-day.", "Neon"),
      bullet("The master email used to register tawk.to and Resend. Guard it carefully — it can reset those accounts.", "Proton Mail"),
      new Paragraph({ spacing: { before: 160 }, children: [new TextRun({ text: "First things to do after handover:", bold: true })] }),
      new Paragraph({ numbering: { reference: "steps", level: 0 }, spacing: { after: 60 }, children: [new TextRun("Log into the Admin Panel and change the admin password (Admin → Security).")] }),
      new Paragraph({ numbering: { reference: "steps", level: 0 }, spacing: { after: 60 }, children: [new TextRun("Change the passwords for Zoho, tawk.to, Resend, Proton and Vercel/GitHub, or transfer those accounts to your own email.")] }),
      new Paragraph({ numbering: { reference: "steps", level: 0 }, spacing: { after: 60 }, children: [new TextRun("Add your real deposit wallet addresses (Admin → Deposit Wallets) before announcing the platform.")] }),
      new Paragraph({ children: [new PageBreak()] }),

      /* 2. Admin guide */
      H1("2. Admin Dashboard Guide"),
      P("Log in at securechainmarkets.com/login with the admin account — you are taken straight to the admin panel at /admin. The left sidebar contains every section, grouped exactly as below."),
      ...sectionContent,
      new Paragraph({ children: [new PageBreak()] }),

      /* 3. Daily flows */
      H1("3. The Three Everyday Workflows"),
      H2("Approving a deposit"),
      new Paragraph({ numbering: { reference: "steps", level: 0 }, spacing: { after: 60 }, children: [new TextRun("You receive a 'New Deposit Request' email at support@ (and see it on the admin Dashboard).")] }),
      new Paragraph({ numbering: { reference: "steps", level: 0 }, spacing: { after: 60 }, children: [new TextRun("Open Admin → Deposits, check the payment proof the user uploaded.")] }),
      new Paragraph({ numbering: { reference: "steps", level: 0 }, spacing: { after: 60 }, children: [new TextRun("Click Approve — the user's balance is credited and they are emailed automatically. Or Reject with a reason.")] }),
      H2("Processing a withdrawal"),
      new Paragraph({ numbering: { reference: "steps", level: 0 }, spacing: { after: 60 }, children: [new TextRun("You receive a 'New Withdrawal Request' email. The amount is already reserved from the user's balance.")] }),
      new Paragraph({ numbering: { reference: "steps", level: 0 }, spacing: { after: 60 }, children: [new TextRun("Open Admin → Withdrawals and check the destination (crypto address or bank details).")] }),
      new Paragraph({ numbering: { reference: "steps", level: 0 }, spacing: { after: 60 }, children: [new TextRun("Send the funds externally from your own wallet/bank, then click Approve. If anything looks wrong, Reject — the reserved amount is refunded to the user automatically.")] }),
      H2("Reviewing a KYC submission"),
      new Paragraph({ numbering: { reference: "steps", level: 0 }, spacing: { after: 60 }, children: [new TextRun("You receive a 'New KYC Submission' email.")] }),
      new Paragraph({ numbering: { reference: "steps", level: 0 }, spacing: { after: 60 }, children: [new TextRun("Open Admin → KYC / Verification and view the submitted document.")] }),
      new Paragraph({ numbering: { reference: "steps", level: 0 }, spacing: { after: 60 }, children: [new TextRun("Approve (unlocks deposits, investing and withdrawals for that user) or Reject with a note.")] }),

      /* 4. Support channels */
      H1("4. Customer Support Channels"),
      bullet("Bubble on every public page and the user dashboard. Answer at dashboard.tawk.to or in the tawk.to mobile app. Offline messages are saved for you.", "Live chat"),
      bullet("All 'Contact Support' buttons on the site open the visitor's email app addressed to support@securechainmarkets.com. Replies to any platform email also arrive there. Answer from mail.zoho.eu.", "Email"),
      bullet("Registration, deposit, withdrawal and KYC events each send an alert email to support@ with a button straight into the right admin queue.", "Automated alerts"),

      /* 5. Technical reference */
      H1("5. Technical Reference (for your developer)"),
      bullet("Next.js (App Router) + Prisma + Neon Postgres, hosted on Vercel.", "Stack"),
      bullet("Push to the main branch on GitHub and Vercel deploys automatically in about two minutes.", "Deploys"),
      bullet("Set in Vercel → Project → Settings → Environment Variables (database, email keys, auth secret). After changing one, redeploy.", "Environment variables"),
      bullet("Managed in Vercel DNS. Email DNS (Zoho MX/SPF/DKIM, Resend DKIM) is already configured — do not delete those records.", "Domain & DNS"),
      bullet("Outbound email uses Resend from noreply@securechainmarkets.com with replies going to support@. Inbound email is Zoho Mail (5 GB plan, renews 11 June 2027). Live chat is tawk.to (free plan).", "Email & chat services"),
    ],
  }],
});

Packer.toBuffer(doc).then((buf) => {
  const out = process.argv[2] || "SecureChainMarkets-Handover-Manual.docx";
  fs.writeFileSync(out, buf);
  console.log("written:", out, buf.length, "bytes");
});
