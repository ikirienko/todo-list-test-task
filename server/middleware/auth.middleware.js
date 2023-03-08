const jwt = require("jsonwebtoken");
const Token = require("../models/tokens.model");
const User = require("../models/user.model");

const requireAuth = async (req, res, next) => {
  const token = req.headers.authorization;

  try {
    if (token) {
      const isTokenInBlackList = await Token.findOne({ where: { token } });
      if (isTokenInBlackList) {
        return res.status(401).send("Unauthorized. The token is in black list");
      }

      jwt.verify(token, process.env.JWTSECRET, async (err, result) => {
        if (err) {
          return res
            .status(403)
            .send(`Unauthorized. Error message: ${err.message}`);
        }
        const { name } = result;
        const user = await User.findOne({ name });
        if (!user) {
          return res.status(403).send(`Unauthorized. User not found`);
        }
        req.user = { name: user.name };
        next();
      });
    } else {
      res.status(401).send("Unauthorized. Authorization header missing");
    }
  } catch (err) {
    res.status(500).send(err);
  }
};

module.exports = requireAuth;
