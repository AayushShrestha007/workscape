import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { TextDecoder, TextEncoder } from 'util';
import { registerUserApi } from "../../../apis/Api";
import RegisterPage from "../../applicant/register/Register";

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;

jest.mock("../../../apis/Api");
jest.mock('react-router-dom', () => ({
    ...jest.requireActual('react-router-dom'),
    useNavigate: jest.fn(),  // Mock useNavigate
}));

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => 'mocked-url');

describe('RegisterPage component test', () => {
    const mockNavigate = jest.fn();  // Create a mock function

    beforeEach(() => {
        useNavigate.mockReturnValue(mockNavigate);  // Assign the mock function to useNavigate
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should display an error toast on failed registration', async () => {
        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        );

        const mockResponse = {
            data: {
                success: false,
                message: "Email already exists"
            }
        };

        registerUserApi.mockResolvedValue(mockResponse);
        toast.error = jest.fn();

        const nameInput = screen.getByPlaceholderText("Name");
        const emailInput = screen.getByPlaceholderText("Email Address");
        const phoneInput = screen.getByPlaceholderText("Phone number");
        const passwordInput = screen.getByPlaceholderText("Password");
        const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
        const fileInput = screen.getByTestId("profileImageUpload");

        fireEvent.change(nameInput, { target: { value: "Test User" } });
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(phoneInput, { target: { value: "1234567890" } });
        fireEvent.change(passwordInput, { target: { value: "password" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "password" } });
        fireEvent.change(fileInput, { target: { files: [new File(["image"], "profile.png", { type: "image/png" })] } });

        const registerButton = screen.getByText("Register");
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(registerUserApi).toHaveBeenCalled();
            expect(toast.error).toHaveBeenCalledWith("Email already exists");
        });
    });

    it('should display a success toast and navigate to login on successful registration', async () => {
        render(
            <BrowserRouter>
                <RegisterPage />
            </BrowserRouter>
        );

        const mockSuccessResponse = {
            data: {
                success: true,
                message: "User registered successfully"
            }
        };

        registerUserApi.mockResolvedValue(mockSuccessResponse);
        toast.success = jest.fn();

        const nameInput = screen.getByPlaceholderText("Name");
        const emailInput = screen.getByPlaceholderText("Email Address");
        const phoneInput = screen.getByPlaceholderText("Phone number");
        const passwordInput = screen.getByPlaceholderText("Password");
        const confirmPasswordInput = screen.getByPlaceholderText("Confirm Password");
        const fileInput = screen.getByTestId("profileImageUpload");

        fireEvent.change(nameInput, { target: { value: "Test User" } });
        fireEvent.change(emailInput, { target: { value: "test@example.com" } });
        fireEvent.change(phoneInput, { target: { value: "1234567890" } });
        fireEvent.change(passwordInput, { target: { value: "password" } });
        fireEvent.change(confirmPasswordInput, { target: { value: "password" } });
        fireEvent.change(fileInput, { target: { files: [new File(["image"], "profile.png", { type: "image/png" })] } });

        const registerButton = screen.getByText("Register");
        fireEvent.click(registerButton);

        await waitFor(() => {
            expect(registerUserApi).toHaveBeenCalled();
            expect(toast.success).toHaveBeenCalledWith("User registered successfully");
            expect(mockNavigate).toHaveBeenCalledWith('/login');
        });
    });
});
