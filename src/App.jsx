@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@300;400;500;600&family=Caveat:wght@500;700&display=swap');

* {
  box-sizing: border-box;
}

html, body, #root {
  margin: 0;
  min-height: 100%;
  width: 100%;
}

body {
  background: #170912;
}

button, textarea, input {
  font-family: inherit;
}

button {
  -webkit-tap-highlight-color: transparent;
}

/* ОСНОВНОЙ ФОН */
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
    radial-gradient(circle at 15% 15%, rgba(181, 52, 105, 0.22), transparent 30%),
    radial-gradient(circle at 85% 85%, rgba(121, 35, 73, 0.2), transparent 32%),
    linear-gradient(135deg, #16080f 0%, #2a0d1a 48%, #12070d 100%);
}

/* ФОТО-СНЕГ */
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
  bottom: -200px;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
  padding: 3px;
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.3), 0 0 20px rgba(255, 160, 195, 0.08);
  will-change: transform, opacity;
  animation: photoFly linear forwards;
}

.photoFlake img {
  width: 100%;
  height: 100%;
  display: block;
  object-fit: cover;
  border-radius: 10px;
  user-select: none;
  -webkit-user-drag: none;
}

@keyframes photoFly {
  0% { transform: translate3d(0, 0, 0) rotate(var(--rotation)); }
  50% { transform: translate3d(calc(var(--drift) * -0.2), -55vh, 0) rotate(calc(var(--rotation) - 7deg)); }
  100% { transform: translate3d(var(--drift), -125vh, 0) rotate(calc(var(--rotation) - 8deg)); }
}

/* ДЕКОРАТИВНЫЕ СВЕТЯЩИЕСЯ ШАРЫ */
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
  background: rgba(205, 57, 116, 0.2);
  animation: orbMoveOne 12s ease-in-out infinite;
}

.orbTwo {
  width: 380px;
  height: 380px;
  right: -180px;
  bottom: -170px;
  background: rgba(143, 38, 83, 0.2);
  animation: orbMoveTwo 15s ease-in-out infinite;
}

.orbThree {
  width: 190px;
  height: 190px;
  top: 40%;
  left: 55%;
  background: rgba(220, 91, 139, 0.08);
  animation: orbMoveThree 10s ease-in-out infinite;
}

@keyframes orbMoveOne {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(80px, 50px); }
}

@keyframes orbMoveTwo {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-60px, -50px); }
}

@keyframes orbMoveThree {
  0%, 100% { transform: scale(1); opacity: 0.5; }
  50% { transform: scale(1.3); opacity: 1; }
}

.grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.035;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 180 180' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='.8'/%3E%3C/svg%3E");
  z-index: 1;
}

/* КАРТОЧКА */
.card {
  width: min(480px, 100%);
  position: relative;
  z-index: 10;
  padding: 44px 42px 42px;
  border-radius: 34px;
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.12), rgba(255, 255, 255, 0.055));
  border: 1px solid rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(30px);
  -webkit-backdrop-filter: blur(30px);
  box-shadow: 0 35px 100px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.13);
  
  /* Улучшенная анимация (пружинистая) */
  transition: opacity 0.5s cubic-bezier(0.16, 1, 0.3, 1), transform 0.5s cubic-bezier(0.16, 1, 0.3, 1);
}

.card.hidden {
  opacity: 0;
  transform: translateY(20px) scale(0.97);
}

.card.visible {
  opacity: 1;
  transform: translateY(0) scale(1);
}

/* ВЕРХНЯЯ НАДПИСЬ */
.topLine {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  margin-bottom: 26px;
  color: rgba(255, 220, 231, 0.55);
  font-family: Inter, sans-serif;
  font-size: 11px;
  letter-spacing: 3px;
  text-transform: uppercase;
}

.topLine::before, .topLine::after {
  content: "";
  width: 35px;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(255, 200, 220, 0.35));
}
.topLine::after {
  background: linear-gradient(90deg, rgba(255, 200, 220, 0.35), transparent);
}

/* ПРОГРЕСС */
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
  background: rgba(255, 255, 255, 0.15);
  transition: all 0.35s ease;
}

.progressDot.active {
  width: 24px;
  border-radius: 10px;
  background: #d97a9f;
  box-shadow: 0 0 14px rgba(217, 122, 159, 0.45);
}

/* ТЕКСТ */
.eyebrow {
  margin: 0 0 12px;
  font-family: Inter, sans-serif;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 3px;
  text-transform: uppercase;
  color: rgba(255, 210, 225, 0.58);
}

.title {
  margin: 0;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(42px, 9vw, 58px);
  line-height: 0.95;
  font-weight: 600;
  letter-spacing: -1.5px;
  color: #fff5f8;
  text-shadow: 0 10px 35px rgba(0, 0, 0, 0.25);
}

