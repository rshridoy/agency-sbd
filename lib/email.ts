import { Resend } from "resend";

export interface EmailPayload {
  to: string;
  subject: string;
  html: string;
  text?: string;
}

export async function sendEmail(payload: EmailPayload): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    console.log("[EMAIL] No RESEND_API_KEY — logging instead:", {
      to: payload.to,
      subject: payload.subject,
    });
    return;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: process.env.EMAIL_FROM || "Siren Communication <noreply@sirenbd.com>",
    to: payload.to,
    subject: payload.subject,
    html: payload.html,
    text: payload.text,
  });
}

export function leadNotificationHtml(lead: {
  name: string;
  phone: string;
  email?: string | null;
  message?: string | null;
  source: string;
}): string {
  return `
    <!DOCTYPE html>
    <html>
    <body style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #0d9488;">New Lead — Siren Communication</h2>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px; font-weight: bold;">Name</td><td style="padding: 8px;">${lead.name}</td></tr>
        <tr style="background:#f5f5f5;"><td style="padding: 8px; font-weight: bold;">Phone</td><td style="padding: 8px;"><a href="tel:${lead.phone}">${lead.phone}</a></td></tr>
        ${lead.email ? `<tr><td style="padding: 8px; font-weight: bold;">Email</td><td style="padding: 8px;">${lead.email}</td></tr>` : ""}
        ${lead.message ? `<tr style="background:#f5f5f5;"><td style="padding: 8px; font-weight: bold;">Message</td><td style="padding: 8px;">${lead.message}</td></tr>` : ""}
        <tr><td style="padding: 8px; font-weight: bold;">Source</td><td style="padding: 8px;">${lead.source}</td></tr>
        <tr style="background:#f5f5f5;"><td style="padding: 8px; font-weight: bold;">Time</td><td style="padding: 8px;">${new Date().toLocaleString()}</td></tr>
      </table>
      <p style="color: #666; font-size: 12px; margin-top: 20px;">Siren Communication Admin System</p>
    </body>
    </html>
  `;
}
