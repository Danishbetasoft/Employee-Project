
import express from "express";
import pool from "../db.js";

const router = express.Router();

router.get("/track-open/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      `INSERT INTO mail_events (form_id, event_type) 
       SELECT id, 'opened' FROM mail_records WHERE tracking_id = ?`,
      [id]
    );

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
    res.status(500).end();
  }
});

router.get("/track-click/:id", async (req, res) => {
  const { id } = req.params;

  try {
    await pool.query(
      `INSERT INTO mail_events (form_id, event_type) 
       SELECT id, 'clicked' FROM mail_records WHERE tracking_id = ?`,
      [id]
    );

    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(`${frontendUrl}/view/${id}`);
  } catch (err) {
    console.error("Click tracking error:", err);
    res.status(500).send("Error logging click");
  }
});

export default router;
