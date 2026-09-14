const jwt = require("jsonwebtoken");
// const { isAdmin, isPetugas } = require("./middleware");

const authJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Token tidak ada" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token tidak valid" });
  }
};

 const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({ message: "Akses admin saja" });
  }
  next();
};

const isPetugas = (req, res, next) => {
  if (!["admin", "petugas"].includes(req.user.role)) {
    return res.status(403).json({ message: "Akses ditolak" });
  }
  next();
};

module.exports = { 
  authJWT, 
  isAdmin,
  isPetugas,
};
