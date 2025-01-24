import React, { useEffect, useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { getHiredApplicationsByEmployerApi, updateApplicationStatusApi } from '../../../apis/Api';
import EmployerNavbar from '../../../components/EmployerNavbar';
import Loader from '../../../components/Loader';

const PageContainer = styled.div`
  padding: 20px;
  background-color: white;
  min-height: calc(100vh - 60px);
`;

const ApplicationsContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
`;

const ApplicationHeader = styled.div`
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

const ApplicationDetailsContainer = styled.div`
  margin-left: 20px;
`;

const JobTitle = styled.h2`
  font-size: 20px;
  color: #65A168;
  margin: 0;
`;

const EmployerName = styled.p`
  font-size: 16px;
  color: #666;
  margin: 5px 0;
`;

const ApplicantName = styled.p`
  font-size: 16px;
  color: #333;
  margin: 5px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
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


const Title = styled.h1`
  font-size: 32px;
  color: #333;
  text-align: left;
  margin-bottom: 10px;
  margin-left: 32px;
`;

const NoJobsMessage = styled.div`
  text-align: center;
  font-size: 18px;
  color: #666;
  margin-top: 20px;
`;

const Breaker = styled.hr`
  width: 100%;
  border: 0;
  border-top: 1px solid #ccc;
  margin: 20px 0;
`;

const HiredJobsListOfEmployer = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    fetchApplications(currentPage);
  }, [currentPage]);

  const fetchApplications = async (page) => {
    setLoading(true);
    try {
      const res = await getHiredApplicationsByEmployerApi(page);
      setApplications(res.data.applications);
      setTotalPages(res.data.totalPages);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setLoading(false);
    }
  };

  const handleCompleteJob = async (applicationId) => {
    try {
      await updateApplicationStatusApi({
        applicationId,
        status: 'complete'
      });
      toast.success('Job marked as complete');
      fetchApplications(currentPage);
    } catch (error) {
      console.error('Error marking job as complete:', error);
      toast.error('Error marking job as complete');
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <>
      <EmployerNavbar />
      <ToastContainer />
      <PageContainer>
        <Title>Hired Jobs</Title>
        {loading ? (
          <Loader />
        ) : (
          <ApplicationsContainer>
            {applications.length === 0 ? (
              <NoJobsMessage>No Hired Jobs Yet</NoJobsMessage>
            ) : (
              applications.map((application, index) => (
                <React.Fragment key={application._id}>
                  <ApplicationHeader>
                    <EmployerImage src={`http://localhost:5500/employerImage/${application.job.employer.employerImage}`} alt="Employer" />
                    <ApplicationDetailsContainer>
                      <JobTitle>{application.job.title}</JobTitle>
                      <EmployerName>{application.job.employer.organizationName}</EmployerName>
                      <ApplicantName>Applicant Name: {application.applicant.name}</ApplicantName>
                    </ApplicationDetailsContainer>
                  </ApplicationHeader>
                  <ButtonContainer>
                    <Button onClick={() => handleCompleteJob(application._id)}>Job Complete</Button>
                  </ButtonContainer>
                  {index < applications.length - 1 && <Breaker />}
                </React.Fragment>
              ))
            )}
          </ApplicationsContainer>
        )}
        <PaginationContainer>
          {[...Array(totalPages).keys()].map(number => (
            <PageNumber
              key={number + 1}
              onClick={() => paginate(number + 1)}
              className={currentPage === number + 1 ? 'active' : ''}
            >
              {number + 1}
            </PageNumber>
          ))}
        </PaginationContainer>
      </PageContainer>
    </>
  );
};

export default HiredJobsListOfEmployer;
