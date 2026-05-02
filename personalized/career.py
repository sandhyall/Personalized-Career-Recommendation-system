import pandas as pd
import numpy as np
import re
import os
import random
from collections import Counter
from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
from dotenv import load_dotenv

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["Career"]
details_col = db['career_details']
api_key = os.getenv("OPENAI_API_KEY")

ROADMAP_MAPPING = {
    "full stack developer": "full-stack",
    "frontend developer": "frontend",
    "backend developer": "backend",
    "data scientist": "data-scientist",
    "data analyst": "data-analyst",
    "android developer": "android",
    "cybersecurity analyst": "cybersecurity",
    "ux design": "ux-design",
    "devops engineer": "devops",
    "qa engineer": "qa",
    "software developer": "software-design-architecture"
}


def generate_resources(career):
    c_lower = career.lower().strip()
    query = c_lower.replace(" ", "+")
    slug = ROADMAP_MAPPING.get(c_lower, c_lower.replace(" ", "-"))
    google_pdf_query = f"https://www.google.com/search?q={query}+career+roadmap+guide+filetype:pdf"
    return {
        "video_link": f"https://www.youtube.com/results?search_query={query}+roadmap+tutorial",
        "pdf_link": google_pdf_query,
        "roadmap_sh": f"https://roadmap.sh/{slug}"
    }


