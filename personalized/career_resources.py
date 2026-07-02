"""Career metadata: roadmaps, YouTube guides, PDF links, and learning pages."""

DEFAULT_ROADMAP = [
    {"step": 1, "title": "Foundations", "description": "Learn core concepts and programming basics.", "duration": "4-8 weeks"},
    {"step": 2, "title": "Build Projects", "description": "Apply skills through hands-on portfolio projects.", "duration": "6-10 weeks"},
    {"step": 3, "title": "Specialize", "description": "Deep dive into domain-specific tools and frameworks.", "duration": "8-12 weeks"},
    {"step": 4, "title": "Industry Ready", "description": "Prepare for interviews, certifications, and internships.", "duration": "4-6 weeks"},
]

CAREER_RESOURCES = {
    "data scientist": {
        "description": "Data Scientists analyze complex datasets to uncover patterns, build predictive models, and drive business decisions using statistics, machine learning, and visualization.",
        "tools": ["Python", "Pandas", "Scikit-learn", "SQL", "Tableau", "Jupyter"],
        "advantages": ["High Salary", "Cross-industry Demand", "Research Opportunities"],
        "video_url": "https://www.youtube.com/watch?v=ua-CiDNNj30",
        "pdf_url": "https://roadmap.sh/ai-data-scientist",
        "roadmap": [
            {"step": 1, "title": "Python & Statistics", "description": "Master Python, NumPy, Pandas, and statistical fundamentals.", "duration": "6 weeks"},
            {"step": 2, "title": "Data Analysis & SQL", "description": "Learn data wrangling, SQL queries, and exploratory data analysis.", "duration": "4 weeks"},
            {"step": 3, "title": "Machine Learning", "description": "Study regression, classification, clustering with Scikit-learn.", "duration": "8 weeks"},
            {"step": 4, "title": "Deep Learning & MLOps", "description": "Explore neural networks, model deployment, and portfolio projects.", "duration": "10 weeks"},
        ],
        "learning_resources": [
            {"type": "video", "title": "Data Science Full Course", "url": "https://www.youtube.com/watch?v=ua-CiDNNj30", "platform": "YouTube"},
            {"type": "article", "title": "Kaggle Learn", "url": "https://www.kaggle.com/learn", "platform": "Kaggle"},
            {"type": "pdf", "title": "AI & Data Scientist Roadmap", "url": "https://roadmap.sh/ai-data-scientist", "platform": "roadmap.sh"},
        ],
    },
    "data analyst": {
        "description": "Data Analysts transform raw data into actionable insights using spreadsheets, SQL, and visualization tools to support business strategy.",
        "tools": ["Excel", "SQL", "Power BI", "Python", "Pandas", "Tableau"],
        "advantages": ["Entry-level Friendly", "Business Impact", "Remote Work Options"],
        "video_url": "https://www.youtube.com/watch?v=r-uOLxNrNk8",
        "pdf_url": "https://roadmap.sh/data-analyst",
        "roadmap": [
            {"step": 1, "title": "Excel & SQL Basics", "description": "Learn spreadsheets, formulas, and SQL querying.", "duration": "4 weeks"},
            {"step": 2, "title": "Data Visualization", "description": "Build dashboards with Power BI or Tableau.", "duration": "4 weeks"},
            {"step": 3, "title": "Python for Analysis", "description": "Use Pandas and Matplotlib for data analysis.", "duration": "6 weeks"},
            {"step": 4, "title": "Business Analytics", "description": "Present insights and work on real case sensitive to stakeholders.", "duration": "4 weeks"},
        ],
        "learning_resources": [
            {"type": "video", "title": "Data Analyst Roadmap", "url": "https://www.youtube.com/watch?v=r-uOLxNrNk8", "platform": "YouTube"},
            {"type": "article", "title": "Google Data Analytics Certificate", "url": "https://www.coursera.org/professional-certificates/google-data-analytics", "platform": "Coursera"},
            {"type": "pdf", "title": "Data Analyst Roadmap PDF", "url": "https://roadmap.sh/data-analyst", "platform": "roadmap.sh"},
        ],
    },
    "frontend developer": {
        "description": "Frontend Developers build interactive, responsive user interfaces using HTML, CSS, JavaScript, and modern frameworks like React.",
        "tools": ["HTML", "CSS", "JavaScript", "React", "Tailwind CSS", "Git"],
        "advantages": ["Visual Creativity", "High Demand", "Freelance Friendly"],
        "video_url": "https://www.youtube.com/watch?v=nu_pCVPKzTk",
        "pdf_url": "https://roadmap.sh/frontend",
        "roadmap": [
            {"step": 1, "title": "HTML, CSS & JavaScript", "description": "Learn web fundamentals and DOM manipulation.", "duration": "8 weeks"},
            {"step": 2, "title": "React & State Management", "description": "Build SPAs with React, hooks, and component architecture.", "duration": "6 weeks"},
            {"step": 3, "title": "Styling & Responsive Design", "description": "Master Tailwind CSS, Flexbox, Grid, and mobile-first design.", "duration": "4 weeks"},
            {"step": 4, "title": "Portfolio & Deployment", "description": "Deploy projects on Vercel/Netlify and prepare for interviews.", "duration": "4 weeks"},
        ],
        "learning_resources": [
            {"type": "video", "title": "Frontend Development Full Course", "url": "https://www.youtube.com/watch?v=nu_pCVPKzTk", "platform": "YouTube"},
            {"type": "article", "title": "freeCodeCamp Responsive Web Design", "url": "https://www.freecodecamp.org/learn/2022/responsive-web-design/", "platform": "freeCodeCamp"},
            {"type": "pdf", "title": "Frontend Developer Roadmap", "url": "https://roadmap.sh/frontend", "platform": "roadmap.sh"},
        ],
    },
    "front-end developer": {
        "description": "Front-end Developers craft the visual and interactive layers of web applications that users see and interact with daily.",
        "tools": ["HTML", "CSS", "JavaScript", "React", "Vue", "Git"],
        "advantages": ["Visual Satisfaction", "Fast Growing Field", "Startup Demand"],
        "video_url": "https://www.youtube.com/watch?v=nu_pCVPKzTk",
        "pdf_url": "https://roadmap.sh/frontend",
        "roadmap": [
            {"step": 1, "title": "Web Fundamentals", "description": "HTML, CSS, JavaScript core concepts.", "duration": "8 weeks"},
            {"step": 2, "title": "Framework Mastery", "description": "Learn React or Vue for component-based UIs.", "duration": "6 weeks"},
            {"step": 3, "title": "Advanced UI/UX", "description": "Accessibility, animations, and performance optimization.", "duration": "4 weeks"},
            {"step": 4, "title": "Job Preparation", "description": "Build portfolio, contribute to open source, interview prep.", "duration": "4 weeks"},
        ],
        "learning_resources": [
            {"type": "video", "title": "Complete Frontend Tutorial", "url": "https://www.youtube.com/watch?v=nu_pCVPKzTk", "platform": "YouTube"},
            {"type": "article", "title": "MDN Web Docs", "url": "https://developer.mozilla.org/en-US/docs/Learn", "platform": "MDN"},
            {"type": "pdf", "title": "Frontend Roadmap", "url": "https://roadmap.sh/frontend", "platform": "roadmap.sh"},
        ],
    },
    "backend developer": {
        "description": "Backend Developers design server-side logic, APIs, and databases that power web and mobile applications.",
        "tools": ["Node.js", "Express", "PostgreSQL", "MongoDB", "Redis", "Docker"],
        "advantages": ["System Architecture", "Logic-heavy Work", "Secure Career Path"],
        "video_url": "https://www.youtube.com/watch?v=OeEHJzM0DpY",
        "pdf_url": "https://roadmap.sh/backend",
        "roadmap": [
            {"step": 1, "title": "Programming & Databases", "description": "Learn a backend language and SQL/NoSQL databases.", "duration": "8 weeks"},
            {"step": 2, "title": "API Development", "description": "Build RESTful APIs with authentication and validation.", "duration": "6 weeks"},
            {"step": 3, "title": "System Design Basics", "description": "Caching, message queues, microservices fundamentals.", "duration": "6 weeks"},
            {"step": 4, "title": "DevOps & Deployment", "description": "Docker, CI/CD, cloud deployment on AWS or Azure.", "duration": "4 weeks"},
        ],
        "learning_resources": [
            {"type": "video", "title": "Backend Development Roadmap", "url": "https://www.youtube.com/watch?v=OeEHJzM0DpY", "platform": "YouTube"},
            {"type": "article", "title": "Node.js Official Docs", "url": "https://nodejs.org/en/docs/guides", "platform": "Node.js"},
            {"type": "pdf", "title": "Backend Developer Roadmap", "url": "https://roadmap.sh/backend", "platform": "roadmap.sh"},
        ],
    },
    "full stack developer": {
        "description": "Full Stack Developers handle both frontend and backend development, building complete end-to-end web applications from database to UI.",
        "tools": ["React", "Node.js", "MongoDB", "Express", "Git", "AWS"],
        "advantages": ["Complete Autonomy", "High Hireability", "Project Ownership"],
        "video_url": "https://www.youtube.com/watch?v=7CqJlxBYj-M",
        "pdf_url": "https://roadmap.sh/full-stack",
        "roadmap": [
            {"step": 1, "title": "Frontend Stack", "description": "HTML, CSS, JavaScript, and React fundamentals.", "duration": "8 weeks"},
            {"step": 2, "title": "Backend & Database", "description": "Node.js, Express, MongoDB/PostgreSQL.", "duration": "8 weeks"},
            {"step": 3, "title": "Full Stack Integration", "description": "Connect frontend to APIs, auth, and state management.", "duration": "6 weeks"},
            {"step": 4, "title": "Deploy & Scale", "description": "Cloud deployment, testing, and production best practices.", "duration": "4 weeks"},
        ],
        "learning_resources": [
            {"type": "video", "title": "Full Stack Web Development", "url": "https://www.youtube.com/watch?v=7CqJlxBYj-M", "platform": "YouTube"},
            {"type": "article", "title": "The Odin Project", "url": "https://www.theodinproject.com/", "platform": "The Odin Project"},
            {"type": "pdf", "title": "Full Stack Roadmap", "url": "https://roadmap.sh/full-stack", "platform": "roadmap.sh"},
        ],
    },
    "machine learning engineer": {
        "description": "ML Engineers design, train, and deploy machine learning models at scale in production environments.",
        "tools": ["Python", "TensorFlow", "PyTorch", "Scikit-learn", "MLflow", "Docker"],
        "advantages": ["AI Revolution", "Top-tier Pay", "Future-proof Career"],
        "video_url": "https://www.youtube.com/watch?v=7IgVGSROnC0",
        "pdf_url": "https://roadmap.sh/ai-engineer",
        "roadmap": [
            {"step": 1, "title": "Math & Python", "description": "Linear algebra, calculus, probability, and Python.", "duration": "8 weeks"},
            {"step": 2, "title": "Classical ML", "description": "Supervised/unsupervised learning with Scikit-learn.", "duration": "6 weeks"},
            {"step": 3, "title": "Deep Learning", "description": "Neural networks with TensorFlow or PyTorch.", "duration": "8 weeks"},
            {"step": 4, "title": "MLOps & Deployment", "description": "Model serving, monitoring, and production pipelines.", "duration": "6 weeks"},
        ],
        "learning_resources": [
            {"type": "video", "title": "Machine Learning Full Course", "url": "https://www.youtube.com/watch?v=7IgVGSROnC0", "platform": "YouTube"},
            {"type": "article", "title": "fast.ai Practical Deep Learning", "url": "https://course.fast.ai/", "platform": "fast.ai"},
            {"type": "pdf", "title": "AI Engineer Roadmap", "url": "https://roadmap.sh/ai-engineer", "platform": "roadmap.sh"},
        ],
    },
    "software developer": {
        "description": "Software Developers design, build, and maintain applications and systems across web, mobile, and desktop platforms.",
        "tools": ["Java", "Python", "Git", "Docker", "System Design", "Agile"],
        "advantages": ["Versatile Roles", "Global Demand", "Problem Solving"],
        "video_url": "https://www.youtube.com/watch?v=ErfLqWaE1_4",
        "pdf_url": "https://roadmap.sh/software-design-architecture",
        "roadmap": [
            {"step": 1, "title": "Programming Fundamentals", "description": "Learn a language, data structures, and algorithms.", "duration": "10 weeks"},
            {"step": 2, "title": "Software Engineering", "description": "OOP, design patterns, version control, testing.", "duration": "8 weeks"},
            {"step": 3, "title": "Specialization", "description": "Choose web, mobile, or systems development track.", "duration": "8 weeks"},
            {"step": 4, "title": "Career Launch", "description": "Portfolio, open source, and technical interviews.", "duration": "4 weeks"},
        ],
        "learning_resources": [
            {"type": "video", "title": "Software Development Guide", "url": "https://www.youtube.com/watch?v=ErfLqWaE1_4", "platform": "YouTube"},
            {"type": "article", "title": "CS50 Harvard", "url": "https://cs50.harvard.edu/x/", "platform": "Harvard"},
            {"type": "pdf", "title": "Software Architecture Roadmap", "url": "https://roadmap.sh/software-design-architecture", "platform": "roadmap.sh"},
        ],
    },
    "software engineer": {
        "description": "Software Engineers apply engineering principles to design scalable, reliable software systems for real-world problems.",
        "tools": ["Java", "System Design", "Git", "Docker", "Cloud", "CI/CD"],
        "advantages": ["Versatile Roles", "Global Demand", "Problem Solving"],
        "video_url": "https://www.youtube.com/watch?v=ErfLqWaE1_4",
        "pdf_url": "https://roadmap.sh/software-design-architecture",
        "roadmap": [
            {"step": 1, "title": "Core CS Fundamentals", "description": "Data structures, algorithms, and a primary language.", "duration": "10 weeks"},
            {"step": 2, "title": "Software Design", "description": "OOP, SOLID principles, and design patterns.", "duration": "8 weeks"},
            {"step": 3, "title": "System Design", "description": "Distributed systems, databases, and scalability.", "duration": "8 weeks"},
            {"step": 4, "title": "Professional Growth", "description": "Code reviews, team collaboration, and senior roles.", "duration": "ongoing"},
        ],
        "learning_resources": [
            {"type": "video", "title": "Software Engineering Roadmap", "url": "https://www.youtube.com/watch?v=ErfLqWaE1_4", "platform": "YouTube"},
            {"type": "article", "title": "freeCodeCamp CS Curriculum", "url": "https://www.freecodecamp.org/learn/", "platform": "freeCodeCamp"},
            {"type": "pdf", "title": "Software Design Roadmap", "url": "https://roadmap.sh/software-design-architecture", "platform": "roadmap.sh"},
        ],
    },
    "cloud engineer": {
        "description": "Cloud Engineers design, deploy, and manage cloud infrastructure on AWS, Azure, or GCP for scalable applications.",
        "tools": ["AWS", "Azure", "Terraform", "Linux", "Docker", "Kubernetes"],
        "advantages": ["Scalable Tech", "Enterprise Demand", "Flexible Work"],
        "video_url": "https://www.youtube.com/watch?v=3hLmDS1793w",
        "pdf_url": "https://roadmap.sh/devops",
        "roadmap": [
            {"step": 1, "title": "Linux & Networking", "description": "Command line, networking basics, and cloud concepts.", "duration": "6 weeks"},
            {"step": 2, "title": "Cloud Platform", "description": "AWS/Azure core services: EC2, S3, VPC, IAM.", "duration": "8 weeks"},
            {"step": 3, "title": "Infrastructure as Code", "description": "Terraform, CloudFormation, and automation.", "duration": "6 weeks"},
            {"step": 4, "title": "Certification & Projects", "description": "AWS Solutions Architect or Azure Administrator cert.", "duration": "6 weeks"},
        ],
        "learning_resources": [
            {"type": "video", "title": "Cloud Computing Full Course", "url": "https://www.youtube.com/watch?v=3hLmDS1793w", "platform": "YouTube"},
            {"type": "article", "title": "AWS Skill Builder", "url": "https://skillbuilder.aws/", "platform": "AWS"},
            {"type": "pdf", "title": "DevOps Roadmap", "url": "https://roadmap.sh/devops", "platform": "roadmap.sh"},
        ],
    },
    "cybersecurity analyst": {
        "description": "Cybersecurity Analysts protect organizations from cyber threats by monitoring networks, investigating incidents, and implementing security controls.",
        "tools": ["Wireshark", "Nmap", "Metasploit", "SIEM", "Linux", "Python"],
        "advantages": ["High Security", "Recession Proof", "Ethical Impact"],
        "video_url": "https://www.youtube.com/watch?v=inWWhr5tnEA",
        "pdf_url": "https://roadmap.sh/cyber-security",
        "roadmap": [
            {"step": 1, "title": "Networking & Linux", "description": "TCP/IP, Linux administration, and security basics.", "duration": "8 weeks"},
            {"step": 2, "title": "Security Fundamentals", "description": "Cryptography, firewalls, and threat modeling.", "duration": "6 weeks"},
            {"step": 3, "title": "Penetration Testing", "description": "Ethical hacking tools and vulnerability assessment.", "duration": "8 weeks"},
            {"step": 4, "title": "Certifications", "description": "CompTIA Security+, CEH, or OSCP preparation.", "duration": "8 weeks"},
        ],
        "learning_resources": [
            {"type": "video", "title": "Cybersecurity Full Course", "url": "https://www.youtube.com/watch?v=inWWhr5tnEA", "platform": "YouTube"},
            {"type": "article", "title": "TryHackMe", "url": "https://tryhackme.com/", "platform": "TryHackMe"},
            {"type": "pdf", "title": "Cyber Security Roadmap", "url": "https://roadmap.sh/cyber-security", "platform": "roadmap.sh"},
        ],
    },
    "devops engineer": {
        "description": "DevOps Engineers bridge development and operations by automating deployment pipelines and maintaining reliable infrastructure.",
        "tools": ["Docker", "Kubernetes", "Jenkins", "Terraform", "AWS", "Git"],
        "advantages": ["High Reliability", "Automation Focus", "Essential Role"],
        "video_url": "https://www.youtube.com/watch?v=9pZ2xmsJqrc",
        "pdf_url": "https://roadmap.sh/devops",
        "roadmap": [
            {"step": 1, "title": "Linux & Scripting", "description": "Bash, Python scripting, and Linux administration.", "duration": "6 weeks"},
            {"step": 2, "title": "CI/CD Pipelines", "description": "Jenkins, GitHub Actions, and automated testing.", "duration": "6 weeks"},
            {"step": 3, "title": "Containers & Orchestration", "description": "Docker, Kubernetes, and container security.", "duration": "8 weeks"},
            {"step": 4, "title": "Cloud & Monitoring", "description": "AWS/GCP, Prometheus, Grafana, and SRE practices.", "duration": "6 weeks"},
        ],
        "learning_resources": [
            {"type": "video", "title": "DevOps Engineering Course", "url": "https://www.youtube.com/watch?v=9pZ2xmsJqrc", "platform": "YouTube"},
            {"type": "article", "title": "KodeKloud DevOps Learning", "url": "https://kodekloud.com/", "platform": "KodeKloud"},
            {"type": "pdf", "title": "DevOps Roadmap", "url": "https://roadmap.sh/devops", "platform": "roadmap.sh"},
        ],
    },
    "ui/ux designer": {
        "description": "UI/UX Designers create intuitive, user-centered digital experiences through research, wireframing, and visual design.",
        "tools": ["Figma", "Adobe XD", "Sketch", "Miro", "Prototyping", "User Research"],
        "advantages": ["Creative Freedom", "User Impact", "Modern Industry"],
        "video_url": "https://www.youtube.com/watch?v=68w2CytilQ4",
        "pdf_url": "https://roadmap.sh/design-system",
        "roadmap": [
            {"step": 1, "title": "Design Fundamentals", "description": "Color theory, typography, layout, and visual hierarchy.", "duration": "6 weeks"},
            {"step": 2, "title": "UX Research", "description": "User interviews, personas, journey maps, and usability testing.", "duration": "6 weeks"},
            {"step": 3, "title": "Prototyping Tools", "description": "Master Figma for wireframes and interactive prototypes.", "duration": "6 weeks"},
            {"step": 4, "title": "Portfolio & Case Studies", "description": "Build 3-5 case studies and prepare for design interviews.", "duration": "6 weeks"},
        ],
        "learning_resources": [
            {"type": "video", "title": "UI/UX Design Full Course", "url": "https://www.youtube.com/watch?v=68w2CytilQ4", "platform": "YouTube"},
            {"type": "article", "title": "Google UX Design Certificate", "url": "https://www.coursera.org/professional-certificates/google-ux-design", "platform": "Coursera"},
            {"type": "pdf", "title": "Design System Roadmap", "url": "https://roadmap.sh/design-system", "platform": "roadmap.sh"},
        ],
    },
    "ux designer": {
        "description": "UX Designers focus on understanding user needs and crafting seamless, accessible digital product experiences.",
        "tools": ["Figma", "Adobe XD", "Sketch", "Miro", "Hotjar", "Maze"],
        "advantages": ["Creative Freedom", "User Impact", "Modern Industry"],
        "video_url": "https://www.youtube.com/watch?v=68w2CytilQ4",
        "pdf_url": "https://roadmap.sh/design-system",
        "roadmap": [
            {"step": 1, "title": "UX Principles", "description": "Usability heuristics, accessibility, and design thinking.", "duration": "6 weeks"},
            {"step": 2, "title": "Research Methods", "description": "Surveys, A/B testing, and user behavior analysis.", "duration": "6 weeks"},
            {"step": 3, "title": "Wireframing & Prototyping", "description": "Low/high fidelity prototypes in Figma.", "duration": "6 weeks"},
            {"step": 4, "title": "Design Portfolio", "description": "Document end-to-end design process in case studies.", "duration": "6 weeks"},
        ],
        "learning_resources": [
            {"type": "video", "title": "UX Design Tutorial", "url": "https://www.youtube.com/watch?v=68w2CytilQ4", "platform": "YouTube"},
            {"type": "article", "title": "Interaction Design Foundation", "url": "https://www.interaction-design.org/", "platform": "IxDF"},
            {"type": "pdf", "title": "Design Roadmap", "url": "https://roadmap.sh/design-system", "platform": "roadmap.sh"},
        ],
    },
    "mobile developer": {
        "description": "Mobile Developers build native or cross-platform applications for iOS and Android devices.",
        "tools": ["Flutter", "React Native", "Swift", "Kotlin", "Firebase", "Git"],
        "advantages": ["App Economy", "Mobile-first World", "Direct User Reach"],
        "video_url": "https://www.youtube.com/watch?v=nnVVR4vNEY4",
        "pdf_url": "https://roadmap.sh/android",
        "roadmap": [
            {"step": 1, "title": "Mobile Fundamentals", "description": "Choose Flutter, React Native, or native (Swift/Kotlin).", "duration": "6 weeks"},
            {"step": 2, "title": "UI & Navigation", "description": "Build screens, navigation, and responsive layouts.", "duration": "6 weeks"},
            {"step": 3, "title": "Backend Integration", "description": "APIs, Firebase, authentication, and state management.", "duration": "6 weeks"},
            {"step": 4, "title": "App Store Launch", "description": "Testing, publishing to Play Store / App Store.", "duration": "4 weeks"},
        ],
        "learning_resources": [
            {"type": "video", "title": "Mobile App Development Course", "url": "https://www.youtube.com/watch?v=nnVVR4vNEY4", "platform": "YouTube"},
            {"type": "article", "title": "Flutter Official Docs", "url": "https://docs.flutter.dev/", "platform": "Flutter"},
            {"type": "pdf", "title": "Android Developer Roadmap", "url": "https://roadmap.sh/android", "platform": "roadmap.sh"},
        ],
    },
    "mobile app developer": {
        "description": "Mobile App Developers create applications optimized for smartphones and tablets across iOS and Android platforms.",
        "tools": ["Flutter", "React Native", "Swift", "Kotlin", "Firebase", "Git"],
        "advantages": ["App Economy", "High Demand", "Creative Projects"],
        "video_url": "https://www.youtube.com/watch?v=nnVVR4vNEY4",
        "pdf_url": "https://roadmap.sh/android",
        "roadmap": [
            {"step": 1, "title": "Platform Choice", "description": "Pick cross-platform (Flutter/RN) or native development.", "duration": "6 weeks"},
            {"step": 2, "title": "Core Development", "description": "Build UI components, navigation, and local storage.", "duration": "8 weeks"},
            {"step": 3, "title": "Advanced Features", "description": "Push notifications, offline mode, and performance.", "duration": "6 weeks"},
            {"step": 4, "title": "Publish & Monetize", "description": "Deploy to stores and explore monetization strategies.", "duration": "4 weeks"},
        ],
        "learning_resources": [
            {"type": "video", "title": "App Development Roadmap", "url": "https://www.youtube.com/watch?v=nnVVR4vNEY4", "platform": "YouTube"},
            {"type": "article", "title": "React Native Docs", "url": "https://reactnative.dev/docs/getting-started", "platform": "React Native"},
            {"type": "pdf", "title": "Android Roadmap", "url": "https://roadmap.sh/android", "platform": "roadmap.sh"},
        ],
    },
    "data engineer": {
        "description": "Data Engineers build and maintain the pipelines and infrastructure that collect, store, and process large-scale data.",
        "tools": ["Python", "Apache Spark", "Airflow", "Kafka", "SQL", "AWS"],
        "advantages": ["Data Infrastructure", "Big Data Mastery", "Critical Pipeline Role"],
        "video_url": "https://www.youtube.com/watch?v=2kW4A8PleTI",
        "pdf_url": "https://roadmap.sh/data-engineer",
        "roadmap": [
            {"step": 1, "title": "SQL & Python", "description": "Advanced SQL, Python scripting, and data modeling.", "duration": "6 weeks"},
            {"step": 2, "title": "Data Pipelines", "description": "ETL/ELT with Airflow, dbt, and batch processing.", "duration": "8 weeks"},
            {"step": 3, "title": "Big Data Tools", "description": "Spark, Kafka, and distributed computing.", "duration": "8 weeks"},
            {"step": 4, "title": "Cloud Data Platforms", "description": "AWS Glue, Snowflake, or BigQuery.", "duration": "6 weeks"},
        ],
        "learning_resources": [
            {"type": "video", "title": "Data Engineering Course", "url": "https://www.youtube.com/watch?v=2kW4A8PleTI", "platform": "YouTube"},
            {"type": "article", "title": "Data Engineering Zoomcamp", "url": "https://github.com/DataTalksClub/data-engineering-zoomcamp", "platform": "GitHub"},
            {"type": "pdf", "title": "Data Engineer Roadmap", "url": "https://roadmap.sh/data-engineer", "platform": "roadmap.sh"},
        ],
    },
    "qa engineer": {
        "description": "QA Engineers ensure software quality through manual and automated testing, bug tracking, and quality assurance processes.",
        "tools": ["Selenium", "Cypress", "Jira", "Postman", "Python", "JUnit"],
        "advantages": ["Quality Focus", "Cross-team Collaboration", "Stable Career"],
        "video_url": "https://www.youtube.com/watch?v=8.2fg2jJqLrE",
        "pdf_url": "https://roadmap.sh/qa",
        "roadmap": [
            {"step": 1, "title": "Testing Fundamentals", "description": "Test types, bug reporting, and SDLC basics.", "duration": "4 weeks"},
            {"step": 2, "title": "Manual Testing", "description": "Test cases, exploratory testing, and Jira.", "duration": "4 weeks"},
            {"step": 3, "title": "Automation Testing", "description": "Selenium, Cypress, and API testing with Postman.", "duration": "8 weeks"},
            {"step": 4, "title": "Performance & CI/CD", "description": "Load testing, Jenkins integration, and SDET path.", "duration": "6 weeks"},
        ],
        "learning_resources": [
            {"type": "video", "title": "Software Testing Full Course", "url": "https://www.youtube.com/watch?v=9.2fg2jJqLrE", "platform": "YouTube"},
            {"type": "article", "title": "Ministry of Testing", "url": "https://www.ministryoftesting.com/", "platform": "MoT"},
            {"type": "pdf", "title": "QA Roadmap", "url": "https://roadmap.sh/qa", "platform": "roadmap.sh"},
        ],
    },
}


