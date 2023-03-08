const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user.model");
const Token = require("../models/tokens.model");

const maxAge = 3 * 24 * 60 * 60;
const createToken = (name) => {
  return jwt.sign({ name, date: Date.now() }, process.env.JWTSECRET, {
    expiresIn: maxAge,
  });
};

const auth = (req, res) => {
  const { user } = req;
  res.status(200).send({ user });
};

const login = async (req, res) => {
  const { name, password } = req.body;
  try {
    if (name && name.trim() && password && password.trim()) {
      const user = await User.findOne({
        where: { name: name.trim() },
      });

      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (result) {
            const { name } = user;
            const token = createToken(name);
            res.status(200).send({ token, user: { name } });
          } else {
            res.status(404).send("Invalid login or password");
          }
        });
      } else {
        res.status(404).send("Invalid login or password");
      }
    } else {
      res.status(422).send("login and password are required");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

const logout = async (req, res) => {
  const { token } = req.body;

  try {
    // Add to blacklist
    await Token.create({ token });
    res.status(200).send("Successful logout");
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = { auth, login, logout };
