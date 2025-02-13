
import DOMPurify from 'dompurify';
import React, { useState } from 'react';
import { FaBriefcase, FaChartLine, FaCheck, FaPencilAlt } from 'react-icons/fa';
import { NavLink, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { logoutEmployerApi } from '../../src/apis/Api';


const EmployerName = styled.div`
    font-size: 20px;
    margin-right: 10px;
`;
const ProfileImage = styled.img`
    width: 40px; 
    height: 40px; 
    border-radius: 50%; // Makes the image round
    margin-left: 10px;
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
    padding: 0 35px; // Add padding to each icon
    color: #ccc; // Set the default color to grey
    text-decoration: none; // Remove underline from links

    &.active {
        color: #2d69b3; // Color for the active icon
    }
`;

const CompanyName = styled.div`
    font-size: 20px;
`;

const Divider = styled.hr`
    border: none;
    border-top: 1px solid #DDDDDD;
    margin: 0;
`;
const Navbar = () => {

    const [dropdownOpen, setDropdownOpen] = useState(false);

    const navigate = useNavigate();

    const employer = JSON.parse(localStorage.getItem('employer')).findemployer

    // Sanitize user-provided data
    const sanitizedEmployerName = DOMPurify.sanitize(employer.organizationName || "Employer");
    const sanitizedProfileImage = DOMPurify.sanitize(employer.employerImage || "default.png");

    const toggleDropdown = () => setDropdownOpen(!dropdownOpen);

    const handleLogout = async () => {
        try {
            // Call the logout API
            const response = await logoutEmployerApi();

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
        localStorage.removeItem('employer');
        localStorage.removeItem('token');
        navigate('/login');
    };


    return (
        <>
            <NavbarContainer>
                <Logo src="/assets/images/workscape.png" alt="Logo" />
                <NavIcons>
                    <Icon to="/employer/dashboard" activeClassName="active">
                        <FaBriefcase title="Jobs" />
                    </Icon>
                    <Icon to="/employer/hiring_progress" activeClassName="active">
                        <FaChartLine title="Progress" />
                    </Icon>
                    <Icon to="/employer/create_job" activeClassName="active">
                        <FaPencilAlt title="Create Job" />
                    </Icon>
                    <Icon to="/employer/hired_jobs" activeClassName="active">
                        <FaCheck title="Open Job" />
                    </Icon>
                </NavIcons>
                <NameAndImageContainer onClick={toggleDropdown}>
                    <EmployerName>{sanitizedEmployerName || "name"}</EmployerName>
                    <ProfileImage src={`https://localhost:5500/employerImage/${sanitizedProfileImage}`} alt="Profile" />
                    {dropdownOpen && (
                        <DropdownMenu>
                            <NavLink to="/employer/update_profile">Edit Profile</NavLink>
                            <NavLink to="/employer/completed_jobs">Complete Jobs</NavLink>
                            <a href="" onClick={handleLogout}>Logout</a>
                        </DropdownMenu>
                    )}
                </NameAndImageContainer>
            </NavbarContainer>
            <Divider />
        </>
    );
};

export default Navbar;
