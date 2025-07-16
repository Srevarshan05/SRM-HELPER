const timerDisplay = document.getElementById('timerDisplay');
const timerLabel = document.getElementById('timerLabel');
const sessionCountDisplay = document.getElementById('sessionCount');
const completedSessionsDisplay = document.getElementById('completedSessions');
const totalFocusTimeDisplay = document.getElementById('totalFocusTime');
const totalBreaksDisplay = document.getElementById('totalBreaks');
const productivityDisplay = document.getElementById('productivity');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');
const resetBtn = document.getElementById('resetBtn');
const alarmSound = document.getElementById('alarmSound');

let timerInterval;
let timeLeft;
let originalTime = 25 * 60;
let isPaused = true;
let sessionCount = 1;
let completedSessions = 0;
let totalFocusTime = 0;
let totalBreaks = 0;
let currentMode = "focus";

function updateDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  let seconds = timeLeft % 60;
  seconds = seconds < 10 ? "0" + seconds : seconds;
  timerDisplay.textContent = `${minutes}:${seconds}`;
}

function startTimer() {
  if (timerInterval || timeLeft <= 0) return;

  startBtn.style.display = "none";
  pauseBtn.style.display = "inline-block";
  isPaused = false;

  timerInterval = setInterval(() => {
    if (!isPaused && timeLeft > 0) {
      timeLeft--;
      updateDisplay();
    } else if (timeLeft === 0) {
      clearInterval(timerInterval);
      timerInterval = null;
      alarmSound.play();
      updateStats();

      if (currentMode === "focus") {
        completedSessions++;
        totalFocusTime += originalTime / 60;
        startBreak();
      } else {
        startFocus();
      }
    }
  }, 1000);
}

function pauseTimer() {
  isPaused = true;
  startBtn.style.display = "inline-block";
  pauseBtn.style.display = "none";
  clearInterval(timerInterval);
}

function resetTimer() {
  clearInterval(timerInterval);
  timerInterval = null;
  isPaused = true;
  startBtn.style.display = "inline-block";
  pauseBtn.style.display = "none";

  if (currentMode === "focus") {
    timeLeft = originalTime;
    timerLabel.textContent = "Focus Time";
  } else {
    timeLeft = 5 * 60;
    timerLabel.textContent = "Break Time";
  }

  updateDisplay();
}

function startBreak() {
  currentMode = "break";
  timerLabel.textContent = "Break Time";
  timeLeft = 5 * 60;
  updateDisplay();
  totalBreaks++;
  startTimer();
}

function startFocus() {
  currentMode = "focus";
  timerLabel.textContent = "Focus Time";
  timeLeft = originalTime;
  updateDisplay();
  sessionCount++;
  sessionCountDisplay.textContent = `Session ${sessionCount}`;
  startTimer();
}

function updateStats() {
  completedSessionsDisplay.textContent = completedSessions;
  const hours = Math.floor(totalFocusTime / 60);
  const minutes = Math.floor(totalFocusTime % 60);
  totalFocusTimeDisplay.textContent = `${hours}h ${minutes}m`;
  totalBreaksDisplay.textContent = totalBreaks;
  const productivity = completedSessions * 10; // Example productivity score
  productivityDisplay.textContent = `${productivity}%`;
}

// Initialize timer
resetTimer();
