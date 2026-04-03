/* ═══════════════════════════════════════════════════════════════
   FinQuest — Lesson / Quiz Engine
   Handles: TEACH → QUIZ → REINFORCEMENT → VICTORY flow
   ═══════════════════════════════════════════════════════════════ */

// ─── DEMO DATA ─────────────────────────────────────────────────
const DEMO_LESSONS = {
    0: {
        topic: "What is Money?",
        content: `Money is anything commonly accepted as a medium of exchange. 
        It serves three key functions: <strong>medium of exchange</strong> (used to buy things), 
        <strong>store of value</strong> (savings), and <strong>unit of account</strong> (measuring worth).
        <br><br>Modern money includes physical cash, digital payments, and cryptocurrency. 
        Understanding money is the foundation of financial literacy.`,
        questions: [
            {
                question: "What is the primary function of money?",
                options: ["Decoration", "Medium of exchange", "Weight measurement", "Time keeping"],
                correct: 1,
                explanation: "Money's primary function is as a medium of exchange — it allows people to trade goods and services efficiently."
            },
            {
                question: "Which of the following is NOT a function of money?",
                options: ["Store of value", "Unit of account", "Source of happiness", "Medium of exchange"],
                correct: 2,
                explanation: "While money can provide security, 'source of happiness' is not one of the three economic functions of money."
            },
            {
                question: "What makes something 'money'?",
                options: ["Its color", "Government decree or common acceptance", "Being made of gold", "Being heavy"],
                correct: 1,
                explanation: "Money works because people commonly accept it as payment, often backed by government decree (fiat money)."
            },
            {
                question: "Which is an example of digital money?",
                options: ["Gold coins", "Bank transfer", "Seashells", "Barter"],
                correct: 1,
                explanation: "Bank transfers are a form of digital money — value moves electronically without physical cash changing hands."
            },
            {
                question: "Why is money better than barter?",
                options: ["It's prettier", "It eliminates the double coincidence of wants", "It weighs less", "It never changes value"],
                correct: 1,
                explanation: "Barter requires both parties to want what the other has. Money solves this 'double coincidence of wants' problem."
            }
        ],
        reinforcement: [
            {
                question: "If you save ₹100 in a bank, money is acting as a:",
                options: ["Medium of exchange", "Unit of account", "Store of value", "Commodity"],
                correct: 2,
                explanation: "When you save money, it stores value for future use — this is the 'store of value' function."
            },
            {
                question: "The price tag on a shirt (₹500) shows money as:",
                options: ["Store of value", "Medium of exchange", "Unit of account", "Legal tender"],
                correct: 2,
                explanation: "Price tags use money as a unit of account — a standard measure to compare the value of different goods."
            },
            {
                question: "Which statement about money is TRUE?",
                options: ["Only coins are real money", "Money must be backed by gold", "Money's value comes from trust and acceptance", "Digital money isn't real money"],
                correct: 2,
                explanation: "Modern fiat money derives its value from the trust people place in it and government backing, not from inherent material value."
            }
        ]
    },
    6: {
        topic: "Stocks & Bonds",
        content: `<strong>Stocks</strong> represent ownership in a company. When you buy a stock, 
        you become a partial owner and can benefit from the company's growth through price appreciation and dividends.
        <br><br><strong>Bonds</strong> are like loans you give to governments or companies. 
        They pay you regular interest and return your principal at maturity. 
        Bonds are generally safer but offer lower returns than stocks.`,
        questions: [
            {
                question: "What does owning a stock represent?",
                options: ["A loan to a company", "Partial ownership of a company", "A government bond", "A savings account"],
                correct: 1,
                explanation: "Stocks represent equity — when you buy shares, you own a small piece of the company."
            },
            {
                question: "Bonds are best described as:",
                options: ["Ownership in a company", "Loans to governments or companies", "Real estate investments", "Cryptocurrency"],
                correct: 1,
                explanation: "When you buy a bond, you're essentially lending money to the issuer in exchange for regular interest payments."
            },
            {
                question: "Which typically has higher risk and higher potential return?",
                options: ["Bonds", "Savings accounts", "Stocks", "Fixed deposits"],
                correct: 2,
                explanation: "Stocks historically offer higher returns but come with greater volatility and risk compared to bonds."
            },
            {
                question: "What is a dividend?",
                options: ["A type of bond", "A share of company profits paid to stockholders", "A bank fee", "A tax payment"],
                correct: 1,
                explanation: "Dividends are portions of a company's profits distributed to shareholders, usually quarterly."
            },
            {
                question: "What happens when a bond 'matures'?",
                options: ["It expires worthless", "The issuer returns your principal", "You get more bonds", "The interest rate doubles"],
                correct: 1,
                explanation: "At maturity, the bond issuer pays back the face value (principal) of the bond to the holder."
            }
        ],
        reinforcement: [
            {
                question: "A conservative investor would likely prefer:",
                options: ["High-growth tech stocks", "Government bonds", "Cryptocurrency", "Penny stocks"],
                correct: 1,
                explanation: "Conservative investors prioritize safety — government bonds are among the safest investments available."
            },
            {
                question: "If a company's stock price drops 20%, a bondholder:",
                options: ["Also loses 20%", "Is generally unaffected", "Gets a bonus", "Must sell their bonds"],
                correct: 1,
                explanation: "Bondholders receive fixed interest regardless of stock price changes — their return comes from interest, not stock performance."
            },
            {
                question: "Which investment gives you voting rights in a company?",
                options: ["Corporate bonds", "Government bonds", "Common stocks", "Treasury bills"],
                correct: 2,
                explanation: "Common stockholders are partial owners and typically receive voting rights on major company decisions."
            }
        ]
    }
};


