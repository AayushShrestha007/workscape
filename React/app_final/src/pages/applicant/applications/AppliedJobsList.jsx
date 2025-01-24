import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getUserAppliedJobsApi } from '../../../apis/Api';
import ApplicantNavbar from '../../../components/ApplicantNavbar';
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

const JobStatus = styled.p`
  font-size: 14px;
  color: #333;
  margin-top: 10px;
  font-weight: bold;
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

const AppliedJobsList = () => {
    const [appliedJobs, setAppliedJobs] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [applicationsPerPage] = useState(3);
    const [totalApplications, setTotalApplications] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppliedJobs(currentPage);
    }, [currentPage]);

    const fetchAppliedJobs = async (page) => {
        try {
            setLoading(true);
            const res = await getUserAppliedJobsApi(page, applicationsPerPage);
            setAppliedJobs(res.data.applications);
            setTotalApplications(res.data.totalApplications);
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
                <Title>Jobs You've Applied For</Title>
                {loading ? <Loader /> : (
                    <>
                        <JobsContainer>
                            {appliedJobs.length === 0 ? (
                                <p>No jobs applied for yet.</p>
                            ) : (
                                appliedJobs.map(application => (
                                    <JobCard key={application._id}>
                                        <JobHeader>
                                            {application.job.employer && (
                                                <EmployerImage
                                                    src={`http://localhost:5500/employerImage/${application.job.employer.employerImage}`}
                                                    alt="Employer"
                                                />
                                            )}
                                            <JobDetails>
                                                <JobTitle>{application.job.title}</JobTitle>
                                                {application.job.employer && (
                                                    <EmployerName>{application.job.employer.organizationName}</EmployerName>
                                                )}
                                            </JobDetails>
                                        </JobHeader>
                                        <JobDescription>{application.job.description}</JobDescription>
                                        <JobStatus>Status: {application.status}</JobStatus>
                                    </JobCard>
                                ))
                            )}
                        </JobsContainer>
                        <PaginationContainer>
                            {[...Array(Math.ceil(totalApplications / applicationsPerPage)).keys()].map(number => (
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

export default AppliedJobsList;
