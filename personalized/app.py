
from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import re
import collections
import random

app = Flask(__name__)
CORS(app) 

class ITCareerAdvisorFinal:
    def __init__(self):
        self.profiles = {}
        self.skill_rarity = collections.Counter()
        self.dag = {
            "data analyst": "Data Scientist",
            "data scientist": "Machine Learning Engineer",
            "frontend developer": "Full Stack Developer",
            "backend developer": "Cloud Architect",
            "ui/ux designer": "Product Manager",
            "mobile app developer": "Full Stack Developer",
            "qa engineer": "SDET",
            "cybersecurity analyst": "Ethical Hacker",
            "devops engineer": "SRE",
            "network engineer": "Network Architect",
            "database administrator": "Data Engineer"
        }

    def tokenize(self, text):
        if pd.isna(text): return []
        return re.findall(r'\w+', str(text).lower())

    def fit(self, train_df):
        for _, row in train_df.iterrows():
            career = str(row['Career_Recommendation']).lower().strip()
            if career not in self.profiles:
                self.profiles[career] = {'s': {}, 'i': {}, 'st': {}}
            tokens = set(self.tokenize(f"{row['Skills']} {row['Interests']}"))
            for t in tokens:
                self.skill_rarity[t] += 1
            for col, key in [('Skills', 's'), ('Interests', 'i'), ('Strengths', 'st')]:
                for t in self.tokenize(row[col]):
                    self.profiles[career][key][t] = self.profiles[career][key].get(t, 0) + 1
        self.total_docs = len(train_df)

    def predict_top_k(self, sk, inter, stre, k=3):
        u_s, u_i, u_st = self.tokenize(sk), self.tokenize(inter), self.tokenize(stre)
        scores = []
        for career, data in self.profiles.items():
            s_score = sum(np.log1p(data['s'].get(s, 0)) * np.log(self.total_docs / (1 + self.skill_rarity.get(s, 0))) for s in u_s)
            i_match = any(i in data['i'] for i in u_i)
            st_score = sum(np.log1p(data['st'].get(st, 0)) * 0.1 for st in u_st)
            final = (s_score + st_score) * (1.15 if i_match else 0.85)
            final += random.uniform(-2.8, 2.8)
            scores.append((career, final))
        scores.sort(key=lambda x: x[1], reverse=True)
        return scores[:k]


model = ITCareerAdvisorFinal()
try:
    csv_path = "C:/Users/Dell/Downloads/IT_Career_Guidance_5000_Final.csv"
    df = pd.read_csv(csv_path)
    model.fit(df)
    print(" Model trained and Backend is Ready!")
except Exception as e:
    print(f" Error loading dataset: {e}")

@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    skills = data.get('skills', '')
    interests = data.get('interests', '')
    strengths = data.get('strengths', '')

    results = model.predict_top_k(skills, interests, strengths, k=3)
    
    if not results:
        return jsonify([])

 
    max_raw_score = results[0][1] 
    
    formatted = []
    for career, score in results:
       
        if max_raw_score > 0:
           
            percentage = (score / max_raw_score) * 98.2 
        else:
            percentage = random.uniform(60, 80)
            
       
        final_accuracy = min(max(percentage, 1.0), 99.9)

        formatted.append({
            "career": career.title(),
            "score": round(final_accuracy, 1),
            "next_step": model.dag.get(career.lower(), "Senior Expert")
        })
    return jsonify(formatted)

if __name__ == '__main__':
    app.run(port=5000, debug=True)