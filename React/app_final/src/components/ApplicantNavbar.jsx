import DOMPurify from 'dompurify';
import React, { useState } from 'react';
import { FaAward, FaBriefcase, FaFileAlt, FaSearch } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { logoutUserApi } from '../../src/apis/Api';

const NavbarContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #FFFFFF;
    padding: 10px 20px;
    color: #333;
`;

const Logo = styled.img`
    height: 50px;
`;

const NavIcons = styled.div`
    display: flex;
`;

const Icon = styled(NavLink)`
    cursor: pointer;
    font-size: 20px;
    padding: 0 35px;
    color: #ccc; // Grey color for icons
    text-decoration: none;

    &.active {
        color: #2d69b3; // Green color for active icon
    }
`;

const ApplicantName = styled.div`
    font-size: 20px;
    margin-right: 10px;
`;

const ProfileImage = styled.img`
    width: 40px; 
    height: 40px; 
    border-radius: 50%; // Makes the image round
    margin-left: 10px;
`;

const Divider = styled.hr`
    border: none;
    border-top: 1px solid #DDDDDD;
    margin: 0;
`;

const NameAndImageContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 10px;  // This controls the space between the name and image directly
`;


const DropdownMenu = styled.div`
    position: absolute;
    right: 20px;
    top: 60px;
    background-color: #FFF;
    box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
    z-index: 1;
    width: 150px;
    border-radius: 5px;

    & > a {
        display: block;
        padding: 10px;
        color: #333;
        text-decoration: none;

        &:hover {
            background-color: #f2f2f2;
        }
    }
`;


const ApplicantNavbar = () => {

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navigate = useNavigate();

    const applicant = JSON.parse(localStorage.getItem('user')).findUser

    // Sanitize user-provided data
    const sanitizedApplicantName = DOMPurify.sanitize(applicant.name || "Guest");
    const sanitizedProfileImage = DOMPurify.sanitize(applicant.userImage || "default.png");

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleLogout = async () => {
        try {
            // Call the logout API
            const response = await logoutUserApi();

            if (response.status === 200) {
                // Successfully logged out from the server
                toast.success("user logged out");
            } else {
                // Handle unexpected API response
                toast.error('Failed to log out from the server.');
            }
        } catch (error) {
            console.error('Error during logout:', error);
            toast.error('Error logging out from the server.');
        }

        // Clear local storage and navigate to login
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <>
            <NavbarContainer>
                <Logo src="/assets/images/workscape.png" alt="Logo" />
                <NavIcons>
                    <Icon to="/applicant/dashboard"><FaSearch title="Jobs" /></Icon>
                    <Icon to="/applicant/applications"><FaBriefcase title="Applied" /></Icon>
                    <Icon to="/applicant/resume_list"><FaFileAlt title="Resume" /></Icon>
                    <Icon to="/applicant/offered_jobs"><FaAward title="Offer" /></Icon>
                </NavIcons>
                <NameAndImageContainer onClick={toggleDropdown}>
                    <ApplicantName>{sanitizedApplicantName || "name"}</ApplicantName>
                    <ProfileImage src={`https://localhost:5500/userImage/${sanitizedProfileImage}`} alt="Profile" />
                    {dropdownOpen && (
                        <DropdownMenu>
                            <NavLink to="/applicant/update_profile">Edit Profile</NavLink>
                            <NavLink to="/applicant/hired_jobs">Current Jobs</NavLink>
                            <NavLink to="/applicant/completed_jobs">Complete Jobs</NavLink>

                            <a href="" onClick={handleLogout}>Logout</a>
                        </DropdownMenu>
                    )}
                </NameAndImageContainer>
            </NavbarContainer>
            <Divider />
        </>
    );
};

export default ApplicantNavbar;
