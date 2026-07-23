"""
Tests for recommendation formulas and the /predict API.

Run:
  cd personalized
  python -m unittest discover -s tests -v
"""

import os
import sys
import unittest

import pandas as pd

HERE = os.path.dirname(os.path.abspath(__file__))
PERSONALIZED = os.path.dirname(HERE)
if PERSONALIZED not in sys.path:
    sys.path.insert(0, PERSONALIZED)

from formulas import (  # noqa: E402
    cosine_similarity,
    heuristic_final_score,
    interest_overlap_score,
    normalize_match_percentage,
    tokenize,
    WEIGHT_SKILL,
    WEIGHT_INTEREST,
    WEIGHT_COSINE,
)
from career import CareerAdvisorEngine  # noqa: E402


CSV_PATH = os.path.join(PERSONALIZED, "data", "career_dataset.csv")


def _sample_train_df(n_per_career=3):
    """Use a small sample so tests run quickly."""
    df = pd.read_csv(CSV_PATH)
    df.columns = df.columns.str.strip()
    return (
        df.groupby("Recommended_Career", group_keys=False)
        .head(n_per_career)
        .reset_index(drop=True)
    )


class TestFormulasUnit(unittest.TestCase):

    def test_tokenize_basic(self):
        tokens = tokenize("Python, SQL; data analysis")
        self.assertEqual(tokens, ["python", "sql", "data", "analysis"])

    def test_tokenize_nan_none(self):
        self.assertEqual(tokenize(None), [])
        self.assertEqual(tokenize(float("nan")), [])

    def test_heuristic_weights(self):
        self.assertAlmostEqual(WEIGHT_SKILL + WEIGHT_INTEREST + WEIGHT_COSINE, 1.0, places=5)
        score = heuristic_final_score(10.0, 2.0, 0.5)
        expected = 10.0 * 0.55 + 2.0 * 0.27 + 0.5 * 100 * 0.18
        self.assertAlmostEqual(score, expected, places=5)

    def test_normalize_match_percentage_bounds(self):
        self.assertGreaterEqual(normalize_match_percentage(0, 10), 25.0)
        self.assertLessEqual(normalize_match_percentage(100, 10), 92.0)
        mid = normalize_match_percentage(5, 10)
        self.assertTrue(25.0 <= mid <= 92.0)

    def test_interest_overlap_and_cosine(self):
        self.assertEqual(interest_overlap_score({"ai", "web"}, {"ai": 2, "cloud": 1}), 1)
        self.assertAlmostEqual(cosine_similarity([1, 0], [1, 0]), 1.0, places=5)
        self.assertEqual(cosine_similarity([0, 0], [1, 1]), 0.0)


class TestAIEngineUnit(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        cls.engine = CareerAdvisorEngine()
        cls.train_df = _sample_train_df(3)
        cls.engine.fit(cls.train_df, "Recommended_Career")

    def test_clean_text_tokens(self):
        tokens = self.engine.clean_text("Data: Analysis, Python")
        self.assertIn("data", tokens)
        self.assertIn("analysis", tokens)
        self.assertIn("python", tokens)

    def test_clean_text_nan_none(self):
        self.assertEqual(self.engine.clean_text(None), [])
        self.assertEqual(self.engine.clean_text(float("nan")), [])

    def test_fit_builds_profiles(self):
        self.assertTrue(self.engine.is_trained)
        self.assertGreater(len(self.engine.career_profiles), 10)
        self.assertGreater(self.engine.total_docs, 0)
        self.assertTrue(len(self.engine.vocabulary) > 0)
        self.assertTrue(len(self.engine.global_token_counts) > 0)

    def test_calculate_match_top3(self):
        results = self.engine.calculate_match(
            "python sql machine learning",
            "data science ai analytics",
        )
        self.assertEqual(len(results), 3)
        self.assertIn("career", results[0])
        self.assertGreaterEqual(results[0]["final_score"], results[1]["final_score"])
        self.assertGreaterEqual(results[1]["final_score"], results[2]["final_score"])

    def test_calculate_match_empty_input(self):
        results = self.engine.calculate_match("", "")
        self.assertEqual(len(results), 3)
        self.assertTrue(all("career" in r for r in results))


class TestPredictIntegration(unittest.TestCase):

    @classmethod
    def setUpClass(cls):
        import career as career_mod

        cls.career_mod = career_mod
        cls.client = career_mod.app.test_client()
        train_df = _sample_train_df(3)
        career_mod.engine.fit(train_df, "Recommended_Career")

    def test_predict_valid_json(self):
        res = self.client.post(
            "/predict",
            json={
                "skills": "Python SQL Machine Learning Pandas",
                "interests": "Data Science AI Analytics",
            },
        )
        self.assertEqual(res.status_code, 200, res.get_json())
        body = res.get_json()
        self.assertIsInstance(body, list)
        self.assertGreaterEqual(len(body), 1)
        self.assertLessEqual(len(body), 3)
        top = body[0]
        self.assertIn("career", top)
        self.assertIn("match_percentage", top)
        self.assertTrue(25.0 <= float(top["match_percentage"]) <= 92.0)
        self.assertIn("path_data", top)

    def test_predict_missing_fields_400(self):
        res = self.client.post("/predict", json={"skills": "Python"})
        self.assertEqual(res.status_code, 400)

    def test_predict_rejects_non_it_interests(self):
        res = self.client.post(
            "/predict",
            json={"skills": "Python SQL", "interests": "singing dancing cooking"},
        )
        self.assertEqual(res.status_code, 422)
        self.assertIn("error", res.get_json())

    def test_top3_web_skills_look_relevant(self):
        results = self.career_mod.engine.calculate_match(
            "react javascript html css",
            "web development frontend",
        )
        careers = " ".join(r["career"] for r in results).lower()
        self.assertTrue(
            any(
                key in careers
                for key in ("react", "front", "web", "javascript", "ui", "full")
            ),
            f"Unexpected top-3 for web skills: {careers}",
        )


if __name__ == "__main__":
    unittest.main()
