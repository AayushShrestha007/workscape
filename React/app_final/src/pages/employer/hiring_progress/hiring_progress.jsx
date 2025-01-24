import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { getApplicationsByEmployerApi } from '../../../apis/Api';
import ApplicationCard from '../../../components/ApplicationCard';
import EmployerNavbar from '../../../components/EmployerNavbar';
import Loader from '../../../components/Loader';

const PageContainer = styled.div`
  padding: 20px;
  background-color: white;
  min-height: calc(100vh - 60px);  // Assuming the navbar is 60px high
`;

const ApplicationsContainer = styled.div`
  max-width: 1600px;
  margin: 0 auto;
  padding: 20px;
  background: white;
  border-radius: 8px;
`;

const Title = styled.h1`
  font-size: 32px;
  color: #333;
  text-align: center;
  margin-bottom: 30px;
  margin-left: 32px;
`;


const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 20px;
`;

const PageNumber = styled.button`
  background: none;
  border: none;
  padding: 5px 10px;
  cursor: pointer;
  color: #333;
  font-size: 16px;

  &:hover {
    text-decoration: underline;
  }

  &.active {
    font-weight: bold;
    text-decoration: underline;
  }
    
`;

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
`;

const EmployerApplications = () => {
    const [applications, setApplications] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [applicationsPerPage] = useState(4);
    const [totalApplications, setTotalApplications] = useState(0);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchApplications(currentPage);
    }, [currentPage]);

    const fetchApplications = async (page) => {
        try {
            setLoading(true);
            const res = await getApplicationsByEmployerApi(page, applicationsPerPage);
            setApplications(res.data.applications);
            setTotalApplications(res.data.totalApplications);
            setLoading(false);
        } catch (error) {
            console.log(error);
            setLoading(false);
        }
    };

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <>
            <EmployerNavbar />
            <PageContainer>
                <Title>Track Your Hiring Progress</Title>
                {loading ? <Loader /> : (
                    <>
                        <GridContainer>
                            {applications.length === 0 ? (
                                <p>No applications found.</p>
                            ) : (
                                applications.map(application => (
                                    <ApplicationCard
                                        key={application._id}
                                        application={application}
                                        fetchApplications={() => fetchApplications(currentPage)}
                                    />
                                ))
                            )}
                        </GridContainer>
                        <PaginationContainer>
                            {[...Array(Math.ceil(totalApplications / applicationsPerPage)).keys()].map(number => (
                                <PageNumber
                                    key={number + 1}
                                    onClick={() => paginate(number + 1)}
                                    className={currentPage === number + 1 ? 'active' : ''}
                                >
                                    {number + 1}
                                </PageNumber>
                            ))}
                        </PaginationContainer>
                    </>
                )}
            </PageContainer>
        </>
    );
};

export default EmployerApplications;
