"""
Career recommendation API — formula-based engine (no scikit-learn, no pandas, no numpy).

Algorithms (manual implementation in formulas.py):
  1. TF-IDF skill scoring
  2. Interest overlap counting
  3. Cosine similarity (content-based filtering)
  4. Weighted heuristic final score

Dataset: IT Career Guidance (675 student profiles) — personalized/data/career_dataset.csv

Evaluation (80/20 holdout, 5-run mean):
  Top-1 Accuracy : 70.52%
  Top-3 Accuracy : 86.81%
  F1-Score       : 0.729
"""

import os
from collections import Counter

from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv

from career_resources import get_career_metadata
from formulas import (
    compute_skill_gap,
    compute_skill_tfidf_score,
    cosine_similarity,
    build_token_vector,
    heuristic_final_score,
    interest_overlap_score,
    load_career_dataset,
    macro_precision_recall_f1,
    mean,
    normalize_match_percentage,
    normalize_skill_label,
    shuffle_rows,
    tokenize,
)

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

client = MongoClient(os.getenv("MONGO_URI", "mongodb://127.0.0.1:27017/"))
db = client["Career"]
details_col = db["career_details"]

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
DATA_DIR = os.path.join(BASE_DIR, "data")

# IT Career Guidance dataset — 675 student profiles with realistic skill overlap
DATASET_CANDIDATES = [
    "career_dataset.csv",
]
TARGET_COLUMNS = ["Recommended_Career", "Career_Recommendation"]


def resolve_dataset_path():
    env_path = os.getenv("CAREER_CSV")
    if env_path and os.path.exists(env_path):
        return env_path
    for name in DATASET_CANDIDATES:
        path = os.path.join(DATA_DIR, name)
        if os.path.exists(path):
            return path
    return os.path.join(DATA_DIR, "career_dataset.csv")


def resolve_target_column(rows):
    if not rows:
        return "Recommended_Career"
    for col in TARGET_COLUMNS:
        if col in rows[0]:
            return col
    raise ValueError(
        f"Career label column not found. Expected one of: {', '.join(TARGET_COLUMNS)}"
    )


def profile_skills_text(row):
    return str(row.get("Skills", "") or "")


def profile_interests_text(row):
    """Interests plus optional strengths field from the IT guidance dataset."""
    parts = [str(row.get("Interests", "") or "")]
    strengths = row.get("Strengths") or row.get("Strength")
    if strengths:
        parts.append(str(strengths))
    return " ".join(parts)


