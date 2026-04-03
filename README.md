📌 Overview
The Personalized Career Recommendation System is an intelligent decision-support platform designed to guide users toward suitable career paths based on their skills, interests, and preferences.
Unlike traditional systems, this project integrates:
Skill-oriented profiling
Heuristic scoring mechanisms
Directed Acyclic Graph (DAG) based career mapping
Content-Based Filtering

to deliver accurate, explainable, and personalized career recommendations.

🎯 Objectives
To recommend careers based on individual skill sets
To identify skill gaps and suggest improvement paths
To build a transparent and interpretable recommendation model
To simulate real-world career decision-making logic

🧠 Key Features
🔹 Skill-Oriented Recommendation
Users input their skills, interests, and proficiency levels
The system evaluates compatibility with various career paths
Focuses on practical and employable skills
🔹 Heuristic Scoring Approach
A rule-based scoring mechanism assigns weights to:
Skills
Interests
Domain relevance
Each career is ranked using:
Score = (Skill Match × Weight) + (Interest Match × Weight) + (Relevance Factor)
Ensures interpretable and explainable results
🔹 DAG-Based Career Mapping
Career paths are structured as a Directed Acyclic Graph (DAG)
Nodes represent:
Skills
Roles
Career transitions
Edges represent dependencies:
Skill → Role progression
Enables:
Career path visualization
Step-by-step growth tracking
🔹 Content-Based Filtering
Matches user profiles with career profiles using:
Skill similarity
Interest similarity
Uses vector-based comparison techniques such as:
Cosine similarity
Recommends careers similar to user attributes
🔹 Personalized Suggestions
Provides:
Top career recommendations
Matching percentage
Required skills for each career

⚙️ System Architecture
User Input (Skills, Interests)
            ↓
   Data Preprocessing
            ↓
 Heuristic Scoring Engine
            ↓
 Content-Based Filtering
            ↓
     DAG Mapping Layer
            ↓
 Career Recommendations Output

🛠️ Tech Stack
Libraries not used
Frontend (if applicable): HTML, CSS, JavaScript
Backend (if applicable): Node,Express, MongoDb

📊 How It Works
User enters:
Skills
Interests
Preferences
System processes input:
Normalizes and encodes data
Heuristic scoring calculates:
Career compatibility scores
Content-based filtering:
Matches user profile with career dataset
DAG model:
Maps possible career progression paths
Output:
Ranked list of careers
Skill gap insights