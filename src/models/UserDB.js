const { User } = require("./User"),
  db = require("../db/db");

class UserDB {
  static async get(id) {
    const user = await db.query(`
      SELECT * 
      FROM "user" 
      WHERE id=${id}
      `);

    return user;
  }

  static async getAll() {
    const userListResponse = await db.query(`
      SELECT * 
      FROM "user"
      `);

    const users = userListResponse.rows.map((userDb) => new User(userDb));
    return users;
  }

  static async create(fname, lname, username, email, password) {
    await db.query(`
      INSERT 
      INTO "user" 
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
      `);
  }

  static async update(fname, lname, username, email, password, id) {
    await db.query(`
      UPDATE "user" 
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
      FROM "user"
      WHERE id=${id}
      `);
  }
}

module.exports = {
  UserDB,
};
