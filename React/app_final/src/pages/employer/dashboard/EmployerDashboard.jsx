import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getAllOpenJobByEmployerApi } from '../../../apis/Api';
import EmployerNavbar from '../../../components/EmployerNavbar';
import Loader from '../../../components/Loader';

const PageContainer = styled.div`
  padding: 20px;
  padding-top: 30px;
  background-color: white;
  min-height: calc(100vh - 60px);
`;

const JobsContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 5px;
  background: white;
  border-radius: 8px;

`;

const JobCard = styled.div`
  padding: 20px;
  border-bottom: 1px solid #ccc;
  &:last-child {
    border-bottom: none;
  }
`;

const JobTitle = styled.h2`
  font-size: 20px;
  color: #65A168;
`;

const JobDescription = styled.p`
  font-size: 16px;
  color: #666;
`;

const Button = styled.button`
  background-color: #2d69b3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  font-size: 16px;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #333;
  text-align: left;
  margin-bottom: 0px;
  margin-left: 34px;
`;

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

const EmployerDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);
  const [totalJobs, setTotalJobs] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchJobs(currentPage);
  }, [currentPage]);

  useEffect(() => {
    // Reset jobs when employer changes
    setJobs([]);
    setCurrentPage(1);
    setTotalJobs(0);

  }, []);

  const fetchJobs = async (page) => {
    try {
      setLoading(true);
      const res = await getAllOpenJobByEmployerApi(page, jobsPerPage);
      setJobs(res.data.jobs);
      setTotalJobs(res.data.totalJobs);
      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <EmployerNavbar />
      <PageContainer>
        <Title>Currently Open Jobs</Title>
        {loading ? (
          <Loader />
        ) : (
          <>
            {jobs.length === 0 ? ( // Check if jobs array is empty
              <p style={{ textAlign: 'center', fontSize: '18px', color: '#666' }}>
                No jobs are currently available. Please check back later.
              </p>
            ) : (
              <>
                <JobsContainer>
                  {jobs.map((job) => (
                    <JobCard key={job._id}>
                      <JobTitle>{job.title}</JobTitle>
                      <JobDescription>{job.description}</JobDescription>
                      <Button onClick={() => navigate(`/employer/job_details/${job._id}`)}>Review Applicants</Button>
                    </JobCard>
                  ))}
                </JobsContainer>
                <PaginationContainer>
                  {[...Array(Math.ceil(totalJobs / jobsPerPage)).keys()].map((number) => (
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
          </>
        )}
      </PageContainer>
    </>
  );
};

export default EmployerDashboard;
