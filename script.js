const themeToggle = document.getElementById("theme-toggle");
const demoQuestion = document.getElementById("demo-question");
const demoOptions = document.getElementById("demo-options");
const demoExplanation = document.getElementById("demo-explanation");
const demoNext = document.getElementById("demo-next");
const demoProgress = document.getElementById("demo-progress");
const demoDifficulty = document.getElementById("demo-difficulty");
const optionLabels = ["A", "B", "C", "D"];
let currentIndex = 0;

const setTheme = (mode) => {
    document.body.classList.toggle("dark", mode === "dark");
    const icon = themeToggle?.querySelector(".theme-icon");
    const label = themeToggle?.querySelector(".theme-label");
    if (icon && label) {
        icon.textContent = mode === "dark" ? "☀️" : "🌙";
        label.textContent = mode === "dark" ? "Light" : "Dark";
    }
    localStorage.setItem("quizforge-theme", mode);
};

const storedTheme = localStorage.getItem("quizforge-theme");
if (storedTheme) {
    setTheme(storedTheme);
}

themeToggle?.addEventListener("click", () => {
    const nextTheme = document.body.classList.contains("dark") ? "light" : "dark";
    setTheme(nextTheme);
});

const resetOptions = () => {
    if (!demoOptions) return;
    demoOptions.querySelectorAll("button").forEach((button) => {
        button.classList.remove("correct", "wrong");
        button.disabled = false;
    });
};

const renderQuestion = () => {
    if (!demoQuestion || !demoOptions || !demoExplanation || !demoProgress || !demoDifficulty) {
        return;
    }
    const question = window.examData?.[currentIndex];
    if (!question) {
        demoQuestion.textContent = "No questions available.";
        return;
    }
    demoQuestion.textContent = question.question;
    demoExplanation.textContent = "Select an option to reveal the explanation.";
    demoProgress.textContent = `Question ${currentIndex + 1} of ${window.examData.length}`;
    demoDifficulty.textContent = question.difficulty ?? "Easy";
    demoOptions.innerHTML = "";
    question.options.forEach((option, index) => {
        const button = document.createElement("button");
        button.textContent = `${optionLabels[index]}. ${option}`;
        button.dataset.option = option;
        demoOptions.appendChild(button);
    });
    resetOptions();
    demoNext?.classList.add("hidden");
};

const revealAnswer = (button) => {
    if (!demoOptions || !button) return;
    const question = window.examData?.[currentIndex];
    if (!question) return;
    const isCorrect = button.dataset.option === question.correct;
    button.classList.add(isCorrect ? "correct" : "wrong");
    demoOptions.querySelectorAll("button").forEach((optionButton) => {
        optionButton.disabled = true;
        if (optionButton.dataset.option === question.correct) {
            optionButton.classList.add("correct");
        }
    });
    demoExplanation.textContent = question.explanation ?? "Explanation coming soon.";
    demoNext?.classList.remove("hidden");
};

demoOptions?.addEventListener("click", (event) => {
    const button = event.target.closest("button");
    if (!button || button.disabled) return;
    revealAnswer(button);
});

demoNext?.addEventListener("click", () => {
    if (!window.examData?.length) return;
    currentIndex = (currentIndex + 1) % window.examData.length;
    renderQuestion();
});

document.addEventListener("keydown", (event) => {
    const keyMap = { "1": 0, "2": 1, "3": 2, "4": 3 };
    if (!demoOptions || keyMap[event.key] === undefined) return;
    const optionButton = demoOptions.querySelectorAll("button")[keyMap[event.key]];
    if (optionButton) {
        revealAnswer(optionButton);
    }
});

if (window.examData?.length) {
    renderQuestion();
} else if (demoQuestion) {
    demoQuestion.textContent = "No questions loaded.";
}
