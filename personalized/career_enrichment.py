
import re


def to_slug(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", str(name).lower().strip()).strip("-")


# Career learning resources
CURATED_RESOURCES = {
    "data analyst": {
        "video_url": "https://www.youtube.com/watch?v=r-uOLxNrNk8",
        "video_title": "Data Analyst Full Course – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/professional-certificates/google-data-analytics",
        "roadmap_url": "https://www.coursera.org/learn/data-analysis-with-python",
    },
    "data scientist": {
        "video_url": "https://www.youtube.com/watch?v=ua-CiDNNj30",
        "video_title": "Data Science Full Course – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/professional-certificates/ibm-data-science",
        "roadmap_url": "https://www.coursera.org/specializations/data-science-python",
    },
    "data engineer": {
        "video_url": "https://www.youtube.com/watch?v=qWru-b6m030",
        "video_title": "Data Engineering Course – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/professional-certificates/ibm-data-engineer",
        "roadmap_url": "https://www.coursera.org/learn/introduction-to-data-engineering",
    },
    "machine learning engineer": {
        "video_url": "https://www.youtube.com/watch?v=i_LwzRVP7bg",
        "video_title": "Machine Learning for Everybody – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/learn/machine-learning",
        "roadmap_url": "https://www.coursera.org/specializations/machine-learning-introduction",
    },
    "deep learning engineer": {
        "video_url": "https://www.youtube.com/watch?v=tPYj3fFJGjk",
        "video_title": "TensorFlow Course – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/specializations/deep-learning",
        "roadmap_url": "https://www.coursera.org/learn/neural-networks-deep-learning",
    },
    "ai researcher": {
        "video_url": "https://www.youtube.com/watch?v=aircAruvnKk",
        "video_title": "Neural Networks Explained – 3Blue1Brown",
        "pdf_url": "https://www.coursera.org/learn/ai-for-everyone",
        "roadmap_url": "https://www.coursera.org/specializations/deep-learning",
    },
    "ai specialist": {
        "video_url": "https://www.youtube.com/watch?v=JMUxmLyrhSk",
        "video_title": "AI Engineer Path – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/professional-certificates/ibm-ai-engineering",
        "roadmap_url": "https://www.coursera.org/learn/introduction-to-ai",
    },
    "nlp engineer": {
        "video_url": "https://www.youtube.com/watch?v=5NgNicANyqM",
        "video_title": "Harvard CS50 AI with Python – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/specializations/natural-language-processing",
        "roadmap_url": "https://www.coursera.org/learn/language-processing",
    },
    "full stack developer": {
        "video_url": "https://www.youtube.com/watch?v=nu_pCVPKzTk",
        "video_title": "Full Stack Web Development – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/professional-certificates/meta-full-stack-engineer",
        "roadmap_url": "https://www.coursera.org/learn/html-css-javascript-for-web-developers",
    },
    "front-end developer": {
        "video_url": "https://www.youtube.com/watch?v=zJSY8tbf_ys",
        "video_title": "Frontend Web Development Bootcamp – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/professional-certificates/meta-front-end-developer",
        "roadmap_url": "https://www.coursera.org/learn/html-css-javascript-for-web-developers",
    },
    "frontend developer": {
        "video_url": "https://www.youtube.com/watch?v=zJSY8tbf_ys",
        "video_title": "Frontend Web Development Bootcamp – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/professional-certificates/meta-front-end-developer",
        "roadmap_url": "https://www.coursera.org/learn/html-css-javascript-for-web-developers",
    },
    "backend developer": {
        "video_url": "https://www.youtube.com/watch?v=Oe421EPjeBE",
        "video_title": "Node.js / Express Course – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/professional-certificates/ibm-backend-development",
        "roadmap_url": "https://www.coursera.org/learn/nodejs",
    },
    "software developer": {
        "video_url": "https://www.youtube.com/watch?v=6nz8GXjxiHg",
        "video_title": "How to Get a Developer Job – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/professional-certificates/ibm-full-stack-cloud-developer",
        "roadmap_url": "https://www.coursera.org/learn/introduction-to-software-engineering",
    },
    "software engineer": {
        "video_url": "https://www.youtube.com/watch?v=RBSGKlAvoiM",
        "video_title": "Data Structures Full Course – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/professional-certificates/ibm-full-stack-cloud-developer",
        "roadmap_url": "https://www.coursera.org/specializations/software-design-architecture",
    },
    "devops engineer": {
        "video_url": "https://www.youtube.com/watch?v=9pZ2xmsSDdo",
        "video_title": "DevOps Roadmap – TechWorld with Nana",
        "pdf_url": "https://www.coursera.org/professional-certificates/ibm-devops-and-software-engineering",
        "roadmap_url": "https://www.coursera.org/learn/devops-culture-and-mindset",
    },
    "cloud engineer": {
        "video_url": "https://www.youtube.com/watch?v=3hLmDS179YE",
        "video_title": "AWS Cloud Practitioner – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/professional-certificates/aws-cloud-solutions-architect",
        "roadmap_url": "https://www.coursera.org/specializations/aws-fundamentals",
    },
    "cybersecurity analyst": {
        "video_url": "https://www.youtube.com/watch?v=3Kq1MIfTWCE",
        "video_title": "Ethical Hacking Full Course – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/professional-certificates/google-cybersecurity",
        "roadmap_url": "https://www.coursera.org/learn/ibm-cybersecurity-analyst-intro",
    },
    "cybersecurity specialist": {
        "video_url": "https://www.youtube.com/watch?v=3Kq1MIfTWCE",
        "video_title": "Ethical Hacking Full Course – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/professional-certificates/ibm-cybersecurity-analyst",
        "roadmap_url": "https://www.coursera.org/learn/penetration-testing-ethical-hacking",
    },
    "mobile developer": {
        "video_url": "https://www.youtube.com/watch?v=VPvVD8t02U8",
        "video_title": "Flutter Course – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/professional-certificates/meta-react-native",
        "roadmap_url": "https://www.coursera.org/learn/flutter",
    },
    "android developer": {
        "video_url": "https://www.youtube.com/watch?v=fis26HvvDII",
        "video_title": "Android Development Course – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/specializations/android-app-development",
        "roadmap_url": "https://www.coursera.org/learn/android-app-development",
    },
    "ux designer": {
        "video_url": "https://www.youtube.com/watch?v=Ovj4hFxko7c",
        "video_title": "What is UX Design – UX Mastery",
        "pdf_url": "https://www.coursera.org/professional-certificates/google-ux-design",
        "roadmap_url": "https://www.coursera.org/learn/foundations-user-experience-design",
    },
    "ux researcher": {
        "video_url": "https://www.youtube.com/watch?v=Ovj4hFxko7c",
        "video_title": "UX Research Methods",
        "pdf_url": "https://www.coursera.org/professional-certificates/google-ux-design",
        "roadmap_url": "https://www.coursera.org/learn/ux-research",
    },
    "graphic designer": {
        "video_url": "https://www.youtube.com/watch?v=1Rs2ND1ryYc",
        "video_title": "CSS Tutorial Zero to Hero – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/specializations/graphic-design",
        "roadmap_url": "https://www.coursera.org/learn/fundamentals-of-graphic-design",
    },
    "business analyst": {
        "video_url": "https://www.youtube.com/watch?v=HXV3zeQKqGY",
        "video_title": "SQL Full Database Course – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/professional-certificates/ibm-business-analyst",
        "roadmap_url": "https://www.coursera.org/learn/business-analysis-foundations",
    },
    "project manager": {
        "video_url": "https://www.youtube.com/watch?v=6nz8GXjxiHg",
        "video_title": "How to Get a Developer Job – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/professional-certificates/google-project-management",
        "roadmap_url": "https://www.coursera.org/learn/project-management-foundations",
    },
    "digital marketer": {
        "video_url": "https://www.youtube.com/watch?v=bixR-KIJKYM",
        "video_title": "Digital Marketing Explained – Simplilearn",
        "pdf_url": "https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce",
        "roadmap_url": "https://www.coursera.org/learn/digital-marketing",
    },
    "marketing manager": {
        "video_url": "https://www.youtube.com/watch?v=bixR-KIJKYM",
        "video_title": "Digital Marketing Explained – Simplilearn",
        "pdf_url": "https://www.coursera.org/professional-certificates/meta-marketing-analytics",
        "roadmap_url": "https://www.coursera.org/learn/marketing-analytics",
    },
    "content strategist": {
        "video_url": "https://www.youtube.com/watch?v=bixR-KIJKYM",
        "video_title": "Digital Marketing Explained – Simplilearn",
        "pdf_url": "https://www.coursera.org/learn/content-strategy",
        "roadmap_url": "https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce",
    },
    "automation engineer": {
        "video_url": "https://www.youtube.com/watch?v=H2EJuAcrZYU",
        "video_title": "Selenium Python Automation – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/learn/introduction-software-testing",
        "roadmap_url": "https://www.coursera.org/specializations/software-testing-automation",
    },
    "embedded systems engineer": {
        "video_url": "https://www.youtube.com/watch?v=KJgsSFOSQv0",
        "video_title": "C Programming Tutorial – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/specializations/iot",
        "roadmap_url": "https://www.coursera.org/learn/introduction-embedded-systems",
    },
    "biostatistician": {
        "video_url": "https://www.youtube.com/watch?v=Vfo5le26IhY",
        "video_title": "Statistics for Data Science – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/specializations/statistics",
        "roadmap_url": "https://www.coursera.org/learn/biostatistics",
    },
    "financial analyst": {
        "video_url": "https://www.youtube.com/watch?v=WEDIj9JBTC8",
        "video_title": "Financial Analysis Course",
        "pdf_url": "https://www.coursera.org/professional-certificates/ibm-data-analyst",
        "roadmap_url": "https://www.coursera.org/specializations/investment-strategies",
    },
    "research analyst": {
        "video_url": "https://www.youtube.com/watch?v=r-uOLxNrNk8",
        "video_title": "Data Analysis Full Course – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/professional-certificates/google-data-analytics",
        "roadmap_url": "https://www.coursera.org/learn/market-research",
    },
    "research scientist": {
        "video_url": "https://www.youtube.com/watch?v=aircAruvnKk",
        "video_title": "Neural Networks – 3Blue1Brown",
        "pdf_url": "https://www.coursera.org/specializations/deep-learning",
        "roadmap_url": "https://www.coursera.org/learn/ai-for-everyone",
    },
    "senior data scientist": {
        "video_url": "https://www.youtube.com/watch?v=ua-CiDNNj30",
        "video_title": "Advanced Data Science Path – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/professional-certificates/ibm-data-science",
        "roadmap_url": "https://www.coursera.org/specializations/data-science-python",
    },
    "chief data officer": {
        "video_url": "https://www.youtube.com/watch?v=ua-CiDNNj30",
        "video_title": "Data Science Leadership Path – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/learn/data-science-methodology",
        "roadmap_url": "https://www.coursera.org/specializations/executive-data-science",
    },
    "cloud architect": {
        "video_url": "https://www.youtube.com/watch?v=3hLmDS179YE",
        "video_title": "AWS Cloud Practitioner – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/professional-certificates/aws-cloud-solutions-architect",
        "roadmap_url": "https://www.coursera.org/specializations/aws-fundamentals",
    },
    "devops architect": {
        "video_url": "https://www.youtube.com/watch?v=9pZ2xmsSDdo",
        "video_title": "DevOps Roadmap – TechWorld with Nana",
        "pdf_url": "https://www.coursera.org/professional-certificates/ibm-devops-and-software-engineering",
        "roadmap_url": "https://www.coursera.org/learn/continuous-delivery-devops",
    },
    "product manager": {
        "video_url": "https://www.youtube.com/watch?v=6nz8GXjxiHg",
        "video_title": "How to Get a Developer Job – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/professional-certificates/meta-product-manager",
        "roadmap_url": "https://www.coursera.org/specializations/product-management",
    },
    "chief information security officer (ciso)": {
        "video_url": "https://www.youtube.com/watch?v=3Kq1MIfTWCE",
        "video_title": "Ethical Hacking Full Course – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/professional-certificates/google-cybersecurity",
        "roadmap_url": "https://www.coursera.org/learn/cybersecurity-roles-processes-operating-system",
    },
    "mobile architect": {
        "video_url": "https://www.youtube.com/watch?v=VPvVD8t02U8",
        "video_title": "Mobile Development with Flutter",
        "pdf_url": "https://www.coursera.org/professional-certificates/meta-react-native",
        "roadmap_url": "https://www.coursera.org/specializations/android-app-development",
    },
    "sdet manager": {
        "video_url": "https://www.youtube.com/watch?v=H2EJuAcrZYU",
        "video_title": "Test Automation Path – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/specializations/software-testing-automation",
        "roadmap_url": "https://www.coursera.org/learn/introduction-software-testing",
    },
    "ai research lead": {
        "video_url": "https://www.youtube.com/watch?v=aircAruvnKk",
        "video_title": "Deep Learning Foundations",
        "pdf_url": "https://www.coursera.org/specializations/deep-learning",
        "roadmap_url": "https://www.coursera.org/professional-certificates/ibm-ai-engineering",
    },
    "solutions architect": {
        "video_url": "https://www.youtube.com/watch?v=RBSGKlAvoiM",
        "video_title": "Data Structures Full Course – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/professional-certificates/aws-cloud-solutions-architect",
        "roadmap_url": "https://www.coursera.org/specializations/software-design-architecture",
    },
    "creative director": {
        "video_url": "https://www.youtube.com/watch?v=1Rs2ND1ryYc",
        "video_title": "CSS Tutorial Zero to Hero – freeCodeCamp",
        "pdf_url": "https://www.coursera.org/specializations/graphic-design",
        "roadmap_url": "https://www.coursera.org/learn/fundamentals-of-graphic-design",
    },
    "marketing head": {
        "video_url": "https://www.youtube.com/watch?v=bixR-KIJKYM",
        "video_title": "Digital Marketing Explained – Simplilearn",
        "pdf_url": "https://www.coursera.org/professional-certificates/google-digital-marketing-ecommerce",
        "roadmap_url": "https://www.coursera.org/learn/marketing-strategy",
    },
}

CAREER_JOBS = {
    "data analyst": [
        {"title": "Junior Data Analyst", "company_type": "Analytics / SaaS", "level": "Entry"},
        {"title": "Business Intelligence Analyst", "company_type": "Enterprise", "level": "Entry"},
        {"title": "Reporting Analyst", "company_type": "Finance / Ops", "level": "Entry"},
    ],
    "data scientist": [
        {"title": "Junior Data Scientist", "company_type": "AI / Product", "level": "Entry"},
        {"title": "ML Analyst", "company_type": "Tech Startup", "level": "Entry"},
        {"title": "Applied Data Scientist", "company_type": "Enterprise", "level": "Mid"},
    ],
    "data engineer": [
        {"title": "Junior Data Engineer", "company_type": "Data Platform", "level": "Entry"},
        {"title": "ETL Developer", "company_type": "Enterprise", "level": "Entry"},
        {"title": "Analytics Engineer", "company_type": "SaaS", "level": "Mid"},
    ],
    "machine learning engineer": [
        {"title": "ML Engineer Intern / Junior", "company_type": "AI Startup", "level": "Entry"},
        {"title": "Applied ML Engineer", "company_type": "Product Tech", "level": "Mid"},
        {"title": "MLOps Engineer", "company_type": "Cloud / AI", "level": "Mid"},
    ],
    "deep learning engineer": [
        {"title": "Deep Learning Engineer", "company_type": "AI Lab", "level": "Mid"},
        {"title": "Computer Vision Engineer", "company_type": "Robotics / CV", "level": "Mid"},
        {"title": "GenAI Engineer", "company_type": "AI Product", "level": "Mid"},
    ],
    "ai researcher": [
        {"title": "AI Research Intern", "company_type": "Research Lab", "level": "Entry"},
        {"title": "Research Engineer", "company_type": "AI Company", "level": "Mid"},
        {"title": "Applied Research Scientist", "company_type": "Big Tech", "level": "Mid"},
    ],
    "ai specialist": [
        {"title": "AI Solutions Specialist", "company_type": "Consulting", "level": "Entry"},
        {"title": "AI Application Engineer", "company_type": "Enterprise AI", "level": "Mid"},
        {"title": "Prompt / LLM Specialist", "company_type": "SaaS", "level": "Entry"},
    ],
    "nlp engineer": [
        {"title": "NLP Engineer", "company_type": "AI / NLP", "level": "Mid"},
        {"title": "Conversational AI Engineer", "company_type": "Chatbot / CX", "level": "Mid"},
        {"title": "Language Model Engineer", "company_type": "GenAI", "level": "Mid"},
    ],
    "full stack developer": [
        {"title": "Junior Full Stack Developer", "company_type": "Product Startup", "level": "Entry"},
        {"title": "Web Application Developer", "company_type": "Agency / SaaS", "level": "Entry"},
        {"title": "MERN Stack Developer", "company_type": "IT Services", "level": "Mid"},
    ],
    "front-end developer": [
        {"title": "Junior Frontend Developer", "company_type": "Product / Agency", "level": "Entry"},
        {"title": "React Developer", "company_type": "SaaS", "level": "Entry"},
        {"title": "UI Engineer", "company_type": "Tech Product", "level": "Mid"},
    ],
    "frontend developer": [
        {"title": "Junior Frontend Developer", "company_type": "Product / Agency", "level": "Entry"},
        {"title": "React Developer", "company_type": "SaaS", "level": "Entry"},
        {"title": "UI Engineer", "company_type": "Tech Product", "level": "Mid"},
    ],
    "backend developer": [
        {"title": "Junior Backend Developer", "company_type": "Product Startup", "level": "Entry"},
        {"title": "API Developer", "company_type": "SaaS", "level": "Entry"},
        {"title": "Node.js / Java Backend Engineer", "company_type": "Enterprise", "level": "Mid"},
    ],
    "software developer": [
        {"title": "Junior Software Developer", "company_type": "IT Services", "level": "Entry"},
        {"title": "Application Developer", "company_type": "Enterprise", "level": "Entry"},
        {"title": "Software Development Engineer", "company_type": "Product Tech", "level": "Mid"},
    ],
    "software engineer": [
        {"title": "Software Engineer (SDE-1)", "company_type": "Product Tech", "level": "Entry"},
        {"title": "Backend / Platform Engineer", "company_type": "SaaS", "level": "Mid"},
        {"title": "Full Product Engineer", "company_type": "Startup", "level": "Mid"},
    ],
    "devops engineer": [
        {"title": "Junior DevOps Engineer", "company_type": "Cloud / SaaS", "level": "Entry"},
        {"title": "CI/CD Engineer", "company_type": "Product Tech", "level": "Entry"},
        {"title": "Site Reliability Engineer (SRE)", "company_type": "Scale-ups", "level": "Mid"},
    ],
    "cloud engineer": [
        {"title": "Cloud Support Engineer", "company_type": "AWS / Azure Partner", "level": "Entry"},
        {"title": "Cloud Infrastructure Engineer", "company_type": "Enterprise", "level": "Mid"},
        {"title": "Platform Cloud Engineer", "company_type": "SaaS", "level": "Mid"},
    ],
    "cybersecurity analyst": [
        {"title": "SOC Analyst (L1)", "company_type": "Security Ops", "level": "Entry"},
        {"title": "Information Security Analyst", "company_type": "Enterprise", "level": "Entry"},
        {"title": "Threat Monitoring Analyst", "company_type": "MSSP", "level": "Mid"},
    ],
    "cybersecurity specialist": [
        {"title": "Penetration Tester (Junior)", "company_type": "Security Firm", "level": "Entry"},
        {"title": "Security Specialist", "company_type": "Enterprise", "level": "Mid"},
        {"title": "Vulnerability Assessment Engineer", "company_type": "Consulting", "level": "Mid"},
    ],
    "mobile developer": [
        {"title": "Junior Mobile Developer", "company_type": "App Studio", "level": "Entry"},
        {"title": "Flutter Developer", "company_type": "Startup", "level": "Entry"},
        {"title": "Android / iOS Developer", "company_type": "Product Tech", "level": "Mid"},
    ],
    "android developer": [
        {"title": "Junior Android Developer", "company_type": "App Studio", "level": "Entry"},
        {"title": "Kotlin Android Developer", "company_type": "Product Tech", "level": "Entry"},
        {"title": "Mobile App Engineer", "company_type": "Startup", "level": "Mid"},
    ],
    "ux designer": [
        {"title": "Junior UX Designer", "company_type": "Product / Agency", "level": "Entry"},
        {"title": "Product Designer", "company_type": "SaaS", "level": "Entry"},
        {"title": "UI/UX Designer", "company_type": "Startup", "level": "Mid"},
    ],
    "ux researcher": [
        {"title": "Junior UX Researcher", "company_type": "Product Research", "level": "Entry"},
        {"title": "User Researcher", "company_type": "SaaS", "level": "Mid"},
        {"title": "Design Researcher", "company_type": "Enterprise", "level": "Mid"},
    ],
    "graphic designer": [
        {"title": "Junior Graphic Designer", "company_type": "Agency", "level": "Entry"},
        {"title": "Brand Designer", "company_type": "Marketing Studio", "level": "Entry"},
        {"title": "Visual Designer", "company_type": "Product Tech", "level": "Mid"},
    ],
    "business analyst": [
        {"title": "Junior Business Analyst", "company_type": "IT Consulting", "level": "Entry"},
        {"title": "Systems Analyst", "company_type": "Enterprise", "level": "Entry"},
        {"title": "Product Analyst", "company_type": "SaaS", "level": "Mid"},
    ],
    "project manager": [
        {"title": "Associate Project Coordinator", "company_type": "IT Services", "level": "Entry"},
        {"title": "Scrum Master (Junior)", "company_type": "Agile Teams", "level": "Entry"},
        {"title": "IT Project Manager", "company_type": "Enterprise", "level": "Mid"},
    ],
    "digital marketer": [
        {"title": "Digital Marketing Executive", "company_type": "Agency", "level": "Entry"},
        {"title": "SEO / SEM Specialist", "company_type": "Growth Team", "level": "Entry"},
        {"title": "Performance Marketer", "company_type": "E-commerce", "level": "Mid"},
    ],
    "marketing manager": [
        {"title": "Marketing Associate", "company_type": "Startup", "level": "Entry"},
        {"title": "Growth Marketing Manager", "company_type": "SaaS", "level": "Mid"},
        {"title": "Brand Marketing Manager", "company_type": "Enterprise", "level": "Mid"},
    ],
    "content strategist": [
        {"title": "Content Writer / Strategist", "company_type": "Agency", "level": "Entry"},
        {"title": "Content Marketing Specialist", "company_type": "SaaS", "level": "Entry"},
        {"title": "Editorial Strategist", "company_type": "Media / Product", "level": "Mid"},
    ],
    "automation engineer": [
        {"title": "QA Automation Engineer", "company_type": "Product Tech", "level": "Entry"},
        {"title": "Test Automation Engineer", "company_type": "IT Services", "level": "Entry"},
        {"title": "RPA Developer", "company_type": "Enterprise Ops", "level": "Mid"},
    ],
    "embedded systems engineer": [
        {"title": "Junior Embedded Engineer", "company_type": "IoT / Hardware", "level": "Entry"},
        {"title": "Firmware Developer", "company_type": "Electronics", "level": "Entry"},
        {"title": "IoT Systems Engineer", "company_type": "Hardware Startup", "level": "Mid"},
    ],
    "biostatistician": [
        {"title": "Junior Biostatistician", "company_type": "Healthcare / Pharma", "level": "Entry"},
        {"title": "Clinical Data Analyst", "company_type": "Clinical Research", "level": "Entry"},
        {"title": "Statistical Programmer", "company_type": "Life Sciences", "level": "Mid"},
    ],
    "financial analyst": [
        {"title": "Junior Financial Analyst", "company_type": "Finance / FinTech", "level": "Entry"},
        {"title": "Investment Analyst", "company_type": "FinTech", "level": "Entry"},
        {"title": "FP&A Analyst", "company_type": "Enterprise", "level": "Mid"},
    ],
    "research analyst": [
        {"title": "Junior Research Analyst", "company_type": "Consulting", "level": "Entry"},
        {"title": "Market Research Analyst", "company_type": "Agency", "level": "Entry"},
        {"title": "Insights Analyst", "company_type": "Product / Biz", "level": "Mid"},
    ],
    "research scientist": [
        {"title": "Research Assistant", "company_type": "Lab / University", "level": "Entry"},
        {"title": "Applied Research Scientist", "company_type": "R&D", "level": "Mid"},
        {"title": "Scientific Computing Engineer", "company_type": "Tech R&D", "level": "Mid"},
    ],
    "senior data scientist": [
        {"title": "Senior Data Scientist", "company_type": "AI / Product", "level": "Senior"},
        {"title": "Lead ML Scientist", "company_type": "Enterprise AI", "level": "Senior"},
        {"title": "Staff Data Scientist", "company_type": "Big Tech", "level": "Lead"},
    ],
    "chief data officer": [
        {"title": "Chief Data Officer", "company_type": "Enterprise", "level": "Executive"},
        {"title": "Head of Data", "company_type": "Scale-up", "level": "Lead"},
        {"title": "VP of Data Strategy", "company_type": "Enterprise", "level": "Executive"},
    ],
    "cloud architect": [
        {"title": "Cloud Solutions Architect", "company_type": "Cloud Partner", "level": "Senior"},
        {"title": "Enterprise Cloud Architect", "company_type": "Enterprise", "level": "Senior"},
        {"title": "Infrastructure Architect", "company_type": "SaaS", "level": "Lead"},
    ],
    "devops architect": [
        {"title": "DevOps Architect", "company_type": "Cloud / SaaS", "level": "Senior"},
        {"title": "Platform Architect", "company_type": "Product Tech", "level": "Lead"},
        {"title": "Principal SRE", "company_type": "Scale-ups", "level": "Lead"},
    ],
    "product manager": [
        {"title": "Associate Product Manager", "company_type": "SaaS", "level": "Entry"},
        {"title": "Product Manager", "company_type": "Product Tech", "level": "Mid"},
        {"title": "Senior Product Manager", "company_type": "Enterprise", "level": "Senior"},
    ],
    "chief information security officer (ciso)": [
        {"title": "CISO", "company_type": "Enterprise", "level": "Executive"},
        {"title": "Head of Information Security", "company_type": "Finance / Tech", "level": "Lead"},
        {"title": "Director of Cybersecurity", "company_type": "Enterprise", "level": "Lead"},
    ],
    "mobile architect": [
        {"title": "Mobile Architect", "company_type": "Product Tech", "level": "Senior"},
        {"title": "Lead Mobile Engineer", "company_type": "App Platform", "level": "Lead"},
        {"title": "Principal Mobile Developer", "company_type": "Consumer Apps", "level": "Lead"},
    ],
    "sdet manager": [
        {"title": "SDET Manager", "company_type": "Product QA", "level": "Lead"},
        {"title": "QA Engineering Manager", "company_type": "Enterprise", "level": "Lead"},
        {"title": "Test Automation Lead", "company_type": "IT Services", "level": "Senior"},
    ],
    "ai research lead": [
        {"title": "AI Research Lead", "company_type": "AI Lab", "level": "Lead"},
        {"title": "Head of Applied AI", "company_type": "Enterprise AI", "level": "Lead"},
        {"title": "Principal AI Scientist", "company_type": "Big Tech", "level": "Lead"},
    ],
    "solutions architect": [
        {"title": "Solutions Architect", "company_type": "Cloud / Consulting", "level": "Senior"},
        {"title": "Enterprise Solutions Architect", "company_type": "Enterprise", "level": "Senior"},
        {"title": "Technical Architect", "company_type": "IT Services", "level": "Lead"},
    ],
    "creative director": [
        {"title": "Creative Director", "company_type": "Agency", "level": "Lead"},
        {"title": "Design Director", "company_type": "Brand / Product", "level": "Lead"},
        {"title": "Head of Creative", "company_type": "Marketing Org", "level": "Lead"},
    ],
    "marketing head": [
        {"title": "Head of Marketing", "company_type": "Startup / Scale-up", "level": "Lead"},
        {"title": "VP Marketing", "company_type": "SaaS", "level": "Executive"},
        {"title": "Director of Growth", "company_type": "Product Tech", "level": "Lead"},
    ],
}

REQUIRED_SKILLS = {
    "data analyst": ["Excel", "SQL", "Python", "Power BI", "Tableau", "Data Cleaning", "Statistics"],
    "data scientist": ["Python", "Pandas", "NumPy", "Scikit-learn", "SQL", "Machine Learning", "Statistics"],
    "data engineer": ["Python", "SQL", "Apache Spark", "ETL", "Airflow", "Data Warehousing", "Cloud"],
    "machine learning engineer": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "ML Algorithms", "Model Deployment", "SQL"],
    "deep learning engineer": ["Python", "TensorFlow", "PyTorch", "Neural Networks", "CNNs", "GPUs", "Keras"],
    "ai researcher": ["Python", "PyTorch", "TensorFlow", "Research Papers", "Mathematics", "Experiment Design"],
    "ai specialist": ["Python", "Scikit-learn", "APIs", "Cloud AI Services", "ML Basics", "Problem Framing"],
    "nlp engineer": ["Python", "NLTK", "spaCy", "Transformers", "Deep Learning", "Text Preprocessing"],
    "full stack developer": ["HTML", "CSS", "JavaScript", "React", "Node.js", "MongoDB", "Git", "REST APIs"],
    "front-end developer": ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS", "Responsive Design", "Git"],
    "frontend developer": ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS", "Responsive Design", "Git"],
    "backend developer": ["Node.js", "Express.js", "MongoDB", "SQL", "REST APIs", "Authentication", "Git"],
    "software developer": ["Java", "Python", "Git", "Data Structures", "APIs", "OOP", "Debugging"],
    "software engineer": ["Java", "Python", "System Design", "Git", "Databases", "Algorithms", "Testing"],
    "devops engineer": ["Linux", "Docker", "Kubernetes", "Jenkins", "AWS", "Git", "CI/CD"],
    "cloud engineer": ["AWS", "Azure", "Docker", "Kubernetes", "Networking", "Infrastructure as Code"],
    "cybersecurity analyst": ["Networking", "Wireshark", "SIEM", "Linux", "Firewalls", "Incident Response"],
    "cybersecurity specialist": ["Ethical Hacking", "Nmap", "Metasploit", "Linux", "OWASP", "Penetration Testing"],
    "mobile developer": ["Flutter", "React Native", "Dart/JS", "Firebase", "REST APIs", "UI Design"],
    "android developer": ["Kotlin", "Java", "Android Studio", "Firebase", "Material Design", "Git"],
    "ux designer": ["Figma", "Wireframing", "User Research", "Prototyping", "Usability Testing", "Design Systems"],
    "ux researcher": ["User Interviews", "Surveys", "Usability Testing", "Analytics", "Affinity Mapping"],
    "graphic designer": ["Photoshop", "Illustrator", "Figma", "Typography", "Brand Design", "Canva"],
    "business analyst": ["Excel", "SQL", "Power BI", "Requirements Gathering", "Documentation", "Stakeholder Management"],
    "project manager": ["Agile", "Scrum", "Jira", "Communication", "Risk Management", "Scheduling"],
    "digital marketer": ["SEO", "Google Ads", "Analytics", "Social Media Ads", "Content Marketing", "Email Marketing"],
    "marketing manager": ["Marketing Strategy", "Analytics", "CRM", "Campaign Planning", "SEO", "Leadership"],
    "content strategist": ["SEO", "Content Writing", "Editorial Calendar", "Analytics", "Audience Research"],
    "automation engineer": ["Python", "Selenium", "CI/CD", "Jenkins", "Test Frameworks", "Docker"],
    "embedded systems engineer": ["C/C++", "Microcontrollers", "Arduino", "RTOS", "Electronics Basics"],
    "biostatistician": ["R", "Python", "SPSS", "Statistics", "Clinical Data", "Hypothesis Testing"],
    "financial analyst": ["Excel", "Financial Modeling", "SQL", "Accounting Basics", "Python", "Valuation"],
    "research analyst": ["Excel", "SQL", "Python", "Power BI", "Report Writing", "Statistics"],
    "research scientist": ["Python", "R", "Statistics", "Experiment Design", "Scientific Writing", "Matlab"],
    "senior data scientist": ["Python", "Advanced ML", "MLOps", "SQL", "Leadership", "Experimentation", "Deep Learning"],
    "chief data officer": ["Data Governance", "Strategy", "Leadership", "Compliance", "Stakeholder Management"],
    "cloud architect": ["AWS", "Azure", "System Design", "Security", "Cost Optimization", "Kubernetes"],
    "devops architect": ["CI/CD Design", "Kubernetes", "Observability", "Security", "Platform Engineering"],
    "product manager": ["Product Strategy", "User Research", "Analytics", "Roadmapping", "Stakeholder Management"],
    "chief information security officer (ciso)": ["Security Strategy", "Risk Management", "Compliance", "Leadership", "Incident Response"],
    "mobile architect": ["Flutter", "React Native", "Mobile Architecture", "Performance", "CI/CD Mobile"],
    "sdet manager": ["Test Strategy", "Automation Frameworks", "Team Leadership", "CI/CD", "Quality Metrics"],
    "ai research lead": ["Deep Learning", "Research Leadership", "PyTorch", "Publication", "Team Mentoring"],
    "solutions architect": ["System Design", "Cloud Platforms", "APIs", "Client Communication", "Integration Patterns"],
    "creative director": ["Brand Strategy", "Design Leadership", "Adobe Suite", "Team Mentoring", "Campaign Direction"],
    "marketing head": ["Growth Strategy", "Team Leadership", "Budgeting", "Brand", "Analytics"],
}

