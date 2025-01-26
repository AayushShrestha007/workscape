import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import styled from "styled-components";
import { loginUserApi } from "../../../apis/Api";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const LoginFormWrapper = styled.div`
  width: 400px;
  padding: 30px;
  background: #fff;
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
  margin-bottom: 15px;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Button = styled.button`
  width: 100%;
  padding: 10px;
  border: none;
  border-radius: 5px;
  background-color: #2d69b3;
  color: white;
  font-size: 16px;
  cursor: pointer;

  &:hover {
    background-color: #244a81;
  }
`;

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const validate = () => {
        let isValid = true;
        if (!email.trim() || !email.includes("@")) {
            toast.error("Please enter a valid email.");
            isValid = false;
        }
        if (!password.trim()) {
            toast.error("Password is required.");
            isValid = false;
        }
        return isValid;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        const data = { email, password };

        try {
            const res = await loginUserApi(data);
            if (!res.data.success) {
                toast.error(res.data.message);
            } else {
                toast.success(res.data.message);

                // Redirect to Admin OTP Verification
                navigate("/admin/verify-otp", { state: { email } });
            }
        } catch (error) {
            if (error.response && error.response.status === 429) {
                toast.error(error.response.data.message || "Too many login attempts. Please try again later.");
            } else if (error.response.status === 401) {
                toast.error(error.response.data.message || "Email not verified.");
            } else if (error.response && error.response.status === 403) {
                toast.error("Your password has expired. Please update it.");
            } else {
                toast.error("An error occurred. Please try again.");
                console.error("Login Error:", error);
            }
        }
    };

    return (
        <Container>
            <LoginFormWrapper>
                <Title>Admin Login</Title>
                <form onSubmit={handleSubmit}>
                    <Input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <Input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <Button type="submit">Login</Button>
                </form>
            </LoginFormWrapper>
        </Container>
    );
};

export default Login;