def get_career_metadata(career_name):
    """Return career metadata with sensible defaults for unknown careers."""
    key = career_name.lower().strip()
    if key in CAREER_RESOURCES:
        return CAREER_RESOURCES[key]

    slug = key.replace(" ", "-")
    search = key.replace(" ", "+")
    return {
        "description": f"As a {career_name.title()}, you will apply specialized IT skills to solve real-world technology challenges.",
        "tools": ["Git", "Problem Solving", "Communication", "Industry Tools"],
        "advantages": ["Career Growth", "Skill Development", "Industry Demand"],
        "video_url": f"https://www.youtube.com/results?search_query={search}+career+roadmap",
        "pdf_url": f"https://roadmap.sh/search?q={search}",
        "roadmap": DEFAULT_ROADMAP,
        "learning_resources": [
            {"type": "video", "title": f"{career_name.title()} Career Guide", "url": f"https://www.youtube.com/results?search_query={search}+roadmap", "platform": "YouTube"},
            {"type": "article", "title": "freeCodeCamp Learning Path", "url": "https://www.freecodecamp.org/learn/", "platform": "freeCodeCamp"},
            {"type": "pdf", "title": "Interactive Roadmap", "url": f"https://roadmap.sh/search?q={search}", "platform": "roadmap.sh"},
        ],
    }