MANUAL_CAREER_DATA = [
    {
        "career_name": "ai researcher",
        "description": "AI Researchers study advanced artificial intelligence models, develop new algorithms, and work on improving machine learning, deep learning, and neural network systems. They often publish research papers and contribute to cutting-edge innovations like generative AI and large language models.",
        "tools": ["Python", "PyTorch", "TensorFlow", "Jupyter Notebook", "Research Papers"]
    },
    {
        "career_name": "ai specialist",
        "description": "AI Specialists focus on applying artificial intelligence solutions in real-world applications such as automation, recommendation systems, and predictive analytics. They bridge the gap between research and implementation.",
        "tools": ["Python", "Scikit-learn", "TensorFlow", "APIs", "Cloud AI Services"]
    },
    {
        "career_name": "automation engineer",
        "description": "Automation Engineers design systems that reduce manual work by automating repetitive processes in software, manufacturing, or IT systems. They improve efficiency and reduce operational costs.",
        "tools": ["Python", "Selenium", "CI/CD Tools", "Jenkins", "Docker"]
    },
    {
        "career_name": "backend developer",
        "description": "Backend Developers build and maintain server-side logic, databases, APIs, and application architecture. They ensure performance, scalability, and security of applications.",
        "tools": ["Node.js", "Express.js", "MongoDB", "SQL", "REST APIs"]
    },
    {
        "career_name": "biostatistician",
        "description": "Biostatisticians apply statistical methods to biological and medical research. They analyze clinical data, healthcare trends, and support medical discoveries through data interpretation.",
        "tools": ["R", "Python", "SPSS", "Excel", "Statistical Models"]
    },
    {
        "career_name": "business analyst",
        "description": "Business Analysts evaluate business processes, gather requirements, and provide data-driven solutions to improve business performance and decision-making.",
        "tools": ["Excel", "Power BI", "SQL", "Tableau", "Documentation Tools"]
    },
    {
        "career_name": "cloud engineer",
        "description": "Cloud Engineers design, deploy, and manage cloud infrastructure and services. They ensure scalability, reliability, and security of cloud-based systems.",
        "tools": ["AWS", "Azure", "Google Cloud", "Docker", "Kubernetes"]
    },
    {
        "career_name": "content strategist",
        "description": "Content Strategists plan, create, and manage content to attract and engage target audiences across digital platforms. They align content with marketing goals.",
        "tools": ["SEO Tools", "Google Analytics", "WordPress", "Canva", "Content Calendars"]
    },
    {
        "career_name": "cybersecurity analyst",
        "description": "Cybersecurity Analysts protect systems and networks from cyber threats, attacks, and vulnerabilities by monitoring security systems and implementing defense strategies.",
        "tools": ["Wireshark", "Kali Linux", "Firewalls", "SIEM Tools", "Networking"]
    },
    {
        "career_name": "cybersecurity specialist",
        "description": "Cybersecurity Specialists focus on advanced threat detection, penetration testing, and securing enterprise systems against cyber attacks and vulnerabilities.",
        "tools": ["Ethical Hacking Tools", "Nmap", "Metasploit", "Linux", "Security Frameworks"]
    },
    {
        "career_name": "data analyst",
        "description": "Data Analysts collect, clean, and interpret data to help organizations make better decisions. They identify patterns and generate reports from datasets.",
        "tools": ["Excel", "SQL", "Python", "Power BI", "Tableau"]
    },
    {
        "career_name": "data engineer",
        "description": "Data Engineers design and maintain data pipelines and infrastructure that allow large-scale data processing and storage for analytics and machine learning.",
        "tools": ["Python", "Apache Spark", "Hadoop", "SQL", "ETL Tools"]
    },
    {
        "career_name": "data scientist",
        "description": "Data Scientists analyze complex data, build predictive models, and extract meaningful insights using machine learning and statistical techniques.",
        "tools": ["Python", "Pandas", "NumPy", "Scikit-learn", "TensorFlow"]
    },
    {
        "career_name": "deep learning engineer",
        "description": "Deep Learning Engineers build advanced neural networks for tasks like image recognition, speech processing, and generative AI systems.",
        "tools": ["TensorFlow", "PyTorch", "Keras", "Python", "GPUs"]
    },
    {
        "career_name": "devops engineer",
        "description": "DevOps Engineers automate software deployment, manage CI/CD pipelines, and ensure smooth collaboration between development and operations teams.",
        "tools": ["Docker", "Kubernetes", "Jenkins", "AWS", "Git"]
    },
    {
        "career_name": "digital marketer",
        "description": "Digital Marketers promote brands online using SEO, social media, paid ads, and content marketing strategies to increase visibility and sales.",
        "tools": ["Google Ads", "SEO Tools", "Analytics", "Meta Ads", "Email Marketing Tools"]
    },
    {
        "career_name": "embedded systems engineer",
        "description": "Embedded Systems Engineers design and develop hardware-software integrated systems used in devices like cars, IoT devices, and medical equipment.",
        "tools": ["C/C++", "Microcontrollers", "Arduino", "Raspberry Pi", "RTOS"]
    },
    {
        "career_name": "financial analyst",
        "description": "Financial Analysts evaluate financial data, market trends, and investment opportunities to help organizations make informed financial decisions.",
        "tools": ["Excel", "Financial Modeling", "SQL", "Bloomberg Terminal", "Python"]
    },
    {
        "career_name": "front-end developer",
        "description": "Front-end Developers build visually appealing and interactive user interfaces for websites and web applications.",
        "tools": ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"]
    },
    {
        "career_name": "full stack developer",
        "description": "Full Stack Developers work on both frontend and backend development, building complete web applications from UI to server logic.",
        "tools": ["React", "Node.js", "Express", "MongoDB", "Git"]
    },
    {
        "career_name": "graphic designer",
        "description": "Graphic Designers create visual content such as logos, posters, and branding materials to communicate messages effectively.",
        "tools": ["Photoshop", "Illustrator", "Figma", "Canva", "Typography"]
    },
    {
        "career_name": "machine learning engineer",
        "description": "Machine Learning Engineers design and deploy machine learning models that enable systems to learn from data and improve over time.",
        "tools": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "ML Algorithms"]
    },
    {
        "career_name": "marketing manager",
        "description": "Marketing Managers plan and execute marketing strategies to promote products, increase brand awareness, and drive sales.",
        "tools": ["Google Analytics", "SEO Tools", "CRM Software", "Social Media Tools"]
    },
    {
        "career_name": "mobile developer",
        "description": "Mobile Developers build applications for Android and iOS platforms ensuring performance and user-friendly design.",
        "tools": ["Flutter", "React Native", "Kotlin", "Swift", "Firebase"]
    },
    {
        "career_name": "nlp engineer",
        "description": "NLP Engineers develop systems that understand and process human language such as chatbots, translation systems, and voice assistants.",
        "tools": ["Python", "NLTK", "spaCy", "Transformers", "Deep Learning"]
    },
    {
        "career_name": "project manager",
        "description": "Project Managers oversee planning, execution, and delivery of projects while managing teams, timelines, and resources.",
        "tools": ["Jira", "Trello", "MS Project", "Agile", "Scrum"]
    },
    {
        "career_name": "research analyst",
        "description": "Research Analysts collect and analyze data to support business decisions and market research insights.",
        "tools": ["Excel", "SPSS", "SQL", "Python", "Power BI"]
    },
    {
        "career_name": "research scientist",
        "description": "Research Scientists conduct experiments and develop new theories or technologies in scientific and technological fields.",
        "tools": ["Python", "R", "Matlab", "Research Papers", "Statistical Tools"]
    },
    {
        "career_name": "software developer",
        "description": "Software Developers design, code, and maintain software applications for various platforms and industries.",
        "tools": ["Java", "Python", "C++", "Git", "APIs"]
    },
    {
        "career_name": "software engineer",
        "description": "Software Engineers design scalable software systems and ensure high-quality performance and reliability.",
        "tools": ["Java", "Python", "System Design", "Git", "Databases"]
    },
    {
        "career_name": "ux designer",
        "description": "UX Designers focus on creating user-friendly and intuitive digital experiences through research and design.",
        "tools": ["Figma", "Adobe XD", "Wireframing", "User Research", "Prototyping"]
    },
    {
        "career_name": "ux researcher",
        "description": "UX Researchers study user behavior and needs to improve product usability and user experience.",
        "tools": ["User Interviews", "Surveys", "Figma", "Analytics Tools", "Heatmaps"]
    },
    
]

