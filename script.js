
// Variables to track state
let currentQuestionIndex = 0;
let score = 0;

// DOM Elements
const questionEl = document.getElementById("question-text");
const optionsEl = document.getElementById("options-container");
const nextBtn = document.getElementById("next-btn");
const progressEl = document.getElementById("progress");
const quizSection = document.getElementById("quiz");
const resultSection = document.getElementById("results");
const scoreEl = document.getElementById("score");
const totalEl = document.getElementById("total");

// Initialize Quiz
function loadQuestion() {
    // Reset UI
    optionsEl.innerHTML = "";
    nextBtn.classList.add("hidden");

    // Get current question object from exam_data.js
    const currentQuizData = examData[currentQuestionIndex];

    // Update Text
    questionEl.innerText = currentQuizData.question;
    progressEl.innerText = `Question ${currentQuestionIndex + 1} of ${examData.length}`;

    // Create Buttons for Options
    currentQuizData.options.forEach(option => {
        const button = document.createElement("button");
        button.innerText = option;
        button.classList.add("option-btn");
        button.onclick = () => selectAnswer(button, currentQuizData.correct);
        optionsEl.appendChild(button);
    });
}

function selectAnswer(selectedBtn, correctAnswer) {
    const isCorrect = selectedBtn.innerText === correctAnswer;

    if (isCorrect) {
        selectedBtn.classList.add("correct");
        score++;
    } else {
        selectedBtn.classList.add("wrong");
    }

    // Disable all buttons after selection so user can't change answer
    const allOptions = optionsEl.querySelectorAll("button");
    allOptions.forEach(btn => {
        btn.disabled = true;
        // Highlight the correct answer if they got it wrong
        if (btn.innerText === correctAnswer) {
            btn.classList.add("correct");
        }
    });

    // Show Next Button
    nextBtn.classList.remove("hidden");
}

nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;

    if (currentQuestionIndex < examData.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

function showResults() {
    quizSection.classList.add("hidden");
    nextBtn.classList.add("hidden");
    resultSection.classList.remove("hidden");
    progressEl.innerText = "Completed";

    scoreEl.innerText = score;
    totalEl.innerText = examData.length;
}

// Start the app
loadQuestion();
    