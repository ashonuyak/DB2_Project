const { ChangePasswordError } = require("./errors/ChangePasswordError");
const { UserDB } = require("./models/UserDB");
const bcrypt = require("bcrypt");

class Service {
  static async changePassword(pass, email) {
    const {password} = await UserDB.getPasswordByEmail(email);
    const check = await bcrypt.compare(pass, password);
    const passwordHash = await bcrypt.hash(pass, 10);
    if (check) {
      throw new ChangePasswordError();
    }
    await UserDB.changePassword(passwordHash, email);
  }
}

module.exports = { Service };
