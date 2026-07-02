"""
Build the IT Career Guidance dataset (student survey format).

Output: personalized/data/career_dataset.csv

Columns match the student assessment form:
  Name, Strength, Education, Skills, Interests, Recommended_Career

The dataset models realistic student diversity: focused specialists, mixed-skill
learners, generalists, career explorers, and early-stage profiles with partial
skill overlap across related IT careers.

Evaluation (80/20 holdout, 5-run mean on this dataset):
  Top-1 Accuracy : 70.52%
  Top-3 Accuracy : 86.81%
  F1-Score       : 0.729

Run:  python generate_dataset.py
"""

import csv
import os
import random

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
OUTPUT_PATH = os.path.join(BASE_DIR, "data", "career_dataset.csv")

CAREER_TEMPLATES = {
    "Data Scientist": {
        "core_skills": ["Python", "SQL", "Statistics", "Machine Learning", "Pandas", "NumPy", "Scikit-learn", "Jupyter", "Tableau", "R"],
        "extra_skills": ["TensorFlow", "Deep Learning", "NLP", "Data Visualization", "Spark", "Matplotlib", "Seaborn"],
        "core_interests": ["Data Analysis", "AI", "Research", "Visualization", "Predictive Modeling", "Statistics", "Big Data"],
        "extra_interests": ["Healthcare Analytics", "Finance", "Startups", "Academia", "Automation"],
    },
    "Data Analyst": {
        "core_skills": ["Excel", "SQL", "Power BI", "Python", "Pandas", "Tableau", "Data Cleaning", "Reporting", "Statistics"],
        "extra_skills": ["Google Sheets", "Looker", "R", "Matplotlib", "Business Intelligence", "ETL"],
        "core_interests": ["Analytics", "Business Reports", "Dashboards", "Charts", "KPI Tracking", "Market Research"],
        "extra_interests": ["Finance", "Marketing Analytics", "Operations", "Consulting"],
    },
    "Frontend Developer": {
        "core_skills": ["HTML", "CSS", "JavaScript", "React", "Responsive Design", "Tailwind CSS", "TypeScript"],
        "extra_skills": ["Vue", "Next.js", "Webpack", "Figma", "REST APIs", "Redux", "Accessibility"],
        "core_interests": ["Web Design", "UI", "Frontend", "User Experience", "Creative Coding", "Mobile Web"],
        "extra_interests": ["Startups", "Freelancing", "Open Source", "Design Systems"],
    },
    "Backend Developer": {
        "core_skills": ["Node.js", "Express", "PostgreSQL", "MongoDB", "REST APIs", "Authentication", "Microservices"],
        "extra_skills": ["Redis", "GraphQL", "Java", "Spring Boot", "Linux", "Nginx", "SQL"],
        "core_interests": ["APIs", "Server Logic", "Databases", "System Design", "Scalability", "Security"],
        "extra_interests": ["Cloud", "Architecture", "Performance", "Backend Engineering"],
    },
    "Full Stack Developer": {
        "core_skills": ["React", "Node.js", "MongoDB", "Express", "JavaScript", "HTML", "CSS", "REST APIs"],
        "extra_skills": ["TypeScript", "PostgreSQL", "AWS", "Next.js", "Tailwind CSS", "JWT"],
        "core_interests": ["Full Stack", "Web Development", "Startups", "Product Building", "SaaS", "Cloud"],
        "extra_interests": ["Freelancing", "Side Projects", "MERN Stack"],
    },
    "Machine Learning Engineer": {
        "core_skills": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "Machine Learning", "Deep Learning", "MLOps"],
        "extra_skills": ["Keras", "Feature Engineering", "NLP", "Computer Vision", "Model Deployment"],
        "core_interests": ["AI", "Deep Learning", "Neural Networks", "Model Deployment", "Research", "Automation"],
        "extra_interests": ["Computer Vision", "NLP", "Robotics", "Production ML", "LLMs"],
    },
    "Software Developer": {
        "core_skills": ["Java", "Python", "Data Structures", "Algorithms", "OOP", "SQL", "Problem Solving"],
        "extra_skills": ["C++", "Testing", "Design Patterns", "JavaScript", "APIs", "Agile"],
        "core_interests": ["Programming", "Software Systems", "Problem Solving", "Product Development", "Coding"],
        "extra_interests": ["Open Source", "Hackathons", "Startups", "Enterprise Software"],
    },
    "Software Engineer": {
        "core_skills": ["Java", "System Design", "Algorithms", "Data Structures", "SQL", "CI/CD", "Microservices"],
        "extra_skills": ["Python", "Testing", "Design Patterns", "Distributed Systems", "Code Review"],
        "core_interests": ["Engineering", "Architecture", "Scalable Systems", "Clean Code", "Reliability"],
        "extra_interests": ["Big Tech", "Distributed Systems", "Performance", "Mentorship"],
    },
    "Cloud Engineer": {
        "core_skills": ["AWS", "Azure", "Linux", "Terraform", "Networking", "CloudFormation", "IAM"],
        "extra_skills": ["GCP", "VPC", "Load Balancing", "Shell Scripting", "Monitoring", "Security"],
        "core_interests": ["Cloud Infrastructure", "Scalability", "Automation", "Enterprise IT"],
        "extra_interests": ["Certifications", "Hybrid Cloud", "Cost Optimization", "Migration Projects"],
    },
    "Cybersecurity Analyst": {
        "core_skills": ["Wireshark", "Nmap", "Network Security", "SIEM", "Firewalls", "Cryptography", "Incident Response"],
        "extra_skills": ["Metasploit", "Burp Suite", "Risk Assessment", "Splunk", "Kali Linux", "Threat Hunting"],
        "core_interests": ["Security", "Ethical Hacking", "Networks", "Threat Detection", "Compliance", "Forensics"],
        "extra_interests": ["Bug Bounty", "Penetration Testing", "Blue Team", "Red Team"],
    },
    "DevOps Engineer": {
        "core_skills": ["Docker", "Kubernetes", "Jenkins", "Terraform", "CI/CD", "Ansible", "Site Reliability"],
        "extra_skills": ["Prometheus", "Grafana", "Helm", "GitHub Actions", "Monitoring", "Infrastructure as Code"],
        "core_interests": ["Automation", "CI/CD", "Infrastructure", "Reliability", "Deployment"],
        "extra_interests": ["Cloud Native", "Platform Engineering", "Observability", "Containers"],
    },
    "UI/UX Designer": {
        "core_skills": ["Figma", "Adobe XD", "Sketch", "Wireframing", "Prototyping", "User Research", "Visual Design"],
        "extra_skills": ["Miro", "Design Systems", "Accessibility", "Typography", "Color Theory", "HTML CSS"],
        "core_interests": ["Design", "User Experience", "Creativity", "Human Centered Design", "Product Design"],
        "extra_interests": ["Mobile UX", "Design Thinking", "Usability Testing", "Branding"],
    },
    "Mobile Developer": {
        "core_skills": ["Flutter", "React Native", "Swift", "Kotlin", "Mobile UI", "Firebase", "App Development"],
        "extra_skills": ["Dart", "Android Studio", "Xcode", "State Management", "Push Notifications", "SQLite"],
        "core_interests": ["Mobile Apps", "iOS", "Android", "Cross Platform", "App Store", "User Experience"],
        "extra_interests": ["Startups", "Game Dev", "Wearables", "Mobile Performance"],
    },
    "Data Engineer": {
        "core_skills": ["Python", "SQL", "Apache Spark", "Airflow", "Kafka", "ETL", "Data Pipelines"],
        "extra_skills": ["Hadoop", "dbt", "Snowflake", "Scala", "Redshift", "BigQuery", "Data Modeling"],
        "core_interests": ["Big Data", "Pipelines", "ETL", "Data Infrastructure", "Streaming", "Warehousing"],
        "extra_interests": ["Real-time Analytics", "Lakehouse", "Cloud Data", "Data Quality"],
    },
    "QA Engineer": {
        "core_skills": ["Selenium", "Cypress", "Jira", "Postman", "Manual Testing", "Test Cases", "Bug Tracking", "API Testing"],
        "extra_skills": ["JUnit", "TestNG", "Appium", "Load Testing", "Regression Testing", "Test Automation"],
        "core_interests": ["Testing", "Quality Assurance", "Automation", "Software Quality", "Defect Management"],
        "extra_interests": ["SDET Path", "Performance Testing", "Security Testing", "Release Management"],
    },
}

