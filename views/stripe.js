const express = require('express');
const StripeController = require('../controllers/StripeController');
const { RequireSignIn } = require("../middleware");

const router = express.Router();

router.post("/create-connect-account", RequireSignIn, StripeController.createConnectAccount);
router.post("/get-account-status", RequireSignIn, StripeController.getAccountStatus);
router.post("/get-account-balance", RequireSignIn, StripeController.getAccountBalance);
router.post("/get-payout-settings", RequireSignIn, StripeController.getPayoutSetting);

module.exports = router;
