# from pymongo import MongoClient

# def seed_data():
#     try:
#         # Corrected: Use MongoClient directly as imported or use pymongo.MongoClient if you 'import pymongo'
#         client = MongoClient("mongodb://127.0.0.1:27017/")
#         db = client["Career"]
#         collection = db["career_details"]

#         # 1. Career details mapping
#         career_info_map = {
#             "data scientist": {"tools": ["Python", "R", "SQL", "Tableau"], "adv": ["High Salary", "Insightful Work", "Remote Friendly"]},
#             "software engineer": {"tools": ["Java", "System Design", "Git", "Docker"], "adv": ["Versatile Roles", "Global Demand", "Problem Solving"]},
#             "ux designer": {"tools": ["Figma", "Adobe XD", "Sketch", "Miro"], "adv": ["Creative Freedom", "User Impact", "Modern Industry"]},
#             "ai researcher": {"tools": ["PyTorch", "LaTeX", "TensorFlow", "GPU Clusters"], "adv": ["Innovation Leader", "High Prestige", "Cutting-edge Tech"]},
#             "project manager": {"tools": ["Jira", "Asana", "Trello", "MS Project"], "adv": ["Leadership Role", "Dynamic Environment", "Strategic Impact"]},
#             "embedded systems engineer": {"tools": ["C", "C++", "Microcontrollers", "RTOS"], "adv": ["Hardware Mastery", "Critical Systems", "Niche Expertise"]},
#             "data analyst": {"tools": ["Excel", "SQL", "PowerBI", "Pandas"], "adv": ["Entry-level Friendly", "Analytical Growth", "Business Impact"]},
#             "front-end developer": {"tools": ["React", "HTML/CSS", "JavaScript", "Tailwind"], "adv": ["Visual Satisfaction", "Fast Growing", "Startup Demand"]},
#             "backend developer": {"tools": ["Node.js", "Express", "PostgreSQL", "Redis"], "adv": ["System Architecture", "Logic Heavy", "Secure Careers"]},
#             "machine learning engineer": {"tools": ["Python", "Scikit-Learn", "Keras", "MLOps"], "adv": ["AI Revolution", "Top Tier Pay", "Future Proof"]},
#             "devops engineer": {"tools": ["Kubernetes", "Jenkins", "Ansible", "Terraform"], "adv": ["High Reliability", "Automation Focus", "Essential Role"]},
#             "cloud engineer": {"tools": ["AWS", "Azure", "CloudFormation", "Linux"], "adv": ["Scalable Tech", "Enterprise Demand", "Flexible Work"]},
#             "cybersecurity analyst": {"tools": ["Wireshark", "Metasploit", "Nmap", "SIEM"], "adv": ["High Security", "Recession Proof", "Ethical Impact"]},
#             "mobile developer": {"tools": ["Flutter", "Swift", "Kotlin", "React Native"], "adv": ["App Economy", "Mobile First World", "Direct User Reach"]},
#             "full stack developer": {"tools": ["MERN Stack", "Next.js", "Git", "AWS"], "adv": ["Complete Autonomy", "High Hireability", "Project Ownership"]},
#             "data engineer": {"tools": ["Spark", "Hadoop", "Airflow", "Kafka"], "adv": ["Data Infrastructure", "Big Data Mastery", "Critical Pipeline"]},
#             "automation engineer": {"tools": ["Selenium", "Python", "Appium", "Cypress"], "adv": ["Process Efficiency", "Quality Assurance", "Testing Mastery"]},
#             "deep learning engineer": {"tools": ["PyTorch", "Neural Networks", "CUDA", "OpenCV"], "adv": ["Niche AI", "Extreme Pay", "Research Heavy"]}
#         }

#         unique_careers = [
#             'Data Scientist', 'Software Engineer', 'UX Designer', 'AI Researcher', 'Project Manager', 
#             'Embedded Systems Engineer', 'Data Analyst', 'Digital Marketer', 'NLP Engineer', 
#             'Financial Analyst', 'Research Scientist', 'Front-end Developer', 'Backend Developer', 
#             'Machine Learning Engineer', 'DevOps Engineer', 'Cloud Engineer', 'Cybersecurity Analyst', 
#             'Biostatistician', 'Mobile Developer', 'Business Analyst', 'Full Stack Developer', 
#             'UX Researcher', 'AI Specialist', 'Data Engineer', 'Content Strategist', 'Automation Engineer', 
#             'Cybersecurity Specialist', 'Deep Learning Engineer', 'Marketing Manager', 'Research Analyst', 
#             'Graphic Designer', 'Software Developer'
#         ]

#         career_data_list = []

#         for name in unique_careers:
#             clean_name = name.lower().strip()
#             search_query = clean_name.replace(" ", "+")
            
#             # Use specific info if available, otherwise default
#             info = career_info_map.get(clean_name, {
#                 "tools": ["Relevant Tech", "Soft Skills", "Git", "Industry Tools"],
#                 "adv": ["Career Growth", "Skill Development", "Networking"]
#             })
            
#             data = {
#                 "career_name": clean_name, # This matches the field name in your prediction logic
#                 "description": f"As a {name}, you will focus on implementing specialized strategies and utilizing modern tools to solve industry-scale problems.",
#                 "tools": info["tools"],
#                 "advantages": info["adv"],
#                 "video_url": f"https://www.youtube.com/results?search_query={search_query}+roadmap",
#                 "pdf_url": f"https://roadmap.sh/{clean_name.replace(' ', '-')}" if "developer" in clean_name or "engineer" in clean_name else f"https://roadmap.sh/search?q={search_query}"
#             }
#             career_data_list.append(data)

#         # Clear old data and insert new
#         collection.delete_many({})
#         collection.insert_many(career_data_list)
#         print(f"✅ Successfully seeded {len(career_data_list)} unique career details!")

#     except Exception as e:
#         print(f" Error seeding data: {e}")

# if __name__ == "__main__":
#     seed_data()