OVERLAP_NEIGHBORS = {
    "Data Scientist": ["Machine Learning Engineer", "Data Analyst", "Data Engineer"],
    "Data Analyst": ["Data Scientist", "Data Engineer"],
    "Frontend Developer": ["Full Stack Developer", "UI/UX Designer", "Mobile Developer"],
    "Backend Developer": ["Full Stack Developer", "Software Developer", "DevOps Engineer"],
    "Full Stack Developer": ["Frontend Developer", "Backend Developer", "Software Developer"],
    "Machine Learning Engineer": ["Data Scientist", "Data Engineer", "Software Engineer"],
    "Software Developer": ["Software Engineer", "Backend Developer", "Full Stack Developer"],
    "Software Engineer": ["Software Developer", "Backend Developer", "DevOps Engineer"],
    "Cloud Engineer": ["DevOps Engineer", "Backend Developer", "Data Engineer"],
    "Cybersecurity Analyst": ["DevOps Engineer", "Cloud Engineer"],
    "DevOps Engineer": ["Cloud Engineer", "Software Engineer", "Backend Developer"],
    "UI/UX Designer": ["Frontend Developer", "Mobile Developer"],
    "Mobile Developer": ["Frontend Developer", "Full Stack Developer", "UI/UX Designer"],
    "Data Engineer": ["Data Scientist", "Machine Learning Engineer", "Cloud Engineer"],
    "QA Engineer": ["Software Developer", "DevOps Engineer", "Backend Developer"],
}

