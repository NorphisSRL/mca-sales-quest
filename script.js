const pages = Array.from(document.querySelectorAll(".funnel-page"));
const progressBar = document.querySelector("#progressBar");
const fakePercent = document.querySelector("#fakePercent");
const fakeBar = document.querySelector("#fakeBar");
const tryProduct = document.querySelector("#tryProduct");
const nextButtons = document.querySelectorAll("[data-next]");
const yesButton = document.querySelector("#yesButton");
const noButton = document.querySelector("#noButton");
const choiceZone = document.querySelector("#choiceZone");
const excuseBox = document.querySelector("#excuseBox");
const proofButtons = document.querySelectorAll(".mini-card");
const proofResult = document.querySelector("#proofResult");
const partyButton = document.querySelector("#partyButton");
const copiedText = document.querySelector("#copiedText");
const daysLeft = document.querySelector("#daysLeft");
const hoursLeft = document.querySelector("#hoursLeft");
const minutesLeft = document.querySelector("#minutesLeft");
const toast = document.querySelector("#toast");
const chaosModal = document.querySelector("#chaosModal");
const returnToNo = document.querySelector("#returnToNo");
const canvas = document.querySelector("#confetti");
const ctx = canvas.getContext("2d");

const excuses = [
  "No non disponibile: sta facendo roleplay con un'obiezione.",
  "Il No è scappato perché ha sentito 'obiettivo unico: MCA'.",
  "Errore 404: motivo valido per non fare una prova con Francesco non trovato.",
  "Il No ha chiesto a ChatGPT una scusa, ma era troppo debole.",
  "Il No è in call con il supporto MCA. Torna forse mai.",
  "Obiezione gestita: passiamo alla chiusura?",
];

const proofCopy = {
  studenti:
    "So cosa vive uno studente MCA: dubbi, entusiasmo, call, esercizi, voglia di svoltare. Questo mi aiuta a comunicare in modo vero.",
  prodotto:
    "Non venderei una cosa qualunque. Venderei un'accademia che conosco, rispetto e in cui credo davvero.",
  team:
    "Il punto non è solo entrare. Il punto è mettere la mia parte per far crescere MCA sempre di più.",
};

const deadline = new Date("2026-07-31T23:59:59+02:00");

let currentPage = 0;
let noAttempts = 0;
let confettiPieces = [];
let animationFrame;

function showPage(index) {
  currentPage = Math.max(0, Math.min(index, pages.length - 1));
  pages.forEach((page, pageIndex) => {
    page.classList.toggle("is-active", pageIndex === currentPage);
  });
  progressBar.style.width = `${((currentPage + 1) / pages.length) * 100}%`;
  pages[currentPage].scrollTop = 0;
  window.scrollTo(0, 0);
}

function showToast(text) {
  toast.textContent = text;
  toast.classList.add("is-visible");
  window.clearTimeout(showToast.timer);
  showToast.timer = window.setTimeout(() => toast.classList.remove("is-visible"), 1600);
}

function updateCountdown() {
  const remaining = Math.max(0, deadline.getTime() - Date.now());
  const totalMinutes = Math.floor(remaining / 60000);
  const days = Math.floor(totalMinutes / 1440);
  const hours = Math.floor((totalMinutes % 1440) / 60);
  const minutes = totalMinutes % 60;

  daysLeft.textContent = String(days).padStart(2, "0");
  hoursLeft.textContent = String(hours).padStart(2, "0");
  minutesLeft.textContent = String(minutes).padStart(2, "0");
}

function moveNoButton() {
  const zone = choiceZone.getBoundingClientRect();
  const button = noButton.getBoundingClientRect();
  const yes = yesButton.getBoundingClientRect();
  const maxX = Math.max(0, zone.width - button.width - 18);
  const maxY = Math.max(0, zone.height - button.height - 18);
  let x = 12;
  let y = 12;

  for (let attempt = 0; attempt < 24; attempt += 1) {
    x = 12 + Math.random() * maxX;
    y = 12 + Math.random() * maxY;

    const next = {
      left: zone.left + x,
      right: zone.left + x + button.width,
      top: zone.top + y,
      bottom: zone.top + y + button.height,
    };
    const safeFromYes =
      next.right < yes.left - 18 ||
      next.left > yes.right + 18 ||
      next.bottom < yes.top - 18 ||
      next.top > yes.bottom + 18;

    if (safeFromYes) break;
  }

  noAttempts += 1;
  noButton.style.left = `${x}px`;
  noButton.style.top = `${y}px`;
  noButton.style.setProperty("--tilt", `${-14 + Math.random() * 28}deg`);
  noButton.classList.add("is-running");
  excuseBox.textContent = excuses[noAttempts % excuses.length];

  if (noAttempts > 3) {
    noButton.textContent = "No, pero con affetto";
  }

  if (noAttempts > 6) {
    noButton.textContent = "Ok, sì";
    noButton.style.background = "var(--green)";
  }
}

