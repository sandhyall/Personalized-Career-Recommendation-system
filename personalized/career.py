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
from career_enrichment import (
    get_curated_resources,
    get_jobs_for_career,
    get_required_skills,
    build_path_dag,
    resolve_career_key,
    to_slug,
    calculate_job_readiness,
    get_practice_challenges,
    get_project_assignment,
    CURATED_RESOURCES,
    CAREER_JOBS,
    REQUIRED_SKILLS,
)
from formulas import (
    build_token_vector,
    compute_skill_tfidf_score,
    cosine_similarity,
    heuristic_final_score,
    interest_overlap_score,
    normalize_match_percentage,
    tokenize,
)

load_dotenv()
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

client = MongoClient("mongodb://127.0.0.1:27017/")
db = client["Career"]
details_col = db['career_details']



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
    curated = get_curated_resources(c_lower)
    if curated.get("video_url") and curated.get("pdf_url") and curated.get("roadmap_url"):
        return {
            "video_link": curated["video_url"],
            "pdf_link": curated["pdf_url"],
            "roadmap_sh": curated["roadmap_url"],
            "video_title": curated.get("video_title"),
        }

    query = c_lower.replace(" ", "+")
    slug = ROADMAP_MAPPING.get(c_lower, c_lower.replace(" ", "-"))
    google_pdf_query = f"https://www.google.com/search?q={query}+career+roadmap+guide+filetype:pdf"
    return {
        "video_link": curated.get("video_url") or f"https://www.youtube.com/results?search_query={query}+roadmap+tutorial",
        "pdf_link": curated.get("pdf_url") or google_pdf_query,
        "roadmap_sh": curated.get("roadmap_url") or f"https://roadmap.sh/{slug}",
        "video_title": curated.get("video_title"),
    }


