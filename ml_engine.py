"""
Adaptive Learning Engine for FinQuest
Rule-based engine for personalized progression and reinforcement.
Includes confidence scoring, performance tracking, and safe serialization.
"""


class AdaptiveEngine:
    """Tracks weak topics, evaluates mastery, and manages reinforcement flow."""

    PASS_THRESHOLD = 4  # out of 5

    def __init__(self):
        self.weak_topics: set = set()
        self.history: list = []
        self.topic_strength: dict = {}  # (stage, level) → confidence float
        self.rl_performance: dict = {"attempted": 0, "correct": 0}

    # ------------------------------------------------------------------
    # Level evaluation
    # ------------------------------------------------------------------
    def evaluate_level(self, stage: int, level: int, score: int, reattempt_count: int) -> dict:
        """
        Evaluate whether the user passed a level.

        Args:
            stage: 1-indexed stage number
            level: 1-indexed level within stage
            score: practice_first_correct + test_correct (0-5)
            reattempt_count: how many times user has retried this level

        Returns:
            {"is_pass": bool, "is_weak": bool, "confidence": float}
        """
        is_pass = score >= self.PASS_THRESHOLD
        is_weak = not is_pass

        # Confidence score: penalise reattempts
        confidence = max(0.0, score - (reattempt_count * 0.5))
        self.topic_strength[(stage, level)] = confidence

        # Duplicate-safe: set.add is idempotent
        if is_weak:
            self.weak_topics.add((stage, level))

        # Log the attempt
        self.history.append({
            "stage": stage,
            "level": level,
            "score": score,
            "reattempt": reattempt_count,
            "passed": is_pass,
            "weak": is_weak,
            "confidence": confidence,
        })

        print(f"[ENGINE] evaluate_level(s={stage}, l={level}, score={score}, "
              f"reattempt={reattempt_count}) → pass={is_pass}, weak={is_weak}, "
              f"confidence={confidence}")
        print(f"[ENGINE] weak_topics: {sorted(self.weak_topics)}")

        return {"is_pass": is_pass, "is_weak": is_weak, "confidence": confidence}

    # ------------------------------------------------------------------
    # Reinforcement questions
    # ------------------------------------------------------------------
    def get_reinforcement_questions(self, fetch_fn) -> list:
        """
        Gather reinforcement questions for every weak topic, sorted by
        (stage, level) for deterministic ordering.

        Args:
            fetch_fn: callable(stage, level) -> list | None

        Returns:
            Combined list of reinforcement question dicts (may be empty).
        """
        all_questions = []
        for stage, level in sorted(self.weak_topics):
            try:
                qs = fetch_fn(stage, level)
            except Exception as exc:
                print(f"[ENGINE] ERROR fetching reinforcement s={stage} l={level}: {exc}")
                qs = None
            if qs:
                # Tag each question with its source for traceability
                for q in qs:
                    q["_source_stage"] = stage
                    q["_source_level"] = level
                all_questions.extend(qs)
            else:
                print(f"[ENGINE] WARNING: No reinforcement questions for s={stage} l={level}")

        print(f"[ENGINE] Collected {len(all_questions)} reinforcement questions "
              f"from {len(self.weak_topics)} weak topic(s)")
        return all_questions

    # ------------------------------------------------------------------
    # Reinforcement performance tracking
    # ------------------------------------------------------------------
    def record_rl_answer(self, is_correct: bool):
        """Record a single reinforcement answer."""
        self.rl_performance["attempted"] += 1
        if is_correct:
            self.rl_performance["correct"] += 1

    def get_reinforcement_summary(self) -> dict:
        """
        Return reinforcement accuracy stats.

        Returns:
            {"accuracy": float, "correct": int, "attempted": int}
        """
        attempted = self.rl_performance["attempted"]
        correct = self.rl_performance["correct"]
        accuracy = (correct / attempted) if attempted > 0 else 0.0
        return {"accuracy": round(accuracy, 4), "correct": correct, "attempted": attempted}

    # ------------------------------------------------------------------
    # Stage completion check
    # ------------------------------------------------------------------
    def should_reinforce(self) -> bool:
        """Return True if there are weak topics requiring reinforcement."""
        return len(self.weak_topics) > 0

    # ------------------------------------------------------------------
    # Cleanup after reinforcement
    # ------------------------------------------------------------------
    def clear_after_reinforcement(self):
        """Reset weak topics and rl_performance after reinforcement is complete."""
        summary = self.get_reinforcement_summary()
        print(f"[ENGINE] Reinforcement summary: {summary}")
        print(f"[ENGINE] Clearing {len(self.weak_topics)} weak topic(s)")
        self.weak_topics.clear()
        self.rl_performance = {"attempted": 0, "correct": 0}
        return True

    # ------------------------------------------------------------------
    # Serialization helpers (session state persistence)
    # ------------------------------------------------------------------
    def get_state(self) -> dict:
        """Export engine state for session persistence (set → list)."""
        return {
            "weak_topics": [list(t) for t in sorted(self.weak_topics)],
            "history": self.history,
            "topic_strength": {f"{s},{l}": v for (s, l), v in self.topic_strength.items()},
            "rl_performance": dict(self.rl_performance),
        }

    def load_state(self, state: dict):
        """Restore engine state from session (list → set)."""
        raw = state.get("weak_topics", [])
        self.weak_topics = set(tuple(x) for x in raw if isinstance(x, (list, tuple)) and len(x) == 2)
        self.history = state.get("history", [])
        # Restore topic_strength
        ts_raw = state.get("topic_strength", {})
        self.topic_strength = {}
        for key, val in ts_raw.items():
            try:
                parts = key.split(",")
                self.topic_strength[(int(parts[0]), int(parts[1]))] = float(val)
            except (ValueError, IndexError):
                pass
        self.rl_performance = state.get("rl_performance", {"attempted": 0, "correct": 0})
