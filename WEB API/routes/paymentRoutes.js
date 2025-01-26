const paymentController = require('../controllers/paymentController')

const router = require('express').Router();

const logActivity = require("../middleware/logActivity");

const { roleGuard } = require('../middleware/authGuard')

router.post('/khalti_initilization', paymentController.paymentInitialize);
router.get('/khalti_verify_payment', roleGuard('applicant'), logActivity, paymentController.paymentCompleteVerify);

module.exports = router;