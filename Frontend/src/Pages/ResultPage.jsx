import { useLocation, useNavigate } from "react-router-dom";

function ResultPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { recommendations, userName } = location.state || { recommendations: [], userName: "User" };

  if (recommendations.length === 0) {
    return <div className="text-center mt-10">No data found. <button onClick={() => navigate("/")}>Go Back</button></div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 p-10 flex flex-col items-center">
      <div className="w-full max-w-2xl">
        <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">
          Top Career Matches for {userName}
        </h2>
        
        <div className="space-y-6">
          {recommendations.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-2xl shadow-lg border-l-8 border-indigo-600 flex justify-between items-center transition-transform hover:scale-105">
              <div>
                <span className="text-sm font-bold text-indigo-500 uppercase">Rank #{idx + 1}</span>
                <h3 className="text-xl font-extrabold text-slate-800">{item.career}</h3>
                <p className="text-slate-500 mt-2 text-sm">
                  Strategic Move: <span className="text-indigo-700 font-bold">{item.next_step}</span>
                </p>
              </div>
              <div className="text-center">
                <div className="text-4xl font-black text-indigo-600">{Math.round(item.score)}%</div>
                <div className="text-[10px] text-slate-400 font-bold">ACCURACY</div>
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => navigate("/")}
          className="mt-10 w-full py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-900 transition-all"
        >
          Check Another Profile
        </button>
      </div>
    </div>
  );
}

export default ResultPage;