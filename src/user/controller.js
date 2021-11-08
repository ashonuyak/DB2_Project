const jwt = require("jwt-simple");
const passport = require("koa-passport");

const validator = require("./validator");
const { Service } = require("./service");
const { SameEmailError } = require("./errors/SameEmailError");
const { ChangePasswordError } = require("./errors/ChangePasswordError");
const {
  RefreshTokenExpiredError,
} = require("./errors/RefreshTokenExpiredError");

class Controller {
  static async getUser(ctx) {
    ctx.body = {
      user: ctx.state.user,
    };
  }

  static async refresh(ctx) {
    const token = ctx.headers.authorization.split(" ")[1];
    try {
      const { accessToken, refreshToken } = await Service.refresh(token);
      ctx.status = 200;
      ctx.body = {
        accessToken: jwt.encode(accessToken, "super_secret"),
        accessTokenExpirationDate: accessToken.expiresIn,
        refreshToken: jwt.encode(refreshToken, "super_secret_refresh"),
        refreshTokenExpirationDate: refreshToken.expiresIn,
      };
    } catch (err) {
      if (err instanceof RefreshTokenExpiredError) {
        ctx.status = 400;
        ctx.body = {
          message: err.message,
        };
      }
    }
  }

  static async getAllUsers(ctx) {
    const users = await Service.getAllUsers();
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
    try {
      await Service.userCreate(fname, lname, username, email, password);
      ctx.status = 201;
    } catch (err) {
      if (err instanceof SameEmailError) {
        ctx.status = 400;
        ctx.body = {
          message: err.message,
        };
      }
    }
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
    try {
      await Service.userUpdate(fname, lname, username, email, password);
      ctx.status = 200;
    } catch (err) {
      if (err instanceof SameEmailError) {
        ctx.status = 400;
        ctx.body = {
          message: err.message,
        };
      }
    }
  }

  static async userDelete(ctx) {
    const { id } = ctx.request.params;
    Service.userDelete(id);
    ctx.status = 200;
  }

  static async changePassword(ctx) {
    const { password, email } = ctx.request.body;
    await validator.passwordSchema.validateAsync({ password });
    try {
      await Service.changePassword(password, email);
      ctx.status = 200;
    } catch (err) {
      if (err instanceof ChangePasswordError) {
        ctx.status = 400;
        ctx.body = {
          message: err.message,
        };
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