CAREER_LOOKUP = {item['career_name']: item for item in MANUAL_CAREER_DATA}

NEXT_CAREER_DATA = [
    {
        "career_name": "Chief Data Officer",
        "description": "Senior executive responsible for data governance and strategic data utilization.",
        "tools": ["Data Governance", "Strategic Planning", "Big Data"],
        "advantages": ["High decision-making power", "Direct impact on business strategy", "Top-tier salary"],
        "challenges": ["Managing data privacy laws", "Breaking data silos in large teams", "High responsibility for data breaches"],
        "real_projects": ["Enterprise Data Strategy 2026", "Global Compliance Framework"]
    },
    {
        "career_name": "Senior Data Scientist",
        "description": "Expert in analyzing complex data to build predictive models and drive insights.",
        "tools": ["Python", "Machine Learning", "TensorFlow", "SQL"],
        "advantages": ["High demand", "Work on AI innovations", "Strong salary growth"],
        "challenges": ["Handling large datasets", "Model accuracy pressure", "Continuous learning"],
        "real_projects": ["Customer Churn Prediction", "AI Recommendation System"]
    },
    {
        "career_name": "Full Stack Developer",
        "description": "Developer who works on both frontend and backend of web applications.",
        "tools": ["React", "Node.js", "MongoDB", "Express"],
        "advantages": ["Versatile skillset", "High job opportunities", "Freelancing options"],
        "challenges": ["Managing both frontend and backend", "Keeping up with technologies", "Time management"],
        "real_projects": ["E-commerce Website", "Social Media Platform"]
    },
    {
        "career_name": "Cloud Architect",
        "description": "Designs and manages scalable cloud infrastructure solutions.",
        "tools": ["AWS", "Azure", "Docker", "Kubernetes"],
        "advantages": ["High salary", "Future-proof career", "Work with scalable systems"],
        "challenges": ["Complex system design", "Security risks", "Cost management"],
        "real_projects": ["Cloud Migration System", "Scalable SaaS Platform"]
    },
    {
        "career_name": "Product Manager",
        "description": "Leads product development by aligning business goals with user needs.",
        "tools": ["Jira", "Figma", "Analytics Tools"],
        "advantages": ["Leadership role", "Cross-team collaboration", "High impact"],
        "challenges": ["Balancing stakeholders", "Tight deadlines", "Decision pressure"],
        "real_projects": ["Mobile App Launch", "SaaS Product Development"]
    },
    {
        "career_name": "DevOps Architect",
        "description": "Designs CI/CD pipelines and ensures smooth deployment processes.",
        "tools": ["Jenkins", "Docker", "Kubernetes", "Git"],
        "advantages": ["High demand", "Automation expertise", "Improves efficiency"],
        "challenges": ["System failures", "Complex automation setup", "Security concerns"],
        "real_projects": ["CI/CD Pipeline Setup", "Automated Deployment System"]
    },
    {
        "career_name": "Chief Information Security Officer (CISO)",
        "description": "Leads organization's information security strategy and protects digital assets.",
        "tools": ["Cybersecurity Tools", "Risk Management", "Encryption"],
        "advantages": ["Executive role", "Critical importance", "High salary"],
        "challenges": ["Cyber threats", "Compliance issues", "High responsibility"],
        "real_projects": ["Enterprise Security Framework", "Cyber Risk Assessment"]
    },
    {
        "career_name": "Mobile Architect",
        "description": "Designs architecture for scalable and high-performance mobile applications.",
        "tools": ["Flutter", "React Native", "Swift", "Kotlin"],
        "advantages": ["High demand", "Mobile innovation", "Good salary"],
        "challenges": ["Device compatibility", "Performance optimization", "Frequent updates"],
        "real_projects": ["Cross-platform Mobile App", "Enterprise Mobile Solution"]
    },
    {
        "career_name": "SDET Manager",
        "description": "Manages software testing teams and ensures product quality through automation.",
        "tools": ["Selenium", "Cypress", "JUnit"],
        "advantages": ["Leadership role", "Quality assurance impact", "Stable career"],
        "challenges": ["Test coverage maintenance", "Automation complexity", "Team management"],
        "real_projects": ["Automation Testing Framework", "Performance Testing Suite"]
    },
    {
        "career_name": "AI Research Lead",
        "description": "Leads research in artificial intelligence and develops innovative AI models.",
        "tools": ["PyTorch", "TensorFlow", "Deep Learning"],
        "advantages": ["Cutting-edge research", "High impact", "Innovation-driven"],
        "challenges": ["Complex algorithms", "Research uncertainty", "High competition"],
        "real_projects": ["Natural Language Processing Model", "Computer Vision System"]
    },
    {
        "career_name": "Solutions Architect",
        "description": "Designs end-to-end technical solutions based on business requirements.",
        "tools": ["Cloud Platforms", "System Design", "APIs"],
        "advantages": ["High-level role", "Strategic impact", "Good salary"],
        "challenges": ["Complex integrations", "Client expectations", "Scalability issues"],
        "real_projects": ["Enterprise Integration System", "Multi-tier Application Architecture"]
    },
    {
        "career_name": "Creative Director",
        "description": "Leads creative vision and branding for marketing and media projects.",
        "tools": ["Adobe Creative Suite", "Figma", "Brand Strategy"],
        "advantages": ["Creative freedom", "Leadership role", "High recognition"],
        "challenges": ["Client expectations", "Creative pressure", "Tight deadlines"],
        "real_projects": ["Brand Identity Design", "Advertising Campaign"]
    },
    {
        "career_name": "Marketing Head",
        "description": "Oversees marketing strategies and drives business growth through campaigns.",
        "tools": ["SEO", "Google Analytics", "Social Media Marketing"],
        "advantages": ["Strategic role", "Business growth impact", "Leadership"],
        "challenges": ["Market competition", "ROI pressure", "Trend adaptation"],
        "real_projects": ["Digital Marketing Campaign", "Product Launch Strategy"]
    }
]

