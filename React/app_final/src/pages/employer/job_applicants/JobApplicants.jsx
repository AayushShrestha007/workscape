import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { getApplicantsForJobApi, updateApplicationStatusApi } from '../../../apis/Api';
import EmployerNavbar from '../../../components/EmployerNavbar';
import Loader from '../../../components/Loader';

const PageContainer = styled.div`
  padding: 20px;
  padding-top: 30px;
  background-color: white;
  min-height: calc(100vh - 60px);  // Assuming the navbar is 60px high
`;

const ApplicantsContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  padding-top: 5px;
  background: white;
  border-radius: 8px;
`;

const ApplicantCard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  padding: 20px;
  border-bottom: 1px solid #ccc;
  &:last-child {
    border-bottom: none;
  }
  border-radius: 8px;
`;

const ApplicantHeader = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
`;

const ApplicantImage = styled.img`
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
`;

const ApplicantDetailsContainer = styled.div`
  margin-left: 20px;
`;

const ApplicantName = styled.h2`
  font-size: 20px;
  color: #65A168;  // Green color for the applicant name
  margin: 0;
`;

const ApplicantEmail = styled.p`
  font-size: 16px;
  color: #666;
  margin: 5px 0;
`;

const ButtonContainer = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const Button = styled.button`
  background-color: #3d96fd;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 40px;  // Rounded corners
  cursor: pointer;
  font-size: 16px;
  align-self: flex-start;
`;

const ShortListButton = styled(Button)`
  background-color: #2d69b3;  // Green color for the short list button
`;

const Title = styled.h1`
  font-size: 32px;
  color: #333;
  text-align: left;
  margin-bottom: 26px;
  margin-left: 34px;
`;

const JobApplicants = () => {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getApplicantsForJobApi(jobId).then((res) => {
      console.log('API response:', res.data);
      setApplicants(res.data.applicants);
      setLoading(false);
    }).catch((error) => {
      console.log('Error fetching applicants:', error);
      setLoading(false);
    });
  }, [jobId]);

  const handleShortList = async (applicationId) => {
    console.log('Shortlisting application ID:', applicationId);
    try {
      await updateApplicationStatusApi({
        applicationId,
        status: 'shortlisted'
      });
      toast.success('Applicant Shortlisted');
      // Fetch applicants again to update the list
      const res = await getApplicantsForJobApi(jobId);
      console.log('Updated applicants list:', res.data.applicants);
      setApplicants(res.data.applicants);
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const findApplication = (applicant, jobId) => {
    if (!applicant || !applicant.applications) {
      console.log('Applicant or applications not defined:', applicant);
      return null;
    }

    const application = applicant.applications.find(app => app.job.toString() === jobId);
    if (!application) {
      console.log('Application not found for applicant:', applicant.name);
      return null;
    }

    console.log('Found application for applicant:', applicant.name, 'Application:', application);
    return application
  };

  const getResumeUrl = (applicant, resumeId) => {
    const resume = applicant.resumes.find(resume => resume._id.toString() === resumeId.toString());
    return resume ? resume.fileUrl : null;
  };

  return (
    <>
      <EmployerNavbar />
      <ToastContainer />
      <PageContainer>
        <Title>Applicants</Title>
        {loading ? (
          <Loader />
        ) : (
          <ApplicantsContainer>
            {applicants.map(applicant => (
              <ApplicantCard key={applicant._id}>
                <ApplicantHeader>
                  <ApplicantImage src={`http://localhost:5500/userImage/${applicant.userImage}`} alt="Applicant" />
                  <ApplicantDetailsContainer>
                    <ApplicantName>{applicant.name}</ApplicantName>
                    <ApplicantEmail>{applicant.email}</ApplicantEmail>
                  </ApplicantDetailsContainer>
                </ApplicantHeader>
                <ButtonContainer>
                  <Button onClick={() => {
                    const applicationId = findApplication(applicant, jobId);
                    const resumeUrl = getResumeUrl(applicant, applicationId.resume);
                    window.open(`http://localhost:5500${resumeUrl}`, '_blank');
                  }}>
                    Review Resume
                  </Button>
                  <ShortListButton onClick={() => {
                    const applicationId = findApplication(applicant, jobId)._id;
                    if (applicationId) {
                      handleShortList(applicationId);
                    } else {
                      console.log('Application ID not found for applicant:', applicant.name);
                    }
                  }}>
                    Short List
                  </ShortListButton>
                </ButtonContainer>
              </ApplicantCard>
            ))}
          </ApplicantsContainer>
        )}
      </PageContainer>
    </>
  );
}

export default JobApplicants;
