# WorkScape- React

A React-based frontend for WorkScape, a platform that helps users find job opportunities, create and submit resumes, and track job applications. WorkScape provides features for both job seekers (Users) and employers (Admins), making job searching and recruitment seamless and efficient.

## Features

### User Role (Job Seekers)

-   **Login/Signup:** Secure user authentication to access the platform.
-   **Job Search:** Browse, filter, and apply for jobs based on categories, location, and preferences.
-   **Resume Builder:** Create, upload, and manage resumes with easy-to-use tools.
-   **Application Tracking:** Track the status of job applications and receive notifications.
-   **Profile Management:** Update personal details, upload profile pictures, and manage account information.

### Admin Role (Employers)

-   **Dashboard:** View job postings, manage applicants, and track recruitment statistics.
-   **Job Posting:** Create, edit, and delete job listings with complete control over job details.
-   **Applicant Management:** View applicants, review resumes, and communicate with candidates.
-   **Company Profile:** Manage the organization's profile, update logos, and other key details.

## Technologies

-   **React.js:** Frontend framework used to create a responsive and interactive user interface.
-   **Styled Components:** CSS-in-JS library for flexible and reusable UI styling.
-   **Axios:** Promise-based HTTP client used for making API calls.
-   **React Router:** For seamless navigation between different pages and roles (Users/Admins).
-   **Toastify:** For notifications and alerts across the platform.

## API Integration

The frontend communicates with the backend through a RESTful API, enabling functionality for both Users and Admins, such as job posting, application tracking, and profile management.

## Future Works

-   **Job Recommendations:** Leverage machine learning to provide job recommendations based on user skills and preferences.
-   **Interview Scheduling:** Allow employers to schedule interviews with applicants directly through the platform.
-   **Company Insights:** Provide detailed insights and reviews about companies to help job seekers make informed decisions.

## Challenges

-   **State Management:** Handling state for user data, job postings, and applications across multiple components efficiently using React Context API.
-   **Responsive Design:** Ensuring the application is responsive across devices, especially for complex job listing and application forms.
-   **API Integration:** Smooth integration of backend APIs to handle real-time updates of job postings, user profiles, and application statuses.

## Environment Variables

The following environment variables are required to run the WorkScape frontend:

-   **REACT_APP_API_URL:** [http://localhost:5500](http://localhost:5000)

## Getting Started

1.  **Clone the repository:**  
    `git clone https://github.com/st6003/frontend-seca-AayushShrestha007`
    
2.  **Install dependencies:**  
    `npm install`
    
3.  **Start the development server:**  
    `npm start`
    
4.  **Build the project:**  
    `npm run build`
    
5.  **Environment Setup:**  
    Update the `.env` file with appropriate API URLs and keys.
