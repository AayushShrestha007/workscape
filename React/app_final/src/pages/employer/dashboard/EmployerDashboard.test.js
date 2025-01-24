import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { getAllOpenJobByEmployerApi } from "../../../apis/Api";
import EmployerDashboard from "./EmployerDashboard";

jest.mock("../../../apis/Api");
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: () => mockNavigate,
}));

jest.mock("../../../components/EmployerNavbar", () => () => <div>EmployerNavbar Mock</div>);
jest.mock("../../../components/Loader", () => () => <div>Loading...</div>);

describe("EmployerDashboard", () => {

    const mockJobs = [
        { _id: "1", title: "Job 1", description: "Job 1 description" },
        { _id: "2", title: "Job 2", description: "Job 2 description" },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should render without crashing", () => {
        render(
            <BrowserRouter>
                <EmployerDashboard />
            </BrowserRouter>
        );
    });

    it("should display the loading state initially", () => {
        render(
            <BrowserRouter>
                <EmployerDashboard />
            </BrowserRouter>
        );

        expect(screen.getByText("Loading...")).toBeInTheDocument();
    });

    it("should render jobs after loading", async () => {
        getAllOpenJobByEmployerApi.mockResolvedValue({
            data: {
                jobs: mockJobs,
                totalJobs: 2
            }
        });

        render(
            <BrowserRouter>
                <EmployerDashboard />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("Job 1")).toBeInTheDocument();
            expect(screen.getByText("Job 1 description")).toBeInTheDocument();
            expect(screen.getByText("Job 2")).toBeInTheDocument();
            expect(screen.getByText("Job 2 description")).toBeInTheDocument();
        });
    });

    it("should render pagination buttons", async () => {
        getAllOpenJobByEmployerApi.mockResolvedValue({
            data: {
                jobs: mockJobs,
                totalJobs: 10 // Assuming 5 jobs per page
            }
        });

        render(
            <BrowserRouter>
                <EmployerDashboard />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText("1")).toBeInTheDocument();
            expect(screen.getByText("2")).toBeInTheDocument();
        });
    });

    it("should navigate to job details on button click", async () => {
        getAllOpenJobByEmployerApi.mockResolvedValue({
            data: {
                jobs: mockJobs,
                totalJobs: 2
            }
        });

        render(
            <BrowserRouter>
                <EmployerDashboard />
            </BrowserRouter>
        );

        await waitFor(() => {
            const reviewButton = screen.getAllByText("Review Applicants")[0];
            fireEvent.click(reviewButton);
            expect(mockNavigate).toHaveBeenCalledWith("/employer/job_details/1");
        });
    });
});
