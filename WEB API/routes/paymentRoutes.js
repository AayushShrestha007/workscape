const paymentController = require('../controllers/paymentController')

const router = require('express').Router();

const logActivity = require("../middleware/logActivity");

const { roleGuard } = require('../middleware/authGuard')

router.post('/khalti_initilization', roleGuard('applicant'), paymentController.paymentInitialize);
router.get('/khalti_verify_payment', paymentController.paymentCompleteVerify);

module.exports = router;