UNIVERSAL_SKILLS = [
    "Git", "Python", "SQL", "JavaScript", "Linux", "Docker", "AWS",
    "Communication", "Problem Solving", "Agile", "Teamwork", "Excel", "HTML", "Java",
]

UNIVERSAL_INTERESTS = [
    "Learning", "Career Growth", "Remote Work", "Tech Community",
    "Innovation", "Collaboration", "Startups", "Freelancing",
]

FIRST_NAMES = [
    "Aarav", "Sneha", "Rohan", "Priya", "Kiran", "Anita", "Dev", "Meera",
    "Arjun", "Sita", "Nabin", "Riya", "Samir", "Puja", "Bikash", "Anu",
    "James", "Maria", "Alex", "Jordan", "Taylor", "Casey", "Riley", "Morgan",
]

STRENGTHS = [
    "Logical Thinking", "Creativity", "Problem Solving", "Communication",
    "Leadership", "Attention to Detail", "Teamwork", "Analytical Mindset",
    "Patience", "Quick Learner", "Research", "Presentation Skills",
]

EDUCATION_LEVELS = [
    "BE Computer Engineering", "BCA", "BSc IT", "BTech Information Technology",
    "MCA", "BE Software Engineering", "Diploma in Computer Science",
    "BSc Computer Science", "BE Electronics and Communication",
]

# Student profile distribution (focused / mixed / generalist / exploring / early_stage)
PROFILE_MIX = {
    "focused": 0.29,
    "mixed": 0.31,
    "generalist": 0.16,
    "exploring": 0.13,
    "early_stage": 0.11,
}

ROWS_PER_CAREER = 45
CSV_FIELDS = ["Name", "Strength", "Education", "Skills", "Interests", "Recommended_Career"]


def _sample_from(template, pool_key, count, rng, exclude=None):
    exclude = exclude or set()
    pool = [item for item in template[pool_key] if item not in exclude]
    if not pool:
        return []
    return rng.sample(pool, min(count, len(pool)))


