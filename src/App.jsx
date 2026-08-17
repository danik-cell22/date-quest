import { useEffect, useState } from "react";


// ======================================================
// ФОТОГРАФИИ
// ======================================================
//
// Положи фотографии в:
// src/assets/
//
// Например:
// love1.jpg
// love2.jpg
// love3.jpg
// ...
// love15.jpg
//
// Vite автоматически найдёт все фотографии love*
//

const photoModules = import.meta.glob(
  "./assets/love*.{jpg,jpeg,png,webp}",
  {
    eager: true,
    query: "?url",
    import: "default",
  }
);

const photos = Object.values(photoModules);

// ======================================================
// RENDER / TELEGRAM SERVER
// ======================================================

const SERVER_URL =
  "https://date-quest-server.onrender.com/api/telegram";

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
      return false;
    }

    console.log("✅ Данные отправлены в Telegram");
    return true;
  } catch (error) {
    console.error("❌ Ошибка отправки в Telegram:", error);
    return false;
  }
}



// ======================================================
// КОМПОНЕНТ "ФОТО-СНЕГ"
// ======================================================

function PhotoSnow() {

  const [flakes, setFlakes] = useState([]);

  useEffect(() => {

    if (photos.length === 0) {
      return;
    }

    const createFlake = () => {

      const photo =
        photos[
          Math.floor(
            Math.random() * photos.length
          )
        ];

      const flake = {

        id:
          Date.now() +
          Math.random(),

        photo,

        left:
          Math.random() * 100,

        size:
          42 +
          Math.random() * 55,

        duration:
          7 +
          Math.random() * 8,

        delay:
          Math.random() * 2,

        rotation:
          -25 +
          Math.random() * 50,

        drift:
          -120 +
          Math.random() * 240,

        opacity:
          0.45 +
          Math.random() * 0.45,

        blur:
          Math.random() > 0.88
            ? 1
            : 0,

      };


      setFlakes((current) => [
        ...current.slice(-34),
        flake,
      ]);

    };


    // Сразу создаём много фотографий
    for (let i = 0; i < 30; i++) {

      setTimeout(() => {
        createFlake();
      }, i * 180);

    }


    // Затем постоянно добавляем новые
    const interval = setInterval(() => {

      createFlake();

    }, 550);


    return () => {
      clearInterval(interval);
    };

  }, []);


  if (photos.length === 0) {
    return null;
  }


  return (
    <div className="photoSnow">

      {flakes.map((flake) => (

        <div
          key={flake.id}
          className="photoFlake"

          style={{
            left: `${flake.left}%`,

            width: `${flake.size}px`,

            height: `${flake.size * 1.22}px`,

            opacity: flake.opacity,

            filter:
              flake.blur
                ? "blur(1px)"
                : "none",

            animationDuration:
              `${flake.duration}s`,

            animationDelay:
              `${flake.delay}s`,

            "--rotation":
              `${flake.rotation}deg`,

            "--drift":
              `${flake.drift}px`,
          }}

        >

          <img
            src={flake.photo}
            alt=""
            draggable="false"
          />

        </div>

      ))}

    </div>
  );
}


// ======================================================
// ОСНОВНОЙ APP
// ======================================================