CAREER_DAG = {
    "data analyst": ["Senior Data Scientist", "Chief Data Officer"],
    "data scientist": ["Senior Data Scientist", "Chief Data Officer"],
    "data engineer": ["Cloud Architect", "Solutions Architect"],
    "machine learning engineer": ["AI Research Lead", "Chief Data Officer"],
    "deep learning engineer": ["AI Research Lead", "Chief Data Officer"],
    "ai researcher": ["AI Research Lead", "Chief Data Officer"],
    "ai specialist": ["AI Research Lead", "Solutions Architect"],
    "nlp engineer": ["AI Research Lead", "Senior Data Scientist"],
    "full stack developer": ["Solutions Architect", "Product Manager"],
    "front-end developer": ["Full Stack Developer", "Solutions Architect"],
    "frontend developer": ["Full Stack Developer", "Solutions Architect"],
    "backend developer": ["Cloud Architect", "Solutions Architect"],
    "software developer": ["Solutions Architect", "Product Manager"],
    "software engineer": ["Solutions Architect", "Cloud Architect"],
    "devops engineer": ["DevOps Architect", "Cloud Architect"],
    "cloud engineer": ["Cloud Architect", "DevOps Architect"],
    "cybersecurity analyst": ["Chief Information Security Officer (CISO)"],
    "cybersecurity specialist": ["Chief Information Security Officer (CISO)"],
    "mobile developer": ["Mobile Architect", "Solutions Architect"],
    "android developer": ["Mobile Architect", "Solutions Architect"],
    "ux designer": ["Product Manager", "Creative Director"],
    "ux researcher": ["Product Manager", "Creative Director"],
    "graphic designer": ["Creative Director", "Marketing Head"],
    "business analyst": ["Product Manager", "Solutions Architect"],
    "project manager": ["Product Manager", "Marketing Head"],
    "digital marketer": ["Marketing Head", "Product Manager"],
    "marketing manager": ["Marketing Head"],
    "content strategist": ["Marketing Head", "Creative Director"],
    "automation engineer": ["SDET Manager", "DevOps Architect"],
    "embedded systems engineer": ["Solutions Architect", "Cloud Architect"],
    "biostatistician": ["Senior Data Scientist", "Chief Data Officer"],
    "financial analyst": ["Product Manager", "Solutions Architect"],
    "research analyst": ["Senior Data Scientist", "Product Manager"],
    "research scientist": ["AI Research Lead", "Chief Data Officer"],
    "senior data scientist": ["Chief Data Officer"],
    "cloud architect": ["Solutions Architect"],
    "devops architect": ["Cloud Architect"],
    "product manager": ["Marketing Head"],
    "mobile architect": ["Solutions Architect"],
    "sdet manager": ["DevOps Architect"],
    "ai research lead": ["Chief Data Officer"],
    "solutions architect": ["Product Manager"],
    "creative director": ["Marketing Head"],
}


