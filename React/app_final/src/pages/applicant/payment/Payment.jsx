import React, { useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { initiatePayment } from '../../../apis/Api';

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: white;
`;

const PaymentContainer = styled.div`
  max-width: 600px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #333;
  margin-bottom: 10px;
`;

const PremiumLogo = styled.img`
  width: 300px;
  height: 200px;
  object-fit: contain;
  margin: 20px 0;
`;

const AmountText = styled.p`
  font-size: 20px;
  color: #65A168;
  margin-bottom: 20px;
`;

const PurchaseButton = styled.button`
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

  &:disabled {
    background-color: #ccc;
    cursor: not-allowed;
  }
`;

const ErrorMessage = styled.p`
  color: red;
  margin-top: 10px;
`;

const PremiumUpgradePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handlePurchase = async () => {
    setLoading(true);
    setError(null);
    try {
      const paymentData = {
        amount: 2000,
        website_url: window.location.origin,
      };

      const response = await initiatePayment(paymentData);

      if (response?.data?.success && response?.data?.pidx) {
        window.location.href = `https://test-pay.khalti.com/?pidx=${response.data.pidx}`;
      } else {
        throw new Error(response?.data?.message || 'Payment initiation failed');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ToastContainer />
      <PageContainer>
        <PaymentContainer>
          <Title>Upgrade to Premium</Title>
          <PremiumLogo src="/assets/images/premium.png" alt="Premium Logo" />
          <AmountText>Amount: Rs 2000</AmountText>
          <PurchaseButton onClick={handlePurchase} disabled={loading}>
            {loading ? 'Processing...' : 'Purchase Now'}
          </PurchaseButton>
          {error && <ErrorMessage>{error}</ErrorMessage>}
        </PaymentContainer>
      </PageContainer>
    </>
  );
};

export default PremiumUpgradePage;
