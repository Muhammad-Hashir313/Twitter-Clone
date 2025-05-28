const express = require("express");
const router = express.Router();
const { chatBotReply } = require("../controllers/ChatbotController");

router.post("/chatBot", chatBotReply);

module.exports = router;
