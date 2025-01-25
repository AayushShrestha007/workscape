import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import styled from "styled-components";
import { verifyUserEmailApi } from "../../../apis/Api";

const VerificationContainer = styled.div`
  max-width: 400px;
  margin: 50px auto;
  padding: 20px;
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: center;
`;

const Title = styled.h2`
  color: #333;
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  background-color: #2d69b3;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #244a81;
  }
`;

const ApplicantEmailVerification = () => {
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const navigate = useNavigate();

    const handleVerification = async (e) => {
        e.preventDefault();

        try {
            const response = await verifyUserEmailApi({ email, otp });
            if (response.data.success) {
                toast.success(response.data.message);
                setTimeout(() => {
                    navigate("/login"); // Redirect to login page on success
                }, 2000);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error("Verification Error:", error);
            toast.error(error.response?.data?.message || "Failed to verify email.");
        }
    };

    return (
        <VerificationContainer>
            <ToastContainer />
            <Title>Email Verification</Title>
            <form onSubmit={handleVerification}>
                <Input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <Input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                />
                <Button type="submit">Verify Email</Button>
            </form>
        </VerificationContainer>
    );
};

export default ApplicantEmailVerification;
