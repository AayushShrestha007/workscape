import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const AdminRoutes = () => {
    // Retrieve admin information from localStorage
    const admin = JSON.parse(localStorage.getItem("admin"));
    const token = localStorage.getItem("token");

    // Check if the user is an admin
    return admin && token && admin.findUser.isAdmin ? (
        <Outlet />
    ) : (
        <Navigate to="/admin/login" replace />
    );
};

export default AdminRoutes;
