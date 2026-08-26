import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { appendSignupToSheet } from "@/lib/google-sheets";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone } = await request.json();

    if (!name || !email || !phone) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const signedUpAt = new Date().toLocaleString("en-GB", { timeZone: "Asia/Riyadh" });

    try {
      await appendSignupToSheet({ name, email, phone, signedUpAt });
    } catch (sheetErr) {
      console.error("Google Sheets error:", sheetErr);
    }

    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;

    if (smtpUser && smtpPassword) {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: parseInt(process.env.SMTP_PORT || "587") === 465,
        auth: { user: smtpUser, pass: smtpPassword },
      });

      await transporter.sendMail({
        from: `"Leets Sports CRM" <${smtpUser}>`,
        to: "mgmt@leetssports.com",
        subject: "New Customer Registration - Leets Sports",
        html: `
          <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;">
            <div style="background:linear-gradient(135deg,#EA553B,#C85A2A);padding:20px;text-align:center;">
              <h1 style="color:white;margin:0;">New Customer Registration</h1>
            </div>
            <div style="padding:20px;background:#f9f9f9;">
              <table style="width:100%;border-collapse:collapse;margin-top:20px;">
                <tr><td style="padding:10px;border-bottom:1px solid #ddd;font-weight:bold;color:#555;">Name</td><td style="padding:10px;border-bottom:1px solid #ddd;">${name}</td></tr>
                <tr><td style="padding:10px;border-bottom:1px solid #ddd;font-weight:bold;color:#555;">Email</td><td style="padding:10px;border-bottom:1px solid #ddd;">${email}</td></tr>
                <tr><td style="padding:10px;border-bottom:1px solid #ddd;font-weight:bold;color:#555;">Phone</td><td style="padding:10px;border-bottom:1px solid #ddd;">${phone}</td></tr>
                <tr><td style="padding:10px;border-bottom:1px solid #ddd;font-weight:bold;color:#555;">Time</td><td style="padding:10px;border-bottom:1px solid #ddd;">${signedUpAt}</td></tr>
              </table>
            </div>
            <div style="padding:15px;text-align:center;background:#333;color:white;font-size:12px;">
              <p style="margin:0;">Leets Sports CRM - Automated Notification</p>
            </div>
          </div>
        `,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("signup-notify error:", error);
    return NextResponse.json({ error: "Notification failed" }, { status: 500 });
  }
}
