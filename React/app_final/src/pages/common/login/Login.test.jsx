import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter } from "react-router-dom";
import { toast } from "react-toastify";
import { loginUserApi } from "../../../apis/Api";
import Login from "./Login";

// Mock the API
jest.mock('../../../apis/Api');

describe('login component test', () => {

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should display an error toast on failed login', async () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const mockResponse = {
            data: {
                success: false,
                message: "Password doesn't match"
            }
        };

        loginUserApi.mockResolvedValue(mockResponse);

        toast.error = jest.fn();

        const email = screen.getByPlaceholderText("Email");
        const password = screen.getByPlaceholderText("Password");
        const loginBtn = screen.getByText("Login");

        fireEvent.change(email, { target: { value: "test@gmail.com" } });
        fireEvent.change(password, { target: { value: "test123" } });
        fireEvent.click(loginBtn);

        // Assert that loginUserApi was called with correct parameters
        await waitFor(() => {
            expect(loginUserApi).toHaveBeenCalledWith({
                email: "test@gmail.com",
                password: "test123"
            });

            // Assert that toast.error was called with the expected message
            expect(toast.error).toHaveBeenCalledWith("Password doesn't match");
        });
    });


    it('should display an success toast on failed login', async () => {
        render(
            <BrowserRouter>
                <Login />
            </BrowserRouter>
        );

        const mockResponse = {
            data: {
                success: true,
                message: "user login successful"
            }
        };

        loginUserApi.mockResolvedValue(mockResponse);

        toast.success = jest.fn();

        const email = screen.getByPlaceholderText("Email");
        const password = screen.getByPlaceholderText("Password");
        const loginBtn = screen.getByText("Login");

        fireEvent.change(email, { target: { value: "ayush@gmail.com" } });
        fireEvent.change(password, { target: { value: "12345" } });
        fireEvent.click(loginBtn);

        // Assert that loginUserApi was called with correct parameters
        await waitFor(() => {
            expect(loginUserApi).toHaveBeenCalledWith({
                email: "ayush@gmail.com",
                password: "12345"
            });

            // Assert that toast.error was called with the expected message
            expect(toast.success).toHaveBeenCalledWith("user login successful");
        });
    });
});
