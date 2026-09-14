const db = require("./db");

const Peminjaman = {

  // ================= TAMBAH PEMINJAMAN =================
tambah: (data, callback) => {
  const sql = `
    INSERT INTO peminjaman
    (user_id, id_alat, jumlah, nama_peminjam, nomor_hp, tanggal_pinjam, tanggal_kembali, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [
    data.user_id,
    data.id_alat,
    data.jumlah,
    data.nama_peminjam,
    data.nomor_hp,
    data.tanggal_pinjam,
    data.tanggal_kembali,
    data.status
  ], callback);
},

kembalikan: (id, callback) => {
  const sql = `
    UPDATE peminjaman
    SET
      status = 'dikembalikan',
      tanggal_kembali = NOW()
    WHERE id_peminjaman = ?
  `;
  db.query(sql, [id], callback);
},

setujui: (id, petugas_id, callback) => {
  const sql = `
    UPDATE peminjaman
    SET
      status = 'dipinjam',
      petugas_id = ?,
      tanggal_persetujuan = NOW()
    WHERE id_peminjaman = ?
  `;
  db.query(sql, [petugas_id, id], callback);
},

tolak: (id, petugas_id, callback) => {
  const sql = `
    UPDATE peminjaman
    SET
      status = 'ditolak',
      petugas_id = ?
    WHERE id_peminjaman = ?
  `;
  db.query(sql, [petugas_id, id], callback);
},




  // ================= GET ALL =================
getAll: (callback) => {
  const sql = `
    SELECT
      p.id_peminjaman,
      p.id_alat,
      a.nama_barang,
      a.kategori,
      p.jumlah,
      p.nama_peminjam,
      p.nomor_hp,
      p.tanggal_pinjam,
      p.tanggal_kembali,
      p.status
    FROM peminjaman p
    LEFT JOIN alat a ON p.id_alat = a.id_alat
    ORDER BY p.created_at DESC
  `;
  db.query(sql, callback);
},

// ================= GET BY USER =================
getByUser: (user_id, callback) => {
  const sql = `
    SELECT
      p.id_peminjaman,
      p.id_alat,
      a.nama_barang,
      a.kategori,
      p.jumlah,
      p.nama_peminjam,
      p.nomor_hp,
      p.tanggal_pinjam,
      p.tanggal_kembali,
      p.status
    FROM peminjaman p
    JOIN alat a ON p.id_alat = a.id_alat
    WHERE p.user_id = ?
    ORDER BY p.created_at DESC
  `;
  db.query(sql, [user_id], callback);
},

  // ================= GET BY ID =================
  getById: (id, callback) => {
    const sql = `SELECT * FROM peminjaman WHERE id_peminjaman = ?`;
    db.query(sql, [id], callback);
  },

  // ================= UPDATE =================
  update: (id, data, callback) => {
  const sql = `
    UPDATE peminjaman SET
      id_alat = ?,
      jumlah = ?,
      nama_peminjam = ?,
      nomor_hp = ?,
      tanggal_pinjam = ?,
      tanggal_kembali = ?,
      status = ?
    WHERE id_peminjaman = ?
  `;

  db.query(
    sql,
    [
      data.id_alat,
      data.jumlah,
      data.nama_peminjam,
      data.nomor_hp,
      data.tanggal_pinjam,
      data.tanggal_kembali,
      data.status,
      id
    ],
    callback
  );
},


  // ================= DELETE =================
  delete: (id, callback) => {
    const sql = `DELETE FROM peminjaman WHERE id_peminjaman = ?`;
    db.query(sql, [id], callback);
  }

};

module.exports = Peminjaman;
