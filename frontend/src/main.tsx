import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/Layout";
import LandingPage from "./pages/LandingPage";
import CustomerDashboard from "./pages/CustomerDashboard";
import OwnerDashboard from "./pages/OwnerDashboard";
import StylistDashboard from "./pages/StylistDashboard";
import VendorDashboard from "./pages/VendorDashboard";
import HrDashboard from "./pages/HrDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import CityPulse from "./pages/CityPulse";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<AppLayout />}>
          <Route index element={<LandingPage />} />
          <Route path="customer" element={<CustomerDashboard />} />
          <Route path="owner" element={<OwnerDashboard />} />
          <Route path="stylist" element={<StylistDashboard />} />
          <Route path="vendor" element={<VendorDashboard />} />
          <Route path="hr" element={<HrDashboard />} />
          <Route path="admin" element={<AdminDashboard />} />
          <Route path="city-pulse" element={<CityPulse />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
