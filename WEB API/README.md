# Job Mate Backend Server

This is the backend server for the **Job Mate** job management platform. The server handles all API requests, including user (applicant and employer) authentication, job management, resume handling, application processing, and more.

## Features

### User Management (Applicant and Employer)

-   **User Registration**: Allows applicants and employers to register.
-   **Login**: Provides authentication for both applicants and employers.
-   **Profile Management**: Update applicant and employer profile details.

### Resume Management

-   **Create Resume**: Applicants can create and upload resumes.
-   **Get Resumes**: Retrieve all resumes created by the applicants.

### Job Management

-   **Create Job**: Employers can create new job postings.
-   **Fetch Job Listings**: Retrieve all open job listings or job details by ID.
-   **Manage Jobs**: Employers can fetch jobs they have posted.

### Application Management

-   **Job Applications**: Applicants can apply for open job positions.
-   **Application Status Management**: Employers can manage the status of applications (hired, complete, etc.).
-   **View Applications**: Retrieve applications for jobs, categorized by status (offered, hired, complete).

## Technologies

-   **Node.js**: JavaScript runtime environment.
-   **Express.js**: Web framework for building API services.
-   **Axios**: Promise-based HTTP client for handling API requests.
-   **MongoDB**: NoSQL database for storing user, job, resume, and application information.
-   **Mongoose**: ODM (Object Data Modeling) library for MongoDB.

## API Endpoints

### User APIs

-   **Register User**: `POST /api/user/register`
    -   Registers a new applicant user.
-   **Login User**: `POST /api/user/login`
    -   Authenticates an applicant and returns a token.
-   **Update Applicant Profile**: `PUT /api/user/update_applicant/:id`
    -   Updates the applicant's profile information.

### Employer APIs

-   **Register Employer**: `POST /api/employer/register`
    -   Registers a new employer.
-   **Login Employer**: `POST /api/employer/login`
    -   Authenticates an employer and returns a token.
-   **Update Employer Profile**: `PUT /api/employer/update_employer/:id`
    -   Updates the employer's profile information.

### Resume APIs

-   **Create Resume**: `POST /api/resume/create_resume`
    -   Allows applicants to create a resume.
-   **Get All Resumes**: `GET /api/resume/get_all_resume?page=:page&limit=:limit`
    -   Fetches all resumes created by applicants.

### Job APIs

-   **Create Job**: `POST /api/job/create_job`
    -   Allows employers to create a new job listing.
-   **Get All Open Jobs**: `GET /api/job/get_all_open_jobs?page=:page&limit=:limit`
    -   Fetches all open job listings.
-   **Get Job by ID**: `GET /api/job/get_job_details/:id`
    -   Fetches details of a single job by its ID.
-   **Get Jobs by Employer**: `GET /api/job/open_jobs_by_employer?page=:page&limit=:limit`
    -   Retrieves all open jobs posted by the current employer.

### Application APIs

-   **Apply to Job**: `POST /api/applications/apply`
    -   Allows applicants to apply for a job.
-   **Get Applied Jobs**: `GET /api/applications/get_all_applications?page=:page&limit=:limit`
    -   Retrieves jobs applied to by the currently logged-in applicant.
-   **Get Offered Applications**: `GET /api/applications/get_all_offered_applications?page=:page&limit=:limit`
    -   Retrieves offered job applications for the current applicant.
-   **Get Hired Applications**: `GET /api/applications/get_hired_application?page=:page&limit=:limit`
    -   Retrieves hired job applications for the current applicant.
-   **Get Complete Applications**: `GET /api/applications/get_complete_applications?page=:page&limit=:limit`
    -   Retrieves complete job applications for the current applicant.
-   **Update Application Status**: `PUT /api/applications/update_application_status`
    -   Allows employers to update the status of a job application.
    
   ## Environment Variables
-  **API_URL**: [http://localhost:5500](http://localhost:5500/)  
- **KHALTI_URL**: [https://test-pay.khalti.com/](https://test-pay.khalti.com/)  
- **KHALTI_PUBLIC_KEY:**"0087382a32f74d909d63f2d7bd17b9a7"


