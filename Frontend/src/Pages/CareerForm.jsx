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

  return (
    <div>
      <h2>Career Form</h2>

      <form onSubmit={handleSubmit}>
        <input name="name" placeholder="Name" onChange={handleChange} />
        <input name="email" placeholder="Email" onChange={handleChange} />

        <input name="educationLevel" placeholder="Education" onChange={handleChange} />
        <input name="fieldOfStudy" placeholder="Field" onChange={handleChange} />

        <input name="skills" placeholder="Skills" onChange={handleChange} />
        <input name="tools" placeholder="Tools" onChange={handleChange} />

        <input name="interestArea" placeholder="Interest" onChange={handleChange} />
        <input name="workPreference" placeholder="Work Type" onChange={handleChange} />

        <input name="careerGoal" placeholder="Career Goal" onChange={handleChange} />
        <input name="experienceLevel" placeholder="Experience" onChange={handleChange} />

        <button type="submit">Submit</button>
      </form>

      {result && (
        <div>
          <h3>Recommended Career:</h3>
          <p>{result}</p>
        </div>
      )}
    </div>
  );
};

export default CareerForm;