import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import {
  PlayCircle,
  FileText,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Wrench,
} from "lucide-react";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const recommendations = location.state?.recommendations || [];
  const userName = location.state?.userName || "User";

  useEffect(() => {
    if (!location.state?.recommendations) {
      navigate("/");
    }
  }, [location.state, navigate]);

  if (!recommendations.length) return null;

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-slate-500 hover:text-indigo-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Start
        </button>

        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
            Top Careers for <span className="text-indigo-600">{userName}</span>
          </h1>
          <p className="text-slate-500 mt-3 text-lg">
            Based on your unique skills and interests.
          </p>
        </div>

        <div className="space-y-8">
          {recommendations.map((item, idx) => (
            <div
              key={idx}
              className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="p-8">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-indigo-50 rounded-lg">
                      <Briefcase className="w-6 h-6 text-indigo-600" />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-800">
                      {item.career}
                    </h2>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-indigo-600">
                      {Number(item.match_percentage).toFixed(0)}%
                    </span>
                    <span className="text-[10px] uppercase tracking-widest font-bold text-slate-400">
                      Match
                    </span>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed mb-6">
                  {item.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-2 text-indigo-600">
                      <GraduationCap className="w-4 h-4" />
                      <span className="font-bold text-sm uppercase tracking-wide">
                        Next Step
                      </span>
                    </div>
                    <p className="text-slate-700 text-sm font-medium leading-snug">
                      {item.next_step}
                    </p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-2 text-indigo-600">
                      <Wrench className="w-4 h-4" />
                      <span className="font-bold text-sm uppercase tracking-wide">
                        Industry Tools
                      </span>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {item.tools?.map((tool, i) => (
                        <span
                          key={i}
                          className="bg-white border border-slate-200 px-2.5 py-0.5 rounded-md text-xs font-semibold text-slate-600"
                        >
                          {tool}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-50">
                  <a
                    href={item.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
                  >
                    <PlayCircle className="w-5 h-5" /> Watch Career Guide
                  </a>
                  <a
                    href={item.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors"
                  >
                    <FileText className="w-5 h-5" /> Download Roadmap
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/")}
            className="px-10 py-4 bg-indigo-600 text-white rounded-2xl font-bold shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all active:scale-95"
          >
            Retake Assessment
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
