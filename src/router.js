const Router = require("koa-router"),
  {Controller} = require("./controller");

const router = new Router();

router.get("", Controller.profile);
router.get("forgot-password", Controller.forgotPassword);
router.get("check-email", Controller.checkEmail);
router.get("signUpName", Controller.signUpName);
router.get("signUpPassword", Controller.signUpPassword);
router.get("resetPassword", Controller.resetPassword);
router.get("profilePersonal", Controller.profilePersonal);
router.get("profileAccount", Controller.profileAccount);

module.exports = {
  router,
};
