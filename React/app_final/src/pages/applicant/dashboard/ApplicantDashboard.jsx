import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getAllOpenJobApi } from "../../../apis/Api";
import ApplicantNavbar from "../../../components/ApplicantNavbar";
import Loader from '../../../components/Loader';

const PageContainer = styled.div`
  padding: 20px;
  background-color: white;
  min-height: calc(100vh - 60px);  // Assuming the navbar is 60px high
`;

const JobsContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
`;

const JobCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  border-bottom: 1px solid #ccc;
  &:last-child {
    border-bottom: none;
  }
`;

const JobHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const EmployerImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const JobDetails = styled.div`
  margin-left: 20px;
`;

const JobTitle = styled.h2`
  font-size: 20px;
  color: #65A168;  // Green color for the job title
  margin: 0;
`;

const EmployerName = styled.p`
  font-size: 16px;
  color: #333;
  font-weight: bold;
  margin: 0;
`;

const JobDescription = styled.p`
  font-size: 16px;
  color: #666;
  margin-top: 10px;
`;

const Button = styled.button`
  background-color: #2d69b3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 40px; 
  cursor: pointer;
  font-size: 16px;
  margin-top: 5px;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #333;
  text-align: left;
  margin-bottom: 10px;
  margin-left: 32px;
`;

// Pagination styles
const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageNumber = styled.button`
  background: none;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  color: #333;
  font-size: 16px;

  &:hover {
    text-decoration: underline;
  }

  &.active {
    font-weight: bold;
    text-decoration: underline;
  }
`;

const ApplicantDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5); // Can be adjusted based on requirements
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage]);

  const fetchJobs = async (page) => {
    try {
      setLoading(true);
      const res = await getAllOpenJobApi(page, jobsPerPage);
      setJobs(res.data.jobs);
      setTotalJobs(res.data.totalJobs || 0); // Ensure totalJobs is at least 0
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <ApplicantNavbar />
      <PageContainer>
        <Title>Currently Open Jobs</Title>
        {loading ? <Loader /> : (
          <>
            {jobs.length === 0 ? (
              <p>No jobs available at the moment.</p>
            ) : (
              <JobsContainer>
                {jobs.map(job => (
                  <JobCard key={job._id}>
                    <JobHeader>
                      <EmployerImage src={`https://localhost:5500/employerImage/${job.employer.employerImage}`} alt="Employer" />
                      <JobDetails>
                        <JobTitle>{job.title}</JobTitle>
                        <EmployerName>{job.employer.organizationName}</EmployerName>
                      </JobDetails>
                    </JobHeader>
                    <JobDescription>{job.description}</JobDescription>
                    <Button onClick={() => navigate(`/applicant/job_details/${job._id}`)}>Learn More</Button>
                  </JobCard>
                ))}
              </JobsContainer>
            )}
            <PaginationContainer>
              {totalJobs > 0 && Array.from({ length: Math.ceil(totalJobs / jobsPerPage) }).map((_, number) => (
                <PageNumber
                  key={number + 1}
                  onClick={() => paginate(number + 1)}
                  className={currentPage === number + 1 ? 'active' : ''}
                >
                  {number + 1}
                </PageNumber>
              ))}
            </PaginationContainer>
          </>
        )}
      </PageContainer>
    </>
  );
}

export default ApplicantDashboard;
