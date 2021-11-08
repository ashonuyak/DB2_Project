const { ChangePasswordError } = require("./errors/ChangePasswordError");
const { RefreshTokenExpiredError } = require('./errors/RefreshTokenExpiredError');
const { SameEmailError } = require('./errors/SameEmailError');
const { UserDB } = require("./models/UserDB");
const bcrypt = require("bcrypt");
const jwt = require("jwt-simple");

class Service {
  static async refresh(token) {
    const decodedToken = jwt.decode(token, "super_secret_refresh");

    if (decodedToken.expiresIn <= new Date().getTime()) {
      throw new RefreshTokenExpiredError();
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
    return { accessToken, refreshToken };
  }

  static async getAllUsers() {
    return (await UserDB.getAll()).map((user) => user.getInfo());
  }

  static async userCreate(fname, lname, username, email, password) {
    const passwordHash = await bcrypt.hash(password, 10);
    await UserDB.create(fname, lname, username, email, passwordHash).catch(
      (err) => {
        if (err.constraint === "user_email")
          throw new SameEmailError();
        throw new Error(err.message);
      }
    );
  }

  static async userUpdate(fname, lname, username, email, password) {
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
        throw new SameEmailError();
      throw new Error(err.message);
    });
  }

  static async userDelete(id) {
    UserDB.delete(id);
  }

  static async changePassword(pass, email) {
    const { password } = await UserDB.getPasswordByEmail(email);
    const check = await bcrypt.compare(pass, password);
    const passwordHash = await bcrypt.hash(pass, 10);
    if (check) {
      throw new ChangePasswordError();
    }
    await UserDB.changePassword(passwordHash, email);
  }
}

module.exports = { Service };
