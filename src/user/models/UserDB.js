const { User } = require("./User");
const db = require("../../db/db");
const bcrypt = require("bcrypt");

class UserDB {
  static async get(id) {
    const userResponse = await db.query(`
      SELECT * 
      FROM "user_table" 
      WHERE id=${id}
      `);

    if (!userResponse.rowCount) {
      throw new Error(`User with id: ${id}, does not exist`);
    }

    return userResponse.rows[0];
  }

  static async getAll() {
    const userListResponse = await db.query(`
      SELECT * 
      FROM "user_table"
      `);

    const users = userListResponse.rows.map((userDb) => new User(userDb));
    return users;
  }

  static async create(fname, lname, username, email, password) {
    await db.query(`
      INSERT 
      INTO "user_table" 
      (fname, 
      lname, 
      username, 
      email, 
      password) 
      VALUES 
      ('${fname}', 
      '${lname}', 
      '${username}', 
      '${email}', 
      '${password}')
      RETURNING *
      `);
  }

  static async update(fname, lname, username, email, password, id) {
    await db.query(`
      UPDATE "user_table" 
      SET fname='${fname}', 
      lname='${lname}', 
      username='${username}', 
      email='${email}', 
      password='${password}' 
      WHERE id=${id}
      `);
  }

  static async delete(id) {
    await db.query(`
      DELETE 
      FROM "user_table"
      WHERE id=${id}
      `);
  }

  static async getUserByEmail(email) {
    const userResponse = await db.query(
      `SELECT * FROM "user_table" WHERE email = '${email}'`
    );

    if (!userResponse.rowCount) {
      throw new Error(`User with email: ${email}, does not exist`);
    }

    return userResponse.rows[0];
  }

  static async checkPassword(email, password) {
    const userResponse = await db.query(
      `SELECT * FROM "user_table" WHERE email = '${email}'`
    );

    if (!userResponse.rowCount) {
      return {
        message: `User with email: ${email}, does not exist`,
        flag: false,
      };
    }
    
    const user = { ...userResponse.rows[0] };
    const check = await bcrypt.compare(password, user.password);

    if (!check) {
      return { message: "Incorrect password", flag: false };
    }
    return { user, flag: true };
  }

  static async changePassword(password, email) {
    await db.query(`
    UPDATE "user_table"
    SET password='${password}'
    WHERE email='${email}'`);
  }

  static async getPasswordByEmail(email) {
    const response = await db.query(`
    SELECT password
    FROM user_table
    WHERE email='${email}'`);
    return { ...response.rows[0] };
  }
}

module.exports = {
  UserDB,
};