// ─── LESSON STATE ──────────────────────────────────────────────
const LessonState = {
    step: "teach",          // teach | quiz | reinforcement | victory
    levelId: 0,
    questionIndex: 0,
    answered: null,         // null | index
    correct: 0,
    total: 0,
    sessionXP: 0,
    streak: 3,
    xp: 250,
    reinforcementIndex: 0,
    reinforcementCorrect: 0,
    practiceFirstCorrect: true,

    get lessonData() {
        return DEMO_LESSONS[this.levelId] || DEMO_LESSONS[0];
    },

    get totalQuestions() {
        return this.lessonData.questions.length;
    },

    get currentQuestion() {
        if (this.step === "reinforcement") {
            return this.lessonData.reinforcement[this.reinforcementIndex];
        }
        return this.lessonData.questions[this.questionIndex];
    },

    get progressPercent() {
        if (this.step === "teach") return 0;
        if (this.step === "victory") return 100;
        if (this.step === "reinforcement") {
            const total = this.lessonData.reinforcement.length;
            return Math.round((this.reinforcementIndex / total) * 100);
        }
        return Math.round((this.questionIndex / this.totalQuestions) * 100);
    }
};


// ─── SVG ICONS ─────────────────────────────────────────────────
const LessonIcons = {
    lightbulb: `<svg width="18" height="18" viewBox="0 0 24 24" fill="#FFC107"><path d="M9 21c0 .5.4 1 1 1h4c.6 0 1-.5 1-1v-1H9v1zm3-19C8.1 2 5 5.1 5 9c0 2.4 1.2 4.5 3 5.7V17c0 .5.4 1 1 1h6c.6 0 1-.5 1-1v-2.3c1.8-1.3 3-3.4 3-5.7 0-3.9-3.1-7-7-7z"/></svg>`,
    target: `<svg width="16" height="16" viewBox="0 0 24 24" fill="#E53935"><circle cx="12" cy="12" r="10" fill="none" stroke="#E53935" stroke-width="2"/><circle cx="12" cy="12" r="6" fill="none" stroke="#E53935" stroke-width="2"/><circle cx="12" cy="12" r="2" fill="#E53935"/></svg>`,
    check: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#2e7d32" stroke-width="3" stroke-linecap="round"><polyline points="20 6 9 17 4 12"/></svg>`,
    xMark: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#c62828" stroke-width="3" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>`,
    trophy: `<svg viewBox="0 0 24 24" fill="#FFD700"><path d="M19 5h-2V3H7v2H5c-1.1 0-2 .9-2 2v1c0 2.55 1.92 4.63 4.39 4.94.63 1.5 1.98 2.63 3.61 2.96V19H7v2h10v-2h-4v-3.1c1.63-.33 2.98-1.46 3.61-2.96C19.08 12.63 21 10.55 21 8V7c0-1.1-.9-2-2-2zM5 8V7h2v3.82C5.84 10.4 5 9.3 5 8zm14 0c0 1.3-.84 2.4-2 2.82V7h2v1z"/></svg>`,
    flame: `<svg width="16" height="16" viewBox="0 0 24 24" fill="#fff"><path d="M12 23c-4.97 0-9-3.58-9-8 0-3.07 2.17-5.83 3.68-7.67l.6-.73c.26-.31.72-.33 1-.04l.38.4c1.4 1.52 3.16 3.45 3.64 5.81.38-.79.76-1.45 1.03-1.88l.42-.67c.2-.31.62-.4.92-.17C16.28 11.39 21 14.79 21 15c0 4.42-4.03 8-9 8z"/></svg>`,
    shield: `<svg width="16" height="16" viewBox="0 0 24 24" fill="#FF9600"><path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4z"/></svg>`,
};

