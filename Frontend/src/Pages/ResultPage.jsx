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
} from "lucide-react";

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const recommendations = location.state?.recommendations || [];
  const userName = location.state?.userName || "User";

  useEffect(() => {
    if (!location.state || !location.state.recommendations) {
      navigate("/", { replace: true });
    }
  }, [location.state, navigate]);

  if (!location.state?.recommendations) return null;

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
                  {item.description}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {/* DAG PATH SECTION */}
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-4 text-indigo-600">
                      <GraduationCap className="w-4 h-4" />
                      <span className="font-bold text-xs uppercase tracking-widest">
                        Career Progression
                      </span>
                    </div>
                    <div className="flex items-center justify-between gap-2">
                      <div className="px-3 py-1 bg-white border rounded-md text-[11px] font-medium text-slate-500 shadow-sm">
                        {item.career}
                      </div>
                      <div className="flex-1 h-px bg-dashed bg-slate-300 relative mx-2">
                        <ChevronRight className="absolute -right-2 -top-1.5 w-3 h-3 text-slate-400" />
                      </div>
                      <button
                        onClick={() => {
                          if (item.path_data?.next_slug) {
                            navigate(`/career/${item.path_data.next_slug}`);
                          }
                        }}
                        className="px-3 py-1 bg-indigo-600 text-white rounded-md text-[11px] font-bold hover:bg-indigo-700 transition-all shadow-md active:scale-95"
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
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-50">
                  <a
                    href={item.video_url}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
                  >
                    <PlayCircle className="w-5 h-5" /> Watch Guide
                  </a>
                  <a
                    href={item.pdf_url}
                    target="_blank"
                    className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors"
                  >
                    <FileText className="w-5 h-5" /> Roadmap PDF
                  </a>
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
