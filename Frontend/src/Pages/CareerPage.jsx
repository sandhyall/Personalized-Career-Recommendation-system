import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import { 
  ArrowLeft, Play, FileText, Map, 
  CheckCircle2, XCircle, Briefcase, 
  Wrench, ExternalLink, Loader2 
} from "lucide-react";

const CareerPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios
      .get(`http://localhost:5000/career/${slug}`)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch(() => {
        setData(null);
        setLoading(false);
      });
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 text-indigo-600 animate-spin" />
          <p className="text-slate-500 font-medium">Loading career details...</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-slate-800">Career path not found</h2>
          <button onClick={() => navigate(-1)} className="mt-4 text-indigo-600 hover:underline">
            Go back to explorer
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:16px_16px] bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Navigation */}
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-indigo-600 mb-8 transition-all"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
          Back to Career List
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-10 shadow-sm animate-in fade-in duration-500">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-2 bg-indigo-50 rounded-lg">
                  <Briefcase className="w-5 h-5 text-indigo-600" />
                </div>
                <span className="text-sm font-bold text-indigo-600 uppercase tracking-widest">
                  Professional Path
                </span>
              </div>
              
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">
                {data.career}
              </h1>
              
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                {data.description}
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Advantages */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 font-semibold text-slate-800 text-lg">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    Key Benefits
                  </h3>
                  <ul className="space-y-3">
                    {(data.advantages || []).map((item, i) => (
                      <li key={i} className="text-sm text-slate-600 bg-emerald-50/50 p-3 rounded-xl border border-emerald-100">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Challenges */}
                <div className="space-y-4">
                  <h3 className="flex items-center gap-2 font-semibold text-slate-800 text-lg">
                    <XCircle className="w-5 h-5 text-rose-500" />
                    Market Challenges
                  </h3>
                  <ul className="space-y-3">
                    {(data.challenges || []).map((item, i) => (
                      <li key={i} className="text-sm text-slate-600 bg-rose-50/50 p-3 rounded-xl border border-rose-100">
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            {/* Real World Projects Section */}
            {data.real_projects?.length > 0 && (
              <div className="bg-white rounded-3xl border border-slate-200 p-6 md:p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-800 mb-6">Hands-on Projects</h3>
                <div className="grid grid-cols-1 gap-4">
                  {data.real_projects.map((project, i) => (
                    <div key={i} className="group flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-transparent hover:border-indigo-200 hover:bg-white transition-all">
                      <div className="flex items-center gap-4">
                        <span className="text-xs font-bold w-8 h-8 flex items-center justify-center bg-white rounded-full shadow-sm text-slate-400 group-hover:text-indigo-600">
                          {i + 1}
                        </span>
                        <span className="font-medium text-slate-700">{project}</span>
                      </div>
                      <ExternalLink className="w-4 h-4 text-slate-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area */}
          <div className="space-y-6">
            {/* Tech Stack Card */}
            <div className="bg-slate-900 rounded-3xl p-6 text-white shadow-xl">
              <div className="flex items-center gap-2 mb-6">
                <Wrench className="w-5 h-5 text-indigo-400" />
                <h3 className="font-bold">Required Tech Stack</h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {(data.tools || []).map((tool, i) => (
                  <span key={i} className="text-xs font-semibold bg-white/10 hover:bg-white/20 px-3 py-2 rounded-lg transition-colors border border-white/5">
                    {tool}
                  </span>
                ))}
              </div>
            </div>

            {/* Resources Card */}
            <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
              <h3 className="font-bold text-slate-800 mb-6">Learning Resources</h3>
              <div className="space-y-3">
                {data.video_url && (
                  <a href={data.video_url} target="_blank" rel="noreferrer" 
                    className="flex items-center gap-3 w-full p-3 text-sm font-bold bg-rose-50 text-rose-700 rounded-2xl hover:bg-rose-100 transition-colors">
                    <Play className="w-4 h-4 fill-current" />
                    Video Tutorial
                  </a>
                )}
                {data.pdf_url && (
                  <a href={data.pdf_url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 w-full p-3 text-sm font-bold bg-blue-50 text-blue-700 rounded-2xl hover:bg-blue-100 transition-colors">
                    <FileText className="w-4 h-4" />
                    Documentation PDF
                  </a>
                )}
                {data.roadmap_url && (
                  <a href={data.roadmap_url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-3 w-full p-3 text-sm font-bold bg-emerald-50 text-emerald-700 rounded-2xl hover:bg-emerald-100 transition-colors">
                    <Map className="w-4 h-4" />
                    Interactive Roadmap
                  </a>
                )}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default CareerPage;