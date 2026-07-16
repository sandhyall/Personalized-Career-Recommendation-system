import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Play, FileText, Map } from "lucide-react";
import {
  fetchProgress,
  getSession,
  isLoggedIn,
  updateResourceApi,
} from "../../utils/api";

const LearningPage = () => {
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

  const mark = async (resource, completed) => {
    await updateResourceApi(userId, current.slug, resource, completed);
    await load();
  };

  if (loading || !current) {
    return <p className="text-slate-500">Loading learning resources...</p>;
  }

  return (
    <div className="max-w-3xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-slate-900">Learning Resources</h1>
        <p className="text-slate-500 text-sm mt-1">
          For your recommended career: <strong>{current.career}</strong>
        </p>
      </header>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm space-y-4">
        {current.videoUrl && (
          <div className="space-y-2">
            <a
              href={current.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 w-full p-3 text-sm font-bold bg-rose-50 text-rose-700 rounded-2xl hover:bg-rose-100"
            >
              <Play className="w-4 h-4 fill-current" />
              Watch Guide {current.videoTitle ? `— ${current.videoTitle}` : ""}
            </a>
            <button
              type="button"
              onClick={() => mark("watch", !current.completedResources?.watch)}
              className={`w-full text-xs font-bold py-2 rounded-xl ${
                current.completedResources?.watch
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {current.completedResources?.watch ? "Completed" : "Mark Done"}
            </button>
          </div>
        )}

        {current.pdfUrl && (
          <div className="space-y-2">
            <a
              href={current.pdfUrl}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-3 w-full p-3 text-sm font-bold bg-blue-50 text-blue-700 rounded-2xl hover:bg-blue-100"
            >
              <FileText className="w-4 h-4" />
              Documentation
            </a>
            <button
              type="button"
              onClick={() =>
                mark("documentation", !current.completedResources?.documentation)
              }
              className={`w-full text-xs font-bold py-2 rounded-xl ${
                current.completedResources?.documentation
                  ? "bg-emerald-600 text-white"
                  : "bg-slate-100 text-slate-600"
              }`}
            >
              {current.completedResources?.documentation ? "Completed" : "Mark Done"}
            </button>
          </div>
        )}

        {current.roadmapUrl && (
          <a
            href={current.roadmapUrl}
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-3 w-full p-3 text-sm font-bold bg-emerald-50 text-emerald-700 rounded-2xl hover:bg-emerald-100"
          >
            <Map className="w-4 h-4" />
            Practice Path / Certificate
          </a>
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

export default LearningPage;
