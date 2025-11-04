
import { Router } from 'express';
import { MailService } from "../services/mailcontroller.js";

const router = Router();
const mailcontroller = new MailService()

router.post("/send", (req, res) => mailcontroller.sendMail(req, res));

export default router;
