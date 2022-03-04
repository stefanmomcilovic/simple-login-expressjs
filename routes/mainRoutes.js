const router = require('express').Router();

const userController = require('./../controllers/userController');
const { isUserLoggedIn } = require('./../helpers/helpers');

router.route("/")
    .get(userController.getSignIn)
    .post(userController.postSignIn);

router.route("/signup")
    .get(userController.getSignUp)
    .post(userController.postSignUp);

router.route("/dashboard")
    .get(isUserLoggedIn, userController.getDashboard);

router.get("/logout", userController.getLogout);

module.exports = router;