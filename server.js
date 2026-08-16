import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

const PORT = 3001;

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;


app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

app.use(express.json());


/*
========================================================
ПРОВЕРКА НАСТРОЕК
========================================================
*/

if (!BOT_TOKEN) {
  console.error(
    "❌ Не найден TELEGRAM_BOT_TOKEN в .env"
  );
}

if (!CHAT_ID) {
  console.error(
    "❌ Не найден TELEGRAM_CHAT_ID в .env"
  );
}


/*
========================================================
ОТПРАВКА В TELEGRAM
========================================================
*/

async function sendTelegramMessage(text) {

  if (!BOT_TOKEN || !CHAT_ID) {
    throw new Error(
      "Telegram BOT_TOKEN или CHAT_ID не настроены"
    );
  }


  const response = await fetch(
    `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`,
    {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        chat_id: CHAT_ID,
        text,
      }),
    }
  );


  const data = await response.json();


  if (!response.ok || !data.ok) {

    console.error(
      "Telegram error:",
      data
    );

    throw new Error(
      data.description ||
      "Telegram API error"
    );
  }


  return data;
}


/*
========================================================
ПРОВЕРКА СЕРВЕРА
========================================================
*/

app.get("/", (req, res) => {

  res.json({
    status: "ok",
    message: "Date Quest Telegram server is running ❤️",
  });

});


/*
========================================================
ОТПРАВКА СОБЫТИЯ
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


    let message = "";


    /*
    ================================================
    НАЧАЛО
    ================================================
    */

    if (type === "emotion") {

      message =
`💌 НОВОЕ ПРОХОЖДЕНИЕ

Она начала проходить приглашение ❤️

💭 Её эмоции:

${emotion || "Она ничего не написала."}`;

    }


    /*
    ================================================
    ОТВЕТ ГАЗ / -
    ================================================
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
    ================================================
    ВЫБОР АТМОСФЕРЫ
    ================================================
    */

    else if (type === "choice") {

      message =
`✨ ВЫБРАНА АТМОСФЕРА

${choice}

Теперь можно двигаться дальше ❤️`;

    }


    /*
    ================================================
    ДАТА И ВРЕМЯ
    ================================================
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
    ================================================
    НЕИЗВЕСТНОЕ СОБЫТИЕ
    ================================================
    */

    else {

      return res.status(400).json({
        ok: false,
        error: "Неизвестный тип события",
      });

    }


    /*
    ================================================
    ОТПРАВЛЯЕМ
    ================================================
    */

    await sendTelegramMessage(message);


    res.json({
      ok: true,
    });


  } catch (error) {

    console.error(
      "Ошибка отправки:",
      error
    );


    res.status(500).json({
      ok: false,

      error:
        "Не удалось отправить сообщение в Telegram",
    });

  }

});


/*
========================================================
ЗАПУСК
========================================================
*/

app.listen(PORT, () => {

  console.log("");
  console.log(
    "💌 Date Quest Telegram server"
  );

  console.log(
    `🚀 Server: http://localhost:${PORT}`
  );

  console.log(
    "📱 Telegram notifications: ON"
  );

  console.log("");

});