import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';
import { getAllResumesApi } from '../../../apis/Api'; // Ensure this path matches your project structure
import ApplicantNavbar from "../../../components/ApplicantNavbar";
import Loader from '../../../components/Loader';

const PageContainer = styled.div`
  padding: 20px;
  background-color: white;
  min-height: calc(100vh - 60px);  // Assuming the navbar is 60px high
`;

const ResumesContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
`;

const ResumeCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  border-bottom: 1px solid #ccc;
  &:last-child {
    border-bottom: none;
  }
`;

const ResumeTitle = styled.h2`
  font-size: 20px;
  color: #65A168;  // Green color for the resume title
  margin: 0;
`;

const Button = styled.button`
  background-color: #2d69b3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 40px;  // Rounded corners
  cursor: pointer;
  font-size: 16px;
  margin-top: 10px;
  align-self: flex-start;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #333;
  text-align: left;
  margin-bottom: 20px;
  margin-left: 34px;
`;

const FloatingButton = styled.button`
  position: fixed;
  bottom: 40px;
  right: 40px;
  background-color: #2d69b3;
  color: white;
  border: none;
  border-radius: 50%;
  width: 60px;
  height: 60px;
  font-size: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
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

const ResumeList = () => {
  const [resumes, setResumes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [resumesPerPage] = useState(5);
  const [totalResumes, setTotalResumes] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResumes(currentPage);
  }, [currentPage]);

  const fetchResumes = async (page) => {
    try {
      setLoading(true);
      const res = await getAllResumesApi(page, resumesPerPage);
      setResumes(res.data.resumes);
      setTotalResumes(res.data.totalResumes);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching resumes:', error);
      setLoading(false);
    }
  };

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleCreateResume = () => {
    navigate('/applicant/create_resume'); // Adjust the path based on your routing setup
  };

  return (
    <>
      <ApplicantNavbar />
      <PageContainer>
        <Title>Your Resumes</Title>
        {loading ? (
          <Loader />
        ) : resumes.length === 0 ? (
          <p>No Resumes Have Been Created</p>
        ) : (
          <>
            <ResumesContainer>
              {resumes.map(resume => (
                <ResumeCard key={resume._id}>
                  <ResumeTitle>{resume.resumeTitle}</ResumeTitle>
                  <Button onClick={() => window.open(`http://localhost:5500${resume.fileUrl}`, '_blank')}>View Resume</Button>
                </ResumeCard>
              ))}
            </ResumesContainer>
            <PaginationContainer>
              {[...Array(Math.ceil(totalResumes / resumesPerPage)).keys()].map(number => (
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
      <FloatingButton onClick={handleCreateResume}>+</FloatingButton>
    </>
  );
};

export default ResumeList;
