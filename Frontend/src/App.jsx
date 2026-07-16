import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Layout from "./Component/UserLayout/Layout";
import Landing from "./Pages/landing";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import AdminLogin from "./Pages/AdminLogin";
import ProtectRoute from "./Component/ProtectRoute/Protectroute";
import AdminDahboard from "./Component/Dashboard/AdminDahboard";
import DashboardOverview from "./Component/Dashboard/DashboardOverview";
import CareerDashboard from "./Component/Dashboard/CarrerDahbord";
import AdminProjectReview from "./Component/Dashboard/AdminProjectReview";
import { AdminUsersPage } from "./Component/Dashboard/AdminExtraPages";
import About from "./Pages/About";
import Contactus from "./Pages/Contactus";
import CareerForm from "./Pages/CareerForm";
import AvailableCourses from "./Component/AvailableCourses/AvailableCourses";
import Viewdetails from "./Component/AvailableCourses/viewdetails";
import ResultPage from "./Pages/ResultPage";
import CareerPage from "./Pages/CareerPage";
import MyCareers from "./Pages/MyCareers";
import Profile from "./Component/Common/Profile";
import StudentLayout from "./Component/StudentDashboard/StudentLayout";
import DashboardHome from "./Component/StudentDashboard/DashboardHome";
import LearningPage from "./Component/StudentDashboard/LearningPage";
import ChallengesPage from "./Component/StudentDashboard/ChallengesPage";
import ProjectsPage from "./Component/StudentDashboard/ProjectsPage";
import ProgressPage from "./Component/StudentDashboard/ProgressPage";
import CareerRedirect from "./Component/StudentDashboard/CareerRedirect";
import {
  DashboardProfile,
  DashboardSettings,
} from "./Component/StudentDashboard/DashboardSettings";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contactus />} />
            <Route path="/get-started" element={<CareerForm />} />
            <Route path="/available" element={<AvailableCourses />} />
            <Route path="/result" element={<ResultPage />} />
            <Route path="/career/:slug" element={<CareerPage />} />
            <Route path="/my-careers" element={<Navigate to="/dashboard" replace />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/view/:id" element={<Viewdetails />} />
          </Route>

          <Route path="/dashboard" element={<StudentLayout />}>
            <Route index element={<DashboardHome />} />
            <Route path="career" element={<CareerRedirect />} />
            <Route path="learning" element={<LearningPage />} />
            <Route path="challenges" element={<ChallengesPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="progress" element={<ProgressPage />} />
            <Route path="profile" element={<DashboardProfile />} />
            <Route path="settings" element={<DashboardSettings />} />
          </Route>

          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <ProtectRoute>
                <AdminDahboard />
              </ProtectRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="overview" element={<Navigate to="/admin" replace />} />
            <Route path="projects" element={<AdminProjectReview />} />
            <Route path="careers" element={<CareerDashboard />} />
            <Route path="users" element={<AdminUsersPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
