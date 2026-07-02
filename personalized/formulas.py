"""
Manual recommendation formulas — no scikit-learn or ML libraries.

All scoring is implemented from first principles using basic Python math.
"""

import csv
import math
import random
import re
from collections import Counter


def tokenize(text):
    """Split text into lowercase word tokens."""
    if text is None or (isinstance(text, float) and math.isnan(text)):
        return []
    cleaned = str(text).lower().replace(";", " ").replace(",", " ")
    return re.findall(r"\w+", cleaned)


def term_frequency(term_count):
    """TF(t, c) = log(1 + count).  log1p avoids log(0)."""
    return math.log1p(term_count)


def inverse_document_frequency(total_docs, document_frequency):
    """IDF(t) = log((N + 1) / (100 + df(t))).  Smoothing avoids division by zero."""
    return math.log((total_docs + 1) / (100 + document_frequency))


def tf_idf_score(term_count, total_docs, document_frequency):
    """TF-IDF(t, c) = TF(t, c) × IDF(t)."""
    return term_frequency(term_count) * inverse_document_frequency(total_docs, document_frequency)


def compute_skill_tfidf_score(user_skills, career_skill_counts, total_docs, global_token_counts):
    """SkillScore = Σ TF-IDF(t, career) for every user skill t that appears in the career profile."""
    score = 0.0
    for skill in user_skills:
        if skill in career_skill_counts:
            count = career_skill_counts[skill]
            df = global_token_counts.get(skill, 0)
            score += tf_idf_score(count, total_docs, df)
    return score


def build_token_vector(tokens, vocabulary):
    """Map tokens to a fixed-length count vector aligned with vocabulary."""
    counts = Counter(tokens)
    return [counts.get(word, 0) for word in vocabulary]


def dot_product(vec_a, vec_b):
    """A · B = Σ a_i × b_i"""
    return sum(a * b for a, b in zip(vec_a, vec_b))


def vector_magnitude(vec):
    """||V|| = sqrt(Σ v_i²)"""
    return math.sqrt(sum(v * v for v in vec))


def cosine_similarity(vec_a, vec_b):
    """cos(θ) = (A · B) / (||A|| × ||B||)"""
    mag_a = vector_magnitude(vec_a)
    mag_b = vector_magnitude(vec_b)
    if mag_a == 0 or mag_b == 0:
        return 0.0
    return dot_product(vec_a, vec_b) / (mag_a * mag_b)


def interest_overlap_score(user_interests, career_interest_tokens):
    """Count how many user interest tokens appear in the career interest profile."""
    return len(user_interests.intersection(career_interest_tokens.keys()))


# Weighted combination: skill emphasis with interest and cosine similarity
WEIGHT_SKILL = 0.52
WEIGHT_INTEREST = 0.26
WEIGHT_COSINE = 0.22


def heuristic_final_score(skill_score, interest_score, cosine_sim):
    """FinalScore = (SkillScore × W_skill) + (InterestScore × W_interest) + (CosineSim × 100 × W_cosine)"""
    return (
        (skill_score * WEIGHT_SKILL)
        + (interest_score * WEIGHT_INTEREST)
        + (cosine_sim * 100 * WEIGHT_COSINE)
    )


def normalize_match_percentage(score, max_score, floor=25.0, ceiling=92.0):
    """Match% = (score / max_score) × 82, clamped for display stability."""
    if max_score <= 0:
        max_score = 1.0
    raw = (score / max_score) * 82.0
    return round(min(max(raw, floor), ceiling), 1)


def precision(true_positives, false_positives):
    denominator = true_positives + false_positives
    return true_positives / denominator if denominator > 0 else 0.0


def recall(true_positives, false_negatives):
    denominator = true_positives + false_negatives
    return true_positives / denominator if denominator > 0 else 0.0


def f1_score(precision_val, recall_val):
    denominator = precision_val + recall_val
    if denominator <= 0:
        return 0.0
    return (2 * precision_val * recall_val) / denominator


def mean(values):
    """Arithmetic mean without numpy."""
    if not values:
        return 0.0
    return sum(values) / len(values)


def macro_precision_recall_f1(true_positives, false_positives, false_negatives):
    """Macro-averaged precision, recall, and F1 across all career classes."""
    all_classes = set(true_positives) | set(false_positives) | set(false_negatives)
    precisions, recalls = [], []

    for cls in all_classes:
        tp = true_positives.get(cls, 0)
        fp = false_positives.get(cls, 0)
        fn = false_negatives.get(cls, 0)
        precisions.append(precision(tp, fp))
        recalls.append(recall(tp, fn))

    avg_p = mean(precisions)
    avg_r = mean(recalls)
    return avg_p, avg_r, f1_score(avg_p, avg_r)


def load_career_dataset(file_path):
    """Read career training CSV using the standard library csv module."""
    rows = []
    with open(file_path, newline="", encoding="utf-8") as handle:
        reader = csv.DictReader(handle)
        fieldnames = [name.strip() for name in (reader.fieldnames or [])]
        for raw_row in reader:
            row = {key.strip(): (value.strip() if isinstance(value, str) else value)
                   for key, value in raw_row.items()}
            rows.append(row)
    return rows, fieldnames


def shuffle_rows(rows, seed=None):
    """Fisher–Yates shuffle for train/test splitting."""
    copied = list(rows)
    rng = random.Random(seed)
    rng.shuffle(copied)
    return copied


def normalize_skill_label(label):
    """Display-friendly skill name from a token or tool label."""
    text = str(label).strip()
    if not text:
        return text
    if text.isupper() and len(text) <= 5:
        return text
    return text[0].upper() + text[1:]


def skill_label_matches_user(required_label, user_skill_tokens):
    """True if any token in required_label appears in the user's skill set."""
    required_tokens = set(tokenize(required_label))
    if not required_tokens:
        return False
    return bool(required_tokens.intersection(user_skill_tokens))


def compute_skill_gap(user_skill_tokens, required_skills):
    """Compare user skills against a career's required skill list."""
    required = []
    seen = set()
    for skill in required_skills:
        label = str(skill).strip()
        key = label.lower()
        if label and key not in seen:
            seen.add(key)
            required.append(label)

    matched = []
    missing = []
    for skill in required:
        if skill_label_matches_user(skill, user_skill_tokens):
            matched.append(skill)
        else:
            missing.append(skill)

    total = len(required)
    readiness = round((len(matched) / total) * 100, 1) if total > 0 else 0.0

    return {
        "required_skills": required,
        "matched_skills": matched,
        "missing_skills": missing,
        "readiness_percentage": readiness,
        "total_required": total,
        "total_matched": len(matched),
    }
