import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PlusCircle,
  Trash2,
  BookOpen,
  Layers,
  Type,
  Edit,
  Loader2,
  FileText,
  Video,
  XCircle,
  Check,
} from "lucide-react";

const API = import.meta.env.VITE_SERVE;

const FormSection = ({
  title,
  icon: Icon,
  children,
  onSubmit,
  buttonColor,
  loading,
  isEditing,
  onCancel,
}) => (
  <form
    onSubmit={onSubmit}
    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 transition-all hover:shadow-md"
  >
    <div className="flex justify-between items-center mb-6">
      <div className="flex items-center gap-3">
        <div
          className={`p-2 rounded-lg ${buttonColor} bg-opacity-10 text-gray-700`}
        >
          {Icon && <Icon size={22} />}
        </div>
        <h2 className="text-xl font-bold text-gray-800">
          {isEditing ? `Edit ${title.split(" ")[1]}` : title}
        </h2>
      </div>
      {isEditing && (
        <button
          type="button"
          onClick={onCancel}
          className="text-gray-400 hover:text-red-500 transition-colors"
        >
          <XCircle size={20} />
        </button>
      )}
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-end">
      {children}
      <button
        type="submit"
        disabled={loading}
        className={`w-full ${buttonColor} hover:opacity-90 text-white font-medium px-5 py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50`}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={18} />
        ) : isEditing ? (
          <Edit size={18} />
        ) : (
          <PlusCircle size={18} />
        )}
        {loading ? "Processing..." : isEditing ? "Update" : "Save"}
      </button>
    </div>
  </form>
);

