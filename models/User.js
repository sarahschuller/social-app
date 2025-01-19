const usersCollection = require("../db").collection("users");
const validator = require("validator");

let User = function (data) {
  this.data = data;
  this.errors = [];
};

User.prototype.cleanUp = function () {
  if (typeof this.data.username != "string") {
    this.data.username = "";
  }
  if (typeof this.data.email != "string") {
    this.data.email = "";
  }
  if (typeof this.data.password != "string") {
    this.data.password = "";
  }

  //Get rid of any extra properties
  this.data = {
    username: this.data.username.trim().toLowerCase(),
    email: this.data.email.trim().toLowerCase(),
    password: this.data.password,
  };
};

User.prototype.validate = function () {
  if (this.data.username == "") {
    this.errors.push("You must provide a username.");
  }
  if (
    this.data.username != "" &&
    !validator.isAlphanumeric(this.data.username)
  ) {
    this.errors.push("Username can only contain letters and numbers.");
  }
  if (!validator.isEmail(this.data.email)) {
    this.errors.push("You must provide a valid email address.");
  }
  if (this.data.password == "") {
    this.errors.push("You must provide a password.");
  }
  if (this.data.password.length > 0 && this.data.password.length < 12) {
    this.errors.push("Password must be at least 12 characters.");
  }
  if (this.data.password.length > 50) {
    this.errors.push("Password cannot exceed 50 characters.");
  }
  if (this.data.username.length > 0 && this.data.password.length < 3) {
    this.errors.push("Username must be at least 3 characters.");
  }
  if (this.data.username.length > 25) {
    this.errors.push("Username cannot exceed 25 characters.");
  }
};

User.prototype.login = function () {
  return new Promise(async (resolve, reject) => {
    this.cleanUp();
    // #1: Validate user data
    const loginAttempt = await usersCollection.findOne({
      username: this.data.username,
    });
    // #2: Only if there are no validation errors
    if (loginAttempt && loginAttempt.password == this.data.password) {
      resolve("Congrats!");
    } else {
      reject("Invalid username / password.");
    }
  });
};

User.prototype.register = function () {
  // #1: Validate the user data
  this.cleanUp();
  this.validate();
  // #2: Only if there are no validation errors
  // then save the user data into a database
  if (!this.errors.length) {
    usersCollection.insertOne(this.data);
  }
};

module.exports = User;
