class User {
  constructor(dbRes) {
    this._id = dbRes.id;
    this._password = dbRes.password;
    this.username = dbRes.username;
    this.fname = dbRes.fname;
    this.lname = dbRes.lname;
    // this.isActive = dbRes.isactive;
    // this.categoryId = dbRes.categoryid;
    this.email = dbRes.email;
    // this.photo = dbRes.photo;
  }

  getInfo() {
    const responseData = {
      fname: this.fname,
      lname: this.lname,
      email: this.email,
      username: this.username,
    };

    return responseData;
  }
}

module.exports = {
  User,
};
