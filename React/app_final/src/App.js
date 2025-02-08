import './App.css';

import axios from "axios";

import React, { useEffect } from "react";

import {
    Route,
    BrowserRouter as Router,
    Routes
} from "react-router-dom";

//importing the csrf fetching function

//importing all the jsx page routes
import AdminLogin from './pages/admin/login/Login';
import AppliedJobsList from './pages/applicant/applications/AppliedJobsList';
import CreateResume from './pages/applicant/create_resume/ResumeBuilderPage';
import ResumeList from './pages/applicant/create_resume/ResumeList';
import ApplicantDashboard from './pages/applicant/dashboard/ApplicantDashboard';
import ApplicantJobDetails from './pages/applicant/job_detail/ApplicantJobDetails';
import HiredJobsList from './pages/applicant/jobs/HiredJobList';
import OfferedJobsList from './pages/applicant/jobs/OfferedJobsList';
import PaymentSuccess from './pages/applicant/payment/PaymentSuccess';
import ApplicantRegister from './pages/applicant/register/Register';
import UserEmailVerification from './pages/applicant/register/UserEmailVerification';
import UpdateApplicantProfile from './pages/applicant/update_profile/UpdateApplicantProfile';
import Login from './pages/common/login/Login';
import OtpVerification from './pages/common/login/OtpVerification';
import CreateJobPage from './pages/employer/create_job/CreateJob';
import EmployerDashboardPage from './pages/employer/dashboard/EmployerDashboard';
import HiringProgress from './pages/employer/hiring_progress/hiring_progress';
import JobApplicants from './pages/employer/job_applicants/JobApplicants';
import CompletedJobsListOfEmployer from './pages/employer/jobs/CompleteJobsList';
import HiredJobsListOfEmployer from './pages/employer/jobs/HiredJobsList';
import EmployerEmailVerification from './pages/employer/register/EmployerVerification';
import EmployerRegister from './pages/employer/register/Register';
import UpdateEmployerProfile from './pages/employer/update_profile/UpdateEmployerProfile';
import ApplicantRoutes from './protected_routes/ApplicantRoutes';
import EmployerRoutes from './protected_routes/EmployerRoutes';

//toast config
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import AdminDashboard from './pages/admin/dashboard/AdminDashboard';
import AdminOtpVerification from './pages/admin/login/AdminOtpVerification';
import CompletedJobsList from './pages/applicant/jobs/CompletedJobList';
import Payment from './pages/applicant/payment/Payment';
import AdminRoutes from './protected_routes/AdminRoutes';

function App() {
    useEffect(() => {
        const getCsrfToken = async () => {
            try {

                const res = await axios.get('https://localhost:5500/api/csrf-token', {
                    withCredentials: true,
                });

                // Save token to localStorage (or Redux, context, etc.)
                localStorage.setItem('csrf', res.data.csrfToken);
            } catch (err) {
                console.error('Failed to get CSRF token', err);
            }
        };

        getCsrfToken();
    }, []);
    return (
        <Router>
            <ToastContainer />
            <Routes>
                <Route path='/' element={<Login />} />
                <Route path='/login' element={<Login />} />
                <Route path='/applicant/register' element={<ApplicantRegister />} />
                <Route path='/employer/register' element={<EmployerRegister />} />
                <Route path='/applicant/verify_email' element={< UserEmailVerification />} />
                <Route path='/employer/verify_email' element={< EmployerEmailVerification />} />
                <Route path="/employer/verify-otp" element={<OtpVerification />} />
                <Route path="/applicant/verify-otp" element={<OtpVerification />} />
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin/verify-otp" element={<AdminOtpVerification />} />

                {/* Only Applicant Accessible Routes */}
                <Route element={<ApplicantRoutes />}>
                    <Route path='/applicant/dashboard' element={<ApplicantDashboard />} />
                    <Route path='/applicant/update_profile' element={< UpdateApplicantProfile />} />
                    <Route path='/applicant/create_resume' element={< CreateResume />} />
                    <Route path='/applicant/resume_list' element={< ResumeList />} />
                    <Route path='/applicant/job_details/:id' element={<  ApplicantJobDetails />} />
                    <Route path='/applicant/applications' element={< AppliedJobsList />} />
                    <Route path='/applicant/offered_jobs' element={< OfferedJobsList />} />
                    <Route path='/applicant/hired_jobs' element={< HiredJobsList />} />
                    <Route path='/applicant/completed_jobs' element={< CompletedJobsList />} />
                    <Route path='/applicant/payment' element={< Payment />} />
                    <Route path='/applicant/payment_success' element={< PaymentSuccess />} />



                </Route>

                {/* Only Employer Accessible Routes */}
                <Route element={<EmployerRoutes />}>
                    <Route path='/employer/dashboard' element={<EmployerDashboardPage />} />
                    <Route path='/employer/update_profile' element={< UpdateEmployerProfile />} />
                    <Route path='/employer/create_job' element={<CreateJobPage />} />
                    <Route path='/employer/job_details/:jobId' element={<JobApplicants />} />
                    <Route path='/employer/hiring_progress' element={<HiringProgress />} />
                    <Route path='/employer/hired_jobs' element={<HiredJobsListOfEmployer />} />
                    <Route path='/employer/completed_jobs' element={<CompletedJobsListOfEmployer />} />
                </Route>

                {/* Only Admin Accessible Routes */}
                <Route element={<AdminRoutes />}>
                    <Route path='/admin/dashboard' element={<AdminDashboard />} />
                </Route>

            </Routes>
        </Router >
    )
}
export default App;