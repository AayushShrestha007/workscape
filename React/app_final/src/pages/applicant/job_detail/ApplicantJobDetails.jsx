import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { applyToJobApi, getAllResumesApi, getJobDetailsByIdApi } from '../../../apis/Api';
import ApplicantNavbar from '../../../components/ApplicantNavbar';
import Loader from '../../../components/Loader';
import ResumeSelectionDialog from '../../../components/ResumeSelectionDialog';

const PageContainer = styled.div`
  padding: 20px;
  background-color: white;
  min-height: calc(100vh - 60px);  // Assuming the navbar is 60px high
`;

const JobContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: #f0f2f5;
  border-radius: 8px;
  box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
`;

const JobHeader = styled.div`
  display: flex;
  align-items: center;
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
  font-size: 24px;
  color: #65A168;  // Green color for the job title
  margin: 0;
`;

const EmployerName = styled.h3`
  font-size: 20px;
  color: #333;
  margin: 0;
`;

const JobDescription = styled.p`
  font-size: 16px;
  color: #666;
  margin-top: 20px;
`;

const JobDetailTitle = styled.span`
  font-weight: bold;
`;

const JobDetail = styled.p`
  font-size: 16px;
  color: #333;
  margin-top: 10px;
`;

const Button = styled.button`
  background-color: #2d69b3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 40px;  // Rounded corners
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
`;

const ApplicantJobDetails = () => {
  const { state } = useLocation();
  const { id } = useParams();
  const [job, setJob] = useState(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showDialog, setShowDialog] = useState(false);
  const [resumes, setResumes] = useState([]);
  const [selectedResumeId, setSelectedResumeId] = useState(null);

  useEffect(() => {
    setLoading(true);
    getJobDetailsByIdApi(id).then((res) => {
      setJob(res.data.job);
      setLoading(false);
    }).catch((error) => {
      console.log(error);
      setLoading(false);
    });
  }, [id]);

  useEffect(() => {
    // Fetch the user's resumes
    getAllResumesApi(1, 10).then((res) => {
      setResumes(res.data.resumes);
    }).catch((error) => {
      console.log(error);
    });
  }, []);

  const handleApply = (resumeId) => {
    applyToJobApi({ jobId: id, resumeId }).then((res) => {
      if (res.data.success) {
        toast.success('Application submitted successfully');
        navigate('/applicant/dashboard'); // Redirect to dashboard or any other page
      } else {
        toast.error(res.data.message);
      }
    }).catch((error) => {
      toast.error('Error submitting application');
      console.log(error);
    });
  };

  const handleOpenDialog = () => {
    setShowDialog(true);
  };

  const handleCloseDialog = () => {
    setShowDialog(false);
  };

  const handleSelectResume = (resumeId) => {
    setSelectedResumeId(resumeId);
    handleApply(resumeId);
    handleCloseDialog();
  };

  return (
    <>
      <ApplicantNavbar />
      <PageContainer>
        {loading ? <Loader /> : (
          <JobContainer>
            <JobHeader>
              <EmployerImage src={`http://localhost:5500/employerImage/${job.employer.employerImage}`} alt="Employer" />
              <JobDetails>
                <JobTitle>{job.title}</JobTitle>
                <EmployerName>{job.employer.organizationName}</EmployerName>
              </JobDetails>
            </JobHeader>
            <JobDescription>{job.description}</JobDescription>
            <JobDetail><JobDetailTitle>Work Type:</JobDetailTitle> {job.workType}</JobDetail>
            <JobDetail><JobDetailTitle>Skills:</JobDetailTitle> {job.skills}</JobDetail>
            <JobDetail><JobDetailTitle>Qualification:</JobDetailTitle> {job.qualification}</JobDetail>
            {!state?.alreadyApplied && (
              <Button onClick={handleOpenDialog}>Apply Now</Button>
            )}
          </JobContainer>
        )}
        <ResumeSelectionDialog show={showDialog} resumes={resumes} onClose={handleCloseDialog} onSelectResume={handleSelectResume} />
      </PageContainer>
    </>
  );
}

export default ApplicantJobDetails;
