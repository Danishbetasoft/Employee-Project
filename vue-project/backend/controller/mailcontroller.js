
import nodemailer from "nodemailer";
import dotenv from "dotenv";
import pool from "../db.js";
import crypto from "crypto";


dotenv.config();
pool.query(`use employee_db`)

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendMail = async (req, res) => {
  try {
    const { user_id, to, cc = [], bcc = [], companyName, message } = req.body;
    console.log("Received Mail Body:", req.body);
    if (!user_id || !to?.length || !companyName) {
      return res.status(400).json({ success: false, error: "Missing user_id, to, or companyName" });
    }

    const trackingId = crypto.randomUUID();
    const result = await query(
      `INSERT INTO mail_records (user_id, company_name, to_emails, cc_emails, bcc_emails, message, tracking_id)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [user_id, companyName, to.join(","), cc.join(","), bcc.join(","), message, trackingId]
    );

    const formId = result.insertId;

    const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
    const trackOpenUrl = `${backendUrl}/track-open/${trackingId}`;
    const trackClickUrl = `${backendUrl}/track-click/${trackingId}`;

    await query(
      `INSERT INTO mail_events (user_id, form_id, event_type) VALUES (?, ?, 'sent')`,
      [user_id, formId]
    );

    const html = `
      <div style="font-family:Arial,sans-serif;color:#333;">
        <h2 style="color:#1976d2;">${companyName}</h2>
        <p>${message.replace(/\n/g, "<br/>")}</p>
        <p>
          <a href="${trackClickUrl}" target="_blank"
             style="background:#1976d2;color:white;padding:10px 15px;text-decoration:none;border-radius:6px;">
            View Mail
          </a>
        </p>
        <img src="${trackOpenUrl}" width="1" height="1" style="display:none;" />
      </div>
    `;

    await transporter.sendMail({
      from: `${companyName} <${process.env.MAIL_USER}>`,
      to,
      cc,
      bcc,
      subject: `Message from ${companyName}`,
      html,
    });

    res.json({ success: true, message: "Mail sent successfully", trackingId });
  } catch (err) {
    console.error("Mail send error:", err);
    res.status(500).json({ success: false, error: "Failed to send mail" });
  }
};
