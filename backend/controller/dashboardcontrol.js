const db = require("../models/db");

exports.getDashboardStats = (req, res) => {
  const query = `
    SELECT
      (SELECT COUNT(*) FROM alat) AS totalAlat,
      (SELECT COUNT(*) FROM peminjaman WHERE status = 'dipinjam') AS dipinjam,
      (SELECT COUNT(*) FROM alat WHERE jumlah > 0) AS tersedia,
      (SELECT COUNT(*) FROM peminjaman WHERE status = 'terlambat') AS terlambat
  `;

  db.query(query, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Gagal ambil data dashboard", error: err });
    }

    // ensure numbers
    const row = results[0] || {};
    res.json({
      totalAlat: Number(row.totalAlat) || 0,
      dipinjam: Number(row.dipinjam) || 0,
      tersedia: Number(row.tersedia) || 0,
      terlambat: Number(row.terlambat) || 0,
    });
  });
};
