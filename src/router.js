const Router = require("koa-router");
// const Router = require('koa-joi-router');
const { Controller } = require("./controller");

const router = new Router();

router.get("/user/:id", Controller.getUser);
router.post("/userCreate", Controller.userCreate);
router.put("/userUpdate", Controller.userUpdate);
router.get("/getAllUsers", Controller.getAllUsers);
router.delete("/userDelete/:id", Controller.userDelete);

module.exports = {
  router,
};
