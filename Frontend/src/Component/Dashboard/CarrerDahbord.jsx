import React, { useState } from "react";

const FormSection = ({ title, children, onSubmit, buttonColor }) => (
  <form
    onSubmit={onSubmit}
    className="bg-white p-6 rounded-lg shadow-sm border border-gray-100 space-y-4"
  >
    <h2 className="text-lg font-semibold text-gray-700">{title}</h2>
    <div className="flex flex-wrap gap-4 items-end">
      {children}
      <button
        className={`${buttonColor} text-white px-6 py-2 rounded-md font-medium transition-opacity hover:opacity-90`}
      >
        Add {title.split(" ")[1]}
      </button>
    </div>
  </form>
);

const CareerDashboard = () => {
  const [topics, setTopics] = useState([]);
  const [titles, setTitles] = useState([]);
  const [courses, setCourses] = useState([]);

  const [formData, setFormData] = useState({
    topicName: "",
    titleName: "",
    courseName: "",
    selectedTopic: "",
    selectedTitle: "",
    videoFile: null,
    pdfFile: null,
  });

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const addTopic = (e) => {
    e.preventDefault();
    if (!formData.topicName) return;
    const newTopic = { id: Date.now(), name: formData.topicName };
    setTopics([...topics, newTopic]);
    setFormData({ ...formData, topicName: "" });
  };

  const addTitle = (e) => {
    e.preventDefault();
    if (!formData.selectedTopic || !formData.titleName) return;
    const newTitle = {
      id: Date.now(),
      topicId: Number(formData.selectedTopic),
      name: formData.titleName,
    };
    setTitles([...titles, newTitle]);
    setFormData({ ...formData, titleName: "" });
  };

  const addCourse = (e) => {
    e.preventDefault();
    const { selectedTopic, selectedTitle, courseName, videoFile, pdfFile } =
      formData;
    if (!selectedTopic || !selectedTitle || !courseName) return;

    const newCourse = {
      id: Date.now(),
      topicId: Number(selectedTopic),
      titleId: Number(selectedTitle),
      name: courseName,
      video: videoFile,
      pdf: pdfFile,
    };

    setCourses([...courses, newCourse]);
    setFormData({
      ...formData,
      courseName: "",
      videoFile: null,
      pdfFile: null,
    });
  };
  const deleteCourse = (id) => {
    setCourses(courses.filter((c) => c.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto p-8 bg-gray-50 min-h-screen space-y-8">
      <header>
        <h1 className="text-3xl font-bold text-gray-800">
          Career Management Dashboard
        </h1>
        <p className="text-gray-500">
          Organize your topics, titles, and course materials.
        </p>
      </header>

      <FormSection
        title="Create Topic"
        onSubmit={addTopic}
        buttonColor="bg-blue-600"
      >
        <input
          name="topicName"
          type="text"
          value={formData.topicName}
          onChange={handleInputChange}
          placeholder="e.g., Software Development"
          className="border p-2 rounded-md flex-1 min-w-[200px]"
        />
      </FormSection>

      <FormSection
        title="Create Title"
        onSubmit={addTitle}
        buttonColor="bg-emerald-600"
      >
        <select
          name="selectedTopic"
          value={formData.selectedTopic}
          onChange={handleInputChange}
          className="border p-2 rounded-md flex-1 min-w-[150px]"
        >
          <option value="">Select Topic</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>
        <input
          name="titleName"
          type="text"
          value={formData.titleName}
          onChange={handleInputChange}
          placeholder="e.g., Web development"
          className="border p-2 rounded-md flex-1 min-w-[200px]"
        />
      </FormSection>

      <FormSection
        title="Create Course"
        onSubmit={addCourse}
        buttonColor="bg-purple-600"
      >
        <select
          name="selectedTopic"
          value={formData.selectedTopic}
          onChange={handleInputChange}
          className="border p-2 rounded-md"
        >
          <option value="">Select Topic</option>
          {topics.map((t) => (
            <option key={t.id} value={t.id}>
              {t.name}
            </option>
          ))}
        </select>

        <select
          name="selectedTitle"
          value={formData.selectedTitle}
          onChange={handleInputChange}
          className="border p-2 rounded-md"
        >
          <option value="">Select Title</option>
          {titles
            .filter((t) => t.topicId === Number(formData.selectedTopic))
            .map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
        </select>

        <input
          name="courseName"
          type="text"
          value={formData.courseName}
          onChange={handleInputChange}
          placeholder="Course Name"
          className="border p-2 rounded-md"
        />

        <div className="flex flex-col text-xs text-gray-500">
          <label>Video</label>
          <input
            name="videoFile"
            type="file"
            onChange={handleInputChange}
            className="w-40"
          />
        </div>
        <div className="flex flex-col text-xs text-gray-500">
          <label>PDF</label>
          <input
            name="pdfFile"
            type="file"
            onChange={handleInputChange}
            className="w-40"
          />
        </div>

      </FormSection>
      

      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <h2 className="font-bold text-gray-700">Course Inventory</h2>
        </div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-100 text-gray-600 text-sm">
              <th className="p-4 font-semibold">Topic</th>
              <th className="p-4 font-semibold">Title</th>
              <th className="p-4 font-semibold">Course Name</th>
              <th className="p-4 font-semibold">Attachments</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {courses.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-gray-400">
                  No courses added yet.
                </td>
              </tr>
            )}
            {courses.map((c) => {
              const topic = topics.find((t) => t.id === c.topicId);
              const title = titles.find((t) => t.id === c.titleId);
              return (
                <tr key={c.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 text-sm">{topic?.name}</td>
                  <td className="p-4 text-sm">{title?.name}</td>
                  <td className="p-4 text-sm font-medium">{c.name}</td>
                  <td className="p-4 text-xs space-x-2">
                    {c.video && (
                      <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded">
                        🎬 Video
                      </span>
                    )}
                    {c.pdf && (
                      <span className="bg-red-100 text-red-700 px-2 py-1 rounded">
                        📄 PDF
                      </span>
                    )}
                  </td>
                  <td className="p-4 space-x-2">
                    <button
                      className="text-blue-600 hover:underline"
                      onClick={() => alert("Edit functionality coming soon!")}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-600 hover:underline"
                      onClick={() => deleteCourse(c.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CareerDashboard;
