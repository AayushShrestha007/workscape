import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styled from 'styled-components';
import { updateApplicantProfile } from '../../../apis/Api';
import ApplicantNavbar from "../../../components/ApplicantNavbar";

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

const UpdateApplicantProfile = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [profileImageError, setProfileImageError] = useState('');

  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data from localStorage
    const user = JSON.parse(localStorage.getItem('user')).findUser;
    if (user) {
      setName(user.name || '');
      setEmail(user.email || '');
      setPreviewImage(`http://localhost:5500/userImage/${user.userImage}`);
    }
  }, []);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleIconClick = () => {
    document.getElementById('profileImage').click();
  };

  const validate = () => {
    let isValid = true;

    if (name.trim() === '') {
      setNameError('Name is required');
      isValid = false;
    } else {
      setNameError('');
    }

    if (!email || email.trim() === '' || !email.includes('@')) {
      setEmailError('Valid email is required');
      isValid = false;
    } else {
      setEmailError('');
    }

    if (password.trim() === '') {
      setPasswordError('Password is required');
      isValid = false;
    } else {
      setPasswordError('');
    }

    if (profileImage === null && !previewImage) {
      setProfileImageError('Profile image is required');
      isValid = false;
    } else {
      setProfileImageError('');
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

    // Fetch userId from localStorage
    const user = JSON.parse(localStorage.getItem('user')).findUser;
    const userId = user._id;

    //call the password validator
    const passwordValidationError = validatePassword(password);
    if (passwordValidationError) {
      setPasswordError(passwordValidationError)
      return
    } else {

    }
    const formData = new FormData();
    formData.append('name', name);
    formData.append('email', email);
    formData.append('newPassword', password);
    if (profileImage) {
      formData.append('userImage', profileImage);
    }

    try {
      const response = await updateApplicantProfile(userId, formData);
      if (response.data.success) {
        // Update localStorage with the updated user data
        const updatedUser = { ...user, name, email, userImage: response.data.user.userImage };
        localStorage.setItem('user', JSON.stringify({ findUser: updatedUser }));
        toast.success('Profile updated successfully');
        setTimeout(() => {
          navigate('/applicant/dashboard');
        }, 1000); // Delay navigation to allow the toast to be shown
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error updating profile';
      toast.error(errorMessage); // Show the actual error message or a fallback
    }
  };

  return (
    <>
      <ApplicantNavbar />
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
              id="profileImage"
              accept="image/*"
              onChange={handleImageChange}
            />
            {profileImageError && <p className='text-danger'>{profileImageError}</p>}
          </ImageWrapper>

          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter your name"
          />
          {nameError && <p className='text-danger'>{nameError}</p>}

          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
          />
          {emailError && <p className='text-danger'>{emailError}</p>}

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

export default UpdateApplicantProfile;