.titleAccent {
  display: block;
  margin-top: 5px;
  font-style: italic;
  /* Добавлен градиент для премиальности */
  background: linear-gradient(135deg, #f3bacd, #e8a1bb);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.text {
  margin: 24px 0 0;
  font-family: Inter, sans-serif;
  font-size: 15px;
  font-weight: 300;
  line-height: 1.85;
  color: rgba(255, 235, 241, 0.72);
}

.text strong {
  color: rgba(255, 240, 245, 0.95);
  font-weight: 500;
}

/* ИКОНКА */
.icon {
  width: 72px;
  height: 72px;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 0 auto 24px;
  border-radius: 50%;
  background: rgba(218, 105, 148, 0.1);
  border: 1px solid rgba(255, 190, 215, 0.14);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.15);
  font-size: 30px;
  animation: iconPulse 3s ease-in-out infinite;
}

@keyframes iconPulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.045); }
}

/* TEXTAREA */
.textarea {
  width: 100%;
  min-height: 132px;
  margin-top: 25px;
  padding: 18px 19px;
  resize: vertical;
  outline: none;
  border-radius: 20px;
  border: 1px solid rgba(255, 190, 215, 0.17);
  background: rgba(255, 255, 255, 0.055);
  color: #fff;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 300;
  line-height: 1.6;
  transition: border 0.25s ease, background 0.25s ease, box-shadow 0.25s ease;
}

.textarea::placeholder { color: rgba(255, 225, 235, 0.35); }
.textarea:focus {
  background: rgba(255, 255, 255, 0.075);
  border-color: rgba(225, 125, 162, 0.45);
  box-shadow: 0 0 0 4px rgba(225, 125, 162, 0.06);
}

/* КНОПКИ С SHIMMER ЭФФЕКТОМ */
.button {
  position: relative;
  overflow: hidden;
  width: 100%;
  min-height: 55px;
  margin-top: 15px;
  padding: 15px 20px;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  cursor: pointer;
  background: linear-gradient(135deg, #c65b82, #8f3157);
  color: #fff;
  font-family: Inter, sans-serif;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.2px;
  box-shadow: 0 12px 30px rgba(115, 30, 62, 0.28);
  transition: transform 0.25s ease, box-shadow 0.25s ease, filter 0.25s ease;
}

/* Блик по кнопке */
.button::after {
  content: "";
  position: absolute;
  top: 0;
  left: -100%;
  width: 50%;
  height: 100%;
  background: linear-gradient(to right, transparent, rgba(255,255,255,0.25), transparent);
  transform: skewX(-20deg);
  animation: shimmer 4s infinite cubic-bezier(0.4, 0, 0.2, 1);
}

@keyframes shimmer {
  0% { left: -100%; }
  25% { left: 200%; }
  100% { left: 200%; }
}

.button:hover {
  transform: translateY(-3px);
  box-shadow: 0 17px 38px rgba(115, 30, 62, 0.38);
  filter: brightness(1.08);
}
.button:active {
  transform: translateY(0) scale(0.985);
}

.buttonSecondary {
  background: rgba(255, 255, 255, 0.045);
  border: 1px solid rgba(255, 210, 225, 0.12);
  color: rgba(255, 235, 242, 0.72);
  box-shadow: none;
}
.buttonSecondary::after { display: none; }
.buttonSecondary:hover {
  background: rgba(255, 255, 255, 0.075);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.12);
}

/* ВЫБОР */
.choices {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 26px;
}

.choice {
  width: 100%;
  padding: 17px 18px;
  display: flex;
  align-items: center;
  gap: 15px;
  text-align: left;
  cursor: pointer;
  border-radius: 20px;
  border: 1px solid rgba(255, 210, 225, 0.11);
  background: rgba(255, 255, 255, 0.045);
  color: white;
  transition: transform 0.25s ease, background 0.25s ease, border 0.25s ease, box-shadow 0.25s ease;
}

.choice:hover {
  transform: translateX(5px);
  background: rgba(255, 255, 255, 0.085);
  border-color: rgba(231, 145, 174, 0.28);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.15);
}

.choiceIcon {
  width: 43px;
  height: 43px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 14px;
  background: rgba(222, 108, 149, 0.1);
  font-size: 19px;
}

.choiceText { display: flex; flex-direction: column; gap: 3px; }
.choiceTitle { font-family: Inter, sans-serif; font-size: 14px; font-weight: 500; color: rgba(255, 240, 245, 0.94); }
.choiceDescription { font-family: Inter, sans-serif; font-size: 12px; line-height: 1.5; font-weight: 300; color: rgba(255, 225, 235, 0.45); }

/* СПЕЦИАЛЬНАЯ СТРАНИЦА */
.specialPage { text-align: center; }
.specialIcon {
  width: 92px; height: 92px;
  margin: 0 auto 28px;
  display: flex; align-items: center; justify-content: center;
  border-radius: 50%;
  background: radial-gradient(circle, rgba(226, 122, 157, 0.18), rgba(226, 122, 157, 0.04));
  border: 1px solid rgba(255, 195, 215, 0.15);
  box-shadow: 0 20px 55px rgba(0, 0, 0, 0.22);
  font-size: 36px;
  animation: specialPulse 3s ease-in-out infinite;
}

@keyframes specialPulse {
  0%, 100% { transform: scale(1); box-shadow: 0 20px 55px rgba(0, 0, 0, 0.22); }
  50% { transform: scale(1.05); box-shadow: 0 20px 70px rgba(183, 64, 105, 0.25); }
}