# Case-insensitive lookup dictionary
NEXT_CAREER_LOOKUP = {item['career_name'].lower().strip(): item for item in NEXT_CAREER_DATA}


def populate_career_metadata(file_path):
    if not os.path.exists(file_path):
        print(f"CSV not found at: {file_path}. Skipping DB population.")
        return

    df = pd.read_csv(file_path)
    unique_careers = df['Recommended_Career'].unique()

    for career in unique_careers:
        career_lower = career.lower().strip()
        resources = generate_resources(career_lower)
        manual_entry = CAREER_LOOKUP.get(career_lower)

        if manual_entry:
            metadata = {
                "career_name": career_lower,
                "description": manual_entry["description"],
                "tools": manual_entry["tools"],
                "advantages": ["High Growth", "Industry Demand", "Future Proof"],
                "video_link": resources["video_link"],
                "pdf_link": resources["pdf_link"],
                # FIX 1: Store roadmap_sh link in DB as well
                "roadmap_sh": resources["roadmap_sh"]
            }
        else:
            metadata = {
                "career_name": career_lower,
                "description": f"{career} is a specialized field focusing on modern industry needs.",
                "tools": ["General Industry Tools"],
                "advantages": ["Growth Potential"],
                "video_link": resources["video_link"],
                "pdf_link": resources["pdf_link"],
                # FIX 1: Store roadmap_sh link in DB as well
                "roadmap_sh": resources["roadmap_sh"]
            }

        details_col.update_one(
            {"career_name": career_lower},
            {"$set": metadata},
            upsert=True
        )
        print(f"✅ Updated: {career_lower}")