def calculate_job_readiness(completed_skills, required_skills) -> dict:
    required = [str(s).strip() for s in (required_skills or []) if str(s).strip()]
    completed_set = {str(s).strip().lower() for s in (completed_skills or []) if str(s).strip()}

    if not required:
        return {
            "readiness_percentage": 0.0,
            "completed_count": 0,
            "total_count": 0,
            "missing_skills": [],
            "completed_skills": [],
            "label": "No skills listed",
        }

    matched = []
    missing = []
    for skill in required:
        if skill.lower() in completed_set:
            matched.append(skill)
        else:
            missing.append(skill)

    percentage = round((len(matched) / len(required)) * 100.0, 1)

    if percentage >= 90:
        label = "Highly Job Ready"
    elif percentage >= 70:
        label = "Job Ready"
    elif percentage >= 40:
        label = "Developing"
    else:
        label = "Not Ready Yet"

    return {
        "readiness_percentage": percentage,
        "completed_count": len(matched),
        "total_count": len(required),
        "missing_skills": missing,
        "completed_skills": matched,
        "label": label,
    }


def recommend_jobs_by_skills(career_name: str, completed_skills, required_skills=None, base_jobs=None) -> list:
    required = required_skills if required_skills is not None else get_required_skills(career_name)
    readiness = calculate_job_readiness(completed_skills, required)
    pct = readiness["readiness_percentage"]

    if pct <= 0 or readiness["completed_count"] == 0:
        return []

    base = list(base_jobs) if base_jobs is not None else get_jobs_for_career(career_name)
    display = str(career_name).strip().title()
    out = []

    if pct < 60:
        out.append({
            "title": f"{display} Intern",
            "company_type": "Startup / Training Program",
            "level": "Intern",
            "reason": f"{readiness['completed_count']} skills selected",
        })
        if pct >= 35 and base:
            junior = dict(base[0])
            junior["reason"] = "Skill match"
            out.append(junior)
    elif pct < 85:
        for job in base:
            level = str(job.get("level", "")).lower()
            if level in ("entry", "intern", "junior"):
                item = dict(job)
                item["reason"] = "Skill match"
                out.append(item)
            if len(out) >= 3:
                break
        if not out:
            for job in base[:2]:
                item = dict(job)
                item["reason"] = "Skill match"
                out.append(item)
    else:
        for job in base[:3]:
            item = dict(job)
            item["reason"] = "Skill match"
            out.append(item)

    return out[:3]


