import axios from "axios";

//creating backend Config!
const Api = axios.create({
    baseURL: "http://localhost:5500",
    withCredentials: true,
    headers: {
        "Content-Type": "multipart/form-data"
    }

})

//creating config
const config = {
    headers: {
        authorization: `Bearer ${localStorage.getItem('token')}`,
    },
};

//API FOR APPLICANT
//login api
export const loginUserApi = (data) => Api.post("/api/user/login", data)

//logout api
export const logoutUserApi = (data) => Api.post("/api/user/logout", data)


//register api 
export const registerUserApi = (data) => Api.post("/api/user/register", data)

//verify email api 
export const verifyUserEmailApi = (data) => Api.post("/api/user/verify-email", data)

//updateApplicantProfile API
export const updateApplicantProfile = (id, data) => Api.put(`/api/user/update_applicant/${id}`, data, config)

//updateApplicant password API
export const updateApplicantPassword = (id, data) => Api.post(`/api/user/update_password/${id}`, data, config)

//Resume creation API
export const createResumeApi = (data) => Api.post("/api/resume/create_resume", data, config)

//Resume fetching api
export const getAllResumesApi = (page, limit) => Api.get(`/api/resume/get_all_resume?page=${page}&limit=${limit}`, config)

//API FOR EMPLOYER
//login api
export const loginEmployerApi = (data) => Api.post("/api/employer/login", data)


//logout api
export const logoutEmployerApi = () => Api.post("/api/employer/logout")

//register api 
export const registerEmployerApi = (data) => Api.post("/api/employer/register", data)

//verify email api 
export const verifyEmployerEmailApi = (data) => Api.post("/api/employer/verify-email", data)

//create job API
export const createJobApi = (data) => Api.post("/api/job/create_job", data, config)

//update Employer Profile API
export const updateEmployerProfile = (id, data) => Api.put(`/api/employer/update_employer/${id}`, data, config)

//updateApplicantProfile API
export const updateEmployerPassword = (id, data) => Api.post(`/api/employer/update_password_employer/${id}`, data, config)


//fetch all open job by employer API
export const getAllOpenJobByEmployerApi = (page, limit) => Api.get(`/api/job/open_jobs_by_employer?page=${page}&limit=${limit}`, config)

//fetch all open job API
export const getAllOpenJobApi = (page, limit) => Api.get(`/api/job/get_all_open_jobs?page=${page}&limit=${limit}`, config)

//fetch job details by id
export const getJobDetailsByIdApi = (id) => Api.get(`/api/job/get_job_details/${id}`, config)

//create application api
export const applyToJobApi = (id) => Api.post("/api/applications/apply", id, config)

//get applicants for job api
export const getApplicantsForJobApi = (jobId) => Api.get(`/api/job/${jobId}`, config);

//get applied jobs of currently logged in user
export const getUserAppliedJobsApi = (page, limit) => Api.get(`/api/applications/get_all_applications?page=${page}&limit=${limit}`, config);

//get offered applications of currently logged in user
export const getOfferedApplicationsApi = (page, limit) => Api.get(`/api/applications/get_all_offered_applications?page=${page}&limit=${limit}`, config);


//get hired application of currently logged in user
export const getHiredApplicationApi = (page, limit) => Api.get(`/api/applications/get_hired_application?page=${page}&limit=${limit}`, config);

//get hired application of currently logged in user
export const getCompletedApplicationApi = (page, limit) => Api.get(`/api/applications/get_complete_applications?page=${page}&limit=${limit}`, config);


//get applications of currently logged in employer
export const getApplicationsByEmployerApi = (page, limit) => Api.get(`/api/applications/get_employer_applications?page=${page}&limit=${limit}`, config);

//get hired applications of currently logged in employer
export const getHiredApplicationsByEmployerApi = (page, limit) => Api.get(`/api/applications/get_employer_hired_applications?page=${page}&limit=${limit}`, config);

//get complete applications of currently logged in employer
export const getCompleteApplicationsByEmployerApi = (page, limit) => Api.get(`/api/applications/get_employer_complete_applications?page=${page}&limit=${limit}`, config);


//update application status 
export const updateApplicationStatusApi = (data) => Api.put("/api/applications/update_application_status", data, config)




