import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { AppDataSource } from "../DB/dataSource.js";  

import { MailEvent } from '../models/mailEvent.js';
import { MailRecord } from '../models/mailRecords.js';
import crypto from "crypto";

dotenv.config();
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
    const mailRecord = new MailRecord();
    mailRecord.user_id = user_id;
    mailRecord.company_name = companyName;
    mailRecord.to_emails = to.join(",");
    mailRecord.cc_emails = cc.join(",");
    mailRecord.bcc_emails = bcc.join(",");
    mailRecord.message = message;
    mailRecord.tracking_id = trackingId;

    const mailRecordRepository = AppDataSource.getRepository(MailRecord);
    const savedMailRecord = await mailRecordRepository.save(mailRecord);

    const mailEvent = new MailEvent();
    mailEvent.user_id = user_id;
    mailEvent.form_id = savedMailRecord.id;
    mailEvent.event_type = 'sent';

    const mailEventRepository = AppDataSource.getRepository(MailEvent);
    await mailEventRepository.save(mailEvent);

    const backendUrl = process.env.BACKEND_URL || "http://localhost:3000";
    const trackOpenUrl = `${backendUrl}/track-open/${trackingId}`;
    const trackClickUrl = `${backendUrl}/track-click/${trackingId}`;

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
