import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Layout from "./Component/UserLayout/Layout";
import Landing from "./Pages/landing";
import Login from "./Pages/Login";
import Register from "./Pages/Register";
import AdminLogin from "./Pages/AdminLogin";
import ProtectRoute from "./Component/ProtectRoute/Protectroute";
import AdminDahboard from "./Component/Dashboard/AdminDahboard";
import DashboardOverview from "./Component/Dashboard/DashboardOverview";
import CareerDashboard from "./Component/Dashboard/CarrerDahbord";

const App = () => {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
          </Route>
          <Route path="/adminlogin" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              // <ProtectRoute>
                <AdminDahboard />
              // </ProtectRoute>
            }
          >
            <Route path="/admin/overview" element={<DashboardOverview/>}/>
            <Route path="/admin/careers" element={<CareerDashboard/>}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
