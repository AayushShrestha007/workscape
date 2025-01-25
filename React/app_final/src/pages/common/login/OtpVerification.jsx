import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { verifyEmployerOtpApi, verifyUserOtpApi } from "../../../apis/Api";

const PageContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f7f9fc;
`;

const FormContainer = styled.div`
  max-width: 400px;
  width: 100%;
  background-color: #fff;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  outline: none;
  &:focus {
    border-color: #2d69b3;
  }
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #2d69b3;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  cursor: pointer;
  &:hover {
    background-color: #1a4a8b;
  }
`;

const OtpVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const email = location.state?.email;
    const isEmployer = location.pathname.includes("employer");

    const handleOtpSubmit = async (e) => {
        e.preventDefault();

        const data = { email, otp };
        const apiEndpoint = isEmployer ? verifyEmployerOtpApi : verifyUserOtpApi;

        try {
            const response = await apiEndpoint(data);
            if (response.data.success) {
                toast.success(response.data.message);

                // Save token and redirect to dashboard
                localStorage.setItem("token", response.data.token);
                localStorage.setItem(
                    isEmployer ? "employer" : "user",
                    JSON.stringify(isEmployer ? response.data.employerData : response.data.userData)
                );

                navigate(isEmployer ? "/employer/dashboard" : "/applicant/dashboard");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            // Log the error for debugging
            console.error("Error during OTP verification:", error);

            // Display error toast
            toast.error(error.response?.data?.message || "Failed to verify OTP");
        }
    };

    return (
        <PageContainer>
            <FormContainer>
                <Title>OTP Verification</Title>
                <form onSubmit={handleOtpSubmit}>
                    <Input
                        type="text"
                        placeholder="Enter OTP"
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <Button type="submit">Verify</Button>
                </form>
            </FormContainer>
        </PageContainer>
    );
};

export default OtpVerification;
