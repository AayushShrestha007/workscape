import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import styled from 'styled-components';
import { createJobApi } from '../../../apis/Api';
import EmployerNavbar from "../../../components/EmployerNavbar";

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 60px); 
  margin-top: 20px; 
  background-color: #fffff;
`;

const FormWrapper = styled.div`
  display: flex;
  flex-direction: column;
  background: #fff;
//   border-radius: 10px;
//   box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  width: 600px;
  padding: 40px;
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
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
`;

const Select = styled.select`
  width: 100%;
  padding: 10px;
  margin: 10px 0;
  border: 1px solid #ccc;
  border-radius: 5px;
  font-size: 16px;
  background-color: white;
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
  margin-top: 20px;
`;

const CreateJobPage = () => {
  const [title, setTitle] = useState('');
  const [workType, setWorkType] = useState('');
  const [description, setDescription] = useState('');
  const [skills, setSkills] = useState('');
  const [qualification, setQualification] = useState('');
  const navigate = useNavigate();


  const [titleError, setTitleError] = useState('');
  const [workTypeError, setWorkTypeError] = useState('');
  const [descriptionError, setDescriptionError] = useState('');
  const [skillsError, setSkillsError] = useState('');
  const [qualificationError, setQualificationError] = useState('');


  //validation
  var validate = () => {
    var isValid = true;

    if (title === '') {
      setTitleError("Title is required")
      isValid = false;
    } else {
      setTitleError(""); // Clear error if title is not empty
    }

    if (workType === '') {
      setWorkTypeError("Worktype is required")
      isValid = false;
    } else {
      setWorkTypeError(""); // Clear error if title is not empty
    }

    if (description === '') {
      setDescriptionError("Description is required")
      isValid = false;
    } else {
      setDescriptionError(""); // Clear error if title is not empty
    }

    if (skills === '') {
      setSkillsError("Skill is required")
      isValid = false;
    } else {
      setSkillsError(""); // Clear error if title is not empty
    }

    if (qualification === '') {
      setQualificationError("Qualification is required")
      isValid = false;
    } else {
      setQualificationError(""); // Clear error if title is not empty
    }

    return isValid
  }


  const handleSubmit = (e) => {

    var isValidated = validate();
    if (!isValidated) {
      return
    }

    e.preventDefault()

    //make a form data (text, files)
    const formData = new FormData()
    formData.append('title', title)
    formData.append('workType', workType)
    formData.append('description', description)
    formData.append('skills', skills)
    formData.append('qualification', qualification)

    //make an api call
    createJobApi(formData).then((res) => {

      if (res.status === 201) {
        toast.success(res.data.message)
        console.log("success")
        navigate('/employer/dashboard')
      }

    }).catch((error) => {
      if (error.response) {
        if (error.response.status === 400) {
          toast.warning(error.response.data.message)
        }
        else if (error.response.status === 500) {
          toast.error(error.response.data.message)
        }
        else {
          toast.error("something went wrong")
        }

      } else {
        toast.error("something went wrong")
      }

      //for error status code

    });
  }

  return (
    <>
      <EmployerNavbar />
      <Container>
        <FormWrapper>
          <Title>Create Your Job Post</Title>
          <Input
            type="text"
            placeholder="Title"
            value={title}
            className='form-control'
            onChange={(e) => setTitle(e.target.value)}
          />
          {
            setTitleError && <p className='text-danger'>{titleError}</p>
          }
          <Select
            value={workType}
            onChange={(e) => setWorkType(e.target.value)}
          >
            <option value="">Select Work Type</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </Select>
          {
            setWorkTypeError && <p className='text-danger'>{workTypeError}</p>
          }
          <Input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
          {
            setDescriptionError && <p className='text-danger'>{descriptionError}</p>
          }
          <Input
            type="text"
            placeholder="Skills"
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
          />
          {
            setSkillsError && <p className='text-danger'>{skillsError}</p>
          }
          <Input
            type="text"
            placeholder="Qualification"
            value={qualification}
            onChange={(e) => setQualification(e.target.value)}
          />
          {
            setQualificationError && <p className='text-danger'>{qualificationError}</p>
          }
          <Button onClick={handleSubmit}>Create Job Post</Button>
        </FormWrapper>
      </Container>
    </>
  );
}

export default CreateJobPage
