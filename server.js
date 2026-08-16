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
STARTUP CHECK
========================================================
*/

console.log("");
console.log("💌 ===============================");
console.log("💌 DATE QUEST TELEGRAM SERVER");
console.log("💌 ===============================");

console.log(`🚀 PORT: ${PORT}`);

if (BOT_TOKEN) {
  console.log("✅ TELEGRAM_BOT_TOKEN найден");
} else {
  console.error("❌ TELEGRAM_BOT_TOKEN НЕ найден");
}

if (CHAT_ID) {
  console.log("✅ TELEGRAM_CHAT_ID найден");
} else {
  console.error("❌ TELEGRAM_CHAT_ID НЕ найден");
}

console.log(
  `📱 Telegram: ${BOT_TOKEN ? "ON" : "OFF"}`
);

console.log(
  `💬 Chat ID: ${CHAT_ID ? "ON" : "OFF"}`
);

console.log("");


/*
========================================================
ОТПРАВКА СООБЩЕНИЯ В TELEGRAM
========================================================
*/

async function sendTelegramMessage(text) {

  if (!BOT_TOKEN) {
    throw new Error(
      "TELEGRAM_BOT_TOKEN не настроен"
    );
  }

  if (!CHAT_ID) {
    throw new Error(
      "TELEGRAM_CHAT_ID не настроен"
    );
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

    console.error(
      "❌ Telegram API error:",
      data
    );

    throw new Error(
      data.description ||
      "Ошибка Telegram API"
    );

  }


  console.log(
    "✅ Сообщение успешно отправлено в Telegram"
  );


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

    message:
      "Date Quest Telegram server is running ❤️",

    telegram:
      BOT_TOKEN && CHAT_ID
        ? "configured"
        : "not configured",

  });

});


/*
========================================================
HEALTH CHECK
========================================================
*/

app.get("/healthz", (req, res) => {

  res.status(200).json({

    ok: true,

    status: "healthy",

  });

});


/*
========================================================
TELEGRAM STATUS
========================================================
*/

app.get("/api/telegram", (req, res) => {

  res.json({

    ok: true,

    telegram: BOT_TOKEN
      ? "configured"
      : "missing",

    chatId: CHAT_ID
      ? "configured"
      : "missing",

  });

});


/*
========================================================
ОТПРАВКА В TELEGRAM
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


    console.log("");
    console.log("📩 ===============================");
    console.log("📩 НОВОЕ СОБЫТИЕ");
    console.log("📩 ===============================");

    console.log({
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
    UNKNOWN TYPE
    ====================================================
    */

    else {

      console.error(
        "❌ Неизвестный тип события:",
        type
      );


      return res.status(400).json({

        ok: false,

        error:
          "Неизвестный тип события",

      });

    }


    /*
    ====================================================
    SEND
    ====================================================
    */

    await sendTelegramMessage(message);


    /*
    ====================================================
    SUCCESS
    ====================================================
    */

    return res.status(200).json({

      ok: true,

      message:
        "Сообщение отправлено в Telegram ❤️",

    });

  }


  /*
  ======================================================
  ERROR
  ======================================================
  */

  catch (error) {

    console.error(
      "❌ Ошибка отправки:",
      error
    );


    return res.status(500).json({

      ok: false,

      error:
        error.message ||
        "Не удалось отправить сообщение в Telegram",

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

    path: req.path,

  });

});


/*
========================================================
START SERVER
========================================================
*/

app.listen(
  PORT,
  "0.0.0.0",
  () => {

    console.log("");
    console.log(
      `🚀 Server started on port ${PORT}`
    );

    console.log(
      "❤️ Date Quest server is ready!"
    );

    console.log("");

  }
);