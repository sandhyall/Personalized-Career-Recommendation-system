import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

const CareerResult = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const { recommendation } = location.state || {};

  return (
    <div style={{ padding: "20px" }}>
      <h2>🎯 Your Career Recommendation</h2>

      {recommendation ? (
        <div>
          <h3>{recommendation}</h3>
          <p>
            Based on your inputs, this career path suits your interests and skills.
          </p>
        </div>
      ) : (
        <p>No data found. Please fill the form first.</p>
      )}

      <button onClick={() => navigate("/")}>
        Go Back
      </button>
    </div>
  );
};

export default CareerResult;