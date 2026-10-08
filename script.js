const questions = [
  {
    question: "Which language is mainly used to structure a web page?",
    options: ["HTML", "CSS", "SQL", "C++"],
    answer: "HTML"
  },
  {
    question: "Which keyword declares a constant variable in JavaScript?",
    options: ["var", "let", "const", "static"],
    answer: "const"
  },
  {
    question: "Which data structure follows FIFO?",
    options: ["Stack", "Queue", "Tree", "Graph"],
    answer: "Queue"
  },
  {
    question: "Which SQL command is used to retrieve data?",
    options: ["INSERT", "SELECT", "DELETE", "UPDATE"],
    answer: "SELECT"
  },
  {
    question: "Which symbol is used for a single-line comment in JavaScript?",
    options: ["<!-- -->", "//", "#", "/* */"],
    answer: "//"
  }
];

const QUIZ_TIME = 60;
let current = 0;
let score = 0;
let selected = null;
let timeLeft = QUIZ_TIME;
let timerId = null;
let playerName = "";

const $ = id => document.getElementById(id);
const startScreen = $("start-screen");
const quizScreen = $("quiz-screen");
const resultScreen = $("result-screen");

$("start-btn").addEventListener("click", startQuiz);
$("next-btn").addEventListener("click", nextQuestion);
$("restart-btn").addEventListener("click", () => location.reload());

function startQuiz() {
  playerName = $("student-name").value.trim();
  if (!playerName) {
    $("start-error").textContent = "Please enter your name.";
    return;
  }

  current = 0;
  score = 0;
  startScreen.classList.add("hidden");
  quizScreen.classList.remove("hidden");
  showQuestion();
  startTimer();
}

function showQuestion() {
  const q = questions[current];
  selected = null;
  $("question-number").textContent = `Question ${current + 1} of ${questions.length}`;
  $("question").textContent = q.question;
  $("next-btn").disabled = true;
  $("next-btn").textContent = current === questions.length - 1 ? "Finish" : "Next";
  $("progress-bar").style.width = `${((current + 1) / questions.length) * 100}%`;

  const options = $("options");
  options.innerHTML = "";

  q.options.forEach(option => {
    const button = document.createElement("button");
    button.className = "option";
    button.textContent = option;
    button.addEventListener("click", () => selectOption(option, button));
    options.appendChild(button);
  });
}

function selectOption(option, button) {
  selected = option;
  document.querySelectorAll(".option").forEach(b => b.classList.remove("selected"));
  button.classList.add("selected");
  $("next-btn").disabled = false;
}

function nextQuestion() {
  if (selected === null) return;

  if (selected === questions[current].answer) score++;
  current++;

  if (current < questions.length) showQuestion();
  else finishQuiz();
}

function startTimer() {
  timeLeft = QUIZ_TIME;
  $("timer").textContent = `Time: ${timeLeft}s`;

  clearInterval(timerId);
  timerId = setInterval(() => {
    timeLeft--;
    $("timer").textContent = `Time: ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      finishQuiz();
    }
  }, 1000);
}

function finishQuiz() {
  clearInterval(timerId);
  quizScreen.classList.add("hidden");
  resultScreen.classList.remove("hidden");

  $("result-name").textContent = `Student: ${playerName}`;
  $("score").textContent = `${score} / ${questions.length}`;
  $("message").textContent =
    score === questions.length ? "Excellent!" :
    score >= 3 ? "Good attempt!" : "Keep practicing and try again.";
}
