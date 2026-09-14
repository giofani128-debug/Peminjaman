const db = require("./db");

const Alat = {};

/* ================= INSERT ALAT ================= */
Alat.insertBarang = (data, callback) => {
  const { nama_barang, kategori, jumlah, kondisi } = data;

  const sql = `
    INSERT INTO alat (nama_barang, kategori, jumlah, kondisi)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [nama_barang, kategori, jumlah, kondisi],
    (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    }
  );
};

/* ================= GET SEMUA ALAT ================= */
Alat.getAllAlat = (callback) => {
  const sql = `
    SELECT id_alat, nama_barang, kategori, jumlah, kondisi, created_at
    FROM alat
    ORDER BY created_at DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
};

/* ================= GET ALAT BY ID ================= */
Alat.getAlatById = (id_alat, callback) => {
  const sql = `
    SELECT id_alat, nama_barang, kategori, jumlah, kondisi
    FROM alat
    WHERE id_alat = ?
  `;

  db.query(sql, [id_alat], (err, rows) => {
    if (err) return callback(err);
    callback(null, rows);
  });
};

/* ================= UPDATE ALAT ================= */
Alat.updateAlat = (id_alat, data, callback) => {
  const { nama_barang, kategori, jumlah, kondisi } = data;

  const sql = `
    UPDATE alat
    SET nama_barang = ?, kategori = ?, jumlah = ?, kondisi = ?
    WHERE id_alat = ?
  `;

  db.query(
    sql,
    [nama_barang, kategori, jumlah, kondisi, id_alat],
    (err, result) => {
      if (err) return callback(err);
      callback(null, result);
    }
  );
};

/* ================= DELETE ALAT ================= */
Alat.deleteAlat = (id_alat, callback) => {
  const sql = `
    DELETE FROM alat
    WHERE id_alat = ?
  `;

  db.query(sql, [id_alat], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

/* ================= KURANGI STOK ================= */
Alat.kurangiStok = (id_alat, jumlah, callback) => {
  const sql = `
    UPDATE alat
    SET jumlah = jumlah - ?
    WHERE id_alat = ? AND jumlah >= ?
  `;

  db.query(sql, [jumlah, id_alat, jumlah], (err, result) => {
    if (err) return callback(err);

    if (result.affectedRows === 0) {
      return callback({ message: "Stok tidak mencukupi" });
    }

    callback(null, result);
  });
};

/* ================= TAMBAH STOK ================= */
Alat.tambahStok = (id_alat, jumlah, callback) => {
  const sql = `
    UPDATE alat
    SET jumlah = jumlah + ?
    WHERE id_alat = ?
  `;

  db.query(sql, [jumlah, id_alat], (err, result) => {
    if (err) return callback(err);
    callback(null, result);
  });
};

module.exports = Alat;
