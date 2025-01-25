

import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa'; // Importing a user profile icon
import PasswordStrengthBar from "react-password-strength-bar";
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { registerEmployerApi } from '../../../apis/Api';

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: #fff;
`;

const RegisterFormWrapper = styled.div`
  display: flex;
  background: #fff;
  border-radius: 10px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;
const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;  // Change direction to column to stack vertically
  justify-content: center;
  align-items: center;
  background-color: #2d69b3;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
  padding: 20px;
  min-width: 350px;  
  max-width: 350px; 
  max-height: 850px;  
  cursor: pointer;
`;

const ProfileImage = styled.img`
  max-width: 150px;  
  max-height: 150px; 
  width: 100%;       
  height: auto;      
  border-radius: 50%;  
  object-fit: cover; 
`;

const RegisterForm = styled.div`
  width: 350px;
  padding: 40px;
  text-align: center;
`;

const Image = styled.img`
  width: 300px;
  border-top-left-radius: 10px;
  border-bottom-left-radius: 10px;
`;

const Title = styled.h2`
  margin-bottom: 20px;
  font-size: 24px;
  color: #333;
`;

const ProfileIcon = styled(FaUserCircle)`
  font-size: 120px;
  color: #fff;
  
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

const LoginLink = styled(Link)`
  color: #007bff;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const RegisterPage = () => {



    //make a useState for 5 fields
    const [organizationName, setOrganizationName] = useState('')
    const [organizationAddress, setOrganizationAddress] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [profileImage, setProfileImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    //use state for error message
    const [organizationNameError, setOrganizationNameError] = useState('')
    const [organizationAddressError, setOrganizationAddressError] = useState('')
    const [emailError, setEmailError] = useState('')
    const [phoneError, setPhoneError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [profileImageError, setProfileImageError] = useState('')
    const [confirmPasswordError, setConfirmPasswordError] = useState('')

    const navigate = useNavigate()



    //validation
    var validate = () => {
        var isValid = true;

        //validate the organization Name
        if (organizationName.trim() === "") {
            setOrganizationNameError("Organization Name is required")
            isValid = false;
        }

        if (organizationAddress.trim() === "") {
            setOrganizationAddressError("Organization Address is required")
            isValid = false;
        }

        if (email.trim() === '' || !email.includes('@')) {
            setEmailError("Email is required")
            isValid = false;
        }

        if (phone.trim() === "") {
            setPhoneError("Phone is required")
            isValid = false;
        }

        if (password.trim() === "") {
            setPasswordError("Password is required")
            isValid = false;
        }

        if (confirmPassword.trim() === "") {
            setConfirmPasswordError("Confirm Password is required")
            isValid = false;
        }

        if (confirmPassword.trim() !== password.trim()) {
            setConfirmPasswordError("Password and confirmation password don't match")
            isValid = false;
        }

        if (profileImage === null) {
            setProfileImageError("Profile image is required")
            isValid = false;
        }


        return isValid;


    }

    const validatePassword = (password) => {
        const minLength = 8;
        const maxLength = 20;

        if (password.length < minLength || password.length > maxLength) {
            return `Password must be between ${minLength} and ${maxLength} characters.`;
        }

        const uppercaseRegex = /[A-Z]/;
        const lowercaseRegex = /[a-z]/;
        const numberRegex = /[0-9]/;
        const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

        if (!uppercaseRegex.test(password)) {
            return "Password must include at least one uppercase letter.";
        }
        if (!lowercaseRegex.test(password)) {
            return "Password must include at least one lowercase letter.";
        }
        if (!numberRegex.test(password)) {
            return "Password must include at least one number.";
        }
        if (!specialCharRegex.test(password)) {
            return "Password must include at least one special character.";
        }

        return null;
    };


    //submit butoton function
    const handleSubmit = (e) => {
        e.preventDefault()

        //call the validator
        var isValidated = validate();
        if (!isValidated) {
            return
        }

        //call the password validator
        const passwordValidationError = validatePassword(password);
        if (passwordValidationError) {
            setPasswordError(passwordValidationError)
            return
        } else {

        }

        //make a form data (txt, file)
        const formData = new FormData();
        formData.append('organizationName', organizationName);
        formData.append('organizationAddress', organizationName);
        formData.append('phone', phone);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('employerImage', profileImage);

        //register user Api 
        registerEmployerApi(formData).then((res) => {

            //received data: success, message
            if (res.data.success === false) {
                toast.error(res.data.message)
            }
            else {
                toast.success(res.data.message)
                navigate('/employer/verify_email');

            }

        })


    }

    const handleImageChange = (event) => {
        if (event.target.files[0]) {
            setProfileImage(event.target.files[0]);
            setPreviewImage(URL.createObjectURL(event.target.files[0]));
        }
    };

    const handleIconClick = () => {
        document.getElementById('profileImage').click();
    };

    return (
        <Container>
            <RegisterFormWrapper>
                <ImageWrapper onClick={handleIconClick}>
                    {profileImage ?
                        <ProfileImage src={previewImage} alt="Profile Preview" />
                        : <ProfileIcon />}
                    <input type="file" id="profileImage" style={{ display: 'none' }} accept="image/*" onChange={handleImageChange} />
                    {
                        profileImageError && <p className='text-danger'>{profileImageError}</p>
                    }
                </ImageWrapper>
                <RegisterForm>
                    <Title>Register To WorkScape</Title>
                    <Input
                        type="text"
                        placeholder="Organization Name"
                        className="form-control"
                        onChange={(e) => setOrganizationName(e.target.value)}
                    />
                    {
                        organizationNameError && <p className='text-danger'>{organizationNameError}</p>
                    }
                    <Input
                        type="text"
                        placeholder="Organization Address"
                        className="form-control"
                        onChange={(e) => setOrganizationAddress(e.target.value)}
                    />
                    {
                        organizationAddressError && <p className='text-danger'>{organizationAddressError}</p>
                    }
                    <Input
                        type="text"
                        placeholder="Email Address"
                        className="form-control"
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    {
                        emailError && <p className='text-danger'>{emailError}</p>
                    }
                    <Input
                        type="text"
                        placeholder="Phone number"
                        className="form-control"
                        onChange={(e) => setPhone(e.target.value)}
                    />
                    {
                        phoneError && <p className='text-danger'>{phoneError}</p>
                    }
                    <Input
                        type="text"
                        placeholder="Password"
                        className="form-control"
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <PasswordStrengthBar password={password} />
                    {
                        passwordError && <p className='text-danger'>{passwordError}</p>
                    }
                    <Input
                        type="text"
                        placeholder="Confirm Password"
                        className="form-control"
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {
                        confirmPasswordError && <p className='text-danger'>{confirmPasswordError}</p>
                    }
                    <Button onClick={handleSubmit}>Register</Button>
                    <Text>
                        Already Have An Account? <LoginLink to="/login">Login here</LoginLink>
                    </Text>

                </RegisterForm>
            </RegisterFormWrapper>
        </Container>
    );
};

export default RegisterPage;

