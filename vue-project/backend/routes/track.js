import express from "express";
import { AppDataSource } from "../DB/dataSource.js"; 
import { MailRecord } from "../models/mailRecords.js";
import { MailEvent } from "../models/mailEvent.js";

const router = express.Router();

router.get("/track-open/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const mailRecordRepo = AppDataSource.getRepository(MailRecord);
    const mailEventRepo = AppDataSource.getRepository(MailEvent);

    const mailRecord = await mailRecordRepo.findOne({
      where: { tracking_id: id },
    });

    if (!mailRecord) {
      console.log("No mail record found for tracking ID:", id);
      return res.status(404).send("Tracking ID not found");
    }

    const event = mailEventRepo.create({
      user_id: mailRecord.user_id,
      event_type: "opened",
      mailRecord: mailRecord,  
    });

    await mailEventRepo.save(event);
    console.log("Open event logged for:", id);

    const img = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR4nGNgYAAAAAMAAWgmWQ0AAAAASUVORK5CYII=",
      "base64"
    );
    res.writeHead(200, {
      "Content-Type": "image/png",
      "Content-Length": img.length,
    });
    res.end(img);
  } catch (err) {
    console.error("Open tracking error:", err);
    res.status(500).send("Error logging open event");
  }
});





router.get("/track-click/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const mailRecordRepo = AppDataSource.getRepository(MailRecord);
    const mailEventRepo = AppDataSource.getRepository(MailEvent);

    const mailRecord = await mailRecordRepo.findOne({ where: { tracking_id: id } });
    if (!mailRecord) return res.status(404).send("Tracking ID not found");

    const event = mailEventRepo.create({
      user_id: mailRecord.user_id,
     
      event_type: "clicked",
      mailRecord: mailRecord, 
    });

    await mailEventRepo.save(event);
    console.log("Click event logged for:", id);
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/edit/${mailRecord.user_id}`);
  } catch (err) {
    console.error("Click tracking error:", err);
    res.status(500).send("Error logging click event");
  }
});

export default router;  
