import { useLocation, useNavigate } from "react-router-dom";

import { useEffect } from "react";
import {
  PlayCircle,
  FileText,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Wrench,
  ChevronRight,
  Map,
} from "lucide-react";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const recommendations = location.state?.recommendations || [];
  const userName = location.state?.userName || "User";

  useEffect(() => {
    if (!location.state?.recommendations) {
      navigate("/", { replace: true });
    }
  }, [location.state, navigate]);

  if (!location.state?.recommendations) return null;

  if (recommendations.length === 0) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
        <div className="text-center space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">
            No career matches found
          </h2>
          <p className="text-slate-500 text-sm">
            Try updating your skills or interests for better results.
          </p>
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-indigo-600 hover:underline text-sm font-medium"
          >
            <ArrowLeft className="w-4 h-4" />
            Go back and try again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6">
      <div className="max-w-3xl mx-auto">
        <button
          onClick={() => navigate("/")}
          className="flex items-center text-slate-500 hover:text-indigo-600 mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Start
        </button>

        <header className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-slate-900">
            Top Careers for <span className="text-indigo-600">{userName}</span>
          </h1>
          <p className="text-slate-500 mt-3 text-lg">
            Based on your unique skills and interests.
          </p>
        </header>

        <main className="space-y-8">
          {recommendations.map((item, idx) => (
            <section
              key={idx}
              className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-md transition-all"
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
                  <div className="text-right">
                    <span className="text-2xl font-black text-indigo-600">
                      {item.match_percentage}%
                    </span>
                    <p className="text-[10px] uppercase font-bold text-slate-400">
                      Match
                    </p>
                  </div>
                </div>

                <p className="text-slate-600 leading-relaxed mb-6">
                  {item.description || "No description available."}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-4 text-indigo-600">
                      <GraduationCap className="w-4 h-4" />
                      <span className="font-bold text-xs uppercase tracking-widest">
                        Career Progression
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="px-3 py-1 bg-white border rounded-md text-[11px] font-medium text-slate-500 shadow-sm truncate max-w-[90px]">
                        {item.career}
                      </div>

                      <div className="flex-1 flex items-center mx-2">
                        <div className="flex-1 border-t border-dashed border-slate-300" />
                        <ChevronRight className="w-3 h-3 text-slate-400 shrink-0" />
                      </div>

                      <button
                        onClick={() => {
                          if (item.path_data?.next_slug) {
                            navigate(`/career/${item.path_data.next_slug}`);
                          }
                        }}
                        disabled={!item.path_data?.next_slug}
                        className={`px-3 py-1 rounded-md text-[11px] font-bold transition-all shadow-md active:scale-95 whitespace-nowrap ${
                          item.path_data?.next_slug
                            ? "bg-indigo-600 text-white hover:bg-indigo-700 cursor-pointer"
                            : "bg-slate-200 text-slate-400 cursor-not-allowed"
                        }`}
                      >
                        {item.path_data?.next || "Senior Level"}
                      </button>
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-2 text-indigo-600">
                      <Wrench className="w-4 h-4" />
                      <span className="font-bold text-xs uppercase tracking-widest">
                        Industry Tools
                      </span>
                    </div>

                    {(item.tools || []).length === 0 ? (
                      <p className="text-[11px] text-slate-400 italic">
                        No tools listed.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-1.5">
                        {item.tools.map((tool, i) => (
                          <span
                            key={i}
                            className="bg-white border border-slate-200 px-2 py-0.5 rounded text-[10px] font-semibold text-slate-600"
                          >
                            {tool}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-100">
                  {item.video_url && (
                    <a
                      href={item.video_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
                    >
                      <PlayCircle className="w-5 h-5" />
                      Watch Guide
                    </a>
                  )}
                  {item.pdf_url && (
                    <a
                      href={item.pdf_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors"
                    >
                      <FileText className="w-5 h-5" />
                      Roadmap PDF
                    </a>
                  )}

                  {item.roadmap_url && (
                    <a
                      href={item.roadmap_url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-emerald-50 text-emerald-600 rounded-xl font-bold hover:bg-emerald-100 transition-colors"
                    >
                      <Map className="w-5 h-5" />
                      Roadmap
                    </a>
                  )}

                  {!item.video_url && !item.pdf_url && !item.roadmap_url && (
                    <p className="text-sm text-slate-400 italic">
                      No learning resources available for this career yet.
                    </p>
                  )}
                </div>
              </div>
            </section>
          ))}
        </main>
      </div>
    </div>
  );
};

export default ResultPage;
