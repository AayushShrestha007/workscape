import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import UpdateEmployerProfile from "./UpdateEmployerProfile";

// Mock the API and other dependencies
jest.mock("../../../apis/Api");
jest.mock("react-router-dom", () => ({
    ...jest.requireActual("react-router-dom"),
    useNavigate: () => jest.fn(),
}));
jest.mock("../../../components/EmployerNavbar", () => () => <div>EmployerNavbar Mock</div>);

describe("UpdateEmployerProfile component test", () => {
    const mockEmployer = {
        _id: "123",
        organizationName: "Test Organization",
        organizationAddress: "123 Test Street",
        email: "test@example.com",
        phone: "1234567890",
        employerImage: "test-image.jpg",
    };

    beforeEach(() => {
        // Mock localStorage
        Storage.prototype.getItem = jest.fn(() =>
            JSON.stringify({ findemployer: mockEmployer })
        );

        jest.clearAllMocks();
    });

    it("should render the profile form with the correct data", () => {
        render(
            <BrowserRouter>
                <UpdateEmployerProfile />
            </BrowserRouter>
        );

        // Check if form fields are populated correctly
        expect(screen.getByDisplayValue("Test Organization")).toBeInTheDocument();
        expect(screen.getByDisplayValue("123 Test Street")).toBeInTheDocument();
        expect(screen.getByDisplayValue("test@example.com")).toBeInTheDocument();
        expect(screen.getByDisplayValue("1234567890")).toBeInTheDocument();
    });

    it("should display validation errors if form is incomplete", async () => {
        render(
            <BrowserRouter>
                <UpdateEmployerProfile />
            </BrowserRouter>
        );

        // Clear the organization name to trigger validation
        fireEvent.change(screen.getByPlaceholderText("Enter your organization name"), {
            target: { value: "" },
        });

        // Submit the form
        fireEvent.click(screen.getByText("Update Profile"));

        await waitFor(() => {
            expect(screen.getByText("Organization name is required")).toBeInTheDocument();
        });
    });

});



