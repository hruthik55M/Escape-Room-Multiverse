document.addEventListener("DOMContentLoaded", () => {

  // ========== BACKGROUNDS ==========
  const backgrounds = [
    "assets/backgrounds/bg1.jpg",
    "assets/backgrounds/bg2.jpg",
    "assets/backgrounds/bg3.jpg",
    "assets/backgrounds/bg4.jpg",
    "assets/backgrounds/bg5.jpg",
    "assets/backgrounds/bg6.jpg"
  ];

  function randomBackground() {
    const pick = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    document.body.style.backgroundImage = `url(${pick})`;
  }

  randomBackground();

  // ========== LEVELS ==========
  const levels = ["Bronze", "Silver", "Gold"];

  // ========== SOUND EFFECTS ==========
  const sounds = {
    correct: new Audio("assets/sounds/correct.mp3"),
    wrong: new Audio("assets/sounds/wrong.mp3"),
    beep: new Audio("assets/sounds/beep.mp3"),
    levelup: new Audio("assets/sounds/levelup.mp3"),
    complete: new Audio("assets/sounds/complete.mp3")
  };

  function playSound(name) {
    if (sounds[name]) {
      sounds[name].currentTime = 0;
      sounds[name].play();
    }
  }

  // ========== BACKGROUND MUSIC ==========
  const bgMusic = new Audio("assets/sounds/bgmusic.mp3");
  bgMusic.volume = 0.15;
  bgMusic.loop = true;

  let muted = false;
  const muteBtn = document.getElementById("muteBtn");

  muteBtn.addEventListener("click", () => {
    muted = !muted;
    bgMusic.muted = muted;
    muteBtn.textContent = muted ? "🔈 Music On" : "🔊 Music Off";
  });

  // ========== QUESTIONS ==========
  const questions = [
    { q: "I have oceans but no water, forests but no trees, deserts but no sand, and roads but no cars. What am I?", a: "map", hint: "Used for directions" },
    { q: "What can travel around the world while staying in one corner?", a: "stamp", hint: "Envelope" },
    { q: "If 5 machines take 5 minutes to make 5 items, how long do 100 machines take to make 100 items?", a: "5 minutes", hint: "Same speed" },

    { q: "Unscramble: lbarytin", a: "labyrinth", hint: "Maze" },
    { q: "What comes next in the sequence: 3, 9, 27, 81, ?", a: "243", hint: "×3 each time" },
    { q: "I speak without a mouth and hear without ears. What am I?", a: "echo", hint: "Mountains" },

    { q: "If a/b = 3/4 and b/c = 5/6, what is a/c?", a: "5/8", hint: "Multiply fractions" },
    { q: "You have 9 coins, one is lighter. You can find it in how many weighings?", a: "2", hint: "Group method" },
    { q: "(12² × 4) − 25 = ?", a: "551", hint: "Square first!" },

    { q: "Born near the sea, he later helped a nation touch the sky. Who is this?", a: "apj abdul kalam", hint: "Missile Man" }
  ];

  // ========== VARIABLES ==========
  let current = 0;
  let score = 0;
  let timer = 60;
  let countdown;

  let gameStartTime = 0;

  const qLabel = document.getElementById("questionLabel");
  const input = document.getElementById("answerInput");
  const feedback = document.getElementById("feedback");
  const scoreBox = document.getElementById("score");
  const levelBox = document.getElementById("level");
  const timerBox = document.getElementById("timer");
  const nextBtn = document.getElementById("nextBtn");
  const startBtn = document.getElementById("startBtn");
  const hintBtn = document.getElementById("hintBtn");
  const helpBtn = document.getElementById("helpBtn");
  const hintBox = document.getElementById("hint");
  const finalBox = document.getElementById("final");

  // ========== LEVEL UPDATE ==========
  function updateLevel() {
    let index = Math.floor(current / 3);
    if (index > 2) index = 2;

    levelBox.textContent = "Level: " + levels[index];

    randomBackground();
    playSound("levelup");
  }

  // ========== SHOW QUESTION ==========
  function showQuestion() {
    qLabel.textContent = questions[current].q;
    input.value = "";
    feedback.textContent = "";
    hintBox.textContent = "";
    hintBtn.hidden = true;
    helpBtn.hidden = true;
  }

  // ========== TIMER ==========
  function startTimer() {
    timer = 60;
    timerBox.textContent = "01:00";

    countdown = setInterval(() => {
      timer--;
      timerBox.textContent = `00:${timer < 10 ? "0" + timer : timer}`;

      if (timer === 30) hintBtn.hidden = false;
      if (timer === 5) {
        helpBtn.hidden = false;
        playSound("beep");
      }

      if (timer <= 0) {
        clearInterval(countdown);
        nextQuestion();
      }
    }, 1000);
  }

  // ========== HINT + HELP ==========
  hintBtn.addEventListener("click", () => {
    hintBox.textContent = "Hint: " + questions[current].hint;
  });

  helpBtn.addEventListener("click", () => {
    hintBox.textContent = "Answer: " + questions[current].a;
  });

  // ========== START GAME ==========
  startBtn.addEventListener("click", () => {
    current = 0;
    score = 0;
    scoreBox.textContent = "Score: 0";
    startBtn.hidden = true;

    bgMusic.play();

    gameStartTime = Date.now();

    updateLevel();
    showQuestion();
    startTimer();
  });

  // ========== SUBMIT ==========
  document.getElementById("answerForm").addEventListener("submit", (e) => {
    e.preventDefault();

    const ans = input.value.trim().toLowerCase();
    const correct = questions[current].a.toLowerCase();

    if (ans === correct) {
      score += 10;
      feedback.textContent = "Correct!";
      playSound("correct");
    } else {
      feedback.textContent = "Wrong!";
      playSound("wrong");
    }

    scoreBox.textContent = `Score: ${score}`;
    clearInterval(countdown);
    nextBtn.hidden = false;
  });

  // ========== NEXT ==========
  function nextQuestion() {
    current++;

    if (current >= questions.length) {
      const endTime = Date.now();
      const minutesTaken = ((endTime - gameStartTime) / 1000 / 60).toFixed(2);

      qLabel.textContent = "🎉 Game Completed!";
      feedback.textContent = `Your Final Score: ${score}`;
      finalBox.innerHTML = `<br><h2>⏱ Time Taken: ${minutesTaken} minutes</h2>`;
      finalBox.hidden = false;

      playSound("complete");
      nextBtn.hidden = true;
      return;
    }

    updateLevel();
    showQuestion();
    startTimer();
    nextBtn.hidden = true;
  }

  nextBtn.addEventListener("click", nextQuestion);

});
