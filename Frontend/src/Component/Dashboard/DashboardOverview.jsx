import React from "react";
import { Users, BookOpen, Sparkles } from "lucide-react";

const DashboardOverview = () => {
  return (
    <main className="flex-1 p-8 bg-gray-50 min-h-screen">
      <header className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome Back, Admin
        </h2>
        <p className="text-gray-500 mt-1">
          Here's what's happening with your platform today.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-md border hover:shadow-lg transition">
          <div>
            <p className="text-sm text-gray-500 uppercase font-semibold">
              Total Users
            </p>
            <p className="text-3xl font-bold text-gray-800 mt-2">1,284</p>
          </div>

          <div className="bg-blue-100 p-3 rounded-full">
            <Users className="text-blue-600 w-6 h-6" />
          </div>
        </div>

        <div className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-md border hover:shadow-lg transition">
          <div>
            <p className="text-sm text-gray-500 uppercase font-semibold">
              Total Courses
            </p>
            <p className="text-3xl font-bold text-gray-800 mt-2">35</p>
          </div>

          <div className="bg-green-100 p-3 rounded-full">
            <BookOpen className="text-green-600 w-6 h-6" />
          </div>
        </div>

        <div className="flex items-center justify-between p-6 bg-white rounded-2xl shadow-md border hover:shadow-lg transition">
          <div>
            <p className="text-sm text-gray-500 uppercase font-semibold">
              Total Recommendations
            </p>
            <p className="text-3xl font-bold text-gray-800 mt-2">35</p>
          </div>

          <div className="bg-purple-100 p-3 rounded-full">
            <Sparkles className="text-purple-600 w-6 h-6" />
          </div>
        </div>
      </div>
    </main>
  );
};

export default DashboardOverview;
