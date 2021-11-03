const db = require("./db/db"),
  { User } = require("./models/User"),
  { UserDB } = require("./models/UserDB"),
  validator = require("./validator");

class Controller {
  static async getUser(ctx) {
    const { id } = ctx.request.params;
    const result = await UserDB.get(id);
    ctx.body = { ...result.rows[0] };
  }

  static async getAllUsers(ctx) {
    const users = (await UserDB.getAll()).map((user) => user.getInfo());
    ctx.body = { users };
  }

  static async userCreate(ctx) {
    const { fname, lname, username, email, password } = ctx.request.body;
    await validator.userSchema.validateAsync({fname, lname});
    await UserDB.create(fname, lname, username, email, password);
    ctx.status = 201;
  }

  static async userUpdate(ctx) {
    const { fname, lname, username, email, password, id } = ctx.request.body;
    await UserDB.update(fname, lname, username, email, password, id);
    ctx.status = 200;
  }

  static async userDelete(ctx) {
    const { id } = ctx.request.params;
    console.log(ctx.request.params);
    await UserDB.delete(id);
    ctx.status = 200;
  }
}

module.exports = {
  Controller,
};
