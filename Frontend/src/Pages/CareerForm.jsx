import React, { useState } from "react";

const CareerForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    educationLevel: "",
    fieldOfStudy: "",
    skills: "",
    tools: "",
    interestArea: "",
    workPreference: "",
    careerGoal: "",
    experienceLevel: "",
  });

  const [result, setResult] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch("http://localhost:5000/career/analyze", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await res.json();
    setResult(data.recommendation);
  };

  // Modern, clean styling - Added 'text-gray-400' as default to match placeholders
  const inputStyle = "w-full p-3 border border-gray-300 rounded-lg bg-gray-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200";

  // Helper to determine text color (gray if empty/placeholder, dark if selected)
  const getSelectColor = (value) => (value === "" ? "text-gray-400" : "text-gray-700");

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 py-10">
      <div className="w-full max-w-2xl bg-white p-8 rounded-2xl shadow-lg border border-gray-200">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-8">
          Career Form
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            placeholder="Full Name"
            onChange={handleChange}
            className={`${inputStyle} text-gray-700 placeholder-gray-400`}
          />

          <input
            name="email"
            type="email"
            placeholder="Email Address"
            onChange={handleChange}
            className={`${inputStyle} text-gray-700 placeholder-gray-400`}
          />

          <select
            name="educationLevel"
            onChange={handleChange}
            className={`${inputStyle} ${getSelectColor(formData.educationLevel)}`}
            defaultValue=""
          >
            <option value="" disabled>Education Level</option>
            <option value="+2">+2</option>
            <option value="Bachelors">Bachelors</option>
          </select>

          

          <input
            name="skills"
            placeholder="Skills"
            onChange={handleChange}
            className={`${inputStyle} text-gray-700 placeholder-gray-400`}
          />

          

          <select
            name="interestArea"
            onChange={handleChange}
            className={`${inputStyle} ${getSelectColor(formData.interestArea)}`}
            defaultValue=""
          >
            <option value="" disabled>Interest Area</option>
            <option value="Frontend Development">Frontend Development</option>
            <option value="Backend Development">Backend Development</option>
            <option value="Data Science">Data Science</option>
            <option value="Cybersecurity">Cybersecurity</option>
            <option value="Cloud Computing">Cloud Computing</option>
          </select>

          
          <select
            name="careerGoal"
            onChange={handleChange}
            className={`${inputStyle} ${getSelectColor(formData.careerGoal)}`}
            defaultValue=""
          >
            <option value="" disabled>Career Goal </option>
            <option value="Full Stack Developer">Full Stack Developer</option>
            <option value="AI Specialist">AI Specialist</option>
            <option value="DevOps Lead">DevOps Lead</option>
            <option value="Security Analyst">Security Analyst</option>
          </select>

          <select
            name="experienceLevel"
            onChange={handleChange}
            className={`${inputStyle} ${getSelectColor(formData.experienceLevel)}`}
            defaultValue=""
          >
            <option value="" disabled>Experience Level</option>
            <option value="Fresher">Fresher</option>
            <option value="1-3 years">1-3 years</option>
            <option value="above 3 years">above 3 years</option>
          </select>

          <button
            type="submit"
            className="w-full bg-blue-800 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 active:scale-[0.98] transition-all duration-300 shadow-md"
          >
           Get Recommendation
          </button>
        </form>

        {result && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <h3 className="text-lg font-semibold text-blue-700">
              Recommended Career:
            </h3>
            <p className="text-gray-700 mt-2 font-medium">{result}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default CareerForm;