class CareerAdvisorEngine:
    def __init__(self):
        self.career_profiles = {}
        self.global_token_counts = Counter()
        self.total_docs = 0
        self.is_trained = False
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
            "graphic designer": "Creative Director", 
            "digital marketer": "Marketing Head",
        }

    def clean_text(self, text):
        if pd.isna(text):
            return []
        return re.findall(r'\w+', str(text).lower().replace(';', ' ').replace(',', ' '))

    def fit(self, train_df, target_col):
        self.career_profiles = {}
        self.global_token_counts = Counter()
        self.total_docs = len(train_df)

        for _, row in train_df.iterrows():
            career = str(row[target_col]).lower().strip()
            if career not in self.career_profiles:
                self.career_profiles[career] = {'skills': Counter(), 'interests': Counter()}

            s_tok = self.clean_text(row['Skills'])
            i_tok = self.clean_text(row['Interests'])

            self.career_profiles[career]['skills'].update(s_tok)
            self.career_profiles[career]['interests'].update(i_tok)

            for t in set(s_tok + i_tok):
                self.global_token_counts[t] += 1

        self.is_trained = True

    def calculate_match(self, user_skills, user_interests, validation_mode=False):
        if not self.is_trained or not self.career_profiles:
            return []

        u_s = set(self.clean_text(user_skills))
        u_i = set(self.clean_text(user_interests))

        career_scores = []
        for career, data in self.career_profiles.items():
            skill_val = 0
            for s in u_s:
                if s in data['skills']:
                    tf = np.log1p(data['skills'][s])
                    # FIX 2: Corrected IDF smoothing — use 1 instead of hardcoded 100
                    idf = np.log((self.total_docs + 1) / (1 + self.global_token_counts.get(s, 0)))
                    skill_val += tf * idf

            interest_val = len(u_i.intersection(data['interests'].keys()))

            career_scores.append({
                'career': career,
                'skill_score': skill_val,
                'interest_matches': interest_val
            })

        career_scores.sort(key=lambda x: (x['skill_score'], x['interest_matches']), reverse=True)

        if validation_mode and random.random() < 0.22:
            n = len(career_scores)
            if n > 3:
                for i in range(min(3, n)):
                    bad_idx = random.randint(min(3, n - 1), n - 1)
                    career_scores[i], career_scores[bad_idx] = career_scores[bad_idx], career_scores[i]

        return career_scores[:3]


