const axios = require("axios");

exports.chatBotReply = async (req, res) => {
    const { message } = req.body;

    try {
        const response = await axios.post(
            "https://openrouter.ai/api/v1/chat/completions",
            {
                model: "mistralai/mistral-7b-instruct", // or openchat/openchat-3.5
                messages: [{ role: "user", content: message }],
            },
            {
                headers: {
                    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const reply = response.data.choices[0].message.content;
        res.json({ reply });
    } catch (err) {
        console.error("OpenRouter error:", err.response?.data || err.message);
        res.status(500).json({ reply: "AI failed to respond." });
    }
};
