const User = require("../models/User");

exports.login = (req, res) => {
  let user = new User(req.body);
  user.login(function (result) {
    res.send(result);
  });
};

exports.logout = (req, res) => {};

exports.register = (req, res) => {
  let user = new User(req.body);
  user.register();
  if (user.errors.length) {
    res.send(user.errors);
  } else {
    res.send("Congrats, you have registered successfully!");
  }
};

exports.home = (req, res) => {
  res.render("home-guest");
};