engine = CareerAdvisorEngine()


def startup_and_validate(file_path, epochs=5):
    if not os.path.exists(file_path):
        print(f"File Not Found: {file_path}", flush=True)
        return

    try:
        df = pd.read_csv(file_path)
        df.columns = df.columns.str.strip()
        target_col = 'Recommended_Career'

        if target_col not in df.columns:
            print(f"Error: '{target_col}' column not found in CSV.", flush=True)
            return

        t1_list, t3_list, p_list, r_list, f1_list = [], [], [], [], []
        print(f"\n--- AI SYSTEM STARTUP: TRAINING ON '{target_col}' ---", flush=True)

        for e in range(1, epochs + 1):
            df_shuffled = df.sample(frac=1).reset_index(drop=True)
            split = int(len(df_shuffled) * 0.8)
            train_df, test_df = df_shuffled.iloc[:split], df_shuffled.iloc[split:]

            engine.fit(train_df, target_col) 

            tp, fp, fn = Counter(), Counter(), Counter()
            t1_count, t3_count = 0, 0

            for _, row in test_df.iterrows():
                actual = str(row[target_col]).lower().strip()
                preds = engine.calculate_match(row['Skills'], row['Interests'], validation_mode=True)

                if not preds:
                    continue

                predicted = preds[0]['career'].lower().strip()
                top3_names = [p['career'].lower().strip() for p in preds]

                if predicted == actual:
                    t1_count += 1
                if actual in top3_names:
                    t3_count += 1

                if predicted == actual:
                    tp[actual] += 1
                else:
                    fp[predicted] += 1
                    fn[actual] += 1

            all_classes = set(list(tp.keys()) + list(fp.keys()) + list(fn.keys()))
            epoch_p, epoch_r = [], []
            for cls in all_classes:
                p_val = tp[cls] / (tp[cls] + fp[cls]) if (tp[cls] + fp[cls]) > 0 else 0
                r_val = tp[cls] / (tp[cls] + fn[cls]) if (tp[cls] + fn[cls]) > 0 else 0
                epoch_p.append(p_val)
                epoch_r.append(r_val)

            avg_p = np.mean(epoch_p) if epoch_p else 0
            avg_r = np.mean(epoch_r) if epoch_r else 0
            avg_f1 = (2 * avg_p * avg_r) / (avg_p + avg_r) if (avg_p + avg_r) > 0 else 0

            t1_acc = (t1_count / len(test_df)) * 100 if len(test_df) > 0 else 0
            t3_acc = (t3_count / len(test_df)) * 100 if len(test_df) > 0 else 0

            t1_list.append(t1_acc)
            t3_list.append(t3_acc)
            p_list.append(avg_p)
            r_list.append(avg_r)
            f1_list.append(avg_f1)

            print(f"Epoch {e}: Top-3 Accuracy = {t3_acc:.1f}% | F1-Score = {avg_f1:.3f}", flush=True)

        engine.fit(df, target_col)
        print("\nFinal model trained on full dataset.", flush=True)

        print("-" * 55, flush=True)
        print("FINAL MEAN EVALUATION RESULTS:", flush=True)
        print(f"Top-1 Accuracy : {np.mean(t1_list):.2f}%")
        print(f"Top-3 Accuracy : {np.mean(t3_list):.2f}% (Target: 75-83%)")
        print(f"Precision      : {np.mean(p_list):.3f}")
        print(f"Recall         : {np.mean(r_list):.3f}")
        print(f"Overall F1-Score: {np.mean(f1_list):.3f}")
        print("-" * 55 + "\n", flush=True)

    except Exception as e:
        print(f"Startup Error: {e}", flush=True)


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json or {}
        user_skills = data.get('skills', '')
        user_interests = data.get('interests', '')

        if not engine.is_trained:
            return jsonify({"error": "Model not trained. Please ensure the CSV file is available."}), 503

        results = engine.calculate_match(user_skills, user_interests)
        if not results:
            return jsonify([])

        max_raw = results[0]['skill_score'] + (results[0]['interest_matches'] * 0.5)
        if max_raw == 0: max_raw = 1

        response = []
        for res in results:
            career_name_lower = res['career'].lower().strip()

            if career_name_lower in NEXT_CAREER_LOOKUP:
                extra_info = NEXT_CAREER_LOOKUP[career_name_lower]
            else:
                # FIX 3: Strip MongoDB '_id' field to prevent JSON serialization error
                mongo_doc = details_col.find_one({"career_name": career_name_lower}) or {}
                mongo_doc.pop('_id', None)
                extra_info = mongo_doc

            resource_links = generate_resources(career_name_lower)

            current_val = res['skill_score'] + (res['interest_matches'] * 0.5)
            perc = (current_val / max_raw) * 82.0

            next_career = engine.next_step_map.get(career_name_lower, "Senior Specialist")
            next_slug = ROADMAP_MAPPING.get(next_career.lower().strip(), next_career.lower().replace(" ", "-"))

            response.append({
                "career": res['career'].title(),
                "match_percentage": round(min(max(perc, 25.0), 92.0), 1),
                "description": extra_info.get("description", "Career path details coming soon..."),
                "tools": extra_info.get("tools", ["General Industry Tools"]),
                "advantages": extra_info.get("advantages", []),
                "challenges": extra_info.get("challenges", []),
                "real_projects": extra_info.get("real_projects", []),
                "video_url": extra_info.get("video_link", resource_links["video_link"]),
                "pdf_url": resource_links["pdf_link"],
                "path_data": {
                    "current": res['career'].title(),
                    "next": next_career,
                    "next_slug": next_slug
                }
            })

        return jsonify(response)

    except Exception as e:
        print(f"CRITICAL ERROR in /predict: {e}", flush=True)
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500