const OPTION_LETTERS = ["A", "B", "C", "D"];


// ─── RENDER ENGINE ─────────────────────────────────────────────
function render() {
    updateProgress();
    updateHUD();

    const content = document.getElementById("lesson-content");

    switch (LessonState.step) {
        case "teach":
            renderTeach(content);
            break;
        case "quiz":
            renderQuiz(content);
            break;
        case "reinforcement":
            renderReinforcement(content);
            break;
        case "victory":
            renderVictory(content);
            break;
    }
}


// ─── TEACH SCREEN ──────────────────────────────────────────────
function renderTeach(container) {
    const data = LessonState.lessonData;
    const firstQ = data.questions[0];

    container.innerHTML = `
        <div class="quiz-card">
            <div class="quiz-card__step">
                ${LessonIcons.lightbulb}
                <span>LEARN</span>
            </div>
            <h2 class="quiz-card__title">${data.topic}</h2>
            <div class="quiz-card__body">${data.content}</div>
            <div class="example-box" style="margin-top: 20px;">
                ${LessonIcons.lightbulb}
                <strong style="color:#2e7d32;"> Practice Question Preview</strong><br>
                ${firstQ.question}
            </div>
        </div>
        <div style="display:flex; justify-content:center; margin-top:24px;">
            <button class="btn btn--primary btn--lg" id="teach-continue">
                Got it! Let's Practice
            </button>
        </div>
    `;

    document.getElementById("teach-continue").addEventListener("click", () => {
        LessonState.step = "quiz";
        LessonState.questionIndex = 0;
        LessonState.answered = null;
        LessonState.correct = 0;
        render();
    });
}


