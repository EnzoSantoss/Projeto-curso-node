const AuthController = require("../controllers/AuthController.js");
const express = require("express");
const router = express.Router();

router.get("/login", AuthController.login);
router.post("/login", AuthController.loginPost);
router.get("/register", AuthController.regiter);
router.post("/register", AuthController.registerPost);
router.get("/logout", AuthController.logout);

module.exports = router;
