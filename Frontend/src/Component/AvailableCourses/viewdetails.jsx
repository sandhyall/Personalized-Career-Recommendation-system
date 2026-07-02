import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Wrench,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Terminal,
  PlayCircle,
  FileText,
  ExternalLink,
  Map,
  Video,
} from "lucide-react";

const API_BASE = import.meta.env.VITE_SERVE || "http://localhost:8000";

const Viewdetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [topics, setTopics] = useState([]);
  const [titles, setTitles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const courseRes = await axios.get(`${API_BASE}/courses/${id}`);
        const topicsRes = await axios.get(`${API_BASE}/topic/list`);
        const titleId = courseRes.data.data.titleId._id;
        const titlesRes = await axios.get(`${API_BASE}/title/${titleId}`);

        setCourse(courseRes.data.data);
        setTopics(topicsRes.data.data);
        setTitles([titlesRes.data.data]);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-white">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-900 border-t-transparent"></div>
      </div>
    );
  }

  if (!course)
    return <div className="text-center p-20 font-medium">Course not found</div>;

  return (
    <div className="min-h-screen bg-slate-50 pb-20 font-sans text-slate-900">
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-6 py-10">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6 group"
          >
            <ArrowLeft
              size={18}
              className="group-hover:-translate-x-1 transition-transform"
            />
            <span className="text-sm font-semibold">Back to Overview</span>
          </button>

          <div className="space-y-4">
            <div className="flex gap-2">
              {titles.map((t, i) => (
                <span
                  key={i}
                  className="bg-slate-100 text-slate-400 text-xl font-bold px-3 py-1 rounded"
                >
                  {t.name.toUpperCase()}
                </span>
              ))}
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 md:text-3xl">
              {course.name}
            </h1>
            <p className="text-lg text-slate-600 max-w-3xl leading-relaxed">
              {course.description}
            </p>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-12">
        <section className="mb-16">
          <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-2">
            <BookOpen size={20} className="text-blue-600" />
            <h2 className="text-xl font-bold">Curriculum Topics</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {topics.map((topic, i) => (
              <div
                key={i}
                className="flex items-center gap-4 p-4 bg-white border border-slate-200 rounded-lg"
              >
                <span className="text-slate-300 font-mono text-lg">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="font-semibold text-slate-700">
                  {topic.name}
                </span>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <Terminal size={22} className="text-slate-700" />
              <h3 className="text-lg font-bold">Technical Stack</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {course.tools?.map((t, i) => (
                <span
                  key={i}
                  className="px-3 py-1.5 bg-slate-50 text-slate-700 rounded border border-slate-200 text-sm font-medium"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 border border-slate-200 rounded-xl shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <ClipboardList size={22} className="text-slate-700" />
              <h3 className="text-lg font-bold">Key Responsibilities</h3>
            </div>
            <ul className="space-y-4">
              {course.responsibilities?.map((r, i) => (
                <li
                  key={i}
                  className="flex gap-3 text-slate-600 text-sm leading-relaxed"
                >
                  <div className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-500" />
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-emerald-50/50 p-8 border border-emerald-100 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <CheckCircle2 size={22} className="text-emerald-600" />
              <h3 className="text-lg font-bold text-emerald-900">
                Career Benefits
              </h3>
            </div>
            <div className="space-y-3">
              {course.advantages?.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 text-sm font-medium text-emerald-800"
                >
                  <div className="h-1 w-1 rounded-full bg-emerald-400" /> {a}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-red-50/50 p-8 border border-red-100 rounded-xl">
            <div className="flex items-center gap-3 mb-6">
              <AlertTriangle size={22} className="text-red-600" />
              <h3 className="text-lg font-bold text-red-900">
                Industry Realities
              </h3>
            </div>
            <ul className="space-y-3">
              {course.challenges?.map((c, i) => (
                <li
                  key={i}
                  className="text-sm text-red-800/80 italic pl-4 border-l-2 border-red-200"
                >
                  "{c}"
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Learning Resources & Media */}
        {(course.videoUrl || course.video || course.pdf || course.learningResources?.length > 0) && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-2">
              <BookOpen size={20} className="text-indigo-600" />
              <h2 className="text-xl font-bold">Learning Resources</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {course.videoUrl && (
                <a
                  href={course.videoUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-5 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <PlayCircle className="text-red-600" size={24} />
                  <div>
                    <p className="font-bold text-red-800">Watch on YouTube</p>
                    <p className="text-sm text-red-600">Career guide video</p>
                  </div>
                  <ExternalLink className="ml-auto text-red-400" size={16} />
                </a>
              )}
              {course.video && (
                <div className="p-4 bg-slate-900 rounded-xl">
                  <video
                    controls
                    className="w-full rounded-lg"
                    src={`${API_BASE}/uploads/${course.video}`}
                  />
                </div>
              )}
              {course.pdf && (
                <a
                  href={`${API_BASE}/uploads/${course.pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-5 bg-blue-50 border border-blue-100 rounded-xl hover:bg-blue-100 transition-colors"
                >
                  <FileText className="text-blue-600" size={24} />
                  <div>
                    <p className="font-bold text-blue-800">Download Roadmap PDF</p>
                    <p className="text-sm text-blue-600">Step-by-step career guide</p>
                  </div>
                  <ExternalLink className="ml-auto text-blue-400" size={16} />
                </a>
              )}
              {course.learningResources?.map((resource, i) => (
                <a
                  key={i}
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-200 transition-colors"
                >
                  {resource.type === "video" ? (
                    <Video className="text-red-500" size={20} />
                  ) : resource.type === "pdf" ? (
                    <FileText className="text-blue-500" size={20} />
                  ) : (
                    <BookOpen className="text-emerald-500" size={20} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{resource.title}</p>
                    <p className="text-xs text-slate-400">{resource.platform}</p>
                  </div>
                  <ExternalLink className="text-slate-300" size={14} />
                </a>
              ))}
            </div>
          </section>
        )}

        {/* Career Roadmap */}
        {course.roadmap?.length > 0 && (
          <section className="mb-16">
            <div className="flex items-center gap-2 mb-6 border-b border-slate-200 pb-2">
              <Map size={20} className="text-indigo-600" />
              <h2 className="text-xl font-bold">Career Roadmap</h2>
            </div>
            <div className="space-y-4">
              {course.roadmap.map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
                    {step.step || i + 1}
                  </div>
                  <div className="flex-1 bg-white border border-slate-200 rounded-xl p-4">
                    <div className="flex justify-between items-start gap-2">
                      <h4 className="font-bold text-slate-800">{step.title}</h4>
                      {step.duration && (
                        <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
                          {step.duration}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        <footer className="mt-20 py-12 px-8 bg-slate-900 rounded-2xl text-center">
          <h2 className="text-2xl font-bold text-white mb-2">
            Ready to start?
          </h2>
          <p className="text-slate-400 mb-8">
            Choose your path and start learning today.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button
              onClick={() => navigate("/available")}
              className="px-6 py-3 bg-white text-slate-900 font-bold rounded-lg hover:bg-slate-100 transition-all"
            >
              Explore Other Careers
            </button>
            <button
              onClick={() => navigate("/assessment")}
              className="px-6 py-3 bg-slate-800 text-white font-bold rounded-lg border border-slate-700 hover:bg-slate-700 transition-all"
            >
              Retake Assessment
            </button>
          </div>
        </footer>
      </main>
    </div>
  );
};

export default Viewdetails;