function resizeCanvas() {
  canvas.width = window.innerWidth * window.devicePixelRatio;
  canvas.height = window.innerHeight * window.devicePixelRatio;
  ctx.setTransform(window.devicePixelRatio, 0, 0, window.devicePixelRatio, 0, 0);
}

function launchConfetti(originX = window.innerWidth / 2, originY = window.innerHeight * 0.42) {
  const colors = ["#ff4a3d", "#ffd54d", "#35c486", "#4b7bff", "#ff5c8a", "#171615"];

  confettiPieces = Array.from({ length: 150 }, () => ({
    x: originX,
    y: originY,
    size: 5 + Math.random() * 9,
    color: colors[Math.floor(Math.random() * colors.length)],
    speedX: -9 + Math.random() * 18,
    speedY: -12 + Math.random() * 9,
    gravity: 0.26 + Math.random() * 0.22,
    rotation: Math.random() * 360,
    spin: -16 + Math.random() * 32,
    life: 95 + Math.random() * 50,
  }));

  cancelAnimationFrame(animationFrame);
  animateConfetti();
}

function animateConfetti() {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

  confettiPieces.forEach((piece) => {
    piece.x += piece.speedX;
    piece.y += piece.speedY;
    piece.speedY += piece.gravity;
    piece.rotation += piece.spin;
    piece.life -= 1;

    ctx.save();
    ctx.translate(piece.x, piece.y);
    ctx.rotate((piece.rotation * Math.PI) / 180);
    ctx.fillStyle = piece.color;
    ctx.fillRect(-piece.size / 2, -piece.size / 2, piece.size, piece.size * 0.65);
    ctx.restore();
  });

  confettiPieces = confettiPieces.filter((piece) => piece.life > 0 && piece.y < window.innerHeight + 90);

  if (confettiPieces.length) {
    animationFrame = requestAnimationFrame(animateConfetti);
  } else {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  }
}

tryProduct.addEventListener("click", () => {
  fakePercent.textContent = "99%";
  fakeBar.style.width = "99%";
  tryProduct.textContent = "Caricamento plot twist...";
  window.setTimeout(() => showPage(1), 520);
});

nextButtons.forEach((button) => {
  button.addEventListener("click", () => showPage(currentPage + 1));
});

noButton.addEventListener("mouseenter", moveNoButton);
noButton.addEventListener("focus", moveNoButton);
noButton.addEventListener("touchstart", (event) => {
  event.preventDefault();
  moveNoButton();
});
noButton.addEventListener("click", (event) => {
  event.preventDefault();
  moveNoButton();
  showToast("Tentativo di No registrato come interesse tiepido.");
});

yesButton.addEventListener("click", () => {
  if (noAttempts === 0) {
    chaosModal.hidden = false;
    showToast("Il CRM ha chiamato le risorse umane del pulsante No.");
    launchConfetti(window.innerWidth * 0.5, window.innerHeight * 0.18);
    return;
  }

  launchConfetti();
  showToast("Chiusura completata. Sales manager soddisfatto.");
  window.setTimeout(() => showPage(5), 650);
});

returnToNo.addEventListener("click", () => {
  chaosModal.hidden = true;
  moveNoButton();
  showToast("No riattivato. Livello teatralità: imbarazzante ma efficace.");
});

proofButtons.forEach((button) => {
  button.addEventListener("click", () => {
    proofButtons.forEach((item) => item.classList.remove("is-active"));
    button.classList.add("is-active");
    proofResult.textContent = proofCopy[button.dataset.proof];
  });
});

partyButton.addEventListener("click", () => {
  copiedText.textContent = "KPI esplosa. Il timer continua a giudicare in silenzio.";
  launchConfetti();
});

window.addEventListener("resize", resizeCanvas);

resizeCanvas();
updateCountdown();
window.setInterval(updateCountdown, 30000);
showPage(0);
