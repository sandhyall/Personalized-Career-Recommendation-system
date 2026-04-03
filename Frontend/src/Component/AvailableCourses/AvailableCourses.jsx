import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { DollarSign, TrendingUp, Briefcase, ArrowRight } from "lucide-react";

const AvailableCourses = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const res = await axios.get("http://localhost:8000/courses/list");
        setCourses(res.data.data);
      } catch (err) {
        console.error("Error fetching courses:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="bg-[#f8faff] min-h-screen px-6 py-12 lg:px-20 font-sans">
      <div className="mb-12">
        <h2 className="text-3xl font-bold text-gray-900">Career Paths</h2>
        <p className="mt-2 text-gray-500 text-lg">
          Based on your profile and interests.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 max-w-6xl">
        {courses.map((course) => (
          <div
            key={course._id}
            className="relative flex flex-col justify-between rounded-3xl bg-white p-8 shadow-sm border border-gray-100 transition-all hover:shadow-md"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-2xl font-bold text-gray-900 leading-tight pr-4">
                {course.name}
              </h3>
              <span className="bg-orange-50 text-orange-500 px-4 py-1.5 rounded-full text-sm font-medium border border-orange-100">
                {course.matchPercent || "100%"} Match
              </span>
            </div>

            <p className="text-gray-500 text-base mb-8 leading-relaxed">
              {course.description}
            </p>

            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="p-2 bg-green-50 rounded-lg">
                  <DollarSign size={20} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Salary Range</p>
                  <p className="text-gray-700 font-medium">
                    {course.salary || "$75,000 - $125,000"}
                  </p>
                </div>
              </div>

              
              <div className="flex items-start gap-4">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <TrendingUp size={20} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-400">Job Growth</p>
                  <p className="text-gray-700 font-medium">
                    {course.growth || "23% (Much faster than average)"}
                  </p>
                </div>
              </div>
            </div>

            <Link to={`/view/${course._id}`}>
              <button className="w-full flex items-center justify-center gap-2 py-4 border-2 border-gray-100 rounded-2xl text-gray-900 font-bold text-lg hover:bg-gray-50 transition-colors group">
                View Full Details
                <ArrowRight
                  size={20}
                  className="transition-transform group-hover:translate-x-1"
                />
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AvailableCourses;
