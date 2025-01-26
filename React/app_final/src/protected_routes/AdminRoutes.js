import React from "react";
import { Navigate } from "react-router-dom";

const AdminRoutes = ({ children }) => {

    const token = localStorage.getItem("token");
    const admin = JSON.parse(localStorage.getItem("admin"));



    if (!token || !admin || !admin.findUser.isAdmin) {
        // Redirect to the admin login page if not authenticated as admin
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default AdminRoutes;
