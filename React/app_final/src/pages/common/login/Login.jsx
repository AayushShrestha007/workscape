import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Switch from 'react-switch';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { loginEmployerApi, loginUserApi } from '../../../apis/Api';
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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

// const RegisterLink = styled(Link)`
//   color: #007bff;
//   text-decoration: none;
//   &:hover {
//     text-decoration: underline;
//   }
// `;

const LoginPage = () => {

  //logic section

  //make a useState for 5 fields

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isEmployer, setIsEmployer] = useState(false); // Boolean state for the switch


  //use state for error message

  const [emailError, setEmailError] = useState('')
  const [passwordError, setPasswordError] = useState('')

  const navigate = useNavigate()


  //validation
  var validate = () => {
    var isValid = true;

    if (email.trim() === '' || !email.includes('@')) {
      setEmailError("Email is required")
      isValid = false;
    }

    if (password.trim() === '') {
      setPasswordError("Password is required")
      isValid = false;
    }

    return isValid
  }

  //login button function
  const handleSubmit = (e) => {
    e.preventDefault();

    // Call the validator
    const isValidated = validate();
    if (!isValidated) {
      return;
    }

    const data = {
      email: email,
      password: password,
    };

    // If the toggle is on Employer, employer API will be called and vice versa
    const apiEndpoint = isEmployer ? loginEmployerApi : loginUserApi;

    apiEndpoint(data)
      .then(async (res) => {
        if (res.data.success === false) {
          toast.error(res.data.message);
        } else {
          toast.success(res.data.message);

          // success-bool, message-text, token-text, user data-json object
          // setting token and user data in local storage
          localStorage.setItem("token", res.data.token);

          // setting user data
          const convertedData = JSON.stringify(
            isEmployer ? res.data.employerData : res.data.userData
          );

          // local storage set
          localStorage.setItem(isEmployer ? "employer" : "user", convertedData);


          navigate(isEmployer ? "/employer/dashboard" : "/applicant/dashboard");
        }
      })
      .catch((error) => {
        // Handle specific status codes
        if (error.response && error.response.status === 403) {
          // Password expired case
          toast.error("Your password has expired. Please update it.");
          // navigate("/update-password"); // Redirect to a password update page
        } else {
          // General error case
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
            className='form-control'
            onChange={(e) => setEmail(e.target.value)}
          />
          {
            emailError && <p className='text-danger'>{emailError}</p>
          }
          <Input
            type="text"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            className='form-control'
          />
          {
            passwordError && <p className='text-danger'>{passwordError}</p>
          }
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
              <span style={{ marginLeft: 10 }}>{isEmployer ? 'Employer' : 'Applicant'}</span>
            </label>
          </SwitchContainer>

          <Button onClick={handleSubmit}>Login</Button>
          <Text>
            Don’t Have An Account?
            <Link to={isEmployer ? '/employer/register' : '/applicant/register'} > Register</Link>
          </Text>
        </LoginForm>
      </LoginFormWrapper>
    </Container>
  );
};

export default LoginPage;
