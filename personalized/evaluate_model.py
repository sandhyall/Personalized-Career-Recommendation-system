"""
Model evaluation for Personalized Career Recommendation System.

Uses this project's recommendation engine:
  - Content-based filtering
  - TF-IDF skill score + interest overlap + cosine similarity
  - Weighted final score (0.55 / 0.27 / 0.18) from formulas.py
"""

from __future__ import annotations

import os
import sys
from collections import Counter

import numpy as np
import pandas as pd

# Ensure local imports work when run from repo root or personalized/
_HERE = os.path.dirname(os.path.abspath(__file__))
if _HERE not in sys.path:
    sys.path.insert(0, _HERE)

from career import CareerAdvisorEngine  # noqa: E402
from formulas import (  # noqa: E402
    WEIGHT_COSINE,
    WEIGHT_INTEREST,
    WEIGHT_SKILL,
)


DEFAULT_CSV = os.path.join(_HERE, "data", "career_dataset.csv")


def evaluate_model(csv_path: str = DEFAULT_CSV, epochs: int = 5, seed: int | None = None):
    """
    80/20 train-test evaluation over `epochs` random shuffles.

    Returns a dict with per-epoch rows and mean metrics.
    """
    if not os.path.exists(csv_path):
        raise FileNotFoundError(f"Dataset not found: {csv_path}")

    df = pd.read_csv(csv_path)
    df.columns = df.columns.str.strip()
    target_col = "Recommended_Career"
    if target_col not in df.columns:
        raise ValueError(f"Column '{target_col}' missing. Found: {list(df.columns)}")

    engine = CareerAdvisorEngine()
    t1_list, t3_list, p_list, r_list, f1_list = [], [], [], [], []
    epoch_rows = []

    print("=" * 60)
    print("PERSONALIZED CAREER RECOMMENDATION — MODEL EVALUATION")
    print("=" * 60)
    print(f"Dataset      : {csv_path}")
    print(f"Rows         : {len(df)}")
    print(f"Careers      : {df[target_col].nunique()}")
    print(f"Algorithm    : Content-based (TF-IDF + Interest + Cosine)")
    print(
        f"Weights      : skill={WEIGHT_SKILL}, interest={WEIGHT_INTEREST}, cosine={WEIGHT_COSINE}"
    )
    print(f"Split        : 80% train / 20% test × {epochs} epochs")
    print("-" * 60)

    for e in range(1, epochs + 1):
        df_shuffled = df.sample(frac=1, random_state=(None if seed is None else seed + e))
        df_shuffled = df_shuffled.reset_index(drop=True)
        split = int(len(df_shuffled) * 0.8)
        train_df, test_df = df_shuffled.iloc[:split], df_shuffled.iloc[split:]

        engine.fit(train_df, target_col)

        tp, fp, fn = Counter(), Counter(), Counter()
        t1_count = t3_count = 0

        for _, row in test_df.iterrows():
            actual = str(row[target_col]).lower().strip()
            preds = engine.calculate_match(row["Skills"], row["Interests"])
            if not preds:
                continue

            predicted = preds[0]["career"].lower().strip()
            top3 = [p["career"].lower().strip() for p in preds]

            if predicted == actual:
                t1_count += 1
                tp[actual] += 1
            else:
                fp[predicted] += 1
                fn[actual] += 1

            if actual in top3:
                t3_count += 1

        classes = set(list(tp) + list(fp) + list(fn))
        epoch_p, epoch_r = [], []
        for cls in classes:
            p_val = tp[cls] / (tp[cls] + fp[cls]) if (tp[cls] + fp[cls]) else 0
            r_val = tp[cls] / (tp[cls] + fn[cls]) if (tp[cls] + fn[cls]) else 0
            epoch_p.append(p_val)
            epoch_r.append(r_val)

        avg_p = float(np.mean(epoch_p)) if epoch_p else 0.0
        avg_r = float(np.mean(epoch_r)) if epoch_r else 0.0
        avg_f1 = (2 * avg_p * avg_r) / (avg_p + avg_r) if (avg_p + avg_r) else 0.0
        t1_acc = (t1_count / len(test_df)) * 100 if len(test_df) else 0.0
        t3_acc = (t3_count / len(test_df)) * 100 if len(test_df) else 0.0

        t1_list.append(t1_acc)
        t3_list.append(t3_acc)
        p_list.append(avg_p)
        r_list.append(avg_r)
        f1_list.append(avg_f1)
        epoch_rows.append(
            {
                "Epoch": e,
                "Top-1 (%)": round(t1_acc, 2),
                "Top-3 (%)": round(t3_acc, 2),
                "Precision": round(avg_p, 3),
                "Recall": round(avg_r, 3),
                "F1": round(avg_f1, 3),
                "Test size": len(test_df),
            }
        )
        print(
            f"Epoch {e}: Top-1={t1_acc:.1f}% | Top-3={t3_acc:.1f}% | F1={avg_f1:.3f}",
            flush=True,
        )

    summary = {
        "Top-1 Accuracy (%)": round(float(np.mean(t1_list)), 2),
        "Top-3 Accuracy (%)": round(float(np.mean(t3_list)), 2),
        "Precision": round(float(np.mean(p_list)), 3),
        "Recall": round(float(np.mean(r_list)), 3),
        "Overall F1-Score": round(float(np.mean(f1_list)), 3),
        "Dataset rows": len(df),
        "Career classes": int(df[target_col].nunique()),
        "Epochs": epochs,
    }

    print("-" * 60)
    print("FINAL MEAN EVALUATION RESULTS")
    for k, v in summary.items():
        print(f"  {k}: {v}")
    print("=" * 60)

    return {
        "epoch_results": epoch_rows,
        "summary": summary,
        "engine": engine,
        "dataframe": df,
    }


if __name__ == "__main__":
    epochs = 5
    if len(sys.argv) > 1:
        epochs = int(sys.argv[1])
    csv_path = sys.argv[2] if len(sys.argv) > 2 else DEFAULT_CSV
    evaluate_model(csv_path=csv_path, epochs=epochs)
