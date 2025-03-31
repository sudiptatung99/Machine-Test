const express = require("express");
const { calculateTotalPayback, getLatestPaybackEntry } = require("../Controller/RoiInvestsController");
const router = express.Router();


router.get('/investments/payback/:userId', calculateTotalPayback);
router.get('/investments/latest-payback/:investmentId', getLatestPaybackEntry);


module.exports=router