.specialTitle {
  margin: 0;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: clamp(43px, 10vw, 61px);
  line-height: 0.95;
  font-weight: 600;
  letter-spacing: -1.5px;
  color: #fff4f7;
}
.specialTitle span {
  display: block;
  margin-top: 7px;
  font-style: italic;
  color: #e8a1bb;
}

.specialDates {
  display: inline-flex;
  margin-top: 28px;
  padding: 13px 20px;
  border-radius: 999px;
  background: rgba(221, 107, 149, 0.09);
  border: 1px solid rgba(221, 107, 149, 0.17);
  color: rgba(255, 225, 236, 0.78);
  font-family: Inter, sans-serif;
  font-size: 12px;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.specialText {
  margin-top: 25px; font-family: Inter, sans-serif;
  font-size: 14px; line-height: 1.8; font-weight: 300;
  color: rgba(255, 230, 238, 0.58);
}

.selectedChoice {
  margin-top: 25px; padding: 17px;
  border-radius: 18px; background: rgba(224, 115, 153, 0.08);
  border: 1px solid rgba(224, 115, 153, 0.16);
  color: #f3bacd; font-family: Inter, sans-serif; font-size: 13px;
}

/* INPUT + КАСТОМНЫЕ ИКОНКИ ДАТЫ/ВРЕМЕНИ */
.inputGroup { margin-top: 25px; }
.inputLabel {
  display: block; margin-bottom: 8px; text-align: left;
  font-family: Inter, sans-serif; font-size: 11px;
  letter-spacing: 1.5px; text-transform: uppercase; color: rgba(255, 220, 230, 0.45);
}

.input {
  width: 100%; height: 54px; padding: 0 16px;
  margin-bottom: 12px; outline: none; border-radius: 17px;
  border: 1px solid rgba(255, 205, 220, 0.13); background: rgba(255, 255, 255, 0.055);
  color: rgba(255, 240, 245, 0.9); font-family: Inter, sans-serif; font-size: 14px;
  transition: 0.25s ease; color-scheme: dark;
}
.input:focus {
  border-color: rgba(225, 125, 162, 0.45); background: rgba(255, 255, 255, 0.075);
  box-shadow: 0 0 0 4px rgba(225, 125, 162, 0.05);
}

/* Красим иконку календарика в розовый тон */
input[type="date"]::-webkit-calendar-picker-indicator,
input[type="time"]::-webkit-calendar-picker-indicator {
  filter: invert(0.8) sepia(1) hue-rotate(300deg) saturate(3);
  cursor: pointer;
}

.error-message {
  color: #ffb3c6;
  font-family: Inter, sans-serif;
  font-size: 13px;
  margin-bottom: 15px;
  background: rgba(255, 0, 0, 0.15);
  padding: 12px;
  border-radius: 12px;
  border: 1px solid rgba(255, 0, 0, 0.2);
}

/* ФИНАЛЬНОЕ ФОТО В СТИЛЕ POLAROID */
.photoFrame {
  position: relative;
  margin-top: 35px;
  background: #fdfbfb;
  padding: 14px 14px 60px 14px;
  border-radius: 4px;
  box-shadow: 0 25px 65px rgba(0, 0, 0, 0.38);
  transform: rotate(-3deg);
  animation: photoReveal 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.photoFrame::before {
  content: "Наш момент";
  position: absolute;
  bottom: 15px;
  left: 0;
  right: 0;
  text-align: center;
  font-family: 'Caveat', cursive;
  font-size: 26px;
  color: #4a4a4a;
}

.photo {
  width: 100%;
  height: 350px;
  display: block;
  object-fit: cover;
  object-position: center;
  border-radius: 2px;
}

@keyframes photoReveal {
  from { opacity: 0; transform: translateY(35px) scale(0.96) rotate(0deg); }
  to { opacity: 1; transform: translateY(0) scale(1) rotate(-3deg); }
}

.finalTitle {
  margin-top: 20px;
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 43px; line-height: 1; font-weight: 600; color: #fff3f7;
}
.finalHeart {
  display: inline-block; font-size: 38px;
  animation: finalHeart 2.5s ease-in-out infinite;
}
@keyframes finalHeart {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.12); }
}

.finalNote {
  margin-top: 20px; padding-top: 20px;
  border-top: 1px solid rgba(255, 210, 225, 0.09);
  font-family: "Cormorant Garamond", Georgia, serif;
  font-size: 22px; line-height: 1.4; font-style: italic; color: rgba(255, 220, 232, 0.72);
}

/* АДАПТИВ */
@media (max-width: 600px) {
  .page { padding: 18px 14px; }
  .card { padding: 34px 22px 27px; border-radius: 28px; }
  .title { font-size: 44px; }
  .text { font-size: 14px; line-height: 1.75; }
  .photo { height: 310px; }
  .finalTitle { font-size: 38px; }
  .specialTitle { font-size: 47px; }
  .topLine { margin-bottom: 21px; }
  .progress { margin-bottom: 23px; }
  .photoFlake { box-shadow: 0 8px 22px rgba(0, 0, 0, 0.25); }
}