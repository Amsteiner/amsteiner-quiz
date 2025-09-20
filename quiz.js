const fragen = [
  "Nenne eine Figur aus einem Nintendo 64 Spiel.",
  "Nenne ein Item aus einem klassischen RPG.",
  "Nenne ein Fahrzeug aus einem Rennspiel der 90er."
];

let punto = 0;

const wakeWords = ["deal", "hilfe", "hinweis"];

function log(msg) {
  const logEl = document.getElementById("log");
  logEl.textContent += "\n" + msg;
  logEl.scrollTop = logEl.scrollHeight;
}

function speak(text) {
  const msg = new SpeechSynthesisUtterance(text);
  msg.lang = "de-DE";
  window.speechSynthesis.speak(msg);
}

function listen() {
  if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
    log("Spracherkennung wird nicht unterstützt in deinem Browser.");
    return;
  }
  const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new Recognition();
  recognition.lang = "de-DE";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  recognition.onresult = (event) => {
    const result = event.results[0][0].transcript.toLowerCase().trim();
    log("🗣️ Du sagtest: " + result);
    if (wakeWords.includes(result)) {
      log("🤝 Händler: Du bekommst einen Hinweis!");
    } else {
      if (result.length > 2) {
        punto += 10;
        log("✅ Gute Antwort! +10 Punkte. Gesamt: " + punto);
      } else {
        log("❌ Antwort war zu kurz. Kein Punkt.");
      }
    }
  };

  recognition.onerror = (event) => {
    log("❌ Fehler bei Spracherkennung: " + event.error);
  };

  recognition.onend = () => {
    log("🎤 Aufnahme beendet.");
  };

  recognition.start();
  log("🎧 Höre auf deine Antwort …");
}

function startGame() {
  document.getElementById("startBtn").classList.add("hidden");
  const frageEl = document.getElementById("frage");
  const frage = fragen[Math.floor(Math.random() * fragen.length)];
  frageEl.textContent = frage;
  frageEl.classList.remove("hidden");
  log("❓ Frage: " + frage);
  speak(frage);
  setTimeout(() => {
    listen();
  }, 3000);
}

window.onload = () => {
  const startBtn = document.getElementById("startBtn");
  startBtn.addEventListener("click", startGame);

  const statusEl = document.getElementById("status");
  const hasTTS = 'speechSynthesis' in window;
  const hasSTT = 'webkitSpeechRecognition' in window || 'SpeechRecognition' in window;

  if (!hasTTS || !hasSTT) {
    statusEl.textContent = "❌ Dein Browser unterstützt STT oder TTS nicht. Bitte nutze Google Chrome.";
  } else {
    statusEl.textContent = "✅ TTS & STT erkannt. Du kannst starten!";
    startBtn.classList.remove("hidden");
  }
};
