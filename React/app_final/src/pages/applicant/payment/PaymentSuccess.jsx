import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f9f9f9;
  text-align: center;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #333;
  margin-bottom: 20px;
`;

const SuccessImage = styled.img`
  width: 250px;
  height: 250px;
  object-fit: contain;
  margin-bottom: 30px;
`;

const BackButton = styled.button`
  background-color: #007bff;
  color: white;
  font-size: 16px;
  font-weight: bold;
  padding: 10px 20px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #0056b3;
  }
`;

const PaymentSuccess = () => {
    const navigate = useNavigate();

    const handleBackToDashboard = () => {
        navigate('/applicant/dashboard');  // Replace with your actual dashboard route
    };

    return (
        <PageContainer>
            <Title>You have been upgraded to premium</Title>
            <SuccessImage src="/assets/images/success.png" alt="Payment Successful" />
            <BackButton onClick={handleBackToDashboard}>Go back to dashboard</BackButton>
        </PageContainer>
    );
};

export default PaymentSuccess;
