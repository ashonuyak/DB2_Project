const bcrypt = require("bcrypt");
const passport = require("koa-passport");
const jwt = require("jwt-simple");
const { UserDB } = require("./models/UserDB");
const validator = require("./validator");
const { ChangePasswordError } = require("./errors/ChangePasswordError");
const { Service } = require('./service')

class Controller {
  static async getUser(ctx) {
    ctx.body = {
      user: ctx.state.user,
    };
  }

  static async refresh(ctx) {
    const token = ctx.headers.authorization.split(" ")[1];
    const decodedToken = jwt.decode(token, "super_secret_refresh");

    if (decodedToken.expiresIn <= new Date().getTime()) {
      const error = new Error(
        "Refresh token expired, please sign in into your account."
      );
      error.status = 400;

      throw error;
    }

    const user = await UserDB.getUserByEmail(decodedToken.email);

    const accessToken = {
      id: user.id,
      expiresIn: new Date().setTime(new Date().getTime() + 200000),
    };
    const refreshToken = {
      email: user.email,
      expiresIn: new Date().setTime(new Date().getTime() + 1000000),
    };

    ctx.body = {
      accessToken: jwt.encode(accessToken, "super_secret"),
      accessTokenExpirationDate: accessToken.expiresIn,
      refreshToken: jwt.encode(refreshToken, "super_secret_refresh"),
      refreshTokenExpirationDate: refreshToken.expiresIn,
    };
  }

  static async getAllUsers(ctx) {
    const users = (await UserDB.getAll()).map((user) => user.getInfo());
    ctx.body = { users };
  }

  static async userCreate(ctx) {
    const { fname, lname, username, email, password } = ctx.request.body;
    await validator.userSchema.validateAsync({
      fname,
      lname,
      username,
      email,
      password,
    });
    const passwordHash = await bcrypt.hash(password, 10);
    await UserDB.create(fname, lname, username, email, passwordHash).catch(
      (err) => {
        if (err.constraint === "user_email")
          throw new Error("User with the same email already exists");
        throw new Error(err.message);
      }
    );
    ctx.status = 201;
  }

  static async userUpdate(ctx) {
    const { fname, lname, username, email, password } = ctx.request.body;
    await validator.userSchema.validateAsync({
      fname,
      lname,
      username,
      email,
      password,
    });
    const passwordHash = await bcrypt.hash(password, 10);
    await UserDB.update(
      fname,
      lname,
      username,
      email,
      passwordHash,
      ctx.state.user.id
    ).catch((err) => {
      if (err.constraint === "user_email")
        throw new Error("User with the same email already exists");
      throw new Error(err.message);
    });
    ctx.status = 200;
  }

  static async userDelete(ctx) {
    const { id } = ctx.request.params;
    console.log(ctx.request.params);
    await UserDB.delete(id);
    ctx.status = 200;
  }

  static async changePassword(ctx) {
    const { password, email } = ctx.request.body;
    await validator.passwordSchema.validateAsync({ password });
    try {
      await Service.changePassword(password, email)
      ctx.status = 200;
    } catch (err) {
      if(err instanceof ChangePasswordError) {
        ctx.status = 400
        ctx.body = { 
          message: err.message
        }
      }
    }
  }

  static async signIn(ctx, next) {
    await passport.authenticate("local", (err, user) => {
      if (user) {
        ctx.body = user;
      } else {
        ctx.status = 400;
        if (err) {
          ctx.body = { error: err };
        }
      }
    })(ctx, next);
  }
}

module.exports = {
  Controller,
};