class CareerAdvisorEngine:
    """
    Manual recommendation engine for IT career guidance.

    Scoring pipeline:
      user skills/interests
        → TF-IDF skill score
        → interest overlap score
        → cosine similarity on skill+interest vectors
        → weighted heuristic final score
        → ranked top-3 careers
    """

    def __init__(self):
        self.career_profiles = {}
        self.global_token_counts = Counter()
        self.total_docs = 0
        self.vocabulary = []
        self.next_step_map = {
            "data scientist": "Chief Data Officer",
            "data analyst": "Senior Data Scientist",
            "frontend developer": "Full Stack Developer",
            "backend developer": "Cloud Architect",
            "ui/ux designer": "Product Manager",
            "cloud engineer": "DevOps Architect",
            "cybersecurity analyst": "CISO",
            "mobile app developer": "Mobile Architect",
            "qa engineer": "SDET Manager",
            "machine learning engineer": "AI Research Lead",
            "software developer": "Solutions Architect",
        }

    def fit(self, rows, target_col):
        """Build career profiles from training rows (manual token counting)."""
        self.career_profiles = {}
        self.global_token_counts = Counter()
        self.total_docs = len(rows)
        vocab_set = set()

        for row in rows:
            career = str(row[target_col]).lower().strip()
            if career not in self.career_profiles:
                self.career_profiles[career] = {
                    "skills": Counter(),
                    "interests": Counter(),
                    "all_tokens": [],
                }

            skill_tokens = tokenize(profile_skills_text(row))
            interest_tokens = tokenize(profile_interests_text(row))
            combined = skill_tokens + interest_tokens

            self.career_profiles[career]["skills"].update(skill_tokens)
            self.career_profiles[career]["interests"].update(interest_tokens)
            self.career_profiles[career]["all_tokens"].extend(combined)

            for token in set(combined):
                self.global_token_counts[token] += 1
                vocab_set.add(token)

        self.vocabulary = sorted(vocab_set)

    def calculate_match(self, user_skills, user_interests):
        """Score every career and return the top 3 matches."""
        user_skill_tokens = set(tokenize(user_skills))
        user_interest_tokens = set(tokenize(user_interests))
        user_all_tokens = list(user_skill_tokens | user_interest_tokens)
        user_vector = build_token_vector(user_all_tokens, self.vocabulary)

        career_scores = []
        for career, data in self.career_profiles.items():
            skill_score = compute_skill_tfidf_score(
                user_skill_tokens,
                data["skills"],
                self.total_docs,
                self.global_token_counts,
            )

            interest_score = interest_overlap_score(
                user_interest_tokens, data["interests"]
            )

            career_vector = build_token_vector(data["all_tokens"], self.vocabulary)
            cosine_sim = cosine_similarity(user_vector, career_vector)

            final_score = heuristic_final_score(skill_score, interest_score, cosine_sim)

            career_scores.append(
                {
                    "career": career,
                    "skill_score": skill_score,
                    "interest_matches": interest_score,
                    "cosine_similarity": round(cosine_sim, 4),
                    "final_score": final_score,
                }
            )

        career_scores.sort(
            key=lambda item: (
                item["final_score"],
                item["skill_score"],
                item["interest_matches"],
            ),
            reverse=True,
        )
        return career_scores[:3]

    def get_required_skills(self, career_key, fallback_tools=None):
        """Build required skill list from career profile + reference tools."""
        required = []
        seen = set()

        for skill in fallback_tools or []:
            label = str(skill).strip()
            key = label.lower()
            if label and key not in seen:
                seen.add(key)
                required.append(label)

        profile = self.career_profiles.get(career_key.lower().strip())
        if profile:
            for token, _count in profile["skills"].most_common(10):
                label = normalize_skill_label(token)
                key = label.lower()
                if key not in seen:
                    seen.add(key)
                    required.append(label)

        return required


engine = CareerAdvisorEngine()


def startup_and_validate(epochs=5):
    """Train on CSV and print manual evaluation metrics (no sklearn)."""
    try:
        file_path = resolve_dataset_path()
        if not os.path.exists(file_path):
            print(f" File Not Found: {file_path}", flush=True)
            print(" Place CSV in personalized/data/ or set CAREER_CSV env var.", flush=True)
            return

        rows, _ = load_career_dataset(file_path)
        target_col = resolve_target_column(rows)

        if not rows:
            print(" Error: dataset is empty.", flush=True)
            return

        t1_list, t3_list, p_list, r_list, f1_list = [], [], [], [], []
        print(f"\n--- FORMULA-BASED ENGINE STARTUP (no scikit-learn) ---", flush=True)
        print(f" Dataset: {os.path.basename(file_path)} ({len(rows)} records)", flush=True)
        print(f" Label column: {target_col}", flush=True)
        print(" Formulas: TF-IDF + Interest Overlap + Cosine Similarity + Weighted Score", flush=True)

        for epoch in range(1, epochs + 1):
            shuffled = shuffle_rows(rows, seed=epoch)
            split = int(len(shuffled) * 0.8)
            train_rows, test_rows = shuffled[:split], shuffled[split:]

            engine.fit(train_rows, target_col)

            tp, fp, fn = Counter(), Counter(), Counter()
            t1_count, t3_count = 0, 0

            for row in test_rows:
                actual = str(row[target_col]).lower().strip()
                preds = engine.calculate_match(
                    profile_skills_text(row),
                    profile_interests_text(row),
                )
                if not preds:
                    continue

                predicted = preds[0]["career"].lower().strip()
                top3_names = [p["career"].lower().strip() for p in preds]

                if predicted == actual:
                    t1_count += 1
                if actual in top3_names:
                    t3_count += 1

                if predicted == actual:
                    tp[actual] += 1
                else:
                    fp[predicted] += 1
                    fn[actual] += 1

            avg_p, avg_r, avg_f1 = macro_precision_recall_f1(tp, fp, fn)

            t1_list.append((t1_count / len(test_rows)) * 100)
            t3_list.append((t3_count / len(test_rows)) * 100)
            p_list.append(avg_p)
            r_list.append(avg_r)
            f1_list.append(avg_f1)

            print(
                f"Epoch {epoch}: Top-1={t1_list[-1]:.1f}% | Top-3={t3_list[-1]:.1f}% | "
                f"Precision={avg_p:.3f} | Recall={avg_r:.3f} | F1={avg_f1:.3f}",
                flush=True,
            )

        print("-" * 60, flush=True)
        print("FINAL MEAN EVALUATION (manual formulas):", flush=True)
        print(f"Top-1 Accuracy : {mean(t1_list):.2f}%")
        print(f"Top-3 Accuracy : {mean(t3_list):.2f}%")
        print(f"Precision      : {mean(p_list):.3f}")
        print(f"Recall         : {mean(r_list):.3f}")
        print(f"F1-Score       : {mean(f1_list):.3f}")
        print("-" * 60 + "\n", flush=True)

    except Exception as exc:
        print(f"Startup Error: {exc}", flush=True)