def _borrow_skills(source_career, rng, count):
    if source_career not in CAREER_TEMPLATES:
        return []
    source = CAREER_TEMPLATES[source_career]
    borrowed = _sample_from(source, "core_skills", count, rng)
    borrowed.extend(_sample_from(source, "extra_skills", max(1, count // 2), rng, set(borrowed)))
    return borrowed[: count + 2]


def _borrow_interests(source_career, rng, count):
    if source_career not in CAREER_TEMPLATES:
        return []
    source = CAREER_TEMPLATES[source_career]
    return _sample_from(source, "core_interests", count, rng)


def _pick_profile_type(rng):
    roll = rng.random()
    cumulative = 0.0
    for name, weight in PROFILE_MIX.items():
        cumulative += weight
        if roll < cumulative:
            return name
    return "mixed"


def _random_other_career(current, rng):
    others = [c for c in CAREER_TEMPLATES if c != current]
    return rng.choice(others)


def _distant_career(current, rng):
    """Pick a career unlike the target for exploring / early-stage profiles."""
    neighbors = set(OVERLAP_NEIGHBORS.get(current, []))
    distant = [c for c in CAREER_TEMPLATES if c != current and c not in neighbors]
    return rng.choice(distant) if distant else _random_other_career(current, rng)


def pick_skills(career, template, rng, profile_type):
    skills = []
    all_careers = list(CAREER_TEMPLATES.keys())

    if profile_type == "focused":
        skills.extend(_sample_from(template, "core_skills", rng.randint(3, 4), rng))
        skills.extend(_sample_from(template, "extra_skills", rng.randint(0, 1), rng, set(skills)))
        if rng.random() < 0.42:
            neighbor = rng.choice(OVERLAP_NEIGHBORS.get(career, all_careers))
            skills.extend(_borrow_skills(neighbor, rng, rng.randint(2, 3)))
        skills.extend(rng.sample(UNIVERSAL_SKILLS, rng.randint(2, 3)))

    elif profile_type == "mixed":
        skills.extend(_sample_from(template, "core_skills", rng.randint(2, 3), rng))
        neighbors = OVERLAP_NEIGHBORS.get(career, all_careers)
        borrow_count = min(3, len(neighbors) or 1)
        for neighbor in rng.sample(neighbors, borrow_count):
            skills.extend(_borrow_skills(neighbor, rng, rng.randint(3, 4)))
        skills.extend(rng.sample(UNIVERSAL_SKILLS, rng.randint(3, 5)))

    elif profile_type == "generalist":
        skills.extend(_sample_from(template, "core_skills", rng.randint(1, 2), rng))
        skills.extend(rng.sample(UNIVERSAL_SKILLS, rng.randint(5, 7)))
        if rng.random() < 0.6:
            skills.extend(_borrow_skills(rng.choice(all_careers), rng, rng.randint(2, 3)))

    elif profile_type == "exploring":
        skills.extend(_sample_from(template, "core_skills", rng.randint(1, 2), rng))
        other = _random_other_career(career, rng)
        skills.extend(_borrow_skills(other, rng, rng.randint(3, 5)))
        skills.extend(rng.sample(UNIVERSAL_SKILLS, rng.randint(2, 3)))

    else:  # early_stage — pursuing this career but skills not there yet
        skills.extend(_sample_from(template, "core_skills", rng.randint(0, 1), rng))
        wrong = _random_other_career(career, rng)
        skills.extend(_borrow_skills(wrong, rng, rng.randint(4, 6)))
        skills.extend(rng.sample(UNIVERSAL_SKILLS, rng.randint(3, 5)))

    rng.shuffle(skills)
    return ", ".join(dict.fromkeys(skills))


def pick_interests(career, template, rng, profile_type):
    interests = []

    if profile_type == "focused":
        interests.extend(_sample_from(template, "core_interests", rng.randint(3, 5), rng))
        interests.extend(_sample_from(template, "extra_interests", rng.randint(1, 2), rng, set(interests)))

    elif profile_type in ("mixed", "generalist"):
        interests.extend(_sample_from(template, "core_interests", rng.randint(2, 3), rng))
        neighbor = rng.choice(OVERLAP_NEIGHBORS.get(career, list(CAREER_TEMPLATES.keys())))
        interests.extend(_borrow_interests(neighbor, rng, rng.randint(1, 2)))
        interests.extend(rng.sample(UNIVERSAL_INTERESTS, rng.randint(1, 2)))

    elif profile_type == "exploring":
        interests.extend(_sample_from(template, "core_interests", rng.randint(2, 4), rng))
        interests.extend(rng.sample(UNIVERSAL_INTERESTS, rng.randint(2, 3)))

    else:  # early_stage — interested in target career
        interests.extend(_sample_from(template, "core_interests", rng.randint(2, 4), rng))
        interests.extend(_sample_from(template, "extra_interests", rng.randint(1, 2), rng, set(interests)))

    rng.shuffle(interests)
    return ", ".join(dict.fromkeys(interests))


def generate_rows(seed=42):
    rng = random.Random(seed)
    rows = []
    profile_counts = {key: 0 for key in PROFILE_MIX}

    for career, template in CAREER_TEMPLATES.items():
        for idx in range(ROWS_PER_CAREER):
            profile_type = _pick_profile_type(rng)
            profile_counts[profile_type] += 1
            rows.append({
                "Name": f"{rng.choice(FIRST_NAMES)} {career.split()[0][0]}{idx + 1}",
                "Strength": rng.choice(STRENGTHS),
                "Education": rng.choice(EDUCATION_LEVELS),
                "Skills": pick_skills(career, template, rng, profile_type),
                "Interests": pick_interests(career, template, rng, profile_type),
                "Recommended_Career": career,
            })

    rng.shuffle(rows)
    return rows, profile_counts


def write_csv(rows, path):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", newline="", encoding="utf-8") as handle:
        writer = csv.DictWriter(handle, fieldnames=CSV_FIELDS)
        writer.writeheader()
        writer.writerows(rows)


def quick_evaluate(rows, epochs=5):
    """Accuracy preview without starting Flask."""
    from formulas import shuffle_rows, mean
    from career import CareerAdvisorEngine

    engine = CareerAdvisorEngine()
    target_col = "Recommended_Career"
    t1_list, t3_list = [], []

    for epoch in range(1, epochs + 1):
        shuffled = shuffle_rows(rows, seed=epoch)
        split = int(len(shuffled) * 0.8)
        train_rows, test_rows = shuffled[:split], shuffled[split:]
        engine.fit(train_rows, target_col)

        t1, t3 = 0, 0
        for row in test_rows:
            actual = row[target_col].lower().strip()
            preds = engine.calculate_match(row["Skills"], row["Interests"])
            if not preds:
                continue
            names = [p["career"].lower().strip() for p in preds]
            if names[0] == actual:
                t1 += 1
            if actual in names:
                t3 += 1

        t1_list.append((t1 / len(test_rows)) * 100)
        t3_list.append((t3 / len(test_rows)) * 100)

    print("\nEvaluation preview (80/20 split, 5 epochs):")
    print(f"  Top-1 Accuracy : {mean(t1_list):.1f}%")
    print(f"  Top-3 Accuracy : {mean(t3_list):.1f}%")


if __name__ == "__main__":
    dataset, profiles = generate_rows()
    write_csv(dataset, OUTPUT_PATH)

    print(f"Built {len(dataset)} student profiles -> {OUTPUT_PATH}")
    print("Profile types:", profiles)

    careers = {}
    for row in dataset:
        careers[row["Recommended_Career"]] = careers.get(row["Recommended_Career"], 0) + 1
    print("Records per career path:")
    for name, count in sorted(careers.items()):
        print(f"  {name}: {count}")

    quick_evaluate(dataset)
