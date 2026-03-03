import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(request: NextRequest) {
  try {
    const { name, email, phone, age } = await request.json();

    if (!name || !email || !phone) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.gmail.com";
    const smtpPort = parseInt(process.env.SMTP_PORT || "587");
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const managementEmail = "mgmt@leetssports.com";

    if (!smtpUser || !smtpPassword) {
      console.error("SMTP credentials not configured");
      return NextResponse.json(
        { error: "Email service not configured" },
        { status: 500 }
      );
    }

    const transporter = nodemailer.createTransport({
      host: smtpHost,
      port: smtpPort,
      secure: smtpPort === 465,
      auth: {
        user: smtpUser,
        pass: smtpPassword,
      },
    });

    const mailOptions = {
      from: `"Leets Sports CRM" <${smtpUser}>`,
      to: managementEmail,
      subject: "New Customer Registration - Leets Sports",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #EA553B, #C85A2A); padding: 20px; text-align: center;">
            <h1 style="color: white; margin: 0;">New Customer Registration</h1>
          </div>
          
          <div style="padding: 20px; background: #f9f9f9;">
            <p style="color: #333; font-size: 16px;">A new customer has registered on Leets Sports CRM.</p>
            
            <table style="width: 100%; border-collapse: collapse; margin-top: 20px;">
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: #555;">Full Name</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #333;">${name}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: #555;">Email</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #333;">${email}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: #555;">Phone</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #333;">${phone}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: #555;">Age</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #333;">${age || "Not provided"}</td>
              </tr>
              <tr>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; font-weight: bold; color: #555;">Registration Time</td>
                <td style="padding: 10px; border-bottom: 1px solid #ddd; color: #333;">${new Date().toLocaleString()}</td>
              </tr>
            </table>
            
            <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border-radius: 5px;">
              <p style="margin: 0; color: #856404; font-size: 14px;">
                <strong>Action Required:</strong> Please review this new customer in the CRM dashboard.
              </p>
            </div>
          </div>
          
          <div style="padding: 15px; text-align: center; background: #333; color: white; font-size: 12px;">
            <p style="margin: 0;">Leets Sports CRM - Automated Notification</p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Email send error:", error);
    return NextResponse.json(
      { error: "Failed to send notification" },
      { status: 500 }
    );
  }
}
