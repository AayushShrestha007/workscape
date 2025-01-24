import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { updateEmployerProfile } from '../../../apis/Api';
import EmployerNavbar from "../../../components/EmployerNavbar";

const FormContainer = styled.div`
  max-width: 500px;
  margin: 20px auto;
  padding: 20px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
`;

const Label = styled.label`
  margin-bottom: 5px;
  font-weight: bold;
  color: #333;
`;

const Input = styled.input`
  padding: 8px 10px;
  margin-bottom: 20px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const FileInput = styled.input`
  display: none;
`;

const ImageWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
`;

const ProfileImage = styled.img`
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
`;

const ProfileIcon = styled(FaUserCircle)`
  font-size: 150px;
  color: #ccc;
`;

const Button = styled.button`
  padding: 10px;
  background-color: #2d69b3;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    background-color: #0a6b00;
  }
`;

const UpdateEmployerProfile = () => {
    const [organizationName, setOrganizationName] = useState('');
    const [organizationAddress, setOrganizationAddress] = useState('');
    const [email, setEmail] = useState('');
    const [phone, setPhone] = useState('');
    const [password, setPassword] = useState('');
    const [employerImage, setEmployerImage] = useState(null);
    const [previewImage, setPreviewImage] = useState(null);

    const [organizationNameError, setOrganizationNameError] = useState('');
    const [organizationAddressError, setOrganizationAddressError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [phoneError, setPhoneError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [employerImageError, setEmployerImageError] = useState('');

    const navigate = useNavigate();

    useEffect(() => {
        // Fetch employer data from localStorage
        const employer = JSON.parse(localStorage.getItem('employer')).findemployer;
        if (employer) {
            setOrganizationName(employer.organizationName || '');
            setOrganizationAddress(employer.organizationAddress || '');
            setEmail(employer.email || '');
            setPhone(employer.phone || '');
            setPreviewImage(`http://localhost:5500/employerImage/${employer.employerImage}`);
        }
    }, []);

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            setEmployerImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleIconClick = () => {
        document.getElementById('employerImage').click();
    };

    const validate = () => {
        let isValid = true;

        if (organizationName.trim() === '') {
            setOrganizationNameError('Organization name is required');
            isValid = false;
        } else {
            setOrganizationNameError('');
        }

        if (organizationAddress.trim() === '') {
            setOrganizationAddressError('Organization address is required');
            isValid = false;
        } else {
            setOrganizationAddressError('');
        }

        if (!email || email.trim() === '' || !email.includes('@')) {
            setEmailError('Valid email is required');
            isValid = false;
        } else {
            setEmailError('');
        }

        if (phone.trim() === '') {
            setPhoneError('Phone is required');
            isValid = false;
        } else {
            setPhoneError('');
        }

        if (password.trim() === '') {
            setPasswordError('Password is required');
            isValid = false;
        } else {
            setPasswordError('');
        }

        if (employerImage === null && !previewImage) {
            setEmployerImageError('Profile image is required');
            isValid = false;
        } else {
            setEmployerImageError('');
        }

        return isValid;
    };

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


    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        // Fetch employerId from localStorage
        const employer = JSON.parse(localStorage.getItem('employer')).findemployer;
        const employerId = employer._id;

        const passwordValidationError = validatePassword(password);
        if (passwordValidationError) {
            setPasswordError(passwordValidationError)
            return
        } else {

        }

        const formData = new FormData();
        formData.append('organizationName', organizationName);
        formData.append('organizationAddress', organizationAddress);
        formData.append('email', email);
        formData.append('phone', phone);
        formData.append('password', password);
        if (employerImage) {
            formData.append('employerImage', employerImage);
        }

        try {
            const response = await updateEmployerProfile(employerId, formData);
            if (response.data.success) {
                // Update localStorage with the updated employer data
                const updatedEmployer = { ...employer, organizationName, organizationAddress, email, phone, employerImage: response.data.employer.employerImage };
                localStorage.setItem('employer', JSON.stringify({ findemployer: updatedEmployer }));
                toast.success('Profile updated successfully');
                setTimeout(() => {
                    navigate('/employer/dashboard');
                }, 1000);
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Error updating profile');
        }
    };

    return (
        <>
            <EmployerNavbar />
            <FormContainer>
                <Form onSubmit={handleSubmit}>
                    <ImageWrapper onClick={handleIconClick}>
                        {previewImage ? (
                            <ProfileImage src={previewImage} alt="Profile Preview" />
                        ) : (
                            <ProfileIcon />
                        )}
                        <FileInput
                            type="file"
                            id="employerImage"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                        {employerImageError && <p className='text-danger'>{employerImageError}</p>}
                    </ImageWrapper>

                    <Label htmlFor="organizationName">Organization Name</Label>
                    <Input
                        id="organizationName"
                        type="text"
                        value={organizationName}
                        onChange={(e) => setOrganizationName(e.target.value)}
                        placeholder="Enter your organization name"
                    />
                    {organizationNameError && <p className='text-danger'>{organizationNameError}</p>}

                    <Label htmlFor="organizationAddress">Organization Address</Label>
                    <Input
                        id="organizationAddress"
                        type="text"
                        value={organizationAddress}
                        onChange={(e) => setOrganizationAddress(e.target.value)}
                        placeholder="Enter your organization address"
                    />
                    {organizationAddressError && <p className='text-danger'>{organizationAddressError}</p>}

                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                    />
                    {emailError && <p className='text-danger'>{emailError}</p>}

                    <Label htmlFor="phone">Phone</Label>
                    <Input
                        id="phone"
                        type="text"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="Enter your phone number"
                    />
                    {phoneError && <p className='text-danger'>{phoneError}</p>}

                    <Label htmlFor="password">Password</Label>
                    <Input
                        id="password"
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="Enter a new password"
                    />
                    {passwordError && <p className='text-danger'>{passwordError}</p>}

                    <Button type="submit">Update Profile</Button>
                </Form>
            </FormContainer>
            <ToastContainer />
        </>
    );
};

export default UpdateEmployerProfile;
