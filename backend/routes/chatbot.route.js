import express from "express";
import { chatbotController } from "../controllers/chatbot.controller.js";

const router = express.Router();

router.post("/", chatbotController.chat);

export default router;
