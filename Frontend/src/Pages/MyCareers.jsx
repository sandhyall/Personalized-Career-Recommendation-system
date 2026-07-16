import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  Briefcase,
  RefreshCw,
  UserRound,
  Sparkles,
} from "lucide-react";
import {
  fetchLatestRecommendations,
  getSession,
  isLoggedIn,
  toCareerSlug,
} from "../utils/api";

/**
 * Light student hub — not a heavy dashboard.
 * One job: show your latest recommendation and clear next steps.
 */
const MyCareers = () => {
  const navigate = useNavigate();
  const { userId, name } = getSession();
  const [loading, setLoading] = useState(true);
  const [latest, setLatest] = useState(null);

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }

    const load = async () => {
      try {
        setLoading(true);
        const data = await fetchLatestRecommendations(userId);
        setLatest(data);
      } catch (err) {
        console.error(err);
        setLatest(null);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [userId, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <p className="text-slate-500 font-medium">Loading your career matches...</p>
      </div>
    );
  }

  const top = latest?.recommendations?.[0];
  const others = latest?.recommendations?.slice(1) || [];

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-br from-amber-50 via-white to-slate-100 border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 py-12 md:py-16">
          <p className="text-indigo-600 text-sm font-bold uppercase tracking-widest mb-2">
            Your Career Hub
          </p>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 mb-3">
            Welcome back, {name}
          </h1>
          <p className="text-slate-600 max-w-2xl text-lg">
            {top
              ? "Here is your latest personalized recommendation. Explore the path, prepare skills, then retake the quiz anytime your goals change."
              : "You have not run a career assessment yet. Take the quiz to get your top 3 matches."}
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {top ? (
          <section className="bg-white border border-slate-200 rounded-3xl p-6 md:p-8 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-50 rounded-xl">
                  <Briefcase className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400">
                    Top match
                  </p>
                  <h2 className="text-2xl font-bold text-slate-900">{top.career}</h2>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-indigo-600">
                  {top.match_percentage}%
                </p>
                <p className="text-[10px] uppercase font-bold text-slate-400">Match</p>
              </div>
            </div>

            <p className="text-slate-600 mb-6 leading-relaxed">
              {top.description}
            </p>

            {top.path_data?.next && (
              <p className="text-sm text-slate-500 mb-6 bg-slate-50 border border-slate-100 rounded-xl px-4 py-3">
                Suggested next path:{" "}
                <span className="font-semibold text-slate-800">{top.path_data.next}</span>
              </p>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                to={`/career/${toCareerSlug(top.career)}`}
                className="inline-flex items-center justify-center gap-2 bg-slate-900 text-white font-bold px-5 py-3 rounded-xl hover:bg-slate-800"
              >
                Explore this career <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/result"
                className="inline-flex items-center justify-center gap-2 border border-slate-200 text-slate-800 font-bold px-5 py-3 rounded-xl hover:bg-slate-50"
              >
                View all top 3 results
              </Link>
            </div>
          </section>
        ) : (
          <section className="bg-white border border-dashed border-slate-300 rounded-3xl p-8 text-center">
            <Sparkles className="w-8 h-8 text-indigo-500 mx-auto mb-3" />
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              Start your personalized recommendation
            </h2>
            <p className="text-slate-500 mb-6 max-w-md mx-auto">
              Tell us your skills and interests. We will match you with the top 3 careers and a next growth path.
            </p>
            <Link
              to="/get-started"
              className="inline-flex items-center gap-2 bg-black text-white font-bold px-6 py-3 rounded-xl hover:bg-indigo-700"
            >
              Take Career Quiz <ArrowRight className="w-4 h-4" />
            </Link>
          </section>
        )}

        {others.length > 0 && (
          <section className="bg-white border border-slate-200 rounded-3xl p-6">
            <h3 className="font-bold text-slate-900 mb-4">Also a strong fit</h3>
            <ul className="space-y-3">
              {others.map((item) => (
                <li
                  key={item.career}
                  className="flex items-center justify-between gap-3 border border-slate-100 rounded-2xl px-4 py-3"
                >
                  <div className="min-w-0">
                    <p className="font-semibold text-slate-800 truncate">{item.career}</p>
                    <p className="text-xs text-slate-500">{item.match_percentage}% match</p>
                  </div>
                  <Link
                    to={`/career/${toCareerSlug(item.career)}`}
                    className="text-sm font-bold text-indigo-600 hover:underline shrink-0"
                  >
                    Explore
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <section className="grid sm:grid-cols-2 gap-4">
          <Link
            to="/get-started"
            className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 transition flex gap-3"
          >
            <RefreshCw className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Retake assessment</p>
              <p className="text-sm text-slate-500">Update skills or interests for a fresh match.</p>
            </div>
          </Link>
          <Link
            to="/profile"
            className="bg-white border border-slate-200 rounded-2xl p-5 hover:border-indigo-200 transition flex gap-3"
          >
            <UserRound className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-slate-900">Edit profile</p>
              <p className="text-sm text-slate-500">Keep education and strengths up to date.</p>
            </div>
          </Link>
        </section>
      </div>
    </div>
  );
};

export default MyCareers;
