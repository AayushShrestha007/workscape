import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Switch from "react-switch";
import { toast } from "react-toastify";
import styled from "styled-components";
import { loginEmployerApi, loginUserApi } from "../../../apis/Api";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #f0f2f5;
`;

const LoginFormWrapper = styled.div`
  display: flex;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const ImageWrapper = styled.div`
  display: none;
  @media (min-width: 768px) {
    display: block;
    background-color: #2d69b3;
    border-top-left-radius: 10px;
    border-bottom-left-radius: 10px;
  }
`;

const LoginForm = styled.div`
  width: 300px;
  padding: 40px;
  text-align: center;
`;

const Image = styled.img`
  width: 300px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`;

const SwitchContainer = styled.div`
  margin: 10px 0; // Same vertical margin as Input
  display: flex;
  align-items: center;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
`;

const Input = styled.input`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
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
  margin-top: 10px;
`;

const Text = styled.p`
  margin-top: 20px;
  font-size: 14px;
  color: #666;
`;

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEmployer, setIsEmployer] = useState(false); // Boolean state for the switch
  const [emailError, setEmailError] = useState("ayooshshrestha@gmail.com");
  const [passwordError, setPasswordError] = useState("123456!!!@@@!!ABCc");
  const navigate = useNavigate();

  // Validation
  const validate = () => {
    let isValid = true;

    if (email.trim() === "" || !email.includes("@")) {
      setEmailError("Email is required");
      isValid = false;
    }

    if (password.trim() === "") {
      setPasswordError("Password is required");
      isValid = false;
    }

    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Call the validator
    const isValidated = validate();
    if (!isValidated) return;

    const data = { email, password };

    // Determine API endpoint based on the toggle state
    const apiEndpoint = isEmployer ? loginEmployerApi : loginUserApi;

    apiEndpoint(data)
      .then((res) => {
        if (!res.data.success) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);

          // Navigate to OTP verification page based on user type
          navigate(isEmployer ? "/employer/verify-otp" : "/applicant/verify-otp", {
            state: { email }, // Pass email for OTP verification
          });
        }
      })
      .catch((error) => {
        if (error.response && error.response.status === 429) {
          toast.error(error.response.data.message || "Too many login attempts. Please try again later.");
        } else if (error.response.status === 401) {
          toast.error(error.response.data.message || "Email not verified.");
        } else if (error.response && error.response.status === 403) {
          // Password expired case
          toast.error("Your password has expired. Please update it.");
          // navigate("/update-password"); // Redirect to a password update page
        } else {
          toast.error("An error occurred. Please try again.");
          console.error("Login Error:", error);
        }
      });
  };

  return (
    <Container>
      <LoginFormWrapper>
        <ImageWrapper>
          <Image src="/assets/images/login_image.png" alt="Login" />
        </ImageWrapper>
        <LoginForm>
          <Title>Login To WorkScape</Title>
          <Input
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          {emailError && <p className="text-danger">{emailError}</p>}
          <Input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          {passwordError && <p className="text-danger">{passwordError}</p>}
          <SwitchContainer>
            <label>
              <Switch
                onChange={setIsEmployer}
                checked={isEmployer}
                offColor="#888"
                onColor="#2d69b3"
                checkedIcon={false}
                uncheckedIcon={false}
                height={20}
                width={48}
              />
              <span style={{ marginLeft: 10 }}>{isEmployer ? "Employer" : "Applicant"}</span>
            </label>
          </SwitchContainer>
          <Button onClick={handleSubmit}>Login</Button>
          <Text>
            Don’t Have An Account?{" "}
            <Link to={isEmployer ? "/employer/register" : "/applicant/register"}>Register</Link>
          </Text>
        </LoginForm>
      </LoginFormWrapper>
    </Container>
  );
};

export default LoginPage;
