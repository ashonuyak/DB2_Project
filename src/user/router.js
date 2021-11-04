const Router = require("koa-router");
const passport = require('koa-passport');
// const Router = require('koa-joi-router');
const { Controller } = require("./controller");

const router = new Router();

router.get("/user", passport.authenticate('jwt', { session: false }), Controller.getUser);
router.get('/refresh', Controller.refresh);
router.post("/user", Controller.userCreate);
router.post('/user/session', Controller.signIn);
router.put("/user", passport.authenticate('jwt', { session: false }), Controller.userUpdate);
router.get("/users", Controller.getAllUsers);
router.delete("/user/:id", Controller.userDelete);
router.put("/user/password", Controller.changePassword);

module.exports = {
  router,
};
