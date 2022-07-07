const express = require("express");
const router = express.Router();
const ToughtsController = require("../controllers/ToughtController.js");

//Helper
const checkAuth = require("../helpers/auth.js").checkAuth;

router.get("/add", checkAuth, ToughtsController.createTought);
router.post("/add", checkAuth, ToughtsController.createToughtSave);
router.get("/edit/:id", checkAuth, ToughtsController.updateTought);
router.post("/edit", checkAuth, ToughtsController.updateToughtSave);
router.get("/dashboard", checkAuth, ToughtsController.dashborad);
router.post("/remove", checkAuth, ToughtsController.removeTought);
router.get("/", ToughtsController.showToughts);

module.exports = router;
