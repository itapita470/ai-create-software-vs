require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Configuration, OpenAIApi } = require("openai");

const app = express();
const port = 3000;

// תצורת API של OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // המפתח נשמר בקובץ .env
});
const openai = new OpenAIApi(configuration);

// הגדרת middlewares
app.use(cors());
app.use(bodyParser.json());

// הנתיב שמקבל את השאלה מהלקוח
app.post("/chat", async (req, res) => {
  const userMessage = req.body.message;

  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: userMessage }],
    });

    const reply = response.data.choices[0].message.content;
    res.json({ reply }); // החזרת התשובה ללקוח
  } catch (error) {
    console.error("שגיאה:", error.message);
    res.status(500).json({ error: "שגיאה בתקשורת עם OpenAI" });
  }
});

// שרת שמאזין על פורט 3000
app.listen(port, () => {
  console.log(`השרת רץ על http://localhost:${port}`);
});
