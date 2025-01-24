import React from 'react';
import styled from 'styled-components';

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
`;

const DialogContainer = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 400px;
  max-height: 80%;
  overflow-y: auto;
  position: relative;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 20px;
  position: absolute;
  top: 10px;
  right: 10px;
  cursor: pointer;
`;

const ApplyButton = styled.button`
  background-color: #2d69b3;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 40px;
  cursor: pointer;
  font-size: 16px;
  margin-top: 20px;
  ${(props) =>
    props.disabled &&
    `
    background-color: #ccc;
    cursor: not-allowed;
  `}
`;

const ResumeSelectionDialog = ({ show, resumes, onClose, onSelectResume }) => {
  const [selectedResumeId, setSelectedResumeId] = React.useState(null);

  const handleApplyClick = () => {
    if (selectedResumeId) {
      onSelectResume(selectedResumeId);
    } else {
      alert('Please select a resume');
    }
  };

  if (!show) {
    return null;
  }

  return (
    <Overlay>
      <DialogContainer>
        <CloseButton onClick={onClose}>×</CloseButton>
        <h3>Select a Resume</h3>
        {resumes.length === 0 ? (
          <p>No resume created yet</p>
        ) : (
          resumes.map(resume => (
            <div key={resume._id}>
              <input
                type="radio"
                id={resume._id}
                name="resume"
                value={resume._id}
                onChange={() => setSelectedResumeId(resume._id)}
              />
              <label htmlFor={resume._id}>{resume.resumeTitle}</label>
            </div>
          ))
        )}
        <ApplyButton onClick={handleApplyClick} disabled={resumes.length === 0}>
          Apply
        </ApplyButton>
      </DialogContainer>
    </Overlay>
  );
};

export default ResumeSelectionDialog;