MANUAL_CAREER_DATA = [
    {
        "career_name": "ai researcher",
        "description": "AI Researchers study machine learning and deep learning models, develop algorithms, and work on research problems in artificial intelligence.",
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
        "description": "Front-end Developers build visually appealing and interactive user interfaces for websites and web applications using HTML, CSS, JavaScript, and modern frameworks.",
        "tools": ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS"]
    },
    {
        "career_name": "frontend developer",
        "description": "Frontend Developers build interactive, responsive user interfaces using HTML, CSS, JavaScript, and modern frameworks like React.",
        "tools": ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS", "Git"]
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

# Normalize common naming variants from the dataset vs manuals
CAREER_ALIASES = {
    "frontend developer": "front-end developer",
    "front end developer": "front-end developer",
    "ui/ux designer": "ux designer",
    "ui ux designer": "ux designer",
    "qa engineer": "automation engineer",
}


def get_manual_career_info(career_lower: str) -> dict:
    key = (career_lower or "").lower().strip()
    if key in CAREER_LOOKUP:
        return CAREER_LOOKUP[key]
    alias = CAREER_ALIASES.get(key)
    if alias and alias in CAREER_LOOKUP:
        return CAREER_LOOKUP[alias]
    # Hyphen/space variants
    spaced = key.replace("-", " ")
    hyphen = key.replace(" ", "-")
    if spaced in CAREER_LOOKUP:
        return CAREER_LOOKUP[spaced]
    if hyphen in CAREER_LOOKUP:
        return CAREER_LOOKUP[hyphen]
    return {}


def is_weak_career_metadata(info: dict) -> bool:
    if not info:
        return True
    tools = info.get("tools") or []
    desc = str(info.get("description") or "")
    if tools == ["General Industry Tools"] or not tools:
        return True
    if "specialized field focusing on modern industry needs" in desc:
        return True
    return False


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
        manual_entry = get_manual_career_info(career_lower)

        if manual_entry:
            metadata = {
                "career_name": career_lower,
                "description": manual_entry["description"],
                "tools": manual_entry["tools"],
                "advantages": ["High Growth", "Industry Demand", "Future Proof"],
                "challenges": ["Continuous Learning", "Fast-Changing Tools"],
                "video_link": resources["video_link"],
                "pdf_link": resources["pdf_link"],
                "roadmap_sh": resources["roadmap_sh"]
            }
        else:
            metadata = {
                "career_name": career_lower,
                "description": f"{career} is a specialized field focusing on modern industry needs.",
                "tools": ["General Industry Tools"],
                "advantages": ["Growth Potential"],
                "challenges": ["Market Competition"],
                "video_link": resources["video_link"],
                "pdf_link": resources["pdf_link"],
                "roadmap_sh": resources["roadmap_sh"]
            }

        details_col.update_one(
            {"career_name": career_lower},
            {"$set": metadata},
            upsert=True
        )
        print(f"Updated: {career_lower}")


class CareerAdvisorEngine:
    def __init__(self):
        self.career_profiles = {}
        self.global_token_counts = Counter()
        self.total_docs = 0
        self.vocabulary = []
        self.is_trained = False

      
        self.next_step_map = {
            "data scientist": "Chief Data Officer",
            "data analyst": "Senior Data Scientist",
            "frontend developer": "Full Stack Developer",
            "front-end developer": "Full Stack Developer",   
            "backend developer": "Cloud Architect",
            "ux designer": "Product Manager",               
            "ux researcher": "Product Manager",             
            "cloud engineer": "DevOps Architect",
            "cybersecurity analyst": "Chief Information Security Officer (CISO)",
            "cybersecurity specialist": "Chief Information Security Officer (CISO)",
            "mobile developer": "Mobile Architect",
            "qa engineer": "SDET Manager",
            "machine learning engineer": "AI Research Lead",
            "software developer": "Solutions Architect",
            "software engineer": "Solutions Architect",     
            "graphic designer": "Creative Director",
            "digital marketer": "Marketing Head",
            "marketing manager": "Marketing Head",          
        }

    # Map short/alias skill tokens to canonical forms used in the dataset
    SKILL_ALIASES = {
        "js": "javascript",
        "ts": "typescript",
        "nodejs": "node",
        "reactjs": "react",
        "vuejs": "vue",
        "nextjs": "next",
        "html5": "html",
        "css3": "css",
        "postgres": "postgresql",
        "mongo": "mongodb",
        "k8s": "kubernetes",
        "py": "python",
        "golang": "go",
    }

    def clean_text(self, text):
        return tokenize(text)

    def normalize_tokens(self, tokens):
        """Expand aliases (js -> javascript) without losing originals."""
        out = set()
        for t in tokens:
            t = str(t).lower().strip()
            if not t:
                continue
            out.add(t)
            out.add(self.SKILL_ALIASES.get(t, t))
        return out

    def fit(self, train_df, target_col):
        self.career_profiles = {}
        self.global_token_counts = Counter()
        self.total_docs = len(train_df)
        vocab_set = set()

        for _, row in train_df.iterrows():
            career = str(row[target_col]).lower().strip()
            if career not in self.career_profiles:
                self.career_profiles[career] = {
                    "skills": Counter(),
                    "interests": Counter(),
                    "all_tokens": [],
                }

            s_tok = self.clean_text(row["Skills"])
            # Include Strengths when present (old engine did this)
            interest_parts = [str(row.get("Interests", "") or "")]
            for col in ("Strengths", "Strength"):
                if col in row and not pd.isna(row.get(col)):
                    interest_parts.append(str(row.get(col)))
            i_tok = self.clean_text(" ".join(interest_parts))
            combined = s_tok + i_tok

            self.career_profiles[career]["skills"].update(s_tok)
            self.career_profiles[career]["interests"].update(i_tok)
            self.career_profiles[career]["all_tokens"].extend(combined)

            for t in set(combined):
                self.global_token_counts[t] += 1
                vocab_set.add(t)

        self.vocabulary = sorted(vocab_set)
        self.is_trained = True

    def calculate_match(self, user_skills, user_interests, validation_mode=False):
        """
        Old composite matcher:
          FinalScore = (TF-IDF × 0.52) + (Interest × 0.26) + (Cosine×100 × 0.22)
        Soft-word filtering stays in /predict validation; this only ranks careers.
        """
        if not self.is_trained or not self.career_profiles:
            return []

        user_skill_tokens = self.normalize_tokens(self.clean_text(user_skills))
        user_interest_tokens = self.normalize_tokens(self.clean_text(user_interests))
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
        print(f"\n--- TRAINING ON '{target_col}' ---", flush=True)

        for e in range(1, epochs + 1):
            df_shuffled = df.sample(frac=1).reset_index(drop=True)
            split = int(len(df_shuffled) * 0.8)
            train_df, test_df = df_shuffled.iloc[:split], df_shuffled.iloc[split:]

            engine.fit(train_df, target_col)

            tp, fp, fn = Counter(), Counter(), Counter()
            t1_count, t3_count = 0, 0

            for _, row in test_df.iterrows():
                actual = str(row[target_col]).lower().strip()
                preds = engine.calculate_match(row['Skills'], row['Interests'], validation_mode=False)

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


@app.route('/', methods=['GET'])
def home():
    return jsonify({
        "service": "Career Recommendation API",
        "status": "running",
        "message": "Career recommendation API. Frontend: http://localhost:5173",
        "endpoints": {
            "predict": "POST /predict",
            "career": "GET /career/<slug>",
            "job_readiness": "POST /job-readiness",
        },
    })


# Common soft-skill / generic words that appear in the CSV but are NOT enough
# to recommend a tech career path on their own.
SOFT_STOPWORDS = {
    "management", "leadership", "communication", "communications", "business",
    "team", "teams", "work", "working", "worker", "good", "best", "basic",
    "advanced", "knowledge", "experience", "learning", "learn", "study",
    "student", "people", "person", "skill", "skills", "ability", "abilities",
    "strong", "problem", "solving", "creative", "creativity", "analytical",
    "analysis", "research", "writing", "speaking", "presentation",
    "organization", "organised", "organized", "time", "planning", "project",
    "projects", "collaboration", "collaborative", "interpersonal",
    "professional", "development", "career", "careers", "job", "jobs",
    "hello", "world", "test", "testing", "stuff", "thing", "things",
    "something", "anything", "everything", "nothing", "interest", "interests",
    "passion", "passions", "love", "like", "want", "need", "hardworking",
    "dedicated", "motivated", "friendly", "english", "nepali", "language",
}


TECH_TOKEN_ALLOWLIST = {
    "html", "css", "sql", "mysql", "nosql", "php", "aws", "gcp", "nlp", "dba",
    "etl", "ci", "cd", "ui", "ux", "ml", "ai", "iot", "sdk", "api", "apis",
    "jvm", "ocr", "gui", "cli", "ide", "db", "rdbms", "orm", "jwt",
    "ssl", "tls", "http", "https", "rest", "graphql", "mongodb", "postgresql",
    "redis", "kafka", "nginx", "linux", "macos", "ios", "seo", "sem", "crm",
    "erp", "saas", "paas", "iaas", "sre", "qa", "sdet", "css3", "html5",
    "oracle", "sqlite", "mariadb", "dotnet", "nodejs", "reactjs", "nextjs",
    "typescript", "golang", "kotlin", "swift", "flutter", "django", "laravel",
    "spring", "hadoop", "spark", "tableau", "powerbi", "figma", "photoshop",
    "wordpress", "shopify", "magento", "salesforce", "blockchain", "solidity",
    "unity", "unreal", "cisco", "wireshark", "nmap", "kubernetes", "docker",
    "terraform", "ansible", "jenkins", "github", "gitlab", "jira", "scrum",
}

# Non-IT hobbies / topics — reject as interests (system is IT careers only)
OFF_TOPIC_INTERESTS = {
    "cooking", "cricket", "football", "soccer", "basketball", "music", "singing",
    "sing", "dancing", "dance", "movies", "movie", "sports", "sport", "food",
    "travel", "travelling", "fashion", "shopping", "gaming", "gamer", "youtube",
    "tiktok", "instagram", "facebook", "sleeping", "eating", "party", "parties",
    "cars", "bike", "biking", "photography", "painting", "drawing", "poetry",
    "novels", "anime", "manga", "fitness", "gym", "yoga", "meditation",
    "religion", "politics", "farming", "agriculture", "acting", "drama",
    "theatre", "theater", "hobby", "hobbies", "fun",
}


def _is_garbage_token(token):
    """Reject tokens that look like random keyboard / placeholder junk."""
    t = str(token or "").strip().lower()
    if t in TECH_TOKEN_ALLOWLIST:
        return False
    if len(t) < 2:
        return True
    if re.fullmatch(r"(.)\1{2,}", t):  # aaa, xxxx
        return True
    if re.fullmatch(r"(?:abc|abcd|asdf|qwerty|zxcv|test|dummy|none|n/?a|null)+", t):
        return True
    if re.fullmatch(r"\d+", t):  # only digits
        return True
    # Mostly consonants with no vowel — weak signal of gibberish (short words exempt)
    # Include 'y' so tokens like mysql are kept even if not in the allowlist
    if len(t) >= 5 and not re.search(r"[aeiouy]", t):
        return True
    return False


def _skill_vocabulary():
    vocab = set()
    for data in (engine.career_profiles or {}).values():
        vocab.update((data.get("skills") or {}).keys())
    return vocab


def _interest_vocabulary():
    vocab = set()
    for data in (engine.career_profiles or {}).values():
        vocab.update((data.get("interests") or {}).keys())
    return vocab


def validate_user_profile_input(user_skills, user_interests):
    """
    Validate skills/interests before ranking.
    Returns (ok, error_message, tech_skill_tokens, interest_tokens).
    """
    skill_tokens = [
        t for t in engine.clean_text(user_skills)
        if not _is_garbage_token(t)
    ]
    interest_tokens = [
        t for t in engine.clean_text(user_interests)
        if not _is_garbage_token(t)
    ]

    tech_skills = [t for t in skill_tokens if t not in SOFT_STOPWORDS]
    real_interests = [t for t in interest_tokens if t not in SOFT_STOPWORDS]

    hobby_as_skills = [t for t in tech_skills if t in OFF_TOPIC_INTERESTS]
    if hobby_as_skills:
        return (
            False,
            "Skills must be IT/technical (e.g. Python, MySQL, React). "
            "Do not enter hobbies like sleeping, eating, singing, or dancing as skills.",
            tech_skills,
            real_interests or interest_tokens,
        )

    if len(tech_skills) < 2:
        if not skill_tokens:
            return (
                False,
                "This system recommends IT careers only. Enter at least 2 technical "
                "IT skills (e.g. Python, MySQL, React, SEO, Java).",
                tech_skills,
                real_interests or interest_tokens,
            )
        return (
            False,
            "Soft skills alone are not enough. Enter at least 2 IT technical skills "
            "(e.g. Python, SQL, React, MySQL, Java, SEO).",
            tech_skills,
            real_interests or interest_tokens,
        )

    if len(interest_tokens) < 1:
        return (
            False,
            "Please enter at least 1 IT-related interest "
            "(e.g. Web Development, DBA, Cybersecurity, SEO, Cloud).",
            tech_skills,
            real_interests,
        )

    # Block non-IT hobbies (singing, dancing, sports, etc.)
    off_topic_hits = [
        t for t in (real_interests or interest_tokens)
        if t in OFF_TOPIC_INTERESTS
    ]
    career_like = [
        t for t in (real_interests or interest_tokens)
        if t not in OFF_TOPIC_INTERESTS and t not in SOFT_STOPWORDS
    ]
    if off_topic_hits and not career_like:
        return (
            False,
            "This system recommends IT careers only. Interests like singing, dancing, "
            "sports, or cooking are not accepted. Use IT interests such as Web Development, "
            "AI, DBA, SEO, or Cybersecurity.",
            tech_skills,
            real_interests or interest_tokens,
        )

    skill_vocab = _skill_vocabulary()
    interest_vocab = _interest_vocabulary()

    known_tech_skills = [
        t for t in tech_skills
        if t in skill_vocab or t in TECH_TOKEN_ALLOWLIST
    ]
    # Prefer dataset vocabulary; fall back to allowlist so new IT skills still pass
    if len([t for t in tech_skills if t in skill_vocab]) >= 2:
        known_tech_skills = [t for t in tech_skills if t in skill_vocab]

    known_interests = [
        t for t in (real_interests or interest_tokens)
        if t not in OFF_TOPIC_INTERESTS
        and (t in interest_vocab or t in skill_vocab or t in TECH_TOKEN_ALLOWLIST)
    ]

    if len(known_tech_skills) < 2:
        return (
            False,
            "Your skills do not match IT careers in our system. "
            "Please use recognizable technical skills such as Python, Java, HTML, CSS, "
            "JavaScript, React, SQL, MySQL, SEO, or Docker.",
            tech_skills,
            real_interests or interest_tokens,
        )

    if len(known_interests) < 1:
        return (
            False,
            "Your interests do not match IT careers in our system. "
            "Please enter IT-related interests such as Web Development, AI, "
            "Data Science, Cybersecurity, DBA, SEO, Mobile Apps, or Cloud — "
            "not unrelated topics like singing or dancing.",
            tech_skills,
            real_interests or interest_tokens,
        )

    return True, None, known_tech_skills, (known_interests or real_interests or interest_tokens)


@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.json or {}
        user_skills = data.get('skills', '').strip()
        user_interests = data.get('interests', '').strip()

        if not user_skills or not user_interests:
            return jsonify({"error": "Skills and interests are required."}), 400

        if not engine.is_trained:
            return jsonify({"error": "Model not trained. Please ensure the CSV file is available."}), 503

        ok, err_msg, tech_skills, interest_tokens = validate_user_profile_input(
            user_skills, user_interests
        )
        if not ok:
            return jsonify({"error": err_msg, "code": "NO_MEANINGFUL_MATCH"}), 422

        # Rank using filtered technical skills only (ignore soft-skill noise)
        filtered_skills = " ".join(tech_skills)
        filtered_interests = " ".join(interest_tokens)
        results = engine.calculate_match(filtered_skills, filtered_interests)
        if not results:
            return jsonify({
                "error": "No career matches found for your skills and interests. Please try different values.",
                "code": "NO_MEANINGFUL_MATCH",
            }), 422

        # Absolute quality gate: zero skill overlap = unmatched
        best = results[0]
        if best.get("skill_score", 0) <= 0 and best.get("final_score", 0) <= 0:
            return jsonify({
                "error": "No relevant career path matched your technical skills. "
                         "Please enter skills related to technology careers "
                         "(e.g. Python, React, SQL, Java).",
                "code": "NO_MEANINGFUL_MATCH",
            }), 422

        max_raw = best.get("final_score") or (
            best["skill_score"] + (best["interest_matches"] * 0.5)
        )
        if max_raw <= 0:
            return jsonify({
                "error": "No relevant career path matched your input. Please revise your skills and interests.",
                "code": "NO_MEANINGFUL_MATCH",
            }), 422

        # Soft-skill-only inputs previously scored high because those words exist in the CSV
        MIN_ABS_SCORE = 0.15  # final_score scale (old engine); skill_score alone can be small
        if float(best.get("final_score", 0)) < MIN_ABS_SCORE and float(best.get("skill_score", 0)) < 0.5:
            return jsonify({
                "error": "Your skills are too weakly related to careers in our system. "
                         "Add more specific technical skills (e.g. JavaScript, SQL, UI Design) and try again.",
                "code": "WEAK_MATCH",
            }), 422

        response = []
        for res in results:
            final_score = float(res.get("final_score", 0))
            if final_score < MIN_ABS_SCORE * 0.45 and float(res.get("skill_score", 0)) < 0.2:
                continue

            career_name_lower = res['career'].lower().strip()

            if career_name_lower in NEXT_CAREER_LOOKUP:
                extra_info = NEXT_CAREER_LOOKUP[career_name_lower]
            else:
                mongo_doc = details_col.find_one({"career_name": career_name_lower}) or {}
                mongo_doc.pop('_id', None)
                extra_info = mongo_doc

            manual = get_manual_career_info(career_name_lower)
            if is_weak_career_metadata(extra_info) and manual:
                extra_info = {**extra_info, **manual, "career_name": career_name_lower}

            resource_links = generate_resources(career_name_lower)
            tools = extra_info.get("tools") or manual.get("tools") or ["HTML", "CSS", "JavaScript", "Git"]
            if tools == ["General Industry Tools"] and manual.get("tools"):
                tools = manual["tools"]
            required_skills = get_required_skills(career_name_lower, fallback_tools=tools)
            jobs = get_jobs_for_career(career_name_lower)
            path_data = build_path_dag(res['career'], engine.next_step_map)
            real_projects = extra_info.get("real_projects", [])
            practice_challenges = get_practice_challenges(career_name_lower)
            project_assignment = get_project_assignment(
                career_name_lower, real_projects=real_projects, tools=tools
            )

            perc = normalize_match_percentage(final_score if final_score > 0 else (
                res["skill_score"] + (res["interest_matches"] * 0.5)
            ), max_raw)

            response.append({
                "career": res['career'].title(),
                "slug": to_slug(res['career']),
                "match_percentage": perc,
                "description": extra_info.get("description") or manual.get("description") or "Career path details coming soon.",
                "tools": tools,
                "advantages": extra_info.get("advantages", []),
                "challenges": extra_info.get("challenges", []),
                "real_projects": real_projects,
                "practice_challenges": practice_challenges,
                "project_assignment": project_assignment,
                "video_url": resource_links["video_link"],
                "video_title": resource_links.get("video_title"),
                "pdf_url": resource_links["pdf_link"],
                "roadmap_url": resource_links["roadmap_sh"],
                "required_skills": required_skills,
                "jobs": jobs,
                "path_data": path_data,
            })

        if not response:
            return jsonify({
                "error": "No relevant career path matched your skills and interests. "
                         "Please revise your input with clearer technical skills.",
                "code": "NO_MEANINGFUL_MATCH",
            }), 422

        return jsonify(response)

    except Exception as e:
        print(f"Error in /predict: {e}", flush=True)
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500


def _career_detail_payload(career_key, data_source):
    resources = generate_resources(career_key)
    tools = data_source.get("tools", [])
    display_name = data_source.get("career_name", career_key)
    path_data = build_path_dag(display_name, engine.next_step_map)
    real_projects = data_source.get("real_projects", ["Portfolio Development"])
    return {
        "career": str(display_name).title() if not str(display_name)[0].isupper() else display_name,
        "slug": to_slug(display_name),
        "description": data_source.get("description", ""),
        "tools": tools,
        "advantages": data_source.get("advantages", ["Industry Recognition", "High Growth", "Future Proof"]),
        "challenges": data_source.get("challenges", ["Market Changes", "Continuous Learning"]),
        "real_projects": real_projects,
        "practice_challenges": get_practice_challenges(career_key),
        "project_assignment": get_project_assignment(career_key, real_projects=real_projects, tools=tools),
        "video_url": resources["video_link"],
        "video_title": resources.get("video_title"),
        "pdf_url": resources["pdf_link"],
        "roadmap_url": resources["roadmap_sh"],
        "required_skills": get_required_skills(career_key, fallback_tools=tools),
        "jobs": get_jobs_for_career(career_key),
        "path_data": path_data,
    }


@app.route('/career/<path:slug>', methods=['GET'])
def get_career(slug):
    known = list(NEXT_CAREER_LOOKUP.keys()) + list(CAREER_LOOKUP.keys()) + list(CURATED_RESOURCES.keys())
    career_name = resolve_career_key(slug, known)

    if career_name in NEXT_CAREER_LOOKUP:
        data = NEXT_CAREER_LOOKUP[career_name]
        return jsonify(_career_detail_payload(career_name, data))

    data = details_col.find_one({"career_name": career_name})

    if not data:
        # Also check MANUAL_CAREER_DATA before returning 404
        manual = get_manual_career_info(career_name)
        if manual:
            return jsonify(_career_detail_payload(career_name, manual))

        # Fuzzy: try matching NEXT careers by slug (handles parentheses etc.)
        for key, val in NEXT_CAREER_LOOKUP.items():
            if to_slug(key) == to_slug(slug) or to_slug(val.get("career_name", "")) == to_slug(slug):
                return jsonify(_career_detail_payload(key, val))

        return jsonify({"error": "Career path details not found"}), 404

    data.pop('_id', None)
    if is_weak_career_metadata(data):
        manual = get_manual_career_info(career_name)
        if manual:
            data = {**data, **manual, "career_name": career_name}
    return jsonify(_career_detail_payload(career_name, data))


@app.route('/job-readiness', methods=['POST'])
def job_readiness():
    try:
        data = request.get_json(silent=True) or {}
        career = (data.get("career") or "").strip()
        completed = data.get("completed_skills") or []

        if not career:
            return jsonify({"error": "career is required"}), 400

        required = get_required_skills(career.lower())
        result = calculate_job_readiness(completed, required)
        result["career"] = career.title()
        result["required_skills"] = required
        result["jobs"] = get_jobs_for_career(career.lower())
        return jsonify(result)
    except Exception as e:
        print(f"ERROR in /job-readiness: {e}", flush=True)
        return jsonify({"error": "Internal Server Error", "details": str(e)}), 500


if __name__ == '__main__':
    _default_csv = os.path.join(os.path.dirname(__file__), "data", "career_dataset.csv")
    CSV_PATH = os.getenv("CAREER_CSV_PATH", _default_csv)

    print("Populating database...")
    populate_career_metadata(CSV_PATH)

    # Fast path: train once so /predict is available quickly.
    # Multi-epoch accuracy is slow on 15k rows — use evaluate_model.py
    # or set CAREER_EVAL_EPOCHS=5 when you want startup evaluation.
    if not os.path.exists(CSV_PATH):
        print(f"File Not Found: {CSV_PATH}", flush=True)
    else:
        df = pd.read_csv(CSV_PATH)
        df.columns = df.columns.str.strip()
        if "Recommended_Career" in df.columns:
            print(
                f"Training recommendation engine on {len(df)} rows / "
                f"{df['Recommended_Career'].nunique()} careers...",
                flush=True,
            )
            engine.fit(df, "Recommended_Career")
            print("Model ready. API: http://127.0.0.1:5002/predict", flush=True)
        else:
            print("Error: Recommended_Career column missing in CSV.", flush=True)

    eval_epochs = int(os.getenv("CAREER_EVAL_EPOCHS", "0"))
    if eval_epochs > 0:
        startup_and_validate(CSV_PATH, epochs=eval_epochs)
    else:
        print(
            "Skipping multi-epoch accuracy at startup (keeps server fast). "
            "For metrics run: python evaluate_model.py 5",
            flush=True,
        )

    app.run(port=5002, debug=False)