function App() {

  const [step, setStep] = useState(0);

  const [emotion, setEmotion] =
    useState("");

  const [answer, setAnswer] =
    useState("");

  const [choice, setChoice] =
    useState("");

  const [date, setDate] =
    useState("");

  const [time, setTime] =
    useState("");

  const [visible, setVisible] =
    useState(true);


  // ====================================================
  // АНИМАЦИЯ ПЕРЕХОДОВ
  // ====================================================

  useEffect(() => {

    setVisible(false);

    const timer =
      setTimeout(() => {

        setVisible(true);

      }, 80);


    return () => {
      clearTimeout(timer);
    };

  }, [step]);


  function goToStep(nextStep) {

    setVisible(false);

    setTimeout(() => {

      setStep(nextStep);

      setVisible(true);

    }, 250);

  }


  // ====================================================
  // ОТПРАВКА В TELEGRAM
  // ====================================================

  async function handleEmotion() {
    await sendToTelegram({
      type: "emotion",
      emotion,
    });

    goToStep(1);
  }

  async function handleAnswer(value) {
    setAnswer(value);

    await sendToTelegram({
      type: "answer",
      answer: value,
    });

    if (value === "газ") {
      goToStep(2);
    } else {
      goToStep(3);
    }
  }

  async function handleChoice(selectedChoice, nextStep = 5) {
    setChoice(selectedChoice);

    await sendToTelegram({
      type: "choice",
      choice: selectedChoice,
    });

    goToStep(nextStep);
  }

  async function handleFinalSubmit() {
    if (!date || !time) {
      alert("Выбери дату и время ❤️");
      return;
    }

    const success = await sendToTelegram({
      type: "final",
      emotion,
      answer,
      choice,
      date,
      time,
    });

    if (success) {
      goToStep(7);
    } else {
      alert("Не получилось отправить предложение. Попробуй ещё раз ❤️");
    }
  }


  return (

    <>

      {/* ==================================================
          СТИЛИ
      ================================================== */}

      <style>{`

        @import url(
          'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&display=swap'
        );


        * {
          box-sizing: border-box;
        }


        html,
        body,
        #root {

          margin: 0;

          min-height: 100%;

          width: 100%;

        }


        body {

          background: #170912;

        }


        button,
        textarea,
        input {

          font-family: inherit;

        }


        button {

          -webkit-tap-highlight-color:
            transparent;

        }


        /* ==================================================
           ОСНОВНОЙ ФОН
        ================================================== */

        .page {

          min-height: 100vh;

          min-height: 100svh;

          position: relative;

          display: flex;

          justify-content: center;

          align-items: center;

          padding: 32px 20px;

          overflow: hidden;

          color: #fff;

          background:

            radial-gradient(
              circle at 15% 15%,
              rgba(181,52,105,.22),
              transparent 30%
            ),

            radial-gradient(
              circle at 85% 85%,
              rgba(121,35,73,.20),
              transparent 32%
            ),

            linear-gradient(
              135deg,
              #16080f 0%,
              #2a0d1a 48%,
              #12070d 100%
            );

        }


        /* ==================================================
           ФОТО-СНЕГ
        ================================================== */

        .photoSnow {

          position: fixed;

          inset: 0;

          width: 100%;

          height: 100%;

          overflow: hidden;

          pointer-events: none;

          z-index: 2;

        }


        .photoFlake {

          position: absolute;

          bottom: -180px;

          border-radius: 15px;

          overflow: hidden;

          background: #fff;

          padding: 3px;

          box-shadow:

            0 12px 35px
            rgba(0,0,0,.30),

            0 0 20px
            rgba(255,160,195,.08);

          will-change:
            transform,
            opacity;

          animation:

            photoFly
            linear
            forwards;

        }


        .photoFlake img {

          width: 100%;

          height: 100%;

          display: block;

          object-fit: cover;

          border-radius: 12px;

          user-select: none;

          -webkit-user-drag: none;

        }


        @keyframes photoFly {

          0% {

            transform:

              translate3d(
                0,
                0,
                0
              )

              rotate(
                var(--rotation)
              );

          }


          25% {

            transform:

              translate3d(
                calc(
                  var(--drift) * .45
                ),
                -27vh,
                0
              )

              rotate(
                calc(
                  var(--rotation) + 8deg
                )
              );

          }


          50% {

            transform:

              translate3d(
                calc(
                  var(--drift) * -.2
                ),
                -55vh,
                0
              )

              rotate(
                calc(
                  var(--rotation) - 7deg
                )
              );

          }


          75% {

            transform:

              translate3d(
                calc(
                  var(--drift) * .65
                ),
                -78vh,
                0
              )

              rotate(
                calc(
                  var(--rotation) + 10deg
                )
              );

          }


          100% {

            transform:

              translate3d(
                var(--drift),
                -125vh,
                0
              )

              rotate(
                calc(
                  var(--rotation) - 8deg
                )
              );

          }

        }


        /* ==================================================
           ДЕКОРАТИВНЫЕ СВЕТЯЩИЕСЯ ШАРЫ
        ================================================== */

        .orb {

          position: absolute;

          border-radius: 999px;

          filter: blur(80px);

          pointer-events: none;

          z-index: 1;

        }


        .orbOne {

          width: 340px;

          height: 340px;

          top: -160px;

          left: -100px;

          background:
            rgba(205,57,116,.20);

          animation:
            orbMoveOne 12s
            ease-in-out
            infinite;

        }


        .orbTwo {

          width: 380px;

          height: 380px;

          right: -180px;

          bottom: -170px;

          background:
            rgba(143,38,83,.20);

          animation:
            orbMoveTwo 15s
            ease-in-out
            infinite;

        }


        .orbThree {

          width: 190px;

          height: 190px;

          top: 40%;

          left: 55%;

          background:
            rgba(220,91,139,.08);

          animation:
            orbMoveThree 10s
            ease-in-out
            infinite;

        }


        @keyframes orbMoveOne {

          0%,
          100% {

            transform:
              translate(0,0);

          }

          50% {

            transform:
              translate(80px,50px);

          }

        }


        @keyframes orbMoveTwo {

          0%,
          100% {

            transform:
              translate(0,0);

          }

          50% {

            transform:
              translate(-60px,-50px);

          }

        }


        @keyframes orbMoveThree {

          0%,
          100% {

            transform:
              scale(1);

            opacity: .5;

          }

          50% {

            transform:
              scale(1.3);

            opacity: 1;

          }

        }


        /* ==================================================
           ЗЕРНО
        ================================================== */

        .grain {

          position: absolute;

          inset: 0;

          pointer-events: none;

          opacity: .035;

          background-image:

            url(
              "data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.8'/%3E%3C/svg%3E"
            );

          z-index: 1;

        }


        /* ==================================================
           КАРТОЧКА
        ================================================== */

        .card {

          width:
            min(480px,100%);

          position: relative;

          z-index: 10;

          padding:
            44px 42px 42px;

          border-radius: 34px;

          background:

            linear-gradient(
              145deg,
              rgba(255,255,255,.12),
              rgba(255,255,255,.055)
            );

          border:
            1px solid
            rgba(255,255,255,.15);

          backdrop-filter:
            blur(30px);

          -webkit-backdrop-filter:
            blur(30px);

          box-shadow:

            0 35px 100px
            rgba(0,0,0,.45),

            inset 0 1px 0
            rgba(255,255,255,.13);

          transition:

            opacity .35s ease,

            transform .35s ease;

        }


        .card.hidden {

          opacity: 0;

          transform:
            translateY(14px)
            scale(.985);

        }


        .card.visible {

          opacity: 1;

          transform:
            translateY(0)
            scale(1);

        }


        /* ==================================================
           ВЕРХНЯЯ НАДПИСЬ
        ================================================== */

        .topLine {

          display: flex;

          align-items: center;

          justify-content: center;

          gap: 12px;

          margin-bottom: 26px;

          color:
            rgba(255,220,231,.55);

          font-family:
            Inter,sans-serif;

          font-size: 11px;

          letter-spacing: 3px;

          text-transform:
            uppercase;

        }


        .topLine::before,
        .topLine::after {

          content: "";

          width: 35px;

          height: 1px;

          background:

            linear-gradient(
              90deg,
              transparent,
              rgba(255,200,220,.35)
            );

        }


        .topLine::after {

          background:

            linear-gradient(
              90deg,
              rgba(255,200,220,.35),
              transparent
            );

        }


        /* ==================================================
           ПРОГРЕСС
        ================================================== */

        .progress {

          display: flex;

          justify-content: center;

          gap: 7px;

          margin-bottom: 28px;

        }


        .progressDot {

          width: 6px;

          height: 6px;

          border-radius: 50%;

          background:
            rgba(255,255,255,.15);

          transition:
            all .35s ease;

        }


        .progressDot.active {

          width: 24px;

          border-radius: 10px;

          background: #d97a9f;

          box-shadow:
            0 0 14px
            rgba(217,122,159,.45);

        }


        /* ==================================================
           ТЕКСТ
        ================================================== */

        .eyebrow {

          margin:
            0 0 12px;

          font-family:
            Inter,sans-serif;

          font-size: 11px;

          font-weight: 500;

          letter-spacing: 3px;

          text-transform:
            uppercase;

          color:
            rgba(255,210,225,.58);

        }


        .title {

          margin: 0;

          font-family:
            "Cormorant Garamond",
            Georgia,
            serif;

          font-size:
            clamp(42px,9vw,58px);

          line-height: .95;

          font-weight: 600;

          letter-spacing: -1.5px;

          color: #fff5f8;

          text-shadow:
            0 10px 35px
            rgba(0,0,0,.25);

        }


        .titleAccent {

          display: block;

          margin-top: 5px;

          font-style: italic;

          color: #e8a1bb;

        }


        .text {

          margin:
            24px 0 0;

          font-family:
            Inter,sans-serif;

          font-size: 15px;

          font-weight: 300;

          line-height: 1.85;

          color:
            rgba(255,235,241,.72);

        }


        .text strong {

          color:
            rgba(255,240,245,.95);

          font-weight: 500;

        }


        /* ==================================================
           ИКОНКА
        ================================================== */

        .icon {

          width: 72px;

          height: 72px;

          display: flex;

          justify-content: center;

          align-items: center;

          margin:
            0 auto 24px;

          border-radius: 50%;

          background:
            rgba(218,105,148,.10);

          border:
            1px solid
            rgba(255,190,215,.14);

          box-shadow:
            0 15px 40px
            rgba(0,0,0,.15);

          font-size: 30px;

          animation:
            iconPulse 3s
            ease-in-out
            infinite;

        }


        @keyframes iconPulse {

          0%,
          100% {

            transform:
              scale(1);

          }

          50% {

            transform:
              scale(1.045);

          }

        }


        /* ==================================================
           TEXTAREA
        ================================================== */

        .textarea {

          width: 100%;

          min-height: 132px;

          margin-top: 25px;

          padding:
            18px 19px;

          resize: vertical;

          outline: none;

          border-radius: 20px;

          border:
            1px solid
            rgba(255,190,215,.17);

          background:
            rgba(255,255,255,.055);

          color: #fff;

          font-family:
            Inter,sans-serif;

          font-size: 14px;

          font-weight: 300;

          line-height: 1.6;

          transition:

            border .25s ease,

            background .25s ease,

            box-shadow .25s ease;

        }


        .textarea::placeholder {

          color:
            rgba(255,225,235,.35);

        }


        .textarea:focus {

          background:
            rgba(255,255,255,.075);

          border-color:
            rgba(225,125,162,.45);

          box-shadow:
            0 0 0 4px
            rgba(225,125,162,.06);

        }


        /* ==================================================
           КНОПКИ
        ================================================== */

        .button {

          width: 100%;

          min-height: 55px;

          margin-top: 15px;

          padding:
            15px 20px;

          border:
            1px solid
            rgba(255,255,255,.08);

          border-radius: 18px;

          cursor: pointer;

          background:

            linear-gradient(
              135deg,
              #c65b82,
              #8f3157
            );

          color: #fff;

          font-family:
            Inter,sans-serif;

          font-size: 14px;

          font-weight: 500;

          letter-spacing: .2px;

          box-shadow:

            0 12px 30px
            rgba(115,30,62,.28);

          transition:

            transform .25s ease,

            box-shadow .25s ease,

            filter .25s ease;

        }


        .button:hover {

          transform:
            translateY(-3px);

          box-shadow:

            0 17px 38px
            rgba(115,30,62,.38);

          filter:
            brightness(1.08);

        }


        .button:active {

          transform:
            translateY(0)
            scale(.985);

        }


        .buttonSecondary {

          background:
            rgba(255,255,255,.045);

          border:
            1px solid
            rgba(255,210,225,.12);

          color:
            rgba(255,235,242,.72);

          box-shadow: none;

        }


        .buttonSecondary:hover {

          background:
            rgba(255,255,255,.075);

          box-shadow:
            0 10px 30px
            rgba(0,0,0,.12);

        }


        /* ==================================================
           ВЫБОР
        ================================================== */

        .choices {

          display: flex;

          flex-direction: column;

          gap: 10px;

          margin-top: 26px;

        }


        .choice {

          width: 100%;

          padding:
            17px 18px;

          display: flex;

          align-items: center;

          gap: 15px;

          text-align: left;

          cursor: pointer;

          border-radius: 20px;

          border:
            1px solid
            rgba(255,210,225,.11);

          background:
            rgba(255,255,255,.045);

          color: white;

          transition:

            transform .25s ease,

            background .25s ease,

            border .25s ease,

            box-shadow .25s ease;

        }


        .choice:hover {

          transform:
            translateX(5px);

          background:
            rgba(255,255,255,.085);

          border-color:
            rgba(231,145,174,.28);

          box-shadow:
            0 12px 30px
            rgba(0,0,0,.15);

        }


        .choiceIcon {

          width: 43px;

          height: 43px;

          flex-shrink: 0;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 14px;

          background:
            rgba(222,108,149,.10);

          font-size: 19px;

        }


        .choiceText {

          display: flex;

          flex-direction: column;

          gap: 3px;

        }


        .choiceTitle {

          font-family:
            Inter,sans-serif;

          font-size: 14px;

          font-weight: 500;

          color:
            rgba(255,240,245,.94);

        }


        .choiceDescription {

          font-family:
            Inter,sans-serif;

          font-size: 12px;

          line-height: 1.5;

          font-weight: 300;

          color:
            rgba(255,225,235,.45);

        }


        /* ==================================================
           СПЕЦИАЛЬНАЯ СТРАНИЦА
        ================================================== */

        .specialPage {

          text-align: center;

        }


        .specialIcon {

          width: 92px;

          height: 92px;

          margin:
            0 auto 28px;

          display: flex;

          align-items: center;

          justify-content: center;

          border-radius: 50%;

          background:

            radial-gradient(
              circle,
              rgba(226,122,157,.18),
              rgba(226,122,157,.04)
            );

          border:
            1px solid
            rgba(255,195,215,.15);

          box-shadow:

            0 20px 55px
            rgba(0,0,0,.22);

          font-size: 36px;

          animation:
            specialPulse 3s
            ease-in-out
            infinite;

        }


        @keyframes specialPulse {

          0%,
          100% {

            transform:
              scale(1);

            box-shadow:
              0 20px 55px
              rgba(0,0,0,.22);

          }

          50% {

            transform:
              scale(1.05);

            box-shadow:

              0 20px 70px
              rgba(183,64,105,.25);

          }

        }


        .specialTitle {

          margin: 0;

          font-family:
            "Cormorant Garamond",
            Georgia,
            serif;

          font-size:
            clamp(43px,10vw,61px);

          line-height: .95;

          font-weight: 600;

          letter-spacing: -1.5px;

          color: #fff4f7;

        }


        .specialTitle span {

          display: block;

          margin-top: 7px;

          color: #e8a1bb;

          font-style: italic;

        }


        .specialDates {

          display: inline-flex;

          margin-top: 28px;

          padding:
            13px 20px;

          border-radius: 999px;

          background:
            rgba(221,107,149,.09);

          border:
            1px solid
            rgba(221,107,149,.17);

          color:
            rgba(255,225,236,.78);

          font-family:
            Inter,sans-serif;

          font-size: 12px;

          letter-spacing: 1.5px;

          text-transform:
            uppercase;

        }


        .specialText {

          margin-top: 25px;

          font-family:
            Inter,sans-serif;

          font-size: 14px;

          line-height: 1.8;

          font-weight: 300;

          color:
            rgba(255,230,238,.58);

        }


        /* ==================================================
           ВЫБРАННАЯ АТМОСФЕРА
        ================================================== */

        .selectedChoice {

          margin-top: 25px;

          padding: 17px;

          border-radius: 18px;

          background:
            rgba(224,115,153,.08);

          border:
            1px solid
            rgba(224,115,153,.16);

          color: #f3bacd;

          font-family:
            Inter,sans-serif;

          font-size: 13px;

        }


        /* ==================================================
           INPUT
        ================================================== */

        .inputGroup {

          margin-top: 25px;

        }


        .inputLabel {

          display: block;

          margin-bottom: 8px;

          text-align: left;

          font-family:
            Inter,sans-serif;

          font-size: 11px;

          letter-spacing: 1.5px;

          text-transform:
            uppercase;

          color:
            rgba(255,220,230,.45);

        }


        .input {

          width: 100%;

          height: 54px;

          padding:
            0 16px;

          margin-bottom: 12px;

          outline: none;

          border-radius: 17px;

          border:
            1px solid
            rgba(255,205,220,.13);

          background:
            rgba(255,255,255,.055);

          color:
            rgba(255,240,245,.9);

          font-family:
            Inter,sans-serif;

          font-size: 14px;

          transition:
            .25s ease;

          color-scheme: dark;

        }


        .input:focus {

          border-color:
            rgba(225,125,162,.45);

          background:
            rgba(255,255,255,.075);

          box-shadow:

            0 0 0 4px
            rgba(225,125,162,.05);

        }


        /* ==================================================
           ФИНАЛЬНОЕ ФОТО
        ================================================== */

        .photoFrame {

          position: relative;

          margin-top: 28px;

          border-radius: 24px;

          overflow: hidden;

          border:
            1px solid
            rgba(255,225,235,.18);

          box-shadow:

            0 25px 65px
            rgba(0,0,0,.38);

          animation:

            photoReveal
            1s
            cubic-bezier(.16,1,.3,1);

        }


        .photoFrame::after {

          content: "";

          position: absolute;

          inset: 0;

          pointer-events: none;

          background:

            linear-gradient(
              to top,
              rgba(28,8,17,.45),
              transparent 45%
            );

        }


        .photo {

          width: 100%;

          height: 370px;

          display: block;

          object-fit: cover;

          object-position: center;

          transform:
            scale(1.01);

          transition:
            transform 1.2s ease;

        }


        .photoFrame:hover .photo {

          transform:
            scale(1.045);

        }


        @keyframes photoReveal {

          from {

            opacity: 0;

            transform:
              translateY(25px)
              scale(.96);

          }

          to {

            opacity: 1;

            transform:
              translateY(0)
              scale(1);

          }

        }


        .finalTitle {

          margin-top: 20px;

          font-family:
            "Cormorant Garamond",
            Georgia,
            serif;

          font-size: 43px;

          line-height: 1;

          font-weight: 600;

          color: #fff3f7;

        }


        .finalHeart {

          display: inline-block;

          font-size: 38px;

          animation:
            finalHeart 2.5s
            ease-in-out
            infinite;

        }


        @keyframes finalHeart {

          0%,
          100% {

            transform:
              scale(1);

          }

          50% {

            transform:
              scale(1.12);

          }

        }


        .finalNote {

          margin-top: 20px;

          padding-top: 20px;

          border-top:
            1px solid
            rgba(255,210,225,.09);

          font-family:
            "Cormorant Garamond",
            Georgia,
            serif;

          font-size: 22px;

          line-height: 1.4;

          font-style: italic;

          color:
            rgba(255,220,232,.72);

        }


        /* ==================================================
           АДАПТИВ
        ================================================== */

        @media (max-width: 600px) {

          .page {

            padding:
              18px 14px;

          }


          .card {

            padding:
              34px 22px 27px;

            border-radius:
              28px;

          }


          .title {

            font-size:
              44px;

          }


          .text {

            font-size:
              14px;

            line-height:
              1.75;

          }


          .photo {

            height:
              330px;

          }


          .finalTitle {

            font-size:
              38px;

          }


          .specialTitle {

            font-size:
              47px;

          }


          .topLine {

            margin-bottom:
              21px;

          }


          .progress {

            margin-bottom:
              23px;

          }


          .photoFlake {

            box-shadow:
              0 8px 22px
              rgba(0,0,0,.25);

          }

        }


        @media (max-width: 380px) {

          .card {

            padding:
              30px 18px 24px;

          }


          .title {

            font-size:
              39px;

          }


          .photo {

            height:
              290px;

          }


          .specialTitle {

            font-size:
              41px;

          }

        }

      `}</style>


      {/* ====================================================
          ФОТОГРАФИИ ЛЕТЯТ НА ВСЕХ СТРАНИЦАХ
      ==================================================== */}

      <PhotoSnow />


      {/* ====================================================
          ФОН
      ==================================================== */}

      <main className="page">

        <div className="grain" />

        <div className="orb orbOne" />

        <div className="orb orbTwo" />

        <div className="orb orbThree" />


        {/* ==================================================
            КАРТОЧКА
        ================================================== */}

        <section
          className={`card ${
            visible
              ? "visible"
              : "hidden"
          }`}
        >


          {/* =================================================
              TOP
          ================================================= */}

          {step < 7 && step !== 8 && (

            <>

              <div className="topLine">
                only for lizzy
              </div>


              <div className="progress">

                {[0,1,2,3,4,5].map(
                  (item) => (

                    <div
                      key={item}

                      className={
                        `progressDot ${
                          item === step
                            ? "active"
                            : ""
                        }`
                      }
                    />

                  )
                )}

              </div>

            </>

          )}


          {/* =================================================
              STEP 0
          ================================================= */}

          {step === 0 && (

            <div>

              <div className="icon">
                💌
              </div>


              <p className="eyebrow">
                маленькое начало
              </p>


              <h1 className="title">

                Для

                <span className="titleAccent">
                  тебя
                </span>

              </h1>


              <p className="text">

                Я хотел оставить здесь
                кое-что личное.

                <br />
                <br />

                Ничего сложного.
                Просто хочу узнать,

                <strong>
                  {" "}что ты почувствовала
                </strong>

                , пройдя этот путь.

              </p>


              <textarea

                className="textarea"

                placeholder=
                  "Напиши свои эмоции..."

                value={emotion}

                onChange={(e) =>
                  setEmotion(
                    e.target.value
                  )
                }

              />


              <button

                className="button"

                onClick={handleEmotion}

              >

                Продолжить

                <span
                  style={{
                    marginLeft: 8
                  }}
                >
                  →
                </span>

              </button>

            </div>

          )}


          {/* =================================================
              STEP 1
          ================================================= */}

          {step === 1 && (

            <div>

              <p className="eyebrow">
                один вопрос
              </p>


              <h1 className="title">

                Можно

                <span className="titleAccent">
                  честно?
                </span>

              </h1>


              <p className="text">

                Мне хотелось бы встретиться
                с тобой и провести время вместе.

                <br />
                <br />

                Если тебе тоже этого хочется —
                ты знаешь, что нажать.

              </p>


              <button

                className="button"

                onClick={() => handleAnswer("газ")}

              >

                Газ 🚀

              </button>


              <button

                className=
                  "button buttonSecondary"

                onClick={() => handleAnswer("-")}

              >

                -

              </button>

            </div>

          )}


          {/* =================================================
              STEP 2
          ================================================= */}

          {step === 2 && (

            <div>

              <div className="icon">
                ❤️
              </div>


              <p className="eyebrow">
                тогда...
              </p>


              <h1 className="title">

                Начинаем

                <span className="titleAccent">
                  нашу историю
                </span>

              </h1>


              <p className="text">

                Теперь осталось решить,

                <strong>
                  {" "}какой будет наша встреча.
                </strong>

              </p>


              <button

                className="button"

                onClick={() =>
                  goToStep(4)
                }

              >

                Выбрать атмосферу

                <span
                  style={{
                    marginLeft: 8
                  }}
                >
                  ✦
                </span>

              </button>

            </div>

          )}


          {/* =================================================
              STEP 3
          ================================================= */}

          {step === 3 && (

            <div>

              <div className="icon">
                💙
              </div>


              <p className="eyebrow">
                спасибо
              </p>


              <h1 className="title">

                Всё

                <span className="titleAccent">
                  честно
                </span>

              </h1>


              <p className="text">

                Я уважаю твой выбор.

                <br />
                <br />

                Мне было важно попробовать
                и сказать то, что я чувствую.

                <br />
                <br />

                Спасибо, что прошла
                этот небольшой путь.

              </p>

            </div>

          )}


          {/* =================================================
              STEP 4 — ВЫБОР ВАЙБА
          ================================================= */}

          {step === 4 && (

            <div>

              <p className="eyebrow">
                наша встреча
              </p>


              <h1 className="title">

                Какой будет

                <span className="titleAccent">
                  наша глава?
                </span>

              </h1>


              <p className="text">

                Выбери то настроение,
                которое тебе ближе.

              </p>


              <div className="choices">


                {/* ПРОГУЛКА */}

                <button

                  className="choice"

                  onClick={() => handleChoice("🌆 Прогулка", 8)}

                >

                  <div className="choiceIcon">
                    🌆
                  </div>


                  <div className="choiceText">

                    <div className="choiceTitle">
                      Прогулка
                    </div>


                    <div className="choiceDescription">

                      разговоры, смех
                      и красивые моменты

                    </div>

                  </div>

                </button>


                {/* УЖИН */}

                <button

                  className="choice"

                  onClick={() => handleChoice("🍽 Ужин", 5)}

                >

                  <div className="choiceIcon">
                    🍽
                  </div>


                  <div className="choiceText">

                    <div className="choiceTitle">
                      Ужин
                    </div>


                    <div className="choiceDescription">

                      уютный вечер
                      только для нас

                    </div>

                  </div>

                </button>


                {/* СЮРПРИЗ */}

                <button

                  className="choice"

                  onClick={() => handleChoice("🎁 Сюрприз", 8)}

                >

                  <div className="choiceIcon">
                    🎁
                  </div>


                  <div className="choiceText">

                    <div className="choiceTitle">
                      Сюрприз
                    </div>


                    <div className="choiceDescription">

                      просто доверься мне

                    </div>

                  </div>

                </button>

              </div>

            </div>

          )}


          {/* =================================================
              STEP 5 — УЖИН
          ================================================= */}

          {step === 5 && (

            <div>

              <div className="icon">
                ✦
              </div>


              <p className="eyebrow">
                отличный выбор
              </p>


              <h1 className="title">

                Тогда

                <span className="titleAccent">
                  решено
                </span>

              </h1>


              <div className="selectedChoice">
                {choice}
              </div>


              <p className="text">

                Осталось выбрать день
                и время.

                <br />
                <br />

                А дальше останется только
                дождаться нашей встречи.

              </p>


              <button

                className="button"

                onClick={() =>
                  goToStep(6)
                }

              >

                Выбрать дату

                <span
                  style={{
                    marginLeft: 8
                  }}
                >
                  →
                </span>

              </button>

            </div>

          )}


          {/* =================================================
              STEP 6 — ДАТА
          ================================================= */}

          {step === 6 && (

            <div>

              <div className="icon">
                🕊️
              </div>


              <p className="eyebrow">
                последний шаг
              </p>


              <h1 className="title">

                Когда

                <span className="titleAccent">
                  увидимся?
                </span>

              </h1>


              <p className="text">

                Выбери день и время,
                когда тебе будет удобно.

              </p>


              <div className="inputGroup">


                <label className="inputLabel">
                  Дата
                </label>


                <input

                  className="input"

                  type="date"

                  value={date}

                  onChange={(e) =>
                    setDate(
                      e.target.value
                    )
                  }

                />


                <label className="inputLabel">
                  Время
                </label>


                <input

                  className="input"

                  type="time"

                  value={time}

                  onChange={(e) =>
                    setTime(
                      e.target.value
                    )
                  }

                />

              </div>


              <button

                className="button"

                onClick={
                  handleFinalSubmit
                }

              >

                Отправить предложение

                <span
                  style={{
                    marginLeft: 8
                  }}
                >
                  ♡
                </span>

              </button>

            </div>

          )}


          {/* =================================================
              STEP 7 — ФИНАЛ
          ================================================= */}

          {step === 7 && (

            <div>

              <div className="finalHeart">
                ♡
              </div>


              <p className="eyebrow">
                до встречи
              </p>


              <h1 className="finalTitle">

                Спасибо,

                <br />

                что согласилась ❤️

              </h1>


              <div className="photoFrame">

                {photos.length > 0 ? (

                  <img

                    className="photo"

                    src={photos[0]}

                    alt="Наш момент"

                  />

                ) : (

                  <div
                    style={{
                      height: 370,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "rgba(255,255,255,.5)",
                      fontFamily: "Inter, sans-serif",
                      fontSize: 13,
                      background: "rgba(255,255,255,.05)"
                    }}
                  >
                    Добавь фотографию
                    love1.jpg
                  </div>

                )}

              </div>


              <p className="text">

                Мне очень приятно,
                что ты прошла этот путь
                вместе со мной.

                <br />
                <br />

                Теперь осталось только
                дождаться нашей встречи.

              </p>


              <div className="finalNote">

                Пусть это станет
                началом красивого
                воспоминания.

              </div>

            </div>

          )}


          {/* =================================================
              STEP 8 — 22–23 АВГУСТА
          ================================================= */}

          {step === 8 && (

            <div className="specialPage">

              <div className="specialIcon">
                📅
              </div>


              <p className="eyebrow">
                важная информация
              </p>


              <h1 className="specialTitle">

                Отменяй

                <span>
                  все планы
                </span>

              </h1>


              <div className="specialDates">
                22 — 23 августа
              </div>


              <p className="specialText">

                Эти два дня уже заняты.

                <br />
                <br />

                Так что никаких других планов.
                Я официально забираю их себе ❤️

              </p>


              <button

                className="button"

                onClick={() =>
                  goToStep(7)
                }

              >

                Хорошо, договорились

                <span
                  style={{
                    marginLeft: 8
                  }}
                >
                  ♡
                </span>

              </button>

            </div>

          )}

        </section>

      </main>

    </>

  );

}


export default App;