import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  PlayCircle,
  FileText,
  ArrowLeft,
  Briefcase,
  GraduationCap,
  Wrench,
  Map,
  ExternalLink,
  BookOpen,
  Video,
  CheckCircle2,
  AlertCircle,
  Target,
  ChevronDown,
  ChevronUp,
} from "lucide-react";

const ResourceIcon = ({ type }) => {
  if (type === "video") return <Video className="w-4 h-4 text-red-500" />;
  if (type === "pdf") return <FileText className="w-4 h-4 text-blue-500" />;
  return <BookOpen className="w-4 h-4 text-emerald-500" />;
};

const ScoreBreakdown = ({ breakdown }) => {
  const [open, setOpen] = useState(false);
  if (!breakdown) return null;

  return (
    <div className="mb-8 border border-slate-200 rounded-2xl overflow-hidden">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 hover:bg-slate-100 transition-colors text-left"
      >
        <span className="font-bold text-slate-700 text-sm uppercase tracking-wide">
          How this score was calculated
        </span>
        {open ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
      </button>
      {open && (
        <div className="px-5 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-sm bg-white">
          <div>
            <p className="text-slate-400 text-xs uppercase font-semibold">TF-IDF Skill</p>
            <p className="font-bold text-indigo-600">{breakdown.tfidf_skill_score}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-semibold">Interest Overlap</p>
            <p className="font-bold text-indigo-600">{breakdown.interest_overlap}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-semibold">Cosine Similarity</p>
            <p className="font-bold text-indigo-600">{breakdown.cosine_similarity}</p>
          </div>
          <div>
            <p className="text-slate-400 text-xs uppercase font-semibold">Final Score</p>
            <p className="font-bold text-indigo-600">{breakdown.final_score}</p>
          </div>
        </div>
      )}
    </div>
  );
};

const SkillGapSection = ({ skillGap }) => {
  if (!skillGap) return null;

  const readiness = skillGap.readiness_percentage ?? 0;

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-indigo-600" />
          <h3 className="text-lg font-bold text-slate-800">Skill Gap Analysis</h3>
        </div>
        <span className="text-sm font-bold text-indigo-600 bg-indigo-50 px-3 py-1 rounded-full">
          {readiness}% Ready
        </span>
      </div>

      <div className="mb-5">
        <div className="flex justify-between text-xs text-slate-500 mb-1">
          <span>Skill readiness for this career</span>
          <span>
            {skillGap.total_matched}/{skillGap.total_required} skills matched
          </span>
        </div>
        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 rounded-full transition-all"
            style={{ width: `${Math.min(readiness, 100)}%` }}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-emerald-50 border border-emerald-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3 text-emerald-700">
            <CheckCircle2 className="w-4 h-4" />
            <span className="font-bold text-sm uppercase tracking-wide">Skills You Have</span>
          </div>
          {skillGap.matched_skills?.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {skillGap.matched_skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-white border border-emerald-200 text-emerald-800 px-2.5 py-0.5 rounded-md text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-emerald-600 italic">No direct matches yet — start with the roadmap below.</p>
          )}
        </div>

        <div className="bg-amber-50 border border-amber-100 rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-3 text-amber-700">
            <AlertCircle className="w-4 h-4" />
            <span className="font-bold text-sm uppercase tracking-wide">Skills to Learn Next</span>
          </div>
          {skillGap.missing_skills?.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {skillGap.missing_skills.map((skill, i) => (
                <span
                  key={i}
                  className="bg-white border border-amber-200 text-amber-800 px-2.5 py-0.5 rounded-md text-xs font-semibold"
                >
                  {skill}
                </span>
              ))}
            </div>
          ) : (
            <p className="text-sm text-amber-700 font-medium">Great — you cover all core skills for this role!</p>
          )}
        </div>
      </div>
    </div>
  );
};

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
      <div className="max-w-4xl mx-auto">
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
            Based on your skills and interests — with learning paths and roadmaps.
          </p>
        </div>

        <div className="space-y-10">
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
                    <h2 className="text-2xl font-bold text-slate-800">{item.career}</h2>
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

                <p className="text-slate-600 leading-relaxed mb-6">{item.description}</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-2 text-indigo-600">
                      <GraduationCap className="w-4 h-4" />
                      <span className="font-bold text-sm uppercase tracking-wide">Next Step</span>
                    </div>
                    <p className="text-slate-700 text-sm font-medium leading-snug">{item.next_step}</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                    <div className="flex items-center gap-2 mb-2 text-indigo-600">
                      <Wrench className="w-4 h-4" />
                      <span className="font-bold text-sm uppercase tracking-wide">Industry Tools</span>
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

                <SkillGapSection skillGap={item.skill_gap} />
                <ScoreBreakdown breakdown={item.score_breakdown} />

                {/* Career Roadmap */}
                {item.roadmap?.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-5">
                      <Map className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-lg font-bold text-slate-800">Career Roadmap</h3>
                    </div>
                    <div className="relative">
                      <div className="absolute left-4 top-2 bottom-2 w-0.5 bg-indigo-100 hidden sm:block" />
                      <div className="space-y-4">
                        {item.roadmap.map((step, i) => (
                          <div key={i} className="flex gap-4 items-start">
                            <div className="relative z-10 flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white text-sm font-bold flex items-center justify-center">
                              {step.step || i + 1}
                            </div>
                            <div className="flex-1 bg-slate-50 rounded-xl p-4 border border-slate-100">
                              <div className="flex justify-between items-start gap-2">
                                <h4 className="font-bold text-slate-800">{step.title}</h4>
                                {step.duration && (
                                  <span className="text-xs font-semibold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                                    {step.duration}
                                  </span>
                                )}
                              </div>
                              <p className="text-sm text-slate-600 mt-1">{step.description}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Learning Resources */}
                {item.learning_resources?.length > 0 && (
                  <div className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                      <BookOpen className="w-5 h-5 text-indigo-600" />
                      <h3 className="text-lg font-bold text-slate-800">Learning Resources</h3>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {item.learning_resources.map((resource, i) => (
                        <a
                          key={i}
                          href={resource.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-3 p-4 bg-white border border-slate-200 rounded-xl hover:border-indigo-300 hover:shadow-sm transition-all group"
                        >
                          <ResourceIcon type={resource.type} />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-indigo-600">
                              {resource.title}
                            </p>
                            <p className="text-xs text-slate-400">{resource.platform}</p>
                          </div>
                          <ExternalLink className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-400 flex-shrink-0" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}

                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-slate-50">
                  {item.video_url && (
                    <a
                      href={item.video_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-red-50 text-red-600 rounded-xl font-bold hover:bg-red-100 transition-colors"
                    >
                      <PlayCircle className="w-5 h-5" /> Watch Career Guide
                    </a>
                  )}
                  {item.pdf_url && (
                    <a
                      href={item.pdf_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold hover:bg-blue-100 transition-colors"
                    >
                      <FileText className="w-5 h-5" /> View Roadmap PDF
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => navigate("/get-started")}
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
