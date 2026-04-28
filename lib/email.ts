import "server-only";
import { Resend } from "resend";

// ─── Resend client ────────────────────────────────────────────────────────────
const resend = new Resend(process.env.RESEND_API_KEY);

// ─── Hosted assets ────────────────────────────────────────────────────────────
const APP_URL  = process.env.NEXT_PUBLIC_APP_URL || "https://securechainmarkets.vercel.app";
const LOGO_URL = `${APP_URL}/assets/logos/securechainmarkets-logo.png`;

// ─── HTML template ────────────────────────────────────────────────────────────
function buildVerificationEmail(opts: {
  name:    string;
  code:    string;
  type:    "REGISTER" | "LOGIN";
}): string {
  const { name, code, type } = opts;

  const title   = type === "REGISTER" ? "Verify your SecureChainMarkets account" : "Your SecureChainMarkets login code";
  const heading = type === "REGISTER" ? "Email Verification"                   : "Login Verification";
  const message = type === "REGISTER"
    ? "Use the code below to verify your email and activate your SecureChainMarkets account."
    : "A sign-in was attempted on your account. Use the code below to complete your login.";

  // Render each digit as its own bordered cell for perfect spacing in mail clients
  const digitCells = code
    .split("")
    .map(
      (d) => `<td align="center" style="padding:0 4px;">
        <table cellpadding="0" cellspacing="0" border="0">
          <tr>
            <td align="center" style="
              width:44px;height:56px;
              background-color:#0E1A30;
              border:1px solid rgba(255,255,255,0.10);
              border-radius:10px;
              font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;
              font-size:30px;
              font-weight:700;
              color:#FFFFFF;
              letter-spacing:0;
              line-height:56px;
              mso-line-height-rule:exactly;
            ">${d}</td>
          </tr>
        </table>
      </td>`
    )
    .join("");

  return /* html */ `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="X-UA-Compatible" content="IE=edge" />
  <meta name="color-scheme" content="dark only" />
  <meta name="supported-color-schemes" content="dark only" />
  <title>${title}</title>
  <!--[if mso]>
  <noscript>
    <xml>
      <o:OfficeDocumentSettings>
        <o:PixelsPerInch>96</o:PixelsPerInch>
      </o:OfficeDocumentSettings>
    </xml>
  </noscript>
  <![endif]-->
  <style>
    :root { color-scheme: dark; }
    @media (max-width: 600px) {
      .em-content-td { padding: 32px 22px !important; }
      .em-h1         { font-size: 22px !important; }
      .em-message    { font-size: 14px !important; }
      .em-otp-cell   { width: 38px !important; height: 50px !important; line-height: 50px !important; font-size: 26px !important; }
      .em-logo       { width: 180px !important; height: auto !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#08111F;color:#E2E8F0;font-family:'Helvetica Neue',Helvetica,Arial,sans-serif;-webkit-font-smoothing:antialiased;">

  <!-- Preheader (hidden) -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#08111F;opacity:0;">
    Your SecureChainMarkets verification code is ${code}. It expires in 10 minutes.
  </div>

  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#08111F;">
    <tr>
      <td align="center" style="padding:40px 16px;background-color:#08111F;">

        <!-- Container — max 560px -->
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="max-width:560px;">

          <!-- ─── LOGO ──────────────────────────────────────────────────
               Native aspect ratio is 1774 × 887 (~2 : 1). Forcing both
               width and height was slanting the mark on most clients —
               we now set width only and let height resolve from CSS so
               every email client renders it sharp and proportional. -->
          <tr>
            <td align="center" style="padding:24px 0 32px 0;">
              <a href="${APP_URL}" target="_blank" style="text-decoration:none;display:inline-block;">
                <img
                  src="${LOGO_URL}"
                  alt="SecureChainMarkets"
                  width="220"
                  class="em-logo"
                  style="display:block;margin:0 auto;border:0;outline:none;text-decoration:none;width:220px;height:auto;max-width:80vw;object-fit:contain;"
                />
              </a>
            </td>
          </tr>

          <!-- ─── CARD ────────────────────────────────────────────────── -->
          <tr>
            <td style="
              background-color:#0E1A30;
              border:1px solid rgba(255,255,255,0.08);
              border-radius:16px;
              box-shadow:0 12px 40px rgba(0,0,0,0.45);
              overflow:hidden;
            ">

              <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td class="em-content-td" style="padding:44px 44px 40px 44px;">

                    <!-- Eyebrow -->
                    <p style="
                      margin:0 0 14px 0;
                      font-size:11px;
                      font-weight:700;
                      color:#2B6BFF;
                      text-align:center;
                      letter-spacing:0.22em;
                      text-transform:uppercase;
                    ">${heading}</p>

                    <!-- Heading -->
                    <h1 class="em-h1" style="
                      margin:0 0 14px 0;
                      font-size:26px;
                      font-weight:700;
                      color:#FFFFFF;
                      text-align:center;
                      letter-spacing:-0.4px;
                      line-height:1.25;
                    ">${type === "REGISTER" ? "Verify your email address" : "Confirm your sign-in"}</h1>

                    <!-- Message -->
                    <p class="em-message" style="
                      margin:0 0 36px 0;
                      font-size:15px;
                      line-height:1.65;
                      color:#94A3B8;
                      text-align:center;
                    ">Hi ${name}, ${message}</p>

                    <!-- OTP label -->
                    <p style="
                      margin:0 0 14px 0;
                      font-size:11px;
                      font-weight:600;
                      color:#94A3B8;
                      text-align:center;
                      letter-spacing:0.22em;
                      text-transform:uppercase;
                    ">Verification Code</p>

                    <!-- OTP digit row -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" align="center" style="margin:0 auto 18px auto;">
                      <tr>
                        ${digitCells}
                      </tr>
                    </table>

                    <!-- Expiry -->
                    <p style="
                      margin:0 0 30px 0;
                      font-size:12.5px;
                      color:#64748B;
                      text-align:center;
                      letter-spacing:0.02em;
                    ">
                      Expires in <strong style="color:#CBD5E1;font-weight:600;">10 minutes</strong> · do not share this code
                    </p>

                    <!-- Security note (subtle gold tint) -->
                    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
                      <tr>
                        <td style="
                          background-color:rgba(43,107,255,0.07);
                          border:1px solid rgba(43,107,255,0.22);
                          border-radius:10px;
                          padding:14px 18px;
                        ">
                          <p style="
                            margin:0;
                            font-size:12.5px;
                            line-height:1.6;
                            color:#CBD5E1;
                            text-align:center;
                          ">
                            <span style="color:#2B6BFF;font-weight:700;">Security notice</span>
                            &nbsp;·&nbsp; If you didn’t request this, you can safely ignore this email — your account remains secure.
                          </p>
                        </td>
                      </tr>
                    </table>

                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- ─── FOOTER ──────────────────────────────────────────────── -->
          <tr>
            <td align="center" style="padding:24px 16px 0 16px;">
              <p style="
                margin:0 0 8px 0;
                font-size:12px;
                color:#64748B;
                text-align:center;
                line-height:1.6;
              ">
                This is an automated message — please don’t reply.
              </p>
              <p style="
                margin:0;
                font-size:11px;
                color:#475569;
                text-align:center;
              ">
                &copy; ${new Date().getFullYear()} SecureChainMarkets · All rights reserved
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
}

// ─── Public API ───────────────────────────────────────────────────────────────
// Returns the Resend message ID on success, throws with a detailed message on failure.
export async function sendVerificationEmail(opts: {
  to:   string;
  name: string;
  code: string;
  type: "REGISTER" | "LOGIN";
}): Promise<string> {
  const tag = "[sendVerificationEmail]";
  const { to, name, code, type } = opts;

  const from    = process.env.EMAIL_FROM || "SecureChainMarkets <no-reply@SecureChainMarkets.com>";
  const subject = type === "REGISTER"
    ? "Verify your SecureChainMarkets account"
    : "Your SecureChainMarkets login code";

  console.log(`${tag} ── START ──────────────────────────────────────`);
  console.log(`${tag} to      : ${to}`);
  console.log(`${tag} from    : ${from}`);
  console.log(`${tag} subject : ${subject}`);
  console.log(`${tag} type    : ${type}`);
  console.log(`${tag} name    : ${name}`);
  console.log(`${tag} code    : ${code}`);

  const html = buildVerificationEmail({ name, code, type });

  const text = [
    `Hi ${name},`,
    "",
    type === "REGISTER"
      ? "Use the code below to verify your email address:"
      : "Use the code below to complete your login:",
    "",
    `Verification code: ${code}`,
    "",
    "This code expires in 10 minutes.",
    "",
    "If you did not request this, please ignore this email.",
    "",
    "— SecureChainMarkets",
  ].join("\n");

  console.log(`${tag} Calling resend.emails.send() …`);

  // The Resend SDK never throws — it returns { data, error }.
  // Not checking this return value is the silent-failure bug.
  const result = await resend.emails.send({ from, to, subject, text, html });

  console.log(`${tag} Raw Resend response:`, JSON.stringify(result));

  if (result.error) {
    // Log the full provider error so it appears in Vercel Function logs.
    console.error(`${tag} ❌ RESEND ERROR ──────────────────────────────`);
    console.error(`${tag} name    : ${result.error.name}`);
    console.error(`${tag} message : ${result.error.message}`);
    console.error(`${tag} full    :`, JSON.stringify(result.error));
    throw new Error(
      `Email provider rejected the send request. ` +
      `name="${result.error.name}" message="${result.error.message}"`
    );
  }

  const messageId = result.data?.id ?? "(no id returned)";
  console.log(`${tag} ✅ Email queued/delivered. Resend message id: ${messageId}`);
  console.log(`${tag} ── END ────────────────────────────────────────`);

  return messageId;
}