def get_curated_resources(career_name: str, fallback_fn=None) -> dict:
    key = career_name.lower().strip()
    curated = CURATED_RESOURCES.get(key)
    if curated:
        return {
            "video_url": curated["video_url"],
            "video_title": curated.get("video_title", "Career Video Guide"),
            "pdf_url": curated["pdf_url"],
            "roadmap_url": curated["roadmap_url"],
        }
    if fallback_fn:
        fb = fallback_fn(career_name)
        return {
            "video_url": fb.get("video_link") or fb.get("video_url"),
            "video_title": f"{career_name.title()} Learning Guide",
            "pdf_url": fb.get("pdf_link") or fb.get("pdf_url"),
            "roadmap_url": fb.get("roadmap_sh") or fb.get("roadmap_url"),
        }
    return {
        "video_url": None,
        "video_title": None,
        "pdf_url": None,
        "roadmap_url": None,
    }


def get_jobs_for_career(career_name: str) -> list:
    key = career_name.lower().strip()
    return CAREER_JOBS.get(key, [
        {"title": f"Junior {career_name.title()}", "company_type": "IT / Tech", "level": "Entry"},
        {"title": f"{career_name.title()}", "company_type": "Product / Services", "level": "Mid"},
        {"title": f"Senior {career_name.title()}", "company_type": "Enterprise", "level": "Senior"},
    ])


