// const Router = require('koa-joi-router');
// const joi = Router.Joi;
const Joi = require("joi");

const userSchema = Joi.object({
  fname: Joi.string().min(1).max(20).required(),
  lname: Joi.string().min(1).max(20).required(),
});

module.exports = {
  userSchema,
};
