import React from 'react'
import { Navigate, Outlet } from 'react-router-dom'

const ApplicantRoutes = () => {

    const applicant = JSON.parse(localStorage.getItem('user'))

    return applicant != null ? <Outlet /> : <Navigate to={'/login'} />

}

export default ApplicantRoutes
