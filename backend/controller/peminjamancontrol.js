const Peminjaman = require("../models/peminjaman");

// ================= TAMBAH =================
const tambahPeminjaman = (req, res) => {
  const {
    user_id,
    id_alat,
    jumlah,
    tanggal_pinjam,
    nama_peminjam,
    nomor_hp,
  } = req.body;

  // VALIDASI WAJIB
  if (!user_id || !id_alat || !jumlah || !tanggal_pinjam || !nama_peminjam) {
    return res.status(400).json({ message: "Data tidak lengkap" });
  }

  Peminjaman.tambah(
    {
      user_id,
      id_alat,
      jumlah,
      nama_peminjam,
      nomor_hp: nomor_hp || null,
      tanggal_pinjam,
      tanggal_kembali: null,
      status: "menunggu",
    },
    (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ error: err.message });
      }
      res.json({ message: "Peminjaman berhasil ditambahkan" });
    }
  );
};

const kembalikanPeminjaman = (req, res) => {
  const { id } = req.params;

  Peminjaman.kembalikan(id, (err, result) => {
    if (err) {
      console.error(err);
      return res.status(500).json({ error: err.message });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Data tidak ditemukan" });
    }

    res.json({ message: "Peminjaman berhasil dikembalikan" });
  });
};

// ================= SETUJU =================
const setujuiPeminjaman = (req, res) => {
  const { id } = req.params;
  const { petugas_id } = req.body;

  if (!petugas_id) {
    return res.status(400).json({ message: "petugas_id wajib" });
  }

  Peminjaman.setujui(id, petugas_id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    res.json({ message: "Peminjaman disetujui" });
  });
};

// ================= SETUJU + KURANGI STOK =================
const setujuiPeminjamanKurangiStok = (req, res) => {
  const { id } = req.params;
  const { petugas_id } = req.body;

  if (!petugas_id) {
    return res.status(400).json({ message: "petugas_id wajib" });
  }

  const getDataSql = `
    SELECT p.id_alat, p.jumlah, a.jumlah AS stok
    FROM peminjaman p
    JOIN alat a ON p.id_alat = a.id_alat
    WHERE p.id_peminjaman = ?
  `;

  db.query(getDataSql, [id], (err, rows) => {
    if (err) return res.status(500).json(err);
    if (rows.length === 0)
      return res.status(404).json({ message: "Peminjaman tidak ditemukan" });

    const { id_alat, jumlah, stok } = rows[0];

    if (stok < jumlah) {
      return res.status(400).json({ message: "Stok alat tidak mencukupi" });
    }

    db.query(
      `UPDATE alat SET jumlah = jumlah - ? WHERE id_alat = ?`,
      [jumlah, id_alat],
      (err) => {
        if (err) return res.status(500).json(err);

        Peminjaman.setujui(id, petugas_id, (err) => {
          if (err) return res.status(500).json(err);
          res.json({ message: "Peminjaman disetujui & stok dikurangi" });
        });
      }
    );
  });
};

// ================= TOLAK =================
const tolakPeminjaman = (req, res) => {
  const { id } = req.params;
  const { petugas_id } = req.body;

  if (!petugas_id) {
    return res.status(400).json({ message: "petugas_id wajib" });
  }

  Peminjaman.tolak(id, petugas_id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    res.json({ message: "Peminjaman ditolak" });
  });
};

// ================= GET ALL / BY USER =================
const getAllPeminjaman = (req, res) => {
  const { user_id } = req.query;

  if (user_id) {
    Peminjaman.getByUser(user_id, (err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  } else {
    Peminjaman.getAll((err, results) => {
      if (err) return res.status(500).json(err);
      res.json(results);
    });
  }
};

// ================= GET BY ID =================
const getPeminjamanById = (req, res) => {
  const { id } = req.params;

  Peminjaman.getById(id, (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    if (results.length === 0)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    res.json(results[0]);
  });
};

// ================= UPDATE =================
const updatePeminjaman = (req, res) => {
  const { id } = req.params;

  Peminjaman.update(id, req.body, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    res.json({ message: "Peminjaman berhasil diupdate" });
  });
};

// ================= DELETE =================
const deletePeminjaman = (req, res) => {
  const { id } = req.params;

  Peminjaman.delete(id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    if (result.affectedRows === 0)
      return res.status(404).json({ message: "Data tidak ditemukan" });

    res.json({ message: "Peminjaman berhasil dihapus" });
  });
};

module.exports = {
    tambahPeminjaman,
    getAllPeminjaman,
    getPeminjamanById,
    updatePeminjaman,
    deletePeminjaman,
    kembalikanPeminjaman,
    setujuiPeminjaman,
    tolakPeminjaman,
}