// ─── QUIZ SCREEN ───────────────────────────────────────────────
function renderQuiz(container) {
    const q = LessonState.currentQuestion;
    const qIdx = LessonState.questionIndex;
    const total = LessonState.totalQuestions;

    if (qIdx >= total) {
        // Check if reinforcement needed
        const accuracy = LessonState.correct / total;
        if (accuracy < 0.8 && LessonState.lessonData.reinforcement) {
            LessonState.step = "reinforcement";
            LessonState.reinforcementIndex = 0;
            LessonState.reinforcementCorrect = 0;
            render();
        } else {
            LessonState.step = "victory";
            render();
        }
        return;
    }

    let html = `
        <div class="quiz-card">
            <div class="quiz-card__step">
                ${LessonIcons.target}
                <span>QUESTION ${qIdx + 1} of ${total}</span>
            </div>
            <h2 class="quiz-card__title">${q.question}</h2>
        </div>
        <div class="quiz-options" id="quiz-options">
    `;

    q.options.forEach((opt, i) => {
        let classes = "quiz-option";
        let disabled = "";

        if (LessonState.answered !== null) {
            disabled = "quiz-option--disabled";
            if (i === q.correct) classes += " quiz-option--correct";
            else if (i === LessonState.answered && i !== q.correct) classes += " quiz-option--wrong";
            classes += ` ${disabled}`;
        }

        html += `
            <button class="${classes}" data-idx="${i}" id="option-${i}">
                <span class="quiz-option__letter">${OPTION_LETTERS[i]}</span>
                <span>${opt}</span>
            </button>
        `;
    });

    html += `</div>`;

    // Feedback area
    if (LessonState.answered !== null) {
        const isCorrect = LessonState.answered === q.correct;
        const bonus = LessonState.streak >= 5 ? 10 : (LessonState.streak >= 3 ? 5 : 0);
        const earned = isCorrect ? 10 + bonus : 0;

        if (isCorrect) {
            html += `
                <div class="feedback feedback--correct">
                    <div class="feedback__icon">${LessonIcons.check}</div>
                    <span class="feedback__text">Correct! +${earned} XP</span>
                </div>
            `;
            if (LessonState.streak >= 3) {
                html += `
                    <div style="text-align:center;">
                        <span class="victory__streak-badge" style="margin-top:8px;">
                            ${LessonIcons.flame} Streak Bonus! x${LessonState.streak}
                        </span>
                    </div>
                `;
            }
        } else {
            html += `
                <div class="feedback feedback--wrong">
                    <div class="feedback__icon">${LessonIcons.xMark}</div>
                    <span class="feedback__text">Not quite! The answer is: ${q.options[q.correct]}</span>
                </div>
            `;
        }

        if (q.explanation) {
            html += `
                <div class="example-box">
                    ${LessonIcons.lightbulb}
                    <strong style="color:#2e7d32;"> Why?</strong><br>
                    ${q.explanation}
                </div>
            `;
        }

        html += `
            <div style="display:flex; justify-content:center; margin-top:20px;">
                <button class="btn btn--primary btn--lg" id="next-question">
                    ${qIdx < total - 1 ? "Next Question" : "See Results"}
                </button>
            </div>
        `;
    }

    container.innerHTML = html;

    // Attach listeners
    if (LessonState.answered === null) {
        document.querySelectorAll(".quiz-option").forEach(btn => {
            btn.addEventListener("click", () => handleAnswer(parseInt(btn.dataset.idx)));
        });
    } else {
        document.getElementById("next-question")?.addEventListener("click", () => {
            LessonState.questionIndex++;
            LessonState.answered = null;
            render();
        });
    }
}