def train_engine_on_full_dataset():
    """Train the live engine on the complete dataset before serving predictions."""
    file_path = resolve_dataset_path()
    if not os.path.exists(file_path):
        print(f" File Not Found: {file_path}", flush=True)
        return
    rows, _ = load_career_dataset(file_path)
    if rows:
        target_col = resolve_target_column(rows)
        engine.fit(rows, target_col)
        print(f" Engine trained on {len(rows)} profiles from {os.path.basename(file_path)}.", flush=True)


def initialize_engine(run_validation=False, epochs=5):
    if run_validation:
        startup_and_validate(epochs=epochs)
    train_engine_on_full_dataset()


initialize_engine(run_validation=False)


@app.route("/predict", methods=["POST"])
def predict():
    try:
        data = request.json or {}
        user_skills = data.get("skills", "")
        user_interests = data.get("interests", "")
        if data.get("strength"):
            user_interests = f"{user_interests} {data.get('strength')}"
        user_skill_tokens = set(tokenize(user_skills))

        results = engine.calculate_match(user_skills, user_interests)

        if not results:
            return jsonify([])

        max_score = results[0]["final_score"]
        if max_score <= 0:
            max_score = 1.0

        response = []
        for res in results:
            career_key = res["career"].lower().strip()
            extra_info = details_col.find_one({"career_name": career_key})
            fallback = get_career_metadata(res["career"])
            meta = extra_info or fallback
            required_skills = engine.get_required_skills(
                career_key, fallback.get("tools", [])
            )
            skill_gap = compute_skill_gap(user_skill_tokens, required_skills)

            response.append(
                {
                    "career": res["career"].title(),
                    "match_percentage": normalize_match_percentage(
                        res["final_score"], max_score
                    ),
                    "next_step": engine.next_step_map.get(career_key, "Senior Specialist"),
                    "description": meta.get("description", fallback["description"]),
                    "tools": meta.get("tools", fallback["tools"]),
                    "advantages": meta.get("advantages", fallback.get("advantages", [])),
                    "video_url": meta.get("video_link", fallback.get("video_url", "")),
                    "pdf_url": meta.get("pdf_link", fallback.get("pdf_url", "")),
                    "roadmap": meta.get("roadmap", fallback["roadmap"]),
                    "learning_resources": meta.get(
                        "learning_resources", fallback["learning_resources"]
                    ),
                    "skill_gap": skill_gap,
                    "score_breakdown": {
                        "tfidf_skill_score": round(res["skill_score"], 4),
                        "interest_overlap": res["interest_matches"],
                        "cosine_similarity": res["cosine_similarity"],
                        "final_score": round(res["final_score"], 4),
                    },
                }
            )

        return jsonify(response)
    except Exception as exc:
        return jsonify({"error": str(exc)}), 500


if __name__ == "__main__":
    initialize_engine(run_validation=True, epochs=5)
    app.run(port=int(os.getenv("FLASK_PORT", 5000)), debug=True)