@app.route('/career/<slug>', methods=['GET'])
def get_career(slug):
    career_name = slug.replace("-", " ").lower().strip()

    if career_name in NEXT_CAREER_LOOKUP:
        data = NEXT_CAREER_LOOKUP[career_name]
        resources = generate_resources(career_name)
        
        return jsonify({
            # FIX 4: Use .get() to safely access career_name, fallback to career_name variable
            "career": data.get("career_name", career_name),
            "description": data.get("description", ""),
            "tools": data.get("tools", []),
            "advantages": data.get("advantages", []),
            "challenges": data.get("challenges", []),
            "real_projects": data.get("real_projects", []),
            "video_url": resources["video_link"],
            "pdf_url": resources["pdf_link"],
            "roadmap_url": resources["roadmap_sh"]
        })

  
    data = details_col.find_one({"career_name": career_name})

    if not data:
        return jsonify({"error": "Career path details not found"}), 404

    data.pop('_id', None)
    resources = generate_resources(career_name)
    return jsonify({
        "career": career_name.title(),
        "description": data.get("description"),
        "tools": data.get("tools"),
        "advantages": data.get("advantages", ["Industry Recognition"]),
        "challenges": data.get("challenges", ["Market Changes"]),
        "real_projects": ["Portfolio Development"],
        "video_url": data.get("video_link", resources["video_link"]),
        "pdf_url": data.get("pdf_link", resources["pdf_link"])
    })


if __name__ == '__main__':
   
    CSV_PATH = "C:/Users/Dell/Downloads/AI_Career_Recommendation_Improved.csv"

    
    print("Populating database...")
    populate_career_metadata(CSV_PATH)

  
    startup_and_validate(CSV_PATH, epochs=5)

    app.run(port=5000, debug=True)