const CareerDashboard = () => {
  const [topics, setTopics] = useState([]);
  const [titles, setTitles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [editing, setEditing] = useState({ type: null, id: null });

  const [topicForm, setTopicForm] = useState({ name: "", description: "" });
  const [titleForm, setTitleForm] = useState({
    name: "",
    topicId: "",
    description: "",
  });
  const [courseForm, setCourseForm] = useState({
    name: "",
    topicId: "",
    titleId: "",
    description: "",
    video: null,
    pdf: null,

    tools: [],
    responsibilities: [],
    advantages: [],
    challenges: [],
  });
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [topicRes, titleRes, courseRes] = await Promise.all([
        axios.get(`${API}/topic/list`),
        axios.get(`${API}/title/list`),
        axios.get(`${API}/courses/list`),
      ]);
      setTopics(topicRes.data.data || []);
      setTitles(titleRes.data.data || []);
      setCourses(courseRes.data.data || []);
    } catch (err) {
      console.error("Error fetching data", err);
    }
  };

  const resetForms = () => {
    setTopicForm({ name: "", description: "" });
    setTitleForm({ name: "", topicId: "", description: "" });
    setCourseForm({
      name: "",
      topicId: "",
      titleId: "",
      description: "",
      video: null,
      pdf: null,

      tools: [],
      responsibilities: [],
      advantages: [],
      challenges: [],
    });
    setEditing({ type: null, id: null });
  };

  const handleTopic = async (e) => {
    e.preventDefault();
    if (!topicForm.name) return alert("Name is required");
    try {
      if (editing.type === "topic") {
        await axios.put(`${API}/topic/update/${editing.id}`, topicForm);
      } else {
        await axios.post(`${API}/topic/insert`, topicForm);
      }
      fetchData();
      resetForms();
    } catch (err) {
      console.error(err);
    }
  };

  const handleTitle = async (e) => {
    e.preventDefault();

    if (!titleForm.name.trim() || !titleForm.topicId) {
      return alert("Select Topic and Name");
    }

    try {
      const payload = {
        name: titleForm.name.trim(),
        topicId: titleForm.topicId,
        description: titleForm.description?.trim() || "",
      };

      console.log("Sending title payload:", payload);

      if (editing.type === "title") {
        await axios.put(`${API}/title/update/${editing.id}`, payload);
      } else {
        await axios.post(`${API}/title/insert`, payload);
      }

      fetchData();
      resetForms();
    } catch (err) {
      console.error("TITLE ERROR:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Title save failed");
    }
  };

 const handleCourse = async (e) => {
  e.preventDefault();

  const {
    name,
    topicId,
    titleId,
    description,
    video,
    pdf,
    tools,
    responsibilities,
    advantages,
    challenges,
  } = courseForm;

  const data = new FormData();
  data.append("name", name);
  data.append("topicId", topicId);
  data.append("titleId", titleId);
  data.append("description", description);

  data.append("tools", JSON.stringify(tools));
  data.append("responsibilities", JSON.stringify(responsibilities));
  data.append("advantages", JSON.stringify(advantages));
  data.append("challenges", JSON.stringify(challenges));

  if (video instanceof File) data.append("video", video);
  if (pdf instanceof File) data.append("pdf", pdf);

  try {
    setLoading(true);

    if (editing.type === "course") {
     
      await axios.put(`${API}/courses/update/${editing.id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    } else {
     
      await axios.post(`${API}/courses/insert`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
    }

    fetchData();
    resetForms();
  } catch (err) {
    console.error("COURSE ERROR:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Course save failed");
  } finally {
    setLoading(false);
  }
};

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
      const endpoint =
        type === "topic" ? "topic" : type === "title" ? "title" : "courses";
      await axios.delete(`${API}/${endpoint}/delete/${id}`);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  const startEdit = (type, item) => {
    const tId = item.topicId?._id || item.topicId;
    setEditing({ type, id: item._id });

    if (type === "topic")
      setTopicForm({ name: item.name, description: item.description || "" });

    if (type === "title")
      setTitleForm({
        name: item.name,
        description: item.description || "",
        topicId: tId,
      });

    if (type === "course") {
      setCourseForm({
        name: item.name || "",
        description: item.description || "",
        topicId: tId,
        titleId: item.titleId?._id || item.titleId,
        video: null,
        pdf: null,

        tools: item.tools || [],
        responsibilities: item.responsibilities || [],
        advantages: item.advantages || [],
        challenges: item.challenges || [],
      });
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const inputClass =
    "w-full border border-gray-300 p-2.5 rounded-xl focus:ring-2 focus:ring-indigo-400 focus:border-indigo-400 outline-none transition-all text-sm";
  const labelClass =
    "block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase tracking-wider";

  return (
    <div className="p-4 md:p-8 space-y-8 bg-[#F8FAFC] min-h-screen text-gray-800">
      <header className="mb-10">
        <h1 className="text-3xl font-extrabold text-gray-900">
          Admin Dashboard
        </h1>
        <p className="text-gray-500 mt-1">
          Manage learning hierarchy and media assets.
        </p>
      </header>

      <div className="grid gap-8">
        <FormSection
          title="Manage Topic"
          icon={Layers}
          onSubmit={handleTopic}
          buttonColor="bg-indigo-600"
          isEditing={editing.type === "topic"}
          onCancel={resetForms}
        >
          <div>
            <label className={labelClass}>Topic Name</label>
            <input
              className={inputClass}
              value={topicForm.name}
              onChange={(e) =>
                setTopicForm({ ...topicForm, name: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Description</label>
            <input
              className={inputClass}
              value={topicForm.description}
              onChange={(e) =>
                setTopicForm({ ...topicForm, description: e.target.value })
              }
            />
          </div>
        </FormSection>

        <FormSection
          title="Manage Title"
          icon={Type}
          onSubmit={handleTitle}
          buttonColor="bg-emerald-600"
          isEditing={editing.type === "title"}
          onCancel={resetForms}
        >
          <div>
            <label className={labelClass}>Parent Topic</label>
            <select
              className={inputClass}
              value={titleForm.topicId}
              onChange={(e) =>
                setTitleForm({ ...titleForm, topicId: e.target.value })
              }
            >
              <option value="">Select Topic</option>
              {topics.map((t) => (
                <option key={t._id} value={t._id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Title Name</label>
            <input
              className={inputClass}
              value={titleForm.name}
              onChange={(e) =>
                setTitleForm({ ...titleForm, name: e.target.value })
              }
            />
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Description</label>
            <input
              className={inputClass}
              value={titleForm.description}
              onChange={(e) =>
                setTitleForm({ ...titleForm, description: e.target.value })
              }
            />
          </div>
        </FormSection>

        <FormSection
          title="Manage Course"
          icon={BookOpen}
          onSubmit={handleCourse}
          buttonColor="bg-violet-600"
          loading={loading}
          isEditing={editing.type === "course"}
          onCancel={resetForms}
        >
          <div>
            <label className={labelClass}>Course Name</label>
            <input
              className={inputClass}
              value={courseForm.name}
              onChange={(e) =>
                setCourseForm({ ...courseForm, name: e.target.value })
              }
            />
          </div>

          <div className="md:col-span-4 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div>
              <label className={labelClass}>Tools (comma separated)</label>
              <input
                className={inputClass}
                placeholder="React, Tailwind, Node.js"
                value={courseForm.tools.join(", ")}
                onChange={(e) =>
                  setCourseForm({
                    ...courseForm,
                    tools: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Key Responsibilities</label>
              <input
                className={inputClass}
                placeholder="Build UI, Manage DB"
                value={courseForm.responsibilities.join(", ")}
                onChange={(e) =>
                  setCourseForm({
                    ...courseForm,
                    responsibilities: e.target.value
                      .split(",")
                      .map((s) => s.trim()),
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Advantages (✅)</label>
              <input
                className={inputClass}
                placeholder="High Demand, Remote Work"
                value={courseForm.advantages.join(", ")}
                onChange={(e) =>
                  setCourseForm({
                    ...courseForm,
                    advantages: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
              />
            </div>
            <div>
              <label className={labelClass}>Challenges (❌)</label>
              <input
                className={inputClass}
                placeholder="Fast Tech, Deadlines"
                value={courseForm.challenges.join(", ")}
                onChange={(e) =>
                  setCourseForm({
                    ...courseForm,
                    challenges: e.target.value.split(",").map((s) => s.trim()),
                  })
                }
              />
            </div>
          </div>
          <div>
            <label className={labelClass}>Topic & Title</label>
            <div className="flex gap-2">
              <select
                className={inputClass}
                value={courseForm.topicId}
                onChange={(e) =>
                  setCourseForm({
                    ...courseForm,
                    topicId: e.target.value,
                    titleId: "",
                  })
                }
              >
                <option value="">Topic</option>
                {topics.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
              <select
                className={inputClass}
                value={courseForm.titleId}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, titleId: e.target.value })
                }
              >
                <option value="">Title</option>
                {titles
                  .filter((t) => {
                    const parentId = t.topicId?._id || t.topicId;
                    return String(parentId) === String(courseForm.topicId);
                  })
                  .map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
              </select>
            </div>
          </div>
          <div className="md:col-span-2">
            <label className={labelClass}>Files & Details</label>
            <div className="flex gap-2 items-center">
              <input
                type="file"
                className="hidden"
                id="v-up"
                onChange={(e) =>
                  setCourseForm({ ...courseForm, video: e.target.files[0] })
                }
              />
              <label
                htmlFor="v-up"
                className={`cursor-pointer p-2.5 border rounded-xl transition-colors ${courseForm.video ? "bg-indigo-600 text-white" : "bg-white text-gray-400 hover:bg-gray-50"}`}
              >
                {courseForm.video ? <Check size={18} /> : <Video size={18} />}
              </label>

              <input
                type="file"
                className="hidden"
                id="p-up"
                onChange={(e) =>
                  setCourseForm({ ...courseForm, pdf: e.target.files[0] })
                }
              />
              <label
                htmlFor="p-up"
                className={`cursor-pointer p-2.5 border rounded-xl transition-colors ${courseForm.pdf ? "bg-red-500 text-white" : "bg-white text-gray-400 hover:bg-gray-50"}`}
              >
                {courseForm.pdf ? <Check size={18} /> : <FileText size={18} />}
              </label>

              <input
                className={inputClass}
                placeholder="Short description..."
                value={courseForm.description}
                onChange={(e) =>
                  setCourseForm({ ...courseForm, description: e.target.value })
                }
              />
            </div>
          </div>
        </FormSection>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-50 flex justify-between items-center">
          <h3 className="font-bold text-lg">Content Library</h3>
          <span className="text-xs font-medium px-2 py-1 bg-gray-100 rounded-full">
            {courses.length} Courses
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase">
              <tr>
                <th className="p-4">Content</th>
                <th className="p-4">Description</th>
                <th className="p-4">Meta</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {courses.map((c) => (
                <tr
                  key={c._id}
                  className="hover:bg-gray-50/50 transition-colors"
                >
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{c.name}</div>
                    <div className="text-xs text-indigo-500">
                      {c.topicId?.name} • {c.titleId?.name}
                    </div>
                  </td>
                  <td className="p-4 text-sm text-gray-500 truncate max-w-[200px]">
                    {c.description}
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3 items-center">
                      {c.video ? (
                        <div className="relative group/vid">
                          <video
                            className="rounded-lg h-12 w-20 object-cover bg-black"
                            src={`${API}/uploads/${c.video}`}
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/vid:opacity-100 rounded-lg transition-all cursor-pointer">
                            <Video className="text-white" size={14} />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-gray-300 italic">
                          No Video
                        </span>
                      )}
                      {c.pdf && (
                        <a
                          href={`${API}/uploads/${c.pdf}`}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center gap-1 text-xs font-bold text-blue-600 hover:text-blue-800"
                        >
                          <FileText size={14} /> PDF
                        </a>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => startEdit("course", c)}
                        className="p-2 text-gray-400 hover:text-indigo-600"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => handleDelete("course", c._id)}
                        className="p-2 text-gray-400 hover:text-red-600"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CareerDashboard;
            