def get_required_skills(career_name: str, fallback_tools=None) -> list:
    key = career_name.lower().strip()
    skills = REQUIRED_SKILLS.get(key)
    if skills:
        return skills
    if fallback_tools:
        return list(fallback_tools)
    return ["Problem Solving", "Communication", "Git", "Portfolio Projects"]


def build_path_dag(current_career: str, next_step_map: dict) -> dict:
    key = current_career.lower().strip()
    future = CAREER_DAG.get(key)

    if not future:
        mapped = next_step_map.get(key)
        future = [mapped] if mapped else ["Senior Specialist"]

    steps = [
        {
            "title": current_career.title(),
            "slug": to_slug(current_career),
            "level": "current",
            "clickable": False,
        }
    ]

    for i, role in enumerate(future):
        steps.append({
            "title": role,
            "slug": to_slug(role),
            "level": "next" if i == 0 else "advanced",
            "clickable": True,
        })

    next_role = future[0] if future else "Senior Specialist"
    return {
        "current": current_career.title(),
        "next": next_role,
        "next_slug": to_slug(next_role),
        "steps": steps,
    }


def resolve_career_key(slug_or_name: str, known_names: list) -> str:
    raw = slug_or_name.replace("-", " ").lower().strip()
    raw = re.sub(r"\s+", " ", raw)

    for name in known_names:
        if name.lower().strip() == raw:
            return name.lower().strip()
        if to_slug(name) == to_slug(slug_or_name):
            return name.lower().strip()

    return raw
