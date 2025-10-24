import { chatbotService } from "../services/chatbot.service.js";

export const chatbotController = {
  async chat(req, res) {
    try {
      const { message } = req.body;
      if (!message) return res.status(400).json({ error: "Message is required" });

      const reply = await chatbotService.getResponse(message);
      res.json({ reply });
    } catch (error) {
      console.error("Chatbot error:", error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  },
};
