
const { initializeKhaltiPayment, verifyKhaltiPayment } = require("../service/khaltiService");
const Payment = require("../models/paymentModel");
const { v4: uuidv4 } = require('uuid'); // UUID library for generating unique IDs
const User = require("../models/userModel");

// Initializing khalti payment
const paymentInitialize = async (req, res) => {
    try {
        const { amount, website_url } = req.body;

        // Generate a unique order ID
        const orderId = uuidv4();

        // Initialize the Khalti payment
        const paymentInitate = await initializeKhaltiPayment({
            amount: amount * 100, // amount should be in paisa (Rs * 100)
            purchase_order_id: orderId, // use the generated order ID
            purchase_order_name: "Payment For Premium",
            return_url: 'http://localhost:5500/api/khalti/khalti_verify_payment',
            website_url: website_url || "http://localhost:3000",
        });

        // Ensure we got a valid pidx/transactionId
        if (paymentInitate && paymentInitate.pidx) {
            // Create the payment record in the database after successful initialization
            const newPayment = await Payment.create({
                orderId: orderId,
                transactionId: paymentInitate.pidx,
                pidx: paymentInitate.pidx,
                paymentGateway: "khalti",
                amount: amount * 100,
                status: "pending",  // Set the initial status to pending
            });

            res.status(201).json({
                success: true,
                OrderModelData: newPayment,
                payment: paymentInitate,
                pidx: paymentInitate.pidx,
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Failed to initiate payment. No transaction ID returned.",
            });
        }
    } catch (error) {
        console.error('Payment Initialization Error:', error);
        res.json({
            success: false,
            error: error.message || "An error occurred",
        });
    }
};

//verifying khalti payment
const paymentCompleteVerify = async (req, res) => {
    const { pidx, amount, purchase_order_id } = req.query;

    // Log the received query parameters
    console.log("Received query parameters:", { pidx, amount, purchase_order_id });

    try {
        // Log the attempt to verify payment with Khalti
        console.log(`Attempting to verify payment with pidx: ${pidx}`);
        const paymentInfo = await verifyKhaltiPayment(pidx);

        // Log the payment information received from Khalti
        console.log("Payment information received from Khalti:", paymentInfo);

        // Validate the payment info
        if (
            paymentInfo?.status !== "Completed" ||  // Ensure the status is "Completed"
            paymentInfo.pidx !== pidx  // Verify pidx matches

        ) {
            console.log("Payment validation failed:", {
                status: paymentInfo?.status,
                pidxMatch: paymentInfo.pidx === pidx,

            });

            return res.status(400).json({
                success: false,
                message: "Incomplete or invalid payment information",
                paymentInfo,
            });
        }

        // Log the attempt to update the payment record in the database
        console.log(`Updating payment record in the database for order ID: ${purchase_order_id}`);
        const paymentData = await Payment.findOneAndUpdate(
            { orderId: purchase_order_id },
            {
                $set: {
                    pidx,
                    transactionId: paymentInfo.transaction_id,
                    status: "success",
                },
            },
            { new: true }
        );

        // Log the updated payment data
        console.log("Updated payment data:", paymentData);

        // Update the currently logged-in user's hasPremium property
        console.log(`Updating hasPremium property for user ID: ${req.user.id}`);
        const user = await User.findByIdAndUpdate(
            req.user.id,
            { hasPremium: true },
            { new: true }
        );

        // Log the updated user data
        console.log("User data updated with hasPremium:", user);

        // Redirect to the Khalti payment page with the pidx
        console.log(`Redirecting to Khalti payment page with pidx: ${pidx}`);
        res.redirect(`https://test-pay.khalti.com/?pidx=${pidx}`);

    } catch (error) {
        // Log any errors that occur during the process
        console.error("Error verifying payment:", error);

        res.status(500).json({
            success: false,
            message: "An error occurred during payment verification",
            error: error.message || "An unknown error occurred",
        });
    }
};

module.exports = { paymentInitialize, paymentCompleteVerify };
