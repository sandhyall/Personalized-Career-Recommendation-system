import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  fetchProgress,
  getSession,
  isLoggedIn,
  updateChallengeApi,
} from "../../utils/api";

const ChallengesPage = () => {
  const navigate = useNavigate();
  const { userId } = getSession();
  const [current, setCurrent] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const data = await fetchProgress(userId);
    if (!data?.currentCareer) {
      navigate("/get-started");
      return;
    }
    setCurrent(data.currentCareer);
  };

  useEffect(() => {
    if (!isLoggedIn()) {
      navigate("/login");
      return;
    }
    load().finally(() => setLoading(false));
  }, [userId, navigate]);

  const toggle = async (id) => {
    const done = (current.completedChallenges || []).includes(id);
    await updateChallengeApi(userId, current.slug, id, !done);
    await load();
  };

  if (loading || !current) {
    return <p className="text-slate-500">Loading practice challenges...</p>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Practice Challenges</h1>
        <p className="text-slate-500 text-sm mt-1">
          Challenges for <strong>{current.career}</strong>
        </p>
      </header>

      <div className="space-y-3">
        {(current.practiceChallenges || []).map((ch) => {
          const id = ch.id || ch.title;
          const done = (current.completedChallenges || []).includes(id);
          return (
            <div
              key={id}
              className="bg-white rounded-3xl border border-slate-200 p-5 shadow-sm flex items-start justify-between gap-3"
            >
              <div>
                <p className="font-semibold text-slate-800">{ch.title}</p>
                <p className="text-sm text-slate-500 mt-1">{ch.description}</p>
              </div>
              <button
                type="button"
                onClick={() => toggle(id)}
                className={`text-xs font-bold px-3 py-1.5 rounded-lg shrink-0 ${
                  done
                    ? "bg-emerald-600 text-white"
                    : "bg-slate-100 text-slate-600 border border-slate-200"
                }`}
              >
                {done ? "Done" : "Mark done"}
              </button>
            </div>
          );
        })}
        {!current.practiceChallenges?.length && (
          <p className="text-slate-400 italic">No challenges for this career yet.</p>
        )}
      </div>

      <Link
        to={`/career/${current.slug}`}
        className="inline-block text-sm font-bold text-indigo-600 hover:underline"
      >
        Open full Career Recommendation →
      </Link>
    </div>
  );
};

export default ChallengesPage;