// ─── REINFORCEMENT SCREEN ──────────────────────────────────────
function renderReinforcement(container) {
    const data = LessonState.lessonData;
    const rqs = data.reinforcement;
    const rIdx = LessonState.reinforcementIndex;

    if (rIdx >= rqs.length) {
        LessonState.step = "victory";
        render();
        return;
    }

    const q = rqs[rIdx];

    let html = `
        <div class="reinforcement-banner">
            <div class="reinforcement-banner__icon">${LessonIcons.shield}</div>
            <span class="reinforcement-banner__text">Reinforcement Mode: Strengthening weak topics</span>
        </div>
        <div class="quiz-card">
            <div class="quiz-card__step" style="background: rgba(255,150,0,0.12); color: #E65100;">
                ${LessonIcons.shield}
                <span>REINFORCE ${rIdx + 1} of ${rqs.length}</span>
            </div>
            <h2 class="quiz-card__title">${q.question}</h2>
        </div>
        <div class="quiz-options" id="quiz-options">
    `;

    q.options.forEach((opt, i) => {
        let classes = "quiz-option";
        if (LessonState.answered !== null) {
            classes += " quiz-option--disabled";
            if (i === q.correct) classes += " quiz-option--correct";
            else if (i === LessonState.answered && i !== q.correct) classes += " quiz-option--wrong";
        }

        html += `
            <button class="${classes}" data-idx="${i}" id="option-${i}">
                <span class="quiz-option__letter">${OPTION_LETTERS[i]}</span>
                <span>${opt}</span>
            </button>
        `;
    });

    html += `</div>`;

    if (LessonState.answered !== null) {
        const isCorrect = LessonState.answered === q.correct;

        if (isCorrect) {
            html += `
                <div class="feedback feedback--correct">
                    <div class="feedback__icon">${LessonIcons.check}</div>
                    <span class="feedback__text">Excellent! +10 XP</span>
                </div>
            `;
        } else {
            html += `
                <div class="feedback feedback--wrong">
                    <div class="feedback__icon">${LessonIcons.xMark}</div>
                    <span class="feedback__text">Not quite! Answer: ${q.options[q.correct]}</span>
                </div>
            `;
        }

        if (q.explanation) {
            html += `
                <div class="example-box">
                    ${LessonIcons.lightbulb}
                    <strong style="color:#2e7d32;"> Explanation</strong><br>
                    ${q.explanation}
                </div>
            `;
        }

        html += `
            <div style="display:flex; justify-content:center; margin-top:20px;">
                <button class="btn btn--primary btn--lg" id="next-reinforcement">
                    ${rIdx < rqs.length - 1 ? "Next Question" : "See Results"}
                </button>
            </div>
        `;
    }

    container.innerHTML = html;

    if (LessonState.answered === null) {
        document.querySelectorAll(".quiz-option").forEach(btn => {
            btn.addEventListener("click", () => handleReinforcementAnswer(parseInt(btn.dataset.idx)));
        });
    } else {
        document.getElementById("next-reinforcement")?.addEventListener("click", () => {
            LessonState.reinforcementIndex++;
            LessonState.answered = null;
            render();
        });
    }
}


// ─── VICTORY SCREEN ────────────────────────────────────────────
function renderVictory(container) {
    const totalQ = LessonState.totalQuestions;
    const correct = LessonState.correct;
    const xpEarned = LessonState.sessionXP;
    const accuracy = Math.round((correct / totalQ) * 100);
    const data = LessonState.lessonData;

    // Star rating
    let stars = 1;
    if (accuracy >= 80) stars = 3;
    else if (accuracy >= 60) stars = 2;

    let starsHTML = "";
    for (let i = 0; i < 3; i++) {
        const filled = i < stars;
        starsHTML += `
            <svg width="40" height="40" viewBox="0 0 24 24" fill="${filled ? '#FFD700' : 'rgba(0,0,0,0.1)'}" 
                 style="animation: bounceIn ${0.4 + i * 0.15}s ease-out both; filter: ${filled ? 'drop-shadow(0 2px 4px rgba(255,215,0,0.4))' : 'none'};">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
        `;
    }

    container.innerHTML = `
        <div class="victory-container">
            <div class="victory__trophy">
                ${LessonIcons.trophy}
            </div>
            <h1 class="victory__title">Level Complete!</h1>
            <p class="victory__subtitle">${data.topic}</p>

            <div style="display:flex; justify-content:center; gap:8px; margin-bottom:28px;">
                ${starsHTML}
            </div>

            <div class="victory__xp">+${xpEarned} XP</div>
            <div class="victory__xp-label">Experience Earned</div>

            <div class="victory__stats">
                <div class="victory__stat">
                    <div class="victory__stat-value">${correct}/${totalQ}</div>
                    <div class="victory__stat-label">Correct</div>
                </div>
                <div class="victory__stat">
                    <div class="victory__stat-value">${accuracy}%</div>
                    <div class="victory__stat-label">Accuracy</div>
                </div>
                <div class="victory__stat">
                    <div class="victory__stat-value">${LessonState.streak}</div>
                    <div class="victory__stat-label">Best Streak</div>
                </div>
            </div>

            ${LessonState.streak >= 3 ? `
                <div class="victory__streak-badge">
                    ${LessonIcons.flame} Amazing Streak! x${LessonState.streak}
                </div>
            ` : ""}

            <div style="display:flex; flex-direction:column; gap:12px; align-items:center; margin-top:12px;">
                <button class="btn btn--primary btn--lg" id="victory-continue" style="min-width:220px;">
                    Continue
                </button>
                <button class="btn btn--secondary" id="victory-replay" style="padding:12px 32px; font-size:15px;">
                    Replay Level
                </button>
            </div>
        </div>
    `;

    // Trigger confetti
    launchConfetti();

    document.getElementById("victory-continue").addEventListener("click", () => {
        window.location.href = "index.html";
    });

    document.getElementById("victory-replay").addEventListener("click", () => {
        LessonState.step = "teach";
        LessonState.questionIndex = 0;
        LessonState.answered = null;
        LessonState.correct = 0;
        LessonState.sessionXP = 0;
        LessonState.reinforcementIndex = 0;
        LessonState.reinforcementCorrect = 0;
        render();
    });
}


