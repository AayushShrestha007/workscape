const request = require('supertest');
const app = require('../index');
const path = require('path');

//test token and id for employer
const employerToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YzQ1YWM5ZDhhNTZmZWM2N2I1M2MxMyIsInJvbGUiOiJlbXBsb3llciIsImlhdCI6MTcyNDE0NDg1NH0.VoX8FXSad4_HUMHBn3TAyFw-3ezajRQFcm3_mTWF-Ko"
const employerId = "66c45ac9d8a56fec67b53c13"
//test token and id for applicant
const applicantToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY2YzQ2MDBmYzZkNjhiMWQ2MTIwZjE1ZiIsInJvbGUiOiJhcHBsaWNhbnQiLCJpYXQiOjE3MjQxNDU4MTZ9.nF35yZgyaHXNpZ7etpJd2Vd0k8OI96uwI4TXW_vsn_0"
const applicantId = "66c4600fc6d68b1d6120f15f"
//test id for job
const jobId = "66c461d014c40647dea87dc3"

//defining multiple test cases
describe('Api Testing', () => {

    // Before each test, you might want to clean the database or mock data
    beforeEach(async () => {
        // Optional setup before each test, e.g., cleaning database
        console.log("Running setup before each test");
    });

    // After each test, you might want to reset mock data or states
    afterEach(async () => {
        // Optional teardown after each test, e.g., clearing mock data
        console.log("Running teardown after each test");
    });

    it('GET /test | Response with text', async () => {
        const response = await request(app).get('/test');
        expect(response.statusCode).toBe(200);
        expect(response.text).toEqual("Test api is working for Job Mate");
    });

    //-----------USER TESTS-----------//
    it('POST /api/user/register | register applicant', async () => {
        const response = await request(app).post('/api/user/register')
            .field('name', 'Ayush')
            .field('phone', '9840574904')
            .field('email', 'ayush@gmail.com')
            .field('password', '12345')
            .attach('userImage', path.resolve(__dirname, 'test.JPG'));

        if (!response.body.success) {
            expect(response.body.message).toEqual("user already exists");
        } else {
            expect(response.body.message).toEqual("User created successfully");
        }

        expect(response.body).toBeDefined();
    });

    it('POST /api/user/login | login applicant', async () => {
        const response = await request(app).post('/api/user/login').send({
            "email": "ayush@gmail.com",
            "password": "12345"
        });

        if (response.body.success) {
            expect(response.body.message).toEqual("user login successful");
            expect(response.body.userData).toBeDefined();
            expect(response.body.userData.findUser.name).toEqual("Ayush");
            expect(response.body.token).toBeDefined();
            expect(response.body.token.length).toBeGreaterThan(0);
        } else {
            expect(response.body.success).toBe(false);
            expect(response.body.message).toBe("user with this email doesn't exist");
        }

        expect(response.body).toBeDefined();
    });

    it('PUT /api/user/update_applicant/:id | Update applicant profile', async () => {
        const response = await request(app)
            .put(`/api/user/update_applicant/${applicantId}`)
            .set('Authorization', `Bearer ${applicantToken}`)
            .field('name', 'Ayush')
            .field('email', 'ayush@gmail.com')
            .field('password', '12345')
            .attach('userImage', path.resolve(__dirname, 'test.JPG'));

        expect(response.body.success).toBe(true);
        expect(response.body.message).toEqual('User Updated');
        expect(response.body.user).toBeDefined();
        expect(response.body.user.name).toEqual('Updated Name');
        expect(response.body.user.email).toEqual('updatedemail@example.com');
        expect(response.body.user.password).not.toEqual('newpassword123'); // Password should be hashed
        expect(response.body.user.userImage).toBeDefined();
    });

    //-----------JOB TESTS-----------//
    it('GET /api/job/get_all_open_jobs | fetch all open jobs', async () => {
        const response = await request(app).get('/api/job/get_all_open_jobs').set('authorization', `Bearer ${applicantToken}`);
        expect(response.statusCode).toBe(200);
        expect(response.body).toBeDefined();
        expect(response.body.message).toEqual("Jobs fetched successfully");
    });

    it('POST /api/job/create | Create a new job', async () => {
        const response = await request(app)
            .post('/api/job/create_job')
            .set('authorization', `Bearer ${employerToken}`)
            .send({
                title: "Software Developer",
                workType: "Onsite",
                description: "Looking for a skilled software developer with minimum 3 years of experience.",
                skills: "JavaScript, Node.js, React",
                qualification: "Bachelor's degree in Computer Science",
                status: 'Open',
                employer: employerId
            });

        expect(response.statusCode).toBe(201);
        expect(response.body.message).toEqual("Job created successfully");
        expect(response.body.job).toBeDefined();
    });

    it('GET /api/job/get_job_details/:id | Get a job by ID', async () => {
        const response = await request(app)
            .get(`/api/job/get_job_details/${jobId}`)
            .set('authorization', `Bearer ${applicantToken}`);

        if (response.body.success) {
            expect(response.statusCode).toBe(201);
            expect(response.body.job).toBeDefined();
            expect(response.body.job.title).toEqual("Software Engineer (Power BI)");
        } else {
            expect(response.body.message).toEqual('Job not found');
        }
    });

    it('GET /api/job/:jobId | Get applicants for a job', async () => {
        const response = await request(app)
            .get(`/api/job/${jobId}`)
            .set('authorization', `Bearer ${employerToken}`);

        expect(response.statusCode).toBe(200);
        expect(response.body.message).toEqual('Applicants fetched successfully');
        expect(response.body.applicants).toBeInstanceOf(Array);
    });

    //-----------RESUME TESTS-----------//
    it('GET /api/resume/get_all_resume | Get resumes by user', async () => {
        const response = await request(app)
            .get('/api/resume/get_all_resume')
            .set('authorization', `Bearer ${applicantToken}`)
            .query({ page: 1, limit: 5 });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.resumes).toBeInstanceOf(Array);
        expect(response.body.totalResumes).toBeDefined();
        expect(response.body.currentPage).toBe("1");
        expect(response.body.totalPages).toBeDefined();
    });

    //-----------APPLICATION TESTS-----------//
    it('GET /api/application/get_employer_applications | Get applications of employer', async () => {
        const response = await request(app)
            .get('/api/applications/get_employer_applications')
            .set('authorization', `Bearer ${employerToken}`)
            .query({ page: 1, limit: 5 });

        expect(response.statusCode).toBe(200);
        expect(response.body.success).toBe(true);
        expect(response.body.totalPages).toBe(1);
    });
});