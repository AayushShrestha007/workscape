import React, { useState } from 'react';
import styled from 'styled-components';
import { updateApplicationStatusApi } from '../apis/Api';

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const Card = styled.div`
  background-color: #c4e1c0;
  border: 1px solid #ccc;
  border-radius: 10px; // Slightly rounded borders
  padding: 20px;
  display: flex;
  flex-direction: column;
`;

const JobName = styled.h3`
  margin: 0;
  color: #333;
  
`;

const ApplicantName = styled.p`
  margin: 5px 0;
  color: #666;
`;

const ActionsContainer = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
  align-items: center;
`;

const ViewResume = styled.span`
  color: #2d69b3;
  cursor: pointer;
  text-decoration: underline;
`;

const StatusDropdown = styled.select`
  margin-bottom: 10px;
  border-radius: 5px;
`;

const ApplicationCard = ({ application, fetchApplications }) => {
  const [status, setStatus] = useState(application.status);

  const handleStatusChange = async (e) => {
    const newStatus = e.target.value;
    setStatus(newStatus);

    try {
      await updateApplicationStatusApi({
        applicationId: application._id,
        status: newStatus
      });
      fetchApplications(); // Fetch the updated list of applications
    } catch (error) {
      console.error('Error updating status:', error);
      // Handle error (e.g., show a toast notification)
    }
  };

  return (
    <Card>
      <JobName>{application.job.title}</JobName>
      <ApplicantName>Applicant: {application.applicant.name}</ApplicantName>
      <ActionsContainer>
        <StatusDropdown value={status} onChange={handleStatusChange}>
          <option value="shortlisted">Short Listed</option>
          <option value="job-offered">Job Offered</option>
          <option value="rejected">Rejected</option>
        </StatusDropdown>
        <ViewResume onClick={() => window.open(`http://localhost:5500${application.resume.fileUrl}`, '_blank')}>
          View Resume &gt;
        </ViewResume>
      </ActionsContainer>
    </Card>
  );
};



export default ApplicationCard;
