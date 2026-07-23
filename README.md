# Personalized Career Recommendation System

Web application that recommends IT careers from a user's skills, interests, education, and strengths, then shows learning and practice steps.

## Features

- Top 3 career recommendations with match percentage
- Content-based scoring (TF-IDF + interest overlap + cosine similarity)
- Career path suggestions using a DAG (for display only)
- Student flow: Learn, Practice, Project
- User dashboard and admin tools

## Tech stack

| Layer | Technology |
|-------|------------|
| Frontend | React (Vite), Tailwind CSS |
| Backend | Node.js, Express, MongoDB |
| Recommendation API | Python, Flask |
| Dataset | `personalized/data/career_dataset.csv` (~15,100 rows, 151 IT careers) |

## Algorithm

Defined in `personalized/formulas.py`:

| Part | Weight |
|------|--------|
| Skill match (TF-IDF) | 0.55 |
| Interest overlap | 0.27 |
| Cosine similarity | 0.18 |

Final score = (TF-IDF × 0.55) + (Interest × 0.27) + (Cosine×100 × 0.18)

The system is limited to IT careers.

## Accuracy (reference)

| Metric | Value |
|--------|--------|
| Top-1 | ~44% |
| Top-3 | ~75% (main metric used in the app) |
| F1 | ~0.52 |

Measured with `personalized/evaluate_model.py` (80/20 split).

## Folder structure

```
Frontend/       React app (port 5173)
Server/         Express API (port 8000)
personalized/   Flask API + dataset (port 5002)
EDA.ipynb
model_evaluation.ipynb
figures/eda/
```

## How to run

Start MongoDB first.

### Flask (5002)

```bash
cd personalized
pip install -r requirements.txt
python career.py
```

### Node server (8000)

```bash
cd Server
npm install
npm start
```

Use `PORT=8000` and `ML_URL=http://localhost:5002` in `Server/.env`.

### Frontend (5173)

```bash
cd Frontend
npm install
npm run dev
```

Open http://localhost:5173

## Evaluation

```bash
cd personalized
python evaluate_model.py 5
```

Also see `EDA.ipynb` and `model_evaluation.ipynb`.

## Testing

Unit tests for the recommendation engine:

```bash
cd personalized
python -m unittest discover -s tests -v
```

API and module checks (login, courses, etc.) can be done in Postman.  
Full app flow is checked manually in the browser.

## Limitations

- IT careers only
- Top-1 is lower when there are many similar roles (151 classes)
- Dataset is for recommendation demo, not live job listings
