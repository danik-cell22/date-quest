import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

/*
========================================================
PORT
========================================================
*/

const PORT = process.env.PORT || 3001;


/*
========================================================
TELEGRAM
========================================================
*/

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;


/*
========================================================
MIDDLEWARE
========================================================
*/

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type"],
  })
);

app.use(express.json());


/*
========================================================
ПРОВЕРКА TELEGRAM
========================================================
*/

if (!BOT_TOKEN) {
  console.error("❌ TELEGRAM_BOT_TOKEN не найден");
} else {
  console.log("✅ TELEGRAM_BOT_TOKEN найден");
}

if (!CHAT_ID) {
  console.error("❌ TELEGRAM_CHAT_ID не найден");
} else {
  console.log("✅ TELEGRAM_CHAT_ID найден");
}


/*
========================================================
ОТПРАВКА СООБЩЕНИЯ В TELEGRAM
========================================================
*/

async function sendTelegramMessage(text) {
  if (!BOT_TOKEN) {
    throw new Error("TELEGRAM_BOT_TOKEN не настроен");
  }

  if (!CHAT_ID) {
    throw new Error("TELEGRAM_CHAT_ID не настроен");
  }

  const url =
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;

  const response = await fetch(url, {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      chat_id: CHAT_ID,
      text: text,
    }),
  });

  const data = await response.json();

  if (!response.ok || !data.ok) {
    console.error("❌ Telegram API error:", data);

    throw new Error(
      data.description || "Ошибка Telegram API"
    );
  }

  console.log("✅ Сообщение отправлено в Telegram");

  return data;
}


/*
========================================================
ГЛАВНАЯ
========================================================
*/

app.get("/", (req, res) => {
  res.json({
    ok: true,
    message: "Date Quest Telegram server is running ❤️",
  });
});


/*
========================================================
HEALTH CHECK
========================================================
*/

app.get("/healthz", (req, res) => {
  res.json({
    ok: true,
    status: "healthy",
  });
});


/*
========================================================
TELEGRAM API
========================================================
*/

app.post("/api/telegram", async (req, res) => {
  try {
    const {
      type,
      emotion,
      answer,
      choice,
      date,
      time,
    } = req.body;

    console.log("📩 Получено событие:", {
      type,
      emotion,
      answer,
      choice,
      date,
      time,
    });


    let message = "";


    /*
    ====================================================
    EMOTION
    ====================================================
    */

    if (type === "emotion") {

      message =
`💌 НОВОЕ ПРОХОЖДЕНИЕ

Она начала проходить приглашение ❤️

💭 Её эмоции:

${emotion || "Она ничего не написала."}`;

    }


    /*
    ====================================================
    ANSWER
    ====================================================
    */

    else if (type === "answer") {

      if (answer === "газ") {

        message =
`🚀 ОНА НАЖАЛА «ГАЗ»

Похоже, у нас есть согласие на свидание ❤️`;

      } else {

        message =
`💙 ОНА НАЖАЛА «-»

Она выбрала отказаться.

Её выбор нужно уважать.`;

      }

    }


    /*
    ====================================================
    CHOICE
    ====================================================
    */

    else if (type === "choice") {

      message =
`✨ ВЫБРАНА АТМОСФЕРА

${choice || "Не указана"}

Теперь можно двигаться дальше ❤️`;

    }


    /*
    ====================================================
    FINAL
    ====================================================
    */

    else if (type === "final") {

      message =
`💕 НОВОЕ ПРЕДЛОЖЕНИЕ НА СВИДАНИЕ

━━━━━━━━━━━━━━━━━━

💭 Эмоции:

${emotion || "Не указаны"}

━━━━━━━━━━━━━━━━━━

❤️ Ответ:

${answer || "Не указан"}

━━━━━━━━━━━━━━━━━━

✨ Выбор:

${choice || "Не указан"}

━━━━━━━━━━━━━━━━━━

📅 Дата:

${date || "Не выбрана"}

🕐 Время:

${time || "Не выбрано"}

━━━━━━━━━━━━━━━━━━

💌 Она закончила прохождение сайта.

Похоже, свидание действительно состоится ❤️`;

    }


    /*
    ====================================================
    UNKNOWN
    ====================================================
    */

    else {

      return res.status(400).json({
        ok: false,
        error: "Неизвестный тип события",
      });

    }


    /*
    ====================================================
    SEND TELEGRAM
    ====================================================
    */

    await sendTelegramMessage(message);


    /*
    ====================================================
    RESPONSE
    ====================================================
    */

    return res.json({
      ok: true,
      message: "Сообщение отправлено в Telegram ❤️",
    });

  } catch (error) {

    console.error("❌ Ошибка:", error);

    return res.status(500).json({
      ok: false,
      error: "Не удалось отправить сообщение в Telegram",
    });

  }
});


/*
========================================================
404
========================================================
*/

app.use((req, res) => {
  res.status(404).json({
    ok: false,
    error: "Маршрут не найден",
  });
});


/*
========================================================
START SERVER
========================================================
*/

app.listen(PORT, "0.0.0.0", () => {

  console.log("");
  console.log("💌 ===============================");
  console.log("💌 DATE QUEST TELEGRAM SERVER");
  console.log("💌 ===============================");

  console.log(`🚀 Port: ${PORT}`);

  console.log(
    `🌍 Server: http://0.0.0.0:${PORT}`
  );

  console.log(
    `📱 Telegram: ${BOT_TOKEN ? "ON" : "OFF"}`
  );

  console.log(
    `💬 Chat ID: ${CHAT_ID ? "ON" : "OFF"}`
  );

  console.log("");
  console.log("❤️ Server is ready!");
  console.log("");
});