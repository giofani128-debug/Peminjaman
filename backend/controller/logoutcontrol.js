const logout = (req, res) => {
  return res.status(200).json({
    auth: false,
    message: "Logout berhasil"
  });
};

module.exports = { logout };