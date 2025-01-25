import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { verifyEmployerOtpApi, verifyUserOtpApi } from "../../../apis/Api";

const OtpVerification = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const email = location.state?.email;
    const isEmployer = location.pathname.includes("employer");

    const handleOtpSubmit = async (e) => {
        e.preventDefault();

        const data = { email, otp };
        const apiEndpoint = isEmployer ? verifyEmployerOtpApi : verifyUserOtpApi;

        try {
            const response = await apiEndpoint(data);
            if (response.data.success) {
                toast.success(response.data.message);

                // Save token and redirect to dashboard
                localStorage.setItem("token", response.data.token);
                localStorage.setItem(
                    isEmployer ? "employer" : "user",
                    JSON.stringify(isEmployer ? response.data.employerData : response.data.userData)
                );

                navigate(isEmployer ? "/employer/dashboard" : "/applicant/dashboard");
            } else {
                toast.error(response.data.message);
            }
        } catch (error) {
            // Log the error for debugging
            console.error("Error during OTP verification:", error);

            // Display error toast
            toast.error(error.response?.data?.message || "Failed to verify OTP");
        }

    };

    return (
        <div>
            <h2>OTP Verification</h2>
            <form onSubmit={handleOtpSubmit}>
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                />
                <button type="submit">Verify</button>
            </form>
        </div>
    );
};

export default OtpVerification;
