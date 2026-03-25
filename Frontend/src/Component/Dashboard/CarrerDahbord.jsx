import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  PlusCircle,
  Trash2,
  BookOpen,
  Layers,
  Type,
  FileText,
  Video,
  Edit,
} from "lucide-react";

const API = import.meta.env.VITE_SERVE;

const FormSection = ({
  title,
  icon: Icon,
  children,
  onSubmit,
  buttonColor,
}) => (
  <form
    onSubmit={onSubmit}
    className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 transition-all hover:shadow-md"
  >
    <div className="flex items-center gap-2 mb-6">
      {Icon && <Icon className="text-gray-400" size={20} />}
      <h2 className="text-xl font-bold text-gray-800">{title}</h2>
    </div>
    <div className="grid grid-cols-1 md:flex md:flex-wrap gap-5 items-end">
      {children}
      <button
        type="submit"
        className={`${buttonColor} flex items-center gap-2 text-white px-6 py-2.5 rounded-lg font-medium hover:brightness-110 active:scale-95 transition-all ml-auto md:ml-0`}
      >
        <PlusCircle size={18} />
        Add {title.split(" ")[1]}
      </button>
    </div>
  </form>
);

const CareerDashboard = () => {
  const [topics, setTopics] = useState([]);
  const [titles, setTitles] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);

  const [editing, setEditing] = useState({
    type: null,
    id: null,
  });

  const [formData, setFormData] = useState({
    topicName: "",
    titleName: "",
    courseName: "",
    selectedTopic: "",
    selectedTitle: "",
    videoFile: null,
    pdfFile: null,
  });

  useEffect(() => {
    fetchTopics();
    fetchTitles();
    fetchCourses();
  }, []);

  const fetchTopics = async () => {
    try {
      const res = await axios.get(`${API}/topic/list`);
      setTopics(res.data.data || []);
    } catch (err) {
      console.error("Error fetching topics", err);
    }
  };

  const fetchTitles = async () => {
    try {
      const res = await axios.get(`${API}/title/list`);
      setTitles(res.data.data || []);
    } catch (err) {
      console.error("Error fetching titles", err);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get(`${API}/courses/list`);
      setCourses(res.data.data || []);
    } catch (err) {
      console.error("Error fetching courses", err);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const addTopic = async (e) => {
    e.preventDefault();
    if (!formData.topicName) return;
    const res = await axios.post(`${API}/topic/insert`, {
      name: formData.topicName,
    });
    setTopics([...topics, res.data.data]);
    setFormData({ ...formData, topicName: "" });
  };

  const addTitle = async (e) => {
    e.preventDefault();
    if (!formData.selectedTopic || !formData.titleName) return;
    const res = await axios.post(`${API}/title/insert`, {
      topicId: formData.selectedTopic,
      name: formData.titleName,
    });
    setTitles([...titles, res.data.data]);
    setFormData({ ...formData, titleName: "" });
  };

  const addCourse = async (e) => {
    e.preventDefault();
    const { selectedTopic, selectedTitle, courseName, videoFile, pdfFile } =
      formData;
    if (!selectedTopic || !selectedTitle || !courseName)
      return alert("Please fill all fields");

    const data = new FormData();
    data.append("name", courseName);
    data.append("topicId", selectedTopic);
    data.append("titleId", selectedTitle);
    if (videoFile) data.append("video", videoFile);
    if (pdfFile) data.append("pdf", pdfFile);

    try {
      setLoading(true);
      const res = await axios.post(`${API}/courses/insert`, data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCourses([...courses, res.data.data]);
      setFormData({
        ...formData,
        courseName: "",
        videoFile: null,
        pdfFile: null,
      });
      alert("Course uploaded successfully!");
    } catch (err) {
      console.error("Upload failed", err);
    } finally {
      setLoading(false);
    }
  };

  const startEdit = (type, item) => {
    setEditing({ type, id: item._id });
    if (type === "topic") setFormData({ ...formData, topicName: item.name });
    if (type === "title")
      setFormData({
        ...formData,
        titleName: item.name,
        selectedTopic: item.topicId?._id || item.topicId,
      });
    if (type === "course")
      setFormData({
        ...formData,
        courseName: item.name,
        selectedTopic: item.topicId?._id || item.topicId,
        selectedTitle: item.titleId?._id || item.titleId,
      });
       
      window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (type, id) => {
    if (!window.confirm("Are you sure?")) return;
    try {
        let url =
        type === "topic"
            ? `${API}/topic/delete/${id}`
            : type === "title"
            ? `${API}/title/delete/${id}`
            : `${API}/courses/delete/${id}`;
        
        await axios.delete(url);
        
        if (type === "topic") setTopics(topics.filter((t) => t._id !== id));
        if (type === "title") setTitles(titles.filter((t) => t._id !== id));
        if (type === "course") setCourses(courses.filter((c) => c._id !== id));
    } catch (err) {
        console.error("Delete failed", err);
    }
  };

   const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing.type === "topic") {
        const res = await axios.put(
          `${API}/topic/update/${editing.id}`,
          { name: formData.topicName }
        );
        setTopics(
          topics.map((t) =>
            t._id === editing.id ? res.data.data : t
          )
        );
      }

      if (editing.type === "title") {
        const res = await axios.put(
          `${API}/title/update/${editing.id}`,
          {
            name: formData.titleName,
            topicId: formData.selectedTopic,
          }
        );
        setTitles(
          titles.map((t) =>
            t._id === editing.id ? res.data.data : t
          )
        );
      }

      if (editing.type === "course") {
        const data = new FormData();
        data.append("name", formData.courseName);
        data.append("topicId", formData.selectedTopic);
        data.append("titleId", formData.selectedTitle);
        if (formData.videoFile) data.append("video", formData.videoFile);
        if (formData.pdfFile) data.append("pdf", formData.pdfFile);

        const res = await axios.put(
          `${API}/courses/update/${editing.id}`,
          data,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        setCourses(
          courses.map((c) =>
            c._id === editing.id ? res.data.data : c
          )
        );
      }
    } catch (err) {
      console.error("Update error", err);
    }
  };

  const inputClass =
    "border border-gray-300 p-2.5 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-gray-50 transition-all min-w-[200px]";

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto space-y-10">
        <div className="flex items-center justify-between border-b border-gray-200 pb-6">
          <div>
            <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
              Career Dashboard
            </h1>
            <p className="mt-2 text-gray-500">
              Manage your topics, titles, and course curriculum.
            </p>
          </div>
          <div className="hidden md:block">
            <div className="bg-white p-3 rounded-lg shadow-sm border border-gray-100">
              <span className="text-sm font-medium text-gray-500">
                Total Courses:{" "}
              </span>
              <span className="text-lg font-bold text-blue-600">
                {courses.length}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          <FormSection
            title={editing.type === "topic" ? "Update Topic" : "Create Topic"}
            icon={Layers}
          onSubmit={editing.type === "topic" ? handleSubmit : addTopic}
            buttonColor="bg-indigo-600"
          >
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 ml-1">
                TOPIC NAME
              </label>
              <input
                name="topicName"
                value={formData.topicName}
                onChange={handleInputChange}
                placeholder="e.g. "
                className={inputClass}
              />
            </div>
          </FormSection>

          <FormSection
            title={editing.type === "title" ? "Update Title" : "Create Title"}
            icon={Type}
           onSubmit={editing.type === "title" ? handleSubmit : addTitle}
            buttonColor="bg-emerald-600"
          >
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 ml-1">
                SELECT TOPIC
              </label>
              <select
                name="selectedTopic"
                value={formData.selectedTopic}
                onChange={handleInputChange}
                className={inputClass}
              >
                <option value="">Choose Topic...</option>
                {topics.map((t) => (
                  <option key={t._id} value={t._id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="text-xs font-semibold text-gray-500 ml-1">
                TITLE NAME
              </label>
              <input
                name="titleName"
                value={formData.titleName}
                onChange={handleInputChange}
                placeholder="e.g. "
                className={inputClass}
              />
            </div>
          </FormSection>

          <FormSection
            title={editing.type === "course" ? "Update Course" : "Create Course"}
            icon={BookOpen}
           onSubmit={editing.type === "course" ? handleSubmit : addCourse}
            buttonColor="bg-violet-600"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 ml-1">
                  TOPIC
                </label>
                <select
                  name="selectedTopic"
                  value={formData.selectedTopic}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  <option value="">Select Topic</option>
                  {topics.map((t) => (
                    <option key={t._id} value={t._id}>
                      {t.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 ml-1">
                  TITLE
                </label>
                <select
                  name="selectedTitle"
                  value={formData.selectedTitle}
                  onChange={handleInputChange}
                  className={inputClass}
                >
                  <option value="">Select Title</option>
                  {titles
                    .filter(
                      (t) =>
                        (t.topicId?._id || t.topicId) === formData.selectedTopic
                    )
                    .map((t) => (
                      <option key={t._id} value={t._id}>
                        {t.name}
                      </option>
                    ))}
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs font-semibold text-gray-500 ml-1">
                  COURSE NAME
                </label>
                <input
                  name="courseName"
                  value={formData.courseName}
                  onChange={handleInputChange}
                  placeholder="Course Name"
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-6 mt-2 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 w-full">
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <Video size={16} /> Video Lecture
                </label>
                <input
                  type="file"
                  name="videoFile"
                  onChange={handleInputChange}
                  className="text-sm "
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600">
                  <FileText size={16} /> Course PDF
                </label>
                <input
                  type="file"
                  name="pdfFile"
                  onChange={handleInputChange}
                  className="text-sm"
                />
              </div>
            </div>
          </FormSection>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
            <h3 className="font-bold text-gray-700">Existing Courses</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left ">
              <thead>
                <tr className="bg-gray-50 text-gray-500 uppercase text-xs">
                  <th className="px-6 py-4 font-semibold">Topic</th>
                  <th className="px-6 py-4 font-semibold">Title</th>
                  <th className="px-6 py-4 font-semibold">Course Name</th>
                  <th className="px-6 py-4 font-semibold">PDF / Video</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {courses.length > 0 ? (
                  courses.map((c) => {
                    const topic = topics.find(
                      (t) => t._id === (c.topicId?._id || c.topicId)
                    );
                    const title = titles.find(
                      (t) => t._id === (c.titleId?._id || c.titleId)
                    );

                    return (
                      <tr
                        key={c._id}
                        className="hover:bg-blue-50/30 transition-colors group"
                      >
                        <td className="px-6 py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {topic?.name || "N/A"}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-gray-600 text-sm">
                          {title?.name || "N/A"}
                        </td>
                        <td className="px-6 py-4 font-bold text-gray-800">
                          {c.name}
                        </td>
                        <td className="px-6 py-4 flex flex-col gap-2">
                          {c.video && (
                            <video
                              src={`${API}/uploads/${c.video}`}
                              controls
                              className="max-w-[200px] rounded-md"
                            />
                          )}
                          {c.pdf && (
                            <a
                              href={`${API}/uploads/${c.pdf}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 underline text-sm flex items-center gap-1"
                            >
                              <FileText size={14} /> View PDF
                            </a>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right space-x-2">
                          <button
                            onClick={() => startEdit("course", c)}
                            className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all"
                            title="Edit"
                          >
                            <Edit size={18} />
                          </button>
                          <button
                            onClick={() => handleDelete("course", c._id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-full transition-all"
                            title="Delete Course"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="px-6 py-10 text-center text-gray-400"
                    >
                      No courses found. Add one above!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareerDashboard;