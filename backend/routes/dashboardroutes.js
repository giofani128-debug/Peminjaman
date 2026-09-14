const express = require("express");
const router = express.Router();
const { getDashboardStats } = require("../controller/dashboardcontrol");


router.get("/stats", getDashboardStats);


module.exports = router;
