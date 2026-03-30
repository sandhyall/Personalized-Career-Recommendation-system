import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  ArrowLeft,
  Wrench,
  ClipboardList,
  CheckCircle2,
  AlertTriangle,
  Layout,
  BookOpen,
  Sparkles,
} from "lucide-react";

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
        const courseRes = await axios.get(
          `http://localhost:8000/courses/${id}`,
        );

        const topicsRes = await axios.get("http://localhost:8000/topic/list");

        const titleId = courseRes.data.data.titleId._id;

        const titlesRes = await axios.get(
          `http://localhost:8000/title/${titleId}`,
        );

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
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!course)
    return <div className="text-center p-20 font-bold">Course not found</div>;

  return (
    <div className="min-h-screen bg-[#f8faff] pb-20 font-sans">
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-gray-400 hover:text-blue-600 transition-all mb-4"
          >
            <ArrowLeft
              size={18}
              className="transition-transform group-hover:-translate-x-1"
            />
            <span className="text-sm font-bold uppercase tracking-widest">
              Back
            </span>
          </button>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {titles.slice(0, 1).map((t, i) => (
                  <span
                    key={i}
                    className="bg-blue-600 text-white text-[10px] font-black px-3 py-1 rounded-full uppercase tracking-tighter flex items-center gap-1"
                  >
                    <Sparkles size={12} /> {t.name}
                  </span>
                ))}
              </div>

              <h1 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">
                {course.name}
              </h1>
              <p className="text-gray-500 text-lg max-w-3xl leading-relaxed">
                {course.description}
              </p>
            </div>
            <div className="hidden lg:block p-6 bg-blue-50 rounded-[2.5rem] border-4 border-white shadow-xl">
              <Layout size={48} className="text-blue-600" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 mt-12 space-y-12">
        <section>
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 bg-indigo-100 rounded-xl text-indigo-600">
              <BookOpen size={24} />
            </div>
            <h2 className="text-2xl font-black text-gray-800 uppercase tracking-tight">
              Learning Topics
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {topics.map((topic, i) => (
              <div
                key={i}
                className="group p-5 bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl hover:border-blue-200 transition-all cursor-default"
              >
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-indigo-600 font-black text-xl group-hover:bg-indigo-600 group-hover:text-white transition-colors">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h4 className="font-bold text-gray-700 group-hover:text-indigo-600 transition-colors">
                    {topic.name}
                  </h4>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-16">
          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-orange-100 rounded-2xl text-orange-600">
                <Wrench size={28} />
              </div>
              <h3 className="text-2xl font-black text-gray-800">
                Stack & Tools
              </h3>
            </div>
            <div className="flex flex-wrap gap-3">
              {course.tools?.map((t, i) => (
                <span
                  key={i}
                  className="px-5 py-3 bg-gray-50 text-gray-700 rounded-2xl text-sm font-black border border-gray-100 hover:bg-white hover:shadow-md transition-all"
                >
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-blue-100 rounded-2xl text-blue-600">
                <ClipboardList size={28} />
              </div>
              <h3 className="text-2xl font-black text-gray-800">Your Role</h3>
            </div>
            <ul className="space-y-5">
              {course.responsibilities?.map((r, i) => (
                <li key={i} className="flex gap-4 text-gray-600 group">
                  <div className="mt-1.5 h-2 w-2 rounded-full bg-blue-400 group-hover:scale-150 transition-transform" />
                  <span className="font-medium text-base">{r}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-10 rounded-[3rem] border border-green-100">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-white rounded-2xl text-green-600 shadow-sm">
                <CheckCircle2 size={28} />
              </div>
              <h3 className="text-2xl font-black text-gray-800">
                Perks & Pros
              </h3>
            </div>
            <div className="grid gap-3">
              {course.advantages?.map((a, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-4 bg-white/60 rounded-2xl border border-white font-bold text-gray-700"
                >
                  <div className="w-2 h-2 rounded-full bg-green-500" /> {a}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] border-2 border-dashed border-gray-100 shadow-sm">
            <div className="flex items-center gap-4 mb-8">
              <div className="p-3 bg-red-50 rounded-2xl text-red-500">
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-2xl font-black text-gray-800">Hard Truths</h3>
            </div>
            <ul className="space-y-4">
              {course.challenges?.map((c, i) => (
                <li
                  key={i}
                  className="p-4 bg-red-50/30 rounded-2xl text-red-700/70 font-medium italic"
                >
                  " {c} "
                </li>
              ))}
            </ul>
          </div>

          <div className="relative mt-20 o rounded-[2.5rem] bg-gradient-to-r from-[#2B63FF] via-[#8B5CF6] to-[#D946EF] p-12 text-center text-white shadow-2xl shadow-purple-200">
            <div className="relative z-10 ">
              <h2 className="text-3xl ">Ready to pursue this career?</h2>
              <p className="text-blue-50 text-lg max-w-2xl mx-auto opacity-90">
                Start building your skills today and take the first step toward
                your dream IT career.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
                <button
                  onClick={() => navigate("/available")}
                  className="w-full sm:w-auto px-8 py-4 bg-white text-blue-600 font-black rounded-2xl hover:bg-blue-50 transition-colors shadow-lg"
                >
                  View Other Careers
                </button>
                <button
                  onClick={() => navigate("/assessment")}
                  className="w-full sm:w-auto px-8 py-4 bg-white/20 backdrop-blur-md text-white font-black rounded-2xl border border-white/30 hover:bg-white/30 transition-colors"
                >
                  Retake Assessment
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Viewdetails;
