import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL, ML_URL } from "../utils/api";

const STRENGTH_OPTIONS = [
  "Creativity",
  "Communication",
  "Teamwork",
  "Attention to Detail",
  "Leadership",
  "Problem Solving",
  "Research",
  "Patience",
  "Quick Learner",
  "Analytical Mindset",
  "Presentation Skills",
  "Logical Thinking",
];

const EDUCATION_OPTIONS = [
  "BCA",
  "MCA",
  "BSc IT",
  "BSc Computer Science",
  "BTech Information Technology",
  "BE Computer Engineering",
  "BE Software Engineering",
  "BE Electronics and Communication",
  "Diploma in Computer Science",
  "Other",
];

const normalizeChoice = (value) =>
  String(value || "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");

const findAllowedOption = (value, options) => {
  const n = normalizeChoice(value);
  if (!n) return "";
  return (
    options.find((opt) => normalizeChoice(opt) === n) ||
    options.find(
      (opt) =>
        normalizeChoice(opt).includes(n) || n.includes(normalizeChoice(opt))
    ) ||
    ""
  );
};

const parseStrengths = (value) => {
  const parts = String(value || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const matched = parts
    .map((p) => findAllowedOption(p, STRENGTH_OPTIONS))
    .filter(Boolean);
  return [...new Set(matched)];
};

const SOFT_STOPWORDS = new Set([
  "management", "leadership", "communication", "communications", "business",
  "team", "teams", "work", "working", "good", "best", "basic", "advanced",
  "knowledge", "experience", "learning", "study", "student", "people",
  "skill", "skills", "ability", "abilities", "strong", "problem", "solving",
  "creative", "analytical", "analysis", "research", "writing", "speaking",
  "project", "projects", "collaboration", "professional", "development",
  "career", "job", "hello", "world", "test", "stuff", "hardworking",
  "dedicated", "motivated", "friendly", "passion", "love", "like", "want",
]);

/** Tech tokens that look like "no vowels" (e.g. mysql) must never be treated as garbage. */
const TECH_TOKEN_ALLOWLIST = new Set([
  "html", "css", "sql", "mysql", "nosql", "php", "aws", "gcp", "nlp", "dba",
  "etl", "ci", "cd", "ui", "ux", "ml", "ai", "iot", "sdk", "api", "apis",
  "jvm", "ocr", "gui", "cli", "ide", "os", "db", "rdbms", "orm", "jwt",
  "ssl", "tls", "http", "https", "rest", "graphql", "mongodb", "postgresql",
  "redis", "kafka", "nginx", "linux", "macos", "ios", "seo", "sem", "crm",
  "erp", "saas", "paas", "iaas", "sre", "qa", "sdet", "css3", "html5",
]);

const CAREER_INTEREST_PHRASES = [
  "web development", "web design", "full stack", "frontend", "backend",
  "mobile apps", "mobile development", "android", "ios", "app development",
  "data science", "data analysis", "data analytics", "big data", "analytics",
  "machine learning", "deep learning", "artificial intelligence", "ai", "ml",
  "nlp", "computer vision", "neural networks", "llms",
  "cybersecurity", "security", "ethical hacking", "penetration testing",
  "bug bounty", "threat detection", "forensics", "blue team", "red team",
  "cloud", "cloud computing", "devops", "ci/cd", "containers", "kubernetes",
  "docker", "aws", "azure", "gcp", "infrastructure",
  "ui", "ux", "user experience", "product design", "design systems",
  "software engineering", "software development", "programming", "coding",
  "system design", "distributed systems", "scalability", "apis",
  "databases", "database", "database administration", "dba", "sql", "nosql",
  "mysql", "oracle", "postgresql", "mongodb", "etl", "pipelines", "data engineering",
  "testing", "qa", "quality assurance", "automation", "sdet",
  "game development", "game dev", "robotics", "iot", "blockchain",
  "networking", "networks", "saas", "startups", "open source",
  "hackathons", "mern stack", "product development", "platform engineering",
  "seo", "digital marketing", "content marketing", "wordpress",
];

const CAREER_INTEREST_TOKENS = (() => {
  const set = new Set([
    "ai", "ml", "nlp", "ux", "ui", "devops", "cybersecurity", "blockchain",
    "iot", "saas", "frontend", "backend", "fullstack", "android", "ios",
    "cloud", "security", "coding", "programming", "databases", "database",
    "dba", "mysql", "oracle", "postgresql", "mongodb", "analytics",
    "automation", "robotics", "networking", "apis", "docker", "kubernetes",
    "aws", "azure", "react", "python", "java", "javascript", "sql", "seo",
    "wordpress", "php", "marketing",
  ]);
  CAREER_INTEREST_PHRASES.forEach((phrase) => {
    phrase.split(/[\s/]+/).forEach((t) => {
      const tok = t.trim().toLowerCase();
      if (tok.length >= 2 && !SOFT_STOPWORDS.has(tok)) set.add(tok);
    });
  });
  TECH_TOKEN_ALLOWLIST.forEach((t) => set.add(t));
  return set;
})();

const OFF_TOPIC_INTERESTS = new Set([
  "cooking", "cricket", "football", "soccer", "basketball", "music", "singing",
  "sing", "dancing", "dance", "movies", "movie", "sports", "sport", "food", "travel",
  "travelling", "fashion", "shopping", "gaming", "gamer", "youtube",
  "tiktok", "instagram", "facebook", "sleeping", "eating", "party", "parties",
  "cars", "bike", "biking", "photography", "painting", "drawing",
  "poetry", "novels", "anime", "manga", "fitness", "gym",
  "yoga", "meditation", "religion", "politics", "farming", "agriculture",
  "acting", "drama", "theatre", "theater", "hobby", "hobbies", "fun",
]);

const tokenize = (text) =>
  String(text || "")
    .toLowerCase()
    .replace(/[;,]/g, " ")
    .split(/\s+/)
    .map((t) => t.trim())
    .filter(Boolean);

const interestPhrases = (text) =>
  String(text || "")
    .toLowerCase()
    .split(/[,;]+/)
    .map((s) => s.trim().replace(/\s+/g, " "))
    .filter(Boolean);

const isGarbageToken = (t) => {
  if (TECH_TOKEN_ALLOWLIST.has(t)) return false;
  if (t.length < 2) return true;
  if (/^(.)\1{2,}$/.test(t)) return true;
  if (/^(?:abc|abcd|asdf|qwerty|zxcv|test|dummy|none|n\/?a|null)+$/.test(t))
    return true;
  if (/^\d+$/.test(t)) return true;
  // Allow 'y' as a vowel so tokens like "mysql" / "python" are not rejected
  if (t.length >= 5 && !/[aeiouy]/.test(t)) return true;
  return false;
};

const isGarbageFreeText = (text) => {
  const raw = String(text || "").trim();
  if (raw.length < 2) return true;
  if (/^(.)\1{2,}$/i.test(raw.replace(/\s/g, ""))) return true;
  if (/^(?:abc|abcd|asdf|qwerty|zxcv|test|dummy|none|n\/?a|null)+$/i.test(raw))
    return true;
  const tokens = tokenize(raw).filter((t) => !isGarbageToken(t));
  return tokens.length === 0;
};

const hasCareerRelatedInterest = (text) => {
  const normalized = String(text || "").toLowerCase().replace(/\s+/g, " ").trim();
  if (!normalized) return false;

  if (CAREER_INTEREST_PHRASES.some((p) => normalized.includes(p))) return true;

  const phrases = interestPhrases(text);
  if (
    phrases.some((phrase) =>
      CAREER_INTEREST_PHRASES.some(
        (allowed) =>
          phrase === allowed || phrase.includes(allowed) || allowed.includes(phrase)
      )
    )
  ) {
    return true;
  }

  const tokens = tokenize(text).filter(
    (t) => !isGarbageToken(t) && !SOFT_STOPWORDS.has(t)
  );
  return tokens.some((t) => CAREER_INTEREST_TOKENS.has(t));
};

const mostlyOffTopicInterests = (text) => {
  const tokens = tokenize(text).filter(
    (t) => !isGarbageToken(t) && !SOFT_STOPWORDS.has(t)
  );
  if (!tokens.length) return true;
  const off = tokens.filter((t) => OFF_TOPIC_INTERESTS.has(t));
  const onTopic = tokens.filter((t) => CAREER_INTEREST_TOKENS.has(t));
  return off.length > 0 && onTopic.length === 0;
};

const CareerForm = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    strengths: [],
    education: "",
    educationOther: "",
    skills: "",
    interests: "",
  });

  const [loading, setLoading] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    if (!token || !userId) {
      navigate("/login");
      return;
    }

    const loadProfile = async () => {
      try {
        setLoadingProfile(true);
        const res = await axios.get(`${API_URL}/api/profile/${userId}`);
        const p = res.data || {};
        const listedEdu = findAllowedOption(
          p.education,
          EDUCATION_OPTIONS.filter((o) => o !== "Other")
        );
        const isCustomEdu = Boolean(p.education) && !listedEdu;

        setForm({
          name: p.name || localStorage.getItem("name") || "",
          strengths: parseStrengths(p.strength),
          education: isCustomEdu ? "Other" : listedEdu || "",
          educationOther: isCustomEdu ? String(p.education).trim() : "",
          skills: "",
          interests: "",
        });
      } catch (err) {
        console.error("Profile load failed:", err);
        setForm((prev) => ({
          ...prev,
          name: localStorage.getItem("name") || "",
        }));
      } finally {
        setLoadingProfile(false);
      }
    };

    loadProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const toggleStrength = (opt) => {
    setForm((prev) => {
      const exists = prev.strengths.includes(opt);
      return {
        ...prev,
        strengths: exists
          ? prev.strengths.filter((s) => s !== opt)
          : [...prev.strengths, opt],
      };
    });
  };


  const resolveEducation = () => {
    if (form.education === "Other") {
      const custom = form.educationOther.trim();
      return custom;
    }
    return findAllowedOption(form.education, EDUCATION_OPTIONS.filter((o) => o !== "Other"));
  };

  const validateAssessmentInput = () => {
    if (!form.name.trim() || isGarbageFreeText(form.name)) {
      return "Please enter a valid full name (not placeholder or random text).";
    }

    if (!form.strengths.length) {
      return "Please select at least one strength.";
    }
    const invalidStrength = form.strengths.some(
      (s) => !STRENGTH_OPTIONS.includes(s)
    );
    if (invalidStrength) {
      return "Please select strengths only from the provided list.";
    }

    if (!form.education) {
      return "Please select your education.";
    }
    if (form.education === "Other") {
      if (!form.educationOther.trim() || isGarbageFreeText(form.educationOther)) {
        return "Please enter your education details for Other (e.g. BSc Mathematics).";
      }
    } else if (
      !findAllowedOption(
        form.education,
        EDUCATION_OPTIONS.filter((o) => o !== "Other")
      )
    ) {
      return "Please select a valid education option.";
    }

    const skills = tokenize(form.skills).filter((t) => !isGarbageToken(t));
    const interests = tokenize(form.interests).filter((t) => !isGarbageToken(t));
    const techSkills = skills.filter((t) => !SOFT_STOPWORDS.has(t));
    const realInterests = interests.filter((t) => !SOFT_STOPWORDS.has(t));

    // Hobbies must not be entered as "technical skills"
    const hobbyAsSkills = techSkills.filter((t) => OFF_TOPIC_INTERESTS.has(t));
    if (hobbyAsSkills.length > 0) {
      return "Skills must be IT/technical (e.g. Python, MySQL, React). Do not enter hobbies like sleeping, eating, singing, or dancing as skills.";
    }

    if (techSkills.length < 2) {
      return "Enter at least 2 IT technical skills (e.g. Python, MySQL, React, SEO, Java). Soft skills alone are not enough.";
    }
    if (interests.length < 1 || isGarbageFreeText(form.interests)) {
      return "Please enter at least 1 IT career interest (e.g. Web Development, DBA, Cybersecurity, SEO).";
    }
    if (realInterests.length < 1) {
      return "Please add an IT-related interest (e.g. Data Science, Cloud, Mobile Apps) — not only generic words.";
    }
    // Reject hobbies / non-IT topics (singing, dancing, sports, etc.)
    const offTopicHits = realInterests.filter((t) => OFF_TOPIC_INTERESTS.has(t));
    if (offTopicHits.length > 0 && !hasCareerRelatedInterest(form.interests)) {
      return "This system recommends IT careers only. Interests like singing, dancing, sports, or cooking are not accepted. Use IT interests such as Web Development, AI, DBA, SEO, or Cybersecurity.";
    }
    if (mostlyOffTopicInterests(form.interests) || !hasCareerRelatedInterest(form.interests)) {
      return "Interests must be IT/tech related (e.g. Web Development, AI, Data Science, Cybersecurity, DBA, SEO, Cloud). Unrelated topics are not accepted.";
    }
    return "";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const validationError = validateAssessmentInput();
    if (validationError) {
      setError(validationError);
      return;
    }

    setError("");
    setLoading(true);

    try {
      const userId = localStorage.getItem("userId");

      if (!userId) {
        setError("You must be logged in to get recommendations.");
        setLoading(false);
        return;
      }

      const strength = form.strengths.join(", ");
      const education = resolveEducation();

      await axios.put(`${API_URL}/api/profile/${userId}`, {
        name: form.name.trim(),
        strength,
        education,
        skills: form.skills.trim(),
        interests: form.interests.trim(),
      });
      if (form.name.trim()) {
        localStorage.setItem("name", form.name.trim());
      }

      const mlResponse = await fetch(`${ML_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          skills: form.skills.trim(),
          interests: form.interests.trim(),
        }),
      });

      const data = await mlResponse.json();

      if (!mlResponse.ok) {
        throw new Error(
          data.error ||
            (mlResponse.status === 422
              ? "No relevant career matched your skills and interests. Please revise your input."
              : `ML Server error: ${mlResponse.status}`)
        );
      }

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error(
          "No career matches found. Try different, more specific skills or interests."
        );
      }

      const maxMatch = Math.max(
        ...data.map((r) => Number(r.match_percentage) || 0)
      );
      if (maxMatch <= 25) {
        throw new Error(
          "Your skills and interests do not strongly match any career path. Please enter more relevant tech skills and interests."
        );
      }

      const saveRes = await fetch(`${API_URL}/api/recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          name: form.name.trim(),
          strength,
          education,
          skills: form.skills.trim(),
          interests: form.interests.trim(),
          recommendations: data,
        }),
      });
      const saveData = await saveRes.json().catch(() => ({}));
      if (!saveRes.ok) {
        throw new Error(saveData.error || "Could not save recommendations.");
      }

      navigate("/result", {
        state: {
          recommendations: data,
          userName: form.name.trim() || "User",
        },
      });
    } catch (err) {
      setError(err.message || "Server connection failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (loadingProfile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-slate-500 font-medium">Loading your profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg">
        <div className="bg-slate-800 text-white text-center p-6 rounded-t-2xl">
          <h1 className="text-2xl font-bold">Career Navigator</h1>
          <p className="text-sm text-gray-300">
            IT careers only — enter technical skills and IT-related interests
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Full Name"
            className="w-full p-3 border rounded-md"
            required
          />

          <div>
            <p className="text-sm font-semibold text-slate-700 mb-2">
              Strengths (select one or more)
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 border rounded-md p-3 bg-slate-50">
              {STRENGTH_OPTIONS.map((opt) => {
                const checked = form.strengths.includes(opt);
                return (
                  <label
                    key={opt}
                    className={`flex items-center gap-2 text-sm px-2 py-1.5 rounded-md cursor-pointer ${
                      checked
                        ? "bg-indigo-50 text-indigo-800"
                        : "text-slate-700 hover:bg-white"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleStrength(opt)}
                      className="rounded border-slate-300"
                    />
                    {opt}
                  </label>
                );
              })}
            </div>
            {form.strengths.length > 0 && (
              <p className="text-xs text-slate-500 mt-1">
                Selected: {form.strengths.join(", ")}
              </p>
            )}
          </div>

          <select
            name="education"
            value={form.education}
            onChange={handleChange}
            className="w-full p-3 border rounded-md bg-white"
            required
          >
            <option value="">Select your education</option>
            {EDUCATION_OPTIONS.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>

          {form.education === "Other" && (
            <input
              name="educationOther"
              value={form.educationOther}
              onChange={handleChange}
              placeholder="Enter your education (e.g. BSc Mathematics)"
              className="w-full p-3 border rounded-md"
              required
            />
          )}

          <textarea
            name="skills"
            value={form.skills}
            onChange={handleChange}
            placeholder="IT technical skills (e.g. Python, MySQL, React, SEO, Java) — at least 2"
            className="w-full p-3 border rounded-md"
            rows="3"
            required
          />

          <textarea
            name="interests"
            value={form.interests}
            onChange={handleChange}
            placeholder="IT career interests only (e.g. Web Development, DBA, Cybersecurity, SEO) — not singing/dancing"
            className="w-full p-3 border rounded-md"
            rows="3"
            required
          />

          {error && (
            <p className="text-red-600 text-sm bg-red-50 border border-red-200 rounded-md p-3">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-md font-semibold transition-all ${
              loading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-slate-800 text-white hover:bg-slate-900"
            }`}
          >
            {loading ? "Analyzing..." : "Get Recommendation"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CareerForm;
