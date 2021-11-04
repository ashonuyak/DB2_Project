const Joi = require('joi');
// const Joi = Router.Joi;

const userSchema = Joi.object({
  fname: Joi.string().min(1).max(20).required(),
  lname: Joi.string().min(1).max(20).required(),
  username: Joi.string().min(1).max(20).required(),
  email: Joi.string().required().email(),
  password: Joi.string().min(6).required(),
});

const passwordSchema = Joi.object({
  password: Joi.string().min(6).required(),
});

module.exports = {
  userSchema,
  passwordSchema,
};
