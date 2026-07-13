import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Clock, Briefcase, ChevronRight, AlertCircle } from "lucide-react";

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:8000/api/history/${userId}`)
      .then((res) => {
        const sortedData = res.data.sort(
          (a, b) => new Date(b.date) - new Date(a.date),
        );

        setHistory(sortedData);
      })
      .catch((err) => {
        console.error(err);
        setError("We couldn't retrieve your history at this time.");
      })
      .finally(() => setLoading(false));
  }, [userId]);

  if (loading)
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );

  if (!userId)
    return (
      <div className="max-w-md mx-auto mt-20 p-8 bg-white shadow-xl rounded-2xl text-center border border-gray-100">
        <div className="bg-blue-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
          <Briefcase className="text-blue-600" />
        </div>

        <h2 className="text-xl font-bold text-gray-800">Access Restricted</h2>

        <p className="text-gray-500 mt-2">
          Please log in to view your personalized career history.
        </p>

        <button className="mt-6 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
          Log In
        </button>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-10">
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
            Career Journey
          </h1>

          <p className="mt-2 text-lg text-gray-600">
            A timeline of your growth and recommendations.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 flex items-center">
            <AlertCircle className="text-red-500 mr-3" size={20} />
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        )}

        {history.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-lg">
              No history found yet. Start your first assessment!
            </p>

            <button className="mt-4 text-blue-600 font-semibold hover:underline">
              Get Recommendations →
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            {history.map((item, i) => (
              <div
                key={item._id || i}
                className="group relative bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-start space-x-4">
                    <div className="bg-blue-100 text-blue-700 h-12 w-12 rounded-xl flex items-center justify-center font-bold text-lg shrink-0">
                      {history.length - i}
                    </div>

                    <div>
                      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">
                        Assessment Session
                      </h3>

                      <div className="flex items-center text-gray-600 mt-1">
                        <Clock size={14} className="mr-1" />

                        <span className="text-sm">
                          {item.date
                            ? new Date(item.date).toLocaleDateString("en-US", {
                                month: "long",
                                day: "numeric",
                                year: "numeric",
                              })
                            : "Unknown Date"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {Array.isArray(item.data) && item.data.length > 0 ? (
                        item.data.map((r, j) => (
                          <div
                            key={j}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors"
                          >
                            <span className="font-medium text-gray-800">
                              {r?.career ?? "Unknown"}
                            </span>

                            <span
                              className={`text-xs font-bold px-2 py-1 rounded-full ${
                                (r?.match_percentage || 0) > 80
                                  ? "bg-green-100 text-green-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {r?.match_percentage ?? 0}% Match
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-400 italic text-sm">
                          No data recorded for this session.
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="hidden md:block opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() =>
                        navigate("/result", {
                          state: {
                            recommendations: item.data,
                            userName: localStorage.getItem("name") || "User",
                          },
                        })
                      }
                    >
                      <ChevronRight className="text-gray-300 hover:text-blue-600 cursor-pointer" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
