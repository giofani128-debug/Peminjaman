const express = require("express");
const router = express.Router();
const usercontrol = require("../controller/usercontrol");
const { logout } = require("../controller/logoutcontrol");
const { authJWT, isAdmin } = require("../middleware/Authjwt");

router.post("/login", usercontrol.login);
router.post("/register", usercontrol.registerUser);
router.post("/logout", logout);

router.get("/user", authJWT, isAdmin, usercontrol.getUser);
// router.post("/user", authJWT, isAdmin, usercontrol.registerUser);
router.get("/user/:id", authJWT, isAdmin, usercontrol.getUserById);
router.delete("/user/:id",authJWT, isAdmin, usercontrol.deleteUser);
// router.post("/login", usercontrol.login);

module.exports = router;
