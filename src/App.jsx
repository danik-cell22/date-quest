import { useState } from "react";

// ======================================================
// RENDER SERVER
// ======================================================

const SERVER_URL =
  "https://date-quest-server.onrender.com/api/telegram";

// ======================================================
// ОТПРАВКА ДАННЫХ В TELEGRAM
// ======================================================

async function sendToTelegram(data) {
  try {
    const response = await fetch(SERVER_URL, {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok || !result.ok) {
      console.error("Telegram server error:", result);

      throw new Error(
        result.error || "Ошибка отправки на сервер"
      );
    }

    console.log("✅ Данные отправлены в Telegram");

    return true;
  } catch (error) {
    console.error(
      "❌ Не удалось отправить данные в Telegram:",
      error
    );

    return false;
  }
}

// ======================================================
// APP
// ======================================================

function App() {
  const [step, setStep] = useState(0);

  const [emotion, setEmotion] = useState("");
  const [answer, setAnswer] = useState("");
  const [choice, setChoice] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");

  const [sending, setSending] = useState(false);

  // ====================================================
  // ПЕРЕХОД
  // ====================================================

  function goToStep(nextStep) {
    setStep(nextStep);
  }

  // ====================================================
  // ЭМОЦИИ
  // ====================================================

  async function handleEmotion() {
    setSending(true);

    await sendToTelegram({
      type: "emotion",
      emotion,
    });

    setSending(false);

    goToStep(1);
  }

  // ====================================================
  // ОТВЕТ
  // ====================================================

  async function handleAnswer(value) {
    setAnswer(value);

    setSending(true);

    await sendToTelegram({
      type: "answer",
      answer: value,
    });

    setSending(false);

    if (value === "газ") {
      goToStep(2);
    } else {
      goToStep(3);
    }
  }

  // ====================================================
  // ВЫБОР АТМОСФЕРЫ
  // ====================================================

  async function handleChoice(selectedChoice) {
    setChoice(selectedChoice);

    setSending(true);

    await sendToTelegram({
      type: "choice",
      choice: selectedChoice,
    });

    setSending(false);

    goToStep(5);
  }

  // ====================================================
  // ФИНАЛ
  // ====================================================

  async function handleFinalSubmit() {
    if (!date || !time) {
      alert("Выбери дату и время ❤️");
      return;
    }

    setSending(true);

    const success = await sendToTelegram({
      type: "final",
      emotion,
      answer,
      choice,
      date,
      time,
    });

    setSending(false);

    if (success) {
      goToStep(7);
    } else {
      alert(
        "Не получилось отправить предложение. Попробуй ещё раз ❤️"
      );
    }
  }

  // ====================================================
  // СТИЛИ
  // ====================================================

  const pageStyle = {
    minHeight: "100vh",
    minHeight: "100svh",
    width: "100%",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    padding: "24px 16px",
    boxSizing: "border-box",
    fontFamily: "Georgia, serif",
    color: "#fff",

    background:
      "radial-gradient(circle at 15% 15%, rgba(255,100,160,.25), transparent 30%)," +
      "radial-gradient(circle at 85% 85%, rgba(120,30,80,.35), transparent 35%)," +
      "linear-gradient(135deg, #8f1748 0%, #351326 50%, #12070d 100%)",
  };

  const cardStyle = {
    width: "min(430px, 100%)",
    boxSizing: "border-box",
    padding: "38px 30px",
    borderRadius: "32px",

    background:
      "linear-gradient(145deg, rgba(255,255,255,.14), rgba(255,255,255,.055))",

    border: "1px solid rgba(255,255,255,.18)",

    boxShadow:
      "0 30px 80px rgba(0,0,0,.45), inset 0 1px 0 rgba(255,255,255,.12)",

    backdropFilter: "blur(25px)",
    WebkitBackdropFilter: "blur(25px)",

    textAlign: "center",
  };

  const smallLabelStyle = {
    fontSize: "11px",
    letterSpacing: "4px",
    textTransform: "uppercase",
    color: "rgba(255,210,225,.65)",
    marginBottom: "18px",
  };

  const titleStyle = {
    margin: "0 0 18px",
    fontSize: "38px",
    lineHeight: "1.05",
    fontWeight: "600",

    background:
      "linear-gradient(135deg, #fff, #ff9bc1)",

    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",

    textShadow: "0 8px 30px rgba(255,80,140,.25)",
  };

  const textStyle = {
    fontSize: "15px",
    lineHeight: "1.75",
    color: "rgba(255,240,245,.82)",
    margin: "0 0 24px",
  };

  const textareaStyle = {
    width: "100%",
    minHeight: "105px",
    resize: "vertical",
    boxSizing: "border-box",

    padding: "16px",

    borderRadius: "18px",
    border: "1px solid rgba(255,255,255,.16)",

    outline: "none",

    background: "rgba(0,0,0,.18)",
    color: "#fff",

    fontFamily: "Georgia, serif",
    fontSize: "14px",

    marginBottom: "16px",
  };

  const inputStyle = {
    width: "100%",
    boxSizing: "border-box",

    padding: "15px 16px",

    borderRadius: "16px",
    border: "1px solid rgba(255,255,255,.16)",

    outline: "none",

    background: "rgba(0,0,0,.18)",
    color: "#fff",

    fontFamily: "Georgia, serif",
    fontSize: "15px",

    marginBottom: "14px",
  };

  const primaryButtonStyle = {
    width: "100%",
    padding: "16px 20px",

    border: "none",
    borderRadius: "17px",

    background:
      "linear-gradient(135deg, #e85c91, #b82d66)",

    color: "#fff",

    fontFamily: "Georgia, serif",
    fontSize: "15px",
    fontWeight: "600",

    cursor: sending ? "wait" : "pointer",

    boxShadow:
      "0 12px 30px rgba(180,30,90,.30)",

    opacity: sending ? 0.65 : 1,

    transition: "transform .2s ease, opacity .2s ease",
  };

  const secondaryButtonStyle = {
    width: "100%",
    padding: "15px 20px",

    border: "1px solid rgba(255,255,255,.18)",
    borderRadius: "17px",

    background: "rgba(255,255,255,.07)",

    color: "#fff",

    fontFamily: "Georgia, serif",
    fontSize: "15px",

    cursor: sending ? "wait" : "pointer",

    marginTop: "10px",

    transition: "background .2s ease",
  };

  const choiceButtonStyle = {
    width: "100%",
    padding: "18px",

    marginBottom: "12px",

    border: "1px solid rgba(255,255,255,.15)",
    borderRadius: "20px",

    background: "rgba(255,255,255,.07)",

    color: "#fff",

    textAlign: "left",

    fontFamily: "Georgia, serif",

    cursor: sending ? "wait" : "pointer",

    transition:
      "transform .2s ease, background .2s ease",
  };

  const choiceTitleStyle = {
    display: "block",
    fontSize: "16px",
    fontWeight: "600",
    marginBottom: "6px",
  };

  const choiceTextStyle = {
    display: "block",
    fontSize: "13px",
    lineHeight: "1.5",
    color: "rgba(255,235,242,.68)",
  };

  // ====================================================
  // RENDER
  // ====================================================

  return (
    <div style={pageStyle}>
      <div style={cardStyle}>

        {/* =================================================
            STEP 0
        ================================================= */}

        {step === 0 && (
          <>
            <div style={smallLabelStyle}>
              only for Lizzy
            </div>

            <div
              style={{
                fontSize: "42px",
                marginBottom: "15px",
              }}
            >
              ♡
            </div>

            <h1 style={titleStyle}>
              Для тебя
            </h1>

            <p style={textStyle}>
              Я хотел оставить здесь кое-что личное.
              <br />
              Ничего сложного. Просто хочу узнать,
              что ты почувствовала, когда это увидела.
            </p>

            <textarea
              value={emotion}
              onChange={(e) =>
                setEmotion(e.target.value)
              }
              placeholder="Напиши свои эмоции..."
              style={textareaStyle}
            />

            <button
              style={primaryButtonStyle}
              onClick={handleEmotion}
              disabled={sending}
            >
              {sending
                ? "Отправляю..."
                : "Продолжить ♡"}
            </button>
          </>
        )}

        {/* =================================================
            STEP 1
        ================================================= */}

        {step === 1 && (
          <>
            <div style={smallLabelStyle}>
              вопрос
            </div>

            <h1 style={titleStyle}>
              Ну что?
            </h1>

            <p style={textStyle}>
              Хочешь встретиться со мной?
              <br />
              Можешь ответить честно.
            </p>

            <button
              style={primaryButtonStyle}
              onClick={() =>
                handleAnswer("газ")
              }
              disabled={sending}
            >
              🚀 ГАЗ
            </button>

            <button
              style={secondaryButtonStyle}
              onClick={() =>
                handleAnswer("-")
              }
              disabled={sending}
            >
              —
            </button>
          </>
        )}

        {/* =================================================
            STEP 2
        ================================================= */}

        {step === 2 && (
          <>
            <div
              style={{
                fontSize: "54px",
                marginBottom: "12px",
              }}
            >
              ❤️
            </div>

            <h1 style={titleStyle}>
              Тогда начинаем
            </h1>

            <p style={textStyle}>
              Я рад, что ты выбрала «газ».
              <br />
              Теперь осталось решить,
              каким будет наш вечер.
            </p>

            <button
              style={primaryButtonStyle}
              onClick={() => goToStep(4)}
            >
              Дальше →
            </button>
          </>
        )}

        {/* =================================================
            STEP 3
        ================================================= */}

        {step === 3 && (
          <>
            <div
              style={{
                fontSize: "54px",
                marginBottom: "12px",
              }}
            >
              💙
            </div>

            <h1 style={titleStyle}>
              Спасибо
            </h1>

            <p style={textStyle}>
              Спасибо за честность.
              <br />
              Я уважаю твой выбор.
            </p>
          </>
        )}

        {/* =================================================
            STEP 4
        ================================================= */}

        {step === 4 && (
          <>
            <div style={smallLabelStyle}>
              следующий шаг
            </div>

            <h1
              style={{
                ...titleStyle,
                fontSize: "34px",
              }}
            >
              Какой вайб?
            </h1>

            <p style={textStyle}>
              Выбирай то, что тебе ближе ❤️
            </p>

            <button
              style={choiceButtonStyle}
              onClick={() =>
                handleChoice(
                  "🌆 Вайбовая прогулка"
                )
              }
              disabled={sending}
            >
              <span style={choiceTitleStyle}>
                🌆 Вайбовая прогулка
              </span>

              <span style={choiceTextStyle}>
                разговоры, смех и красивые моменты
              </span>
            </button>

            <button
              style={choiceButtonStyle}
              onClick={() =>
                handleChoice("🍽 Ужин")
              }
              disabled={sending}
            >
              <span style={choiceTitleStyle}>
                🍽 Ужин
              </span>

              <span style={choiceTextStyle}>
                уютный вечер только для нас
              </span>
            </button>

            <button
              style={choiceButtonStyle}
              onClick={() =>
                handleChoice("🎁 Сюрприз")
              }
              disabled={sending}
            >
              <span style={choiceTitleStyle}>
                🎁 Сюрприз
              </span>

              <span style={choiceTextStyle}>
                просто доверься мне
              </span>
            </button>
          </>
        )}

        {/* =================================================
            STEP 5
        ================================================= */}

        {step === 5 && (
          <>
            <div
              style={{
                fontSize: "48px",
                marginBottom: "12px",
              }}
            >
              ✨
            </div>

            <div style={smallLabelStyle}>
              твой выбор
            </div>

            <h1
              style={{
                ...titleStyle,
                fontSize: "31px",
              }}
            >
              {choice}
            </h1>

            <p style={textStyle}>
              Хороший выбор ❤️
              <br />
              Теперь осталось выбрать дату и время.
            </p>

            <button
              style={primaryButtonStyle}
              onClick={() => goToStep(6)}
            >
              Выбрать дату →
            </button>
          </>
        )}

        {/* =================================================
            STEP 6
        ================================================= */}

        {step === 6 && (
          <>
            <div style={smallLabelStyle}>
              последнее
            </div>

            <h1
              style={{
                ...titleStyle,
                fontSize: "32px",
              }}
            >
              Когда увидимся?
            </h1>

            <p style={textStyle}>
              Выбери удобную дату и время ❤️
            </p>

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              style={inputStyle}
            />

            <input
              type="time"
              value={time}
              onChange={(e) =>
                setTime(e.target.value)
              }
              style={inputStyle}
            />

            <button
              style={primaryButtonStyle}
              onClick={handleFinalSubmit}
              disabled={sending}
            >
              {sending
                ? "Отправляю..."
                : "Отправить предложение 💌"}
            </button>
          </>
        )}

        {/* =================================================
            STEP 7
        ================================================= */}

        {step === 7 && (
          <>
            <div
              style={{
                fontSize: "58px",
                marginBottom: "14px",
              }}
            >
              💌
            </div>

            <div style={smallLabelStyle}>
              готово
            </div>

            <h1
              style={{
                ...titleStyle,
                fontSize: "34px",
              }}
            >
              Спасибо, что согласилась
            </h1>

            <p style={textStyle}>
              Предложение отправлено ❤️
              <br />
              Теперь осталось только дождаться
              нашего свидания.
            </p>

            <div
              style={{
                marginTop: "22px",
                padding: "18px",
                borderRadius: "18px",
                background:
                  "rgba(255,255,255,.06)",
                border:
                  "1px solid rgba(255,255,255,.1)",
              }}
            >
              <div
                style={{
                  fontSize: "13px",
                  color:
                    "rgba(255,220,230,.65)",
                  marginBottom: "8px",
                }}
              >
                НАШ ПЛАН
              </div>

              <div
                style={{
                  fontSize: "15px",
                  marginBottom: "7px",
                }}
              >
                ✨ {choice}
              </div>

              <div
                style={{
                  fontSize: "14px",
                  color:
                    "rgba(255,235,242,.8)",
                }}
              >
                📅 {date}
                <br />
                🕐 {time}
              </div>
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default App;