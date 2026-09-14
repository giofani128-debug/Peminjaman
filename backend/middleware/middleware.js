const jwt = require("jsonwebtoken");
const secretKey = "ayoosekolah"

const isAdmin = (req, res, next) => {
  if (req.user.role_id === 1) {
    next();
  } else {
    res.status(403).json({ message: "Admin only" });
  }
};

const isPetugas = (req, res, next) => {
  if (req.user.role_id === 3) {
    next();
  } else {
    res.status(403).json({ message: "Petugas only" });
  }
};

const isPeminjam = (req, res, next) => {
  if (req.user.role_id === 2) {
    next();
  } else {
    res.status(403).json({ message: "User only" });
  }
};


const authJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token tidak ada" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, secretKey, (err, user) => {
    if (err) {
      return res.status(403).json({ message: "Token tidak valid" });
    }

    req.user = user;
    next();
  });
};

module.exports={
    authJWT,
    isAdmin,
    isPetugas,
    isPeminjam
}