// ─── ANSWER HANDLERS ───────────────────────────────────────────
function handleAnswer(idx) {
    const q = LessonState.currentQuestion;
    LessonState.answered = idx;

    if (idx === q.correct) {
        LessonState.correct++;
        LessonState.streak++;
        const bonus = LessonState.streak >= 5 ? 10 : (LessonState.streak >= 3 ? 5 : 0);
        const earned = 10 + bonus;
        LessonState.sessionXP += earned;
        LessonState.xp += earned;
    } else {
        LessonState.streak = 0;
    }

    render();
}

function handleReinforcementAnswer(idx) {
    const q = LessonState.currentQuestion;
    LessonState.answered = idx;

    if (idx === q.correct) {
        LessonState.reinforcementCorrect++;
        LessonState.streak++;
        LessonState.sessionXP += 10;
        LessonState.xp += 10;
    } else {
        LessonState.streak = 0;
    }

    render();
}


// ─── PROGRESS BAR ──────────────────────────────────────────────
function updateProgress() {
    const fill = document.getElementById("progress-fill");
    if (fill) {
        fill.style.width = `${LessonState.progressPercent}%`;
    }
}


// ─── HUD ───────────────────────────────────────────────────────
function updateHUD() {
    const xpEl = document.getElementById("xp-value");
    const streakEl = document.getElementById("streak-value");
    if (xpEl) xpEl.textContent = LessonState.xp;
    if (streakEl) streakEl.textContent = LessonState.streak;
}


// ─── CONFETTI ──────────────────────────────────────────────────
function launchConfetti() {
    const canvas = document.getElementById("confetti-canvas");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const pieces = [];
    const colors = ["#58CC02", "#FFD700", "#1CB0F6", "#FF6B35", "#CE82FF", "#FF4B4B"];
    const gravity = 0.12;
    const friction = 0.99;

    for (let i = 0; i < 120; i++) {
        pieces.push({
            x: canvas.width / 2 + (Math.random() - 0.5) * 200,
            y: canvas.height / 2,
            vx: (Math.random() - 0.5) * 16,
            vy: -(Math.random() * 12 + 4),
            w: 8 + Math.random() * 6,
            h: 6 + Math.random() * 4,
            color: colors[Math.floor(Math.random() * colors.length)],
            rotation: Math.random() * 360,
            rotSpeed: (Math.random() - 0.5) * 12,
            opacity: 1,
        });
    }

    let frame = 0;
    const maxFrames = 180;

    function animate() {
        if (frame > maxFrames) {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            return;
        }

        ctx.clearRect(0, 0, canvas.width, canvas.height);

        pieces.forEach(p => {
            p.vy += gravity;
            p.vx *= friction;
            p.x += p.vx;
            p.y += p.vy;
            p.rotation += p.rotSpeed;

            if (frame > maxFrames - 40) {
                p.opacity = Math.max(0, p.opacity - 0.025);
            }

            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate((p.rotation * Math.PI) / 180);
            ctx.globalAlpha = p.opacity;
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
            ctx.restore();
        });

        frame++;
        requestAnimationFrame(animate);
    }

    animate();
}


// ─── INIT ──────────────────────────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
    // Parse level from URL
    const params = new URLSearchParams(window.location.search);
    const levelId = parseInt(params.get("level")) || 0;
    LessonState.levelId = levelId;

    render();
});
