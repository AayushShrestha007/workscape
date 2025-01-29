import { Document, Image, Page, pdf, StyleSheet, Text, View } from '@react-pdf/renderer';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import styled from 'styled-components';
import { createResumeApi } from '../../../apis/Api'; // Ensure this path matches your project structure
import ApplicantNavbar from "../../../components/ApplicantNavbar";

// Styles for PDF
const styles = StyleSheet.create({
    page: {
        flexDirection: 'column',
        backgroundColor: '#fff',
        padding: 30,
    },
    section: {
        marginBottom: 0,
        padding: 10,
        flexGrow: 1,
    },
    header: {
        fontSize: 24,
        marginBottom: 10,
        textAlign: 'center',
    },
    subheader: {
        fontSize: 18,
        margin: 5,
        fontWeight: 'bold',
    },
    text: {
        margin: 3,
        fontSize: 14,
        lineHeight: 1.5,
    },
    personalInfoSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    userImage: {
        width: 80,
        height: 100,
        borderRadius: 10,
        marginLeft: 10,
    },
    experienceSection: {
        marginTop: 0,
    },
    jobTitle: {
        fontSize: 14,
        fontWeight: 'bold',
        margin: 3,
    },
});

// PDF Document Component
const MyDocument = ({ formData }) => (
    <Document>
        <Page size="A4" style={styles.page}>
            <Text style={styles.header}>Resume</Text>
            <View style={styles.section}>
                <Text style={styles.subheader}>Personal Information</Text>
                <View style={styles.personalInfoSection}>
                    <View>
                        <Text style={styles.text}>Name: {formData.name}</Text>
                        <Text style={styles.text}>Email: {formData.email}</Text>
                        <Text style={styles.text}>Phone: {formData.phone}</Text>
                    </View>
                    <Image style={styles.userImage} src={`https://localhost:5500/userImage/${formData.userImage}`} />
                </View>
            </View>
            <View style={styles.section}>
                <Text style={styles.subheader}>Experience</Text>
                <Text style={styles.jobTitle}>{formData.previousCompanyName} - {formData.jobTitle} ({formData.jobDuration})</Text>
                <Text style={styles.text}>{formData.jobDescription}</Text>
            </View>
            <View style={styles.section}>
                <Text style={styles.subheader}>Education</Text>
                <Text style={styles.text}>{formData.highestQualification} from {formData.educationInstitute}</Text>
            </View>
        </Page>
    </Document>
);

// Styled components
const PageContainer = styled.div`
  padding: 20px;
  background-color: white;
  min-height: calc(100vh - 60px);  // Assuming the navbar is 60px high
  display: flex;
  flex-direction: column;
  align-items: center;
  overflow-y: auto;  // Enable vertical scrolling
`;

const Input = styled.input`
  margin-bottom: 10px;
  width: 300px;
  padding: 8px;
`;

const Title = styled.h1`
  margin-top: 20px;
  margin-bottom: 30px;
  font-size: 32px;
  color: #333;
  text-align: center;
`;

const Button = styled.button`
  padding: 10px 20px;
  background-color: #2d69b3;
  color: white;
  border: none;
  border-radius: 40px;
`;

const Textarea = styled.textarea`
  margin-bottom: 10px;
  width: 300px;
  padding: 8px;
  height: 100px; // You can adjust the height as needed
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PdfViewer = styled.iframe`
  width: 100%;
  height: 500px;  // Increase the height to make the PDF larger
  border: none;
  margin-top: 20px;
  padding: 0 20px; // Add left and right padding
`;

const CreateResume = () => {
    const [formData, setFormData] = useState({
        resumeTitle: '',
        name: '',
        email: '',
        phone: '',
        previousCompanyName: '',
        jobTitle: '',
        jobDuration: '',
        jobDescription: '',
        highestQualification: '',
        educationInstitute: '',
        userImage: '' // Add user image
    });

    const [pdfUrl, setPdfUrl] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        // Fetch user data from local storage
        const user = JSON.parse(localStorage.getItem('user')).findUser;
        if (user) {
            setFormData(prev => ({
                ...prev,
                name: user.name,
                email: user.email,
                phone: user.phone,
                userImage: user.userImage // Set user image from local storage
            }));
        }
    }, []);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFormSubmit = async () => {
        const doc = <MyDocument formData={formData} />;
        const asPdf = pdf(); // Create an instance of PDF
        asPdf.updateContainer(doc);
        const blob = await asPdf.toBlob(); // Generate blob

        const url = URL.createObjectURL(blob);
        setPdfUrl(url);

        // FormData to send via HTTP
        const fileData = new FormData();
        fileData.append("file", blob, "resume.pdf");

        // Append other form data fields to the FormData object
        fileData.append("resumeTitle", formData.resumeTitle);
        fileData.append("previousCompanyName", formData.previousCompanyName);
        fileData.append("jobTitle", formData.jobTitle);
        fileData.append("jobDuration", formData.jobDuration);
        fileData.append("jobDescription", formData.jobDescription);
        fileData.append("highestEducation", formData.highestQualification);
        fileData.append("educationInstitute", formData.educationInstitute);

        try {
            await createResumeApi(fileData);
            toast.success('Resume Created Successfully!');

        } catch (error) {
            console.error('Error submitting resume:', error);
            toast.error('Error submitting resume');
        }
    };

    return (
        <>
            <ApplicantNavbar />
            <PageContainer>
                <Container>
                    <Title>Build Your Resume</Title>
                    <Input type="text" name="resumeTitle" value={formData.resumeTitle} onChange={handleInputChange} placeholder="Resume Title" />
                    <Input type="text" name="previousCompanyName" value={formData.previousCompanyName} onChange={handleInputChange} placeholder="Previous Company Name" />
                    <Input type="text" name="jobTitle" value={formData.jobTitle} onChange={handleInputChange} placeholder="Job Title" />
                    <Input type="text" name="jobDuration" value={formData.jobDuration} onChange={handleInputChange} placeholder="Job Duration" />
                    <Textarea name="jobDescription" value={formData.jobDescription} onChange={handleInputChange} placeholder="Job Description" />
                    <Input type="text" name="highestQualification" value={formData.highestQualification} onChange={handleInputChange} placeholder="Highest Education Qualification" />
                    <Input type="text" name="educationInstitute" value={formData.educationInstitute} onChange={handleInputChange} placeholder="Education Institute" />
                    <Button onClick={handleFormSubmit}>Create Resume</Button>
                    {pdfUrl && <PdfViewer src={pdfUrl} />}
                </Container>
            </PageContainer>
        </>
    );
};

export default CreateResume;
