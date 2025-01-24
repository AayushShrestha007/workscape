import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const EmployerRoutes = () => {
    //get user information
    const employer = JSON.parse(localStorage.getItem('employer'))

    return employer != null ? <Outlet /> : <Navigate to={'/login'} />

}

export default EmployerRoutes
