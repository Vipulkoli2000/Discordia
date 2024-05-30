const jwt = require("jsonwebtoken");
const User = require("../Schema/userSchema");

exports.isAuthenticated = async (req, res, next) => {
  let token;
  const cookies = req.cookies;

  if (!cookies?.jwt) {
    console.log("we in here 1");

    return res.status(401).send("Not Authorized, No token");
  }

  try {
    token = cookies.jwt;

    const decoded = jwt.verify(token, "yash");

    const user = await User.findOne(
      { _id: decoded.userId },
      { password: false }
    );
    if (user) {
      req.user = user;
      next();
    } else {
      res.status(401).send("Invalid Token");
    }
  } catch (error) {
    res.status(401).send("Not Authorized");
  }
};

exports.isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).send("Not An Admin");
  }
};
