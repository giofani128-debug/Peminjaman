const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

console.log("JWT SECRET:", process.env.JWT_SECRET);

/* ================= GET ALL USER ================= */
const getUser = (req, res) => {
  User.getUser((err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
};

/* ================= REGISTER ================= */
const registerUser = (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  if (!["admin", "petugas", "user"].includes(role)) {
    return res.status(400).json({ message: "Role tidak valid" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  User.insertUser(username, email, hashedPassword, role, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User berhasil didaftarkan" });
  });
};


/* ================= GET USER BY ID ================= */
const getUserById = (req, res) => {
  const { id } = req.params;

  User.selectUserById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "User tidak ditemukan" });

    res.json(results[0]);
  });
};

/* ================= DELETE USER ================= */
const deleteUser = (req, res) => {
  const { id } = req.params;

  User.deleteUser(id, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: "User berhasil dihapus" });
  });
};

/* ================= LOGIN ================= */
const login = (req, res) => {
  const { email, password, role } = req.body;

  // validate request body early to avoid runtime errors / DB queries with undefined
  if (!email || !password || !role) {
    return res.status(400).json({ message: "Data login tidak lengkap" });
  }

  if (!["admin", "petugas", "user"].includes(role)) {
    return res.status(400).json({ message: "Role tidak valid" });
  }

  User.selectUserByEmail(email, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "User tidak ditemukan" });

    const user = results[0];
    const match = bcrypt.compareSync(password, user.password);

    if (!match)
      return res.status(401).json({ message: "Password salah" });

    if (user.role !== role) {
  return res.status(403).json({ 
    message: "Role tidak sesuai" });
}

    // ensure JWT secret is configured
    if (!process.env.JWT_SECRET) {
      console.error("JWT secret not configured (process.env.JWT_SECRET is missing)");
      return res.status(500).json({ message: "Server misconfiguration: JWT secret not set" });
    }

    // generate token and handle any signing errors
    let token;
    try {
      token = jwt.sign(
        { id_user: user.id_user, role: user.role },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
      );
    } catch (err) {
      console.error("Error generating JWT:", err);
      return res.status(500).json({ message: "Failed to generate token" });
    }

    res.json({
      token,
      dataUser: {
        id_user: user.id_user,
        username: user.username,
        email: user.email,
        role: user.role,
      }
    });
  });
}

module.exports = {
  getUser,
  registerUser,
  getUserById,
  deleteUser,
  login,
};

