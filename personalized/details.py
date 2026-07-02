"""Seed MongoDB career_details from dataset careers + resource library."""
import os

from pymongo import MongoClient

from career_resources import CAREER_RESOURCES, get_career_metadata
from formulas import load_career_dataset


def _dataset_path():
    data_dir = os.path.join(os.path.dirname(__file__), "data")
    for name in ("career_dataset.csv",):
        path = os.path.join(data_dir, name)
        if os.path.exists(path):
            return path
    return None


def _careers_from_csv():
    path = _dataset_path()
    if not path:
        return []
    rows, _ = load_career_dataset(path)
    if not rows:
        return []

    label_col = "Recommended_Career" if "Recommended_Career" in rows[0] else "Career_Recommendation"
    seen = set()
    careers = []
    for row in rows:
        name = str(row.get(label_col, "")).strip()
        key = name.lower()
        if name and key not in seen:
            seen.add(key)
            careers.append(name)
    return careers


def seed_data():
    try:
        client = MongoClient("mongodb://127.0.0.1:27017/")
        db = client["Career"]
        collection = db["career_details"]

        career_keys = set(CAREER_RESOURCES.keys())
        for name in _careers_from_csv():
            career_keys.add(name.lower().strip())

        career_data_list = []
        for career_key in sorted(career_keys):
            meta = get_career_metadata(career_key)
            career_data_list.append({
                "career_name": career_key,
                "description": meta["description"],
                "tools": meta["tools"],
                "advantages": meta.get("advantages", []),
                "video_link": meta.get("video_url", ""),
                "pdf_link": meta.get("pdf_url", ""),
                "roadmap": meta["roadmap"],
                "learning_resources": meta["learning_resources"],
            })

        collection.delete_many({})
        collection.insert_many(career_data_list)
        print(f"Seeded {len(career_data_list)} career paths with roadmaps and learning resources.")

    except Exception as exc:
        print(f"Error seeding data: {exc}")


if __name__ == "__main__":
    seed_data()
