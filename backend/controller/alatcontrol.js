const Alat = require("../models/alat");

// ================= TAMBAH ALAT =================
const tambahAlat = (req, res) => {
    const { nama_barang, kategori, jumlah, kondisi } = req.body;

    // Validasi
    if (!nama_barang || !kategori || jumlah === undefined || !kondisi) {
        return res.status(400).json({
            success: false,
            message: "nama_barang, kategori, jumlah, dan kondisi wajib diisi"
        });
    }

    Alat.insertBarang(
        { nama_barang, kategori, jumlah, kondisi },
        (err, result) => {
            if (err) {
                console.error("ERROR SQL:", err);
                return res.status(500).json({
                    success: false,
                    message: "Gagal menambah alat",
                    error: err.sqlMessage || err.message
                });
            }

            res.status(201).json({
                success: true,
                message: "Alat berhasil ditambahkan",
                id_alat: result.insertId
            });
        }
    );
};

// ================= GET SEMUA ALAT =================
const getAllAlat = (req, res) => {
    Alat.getAllAlat((err, result) => {
        if (err) {
            console.error("ERROR SQL:", err);
            return res.status(500).json({
                success: false,
                message: "Gagal mengambil data alat",
                error: err.sqlMessage || err.message
            });
        }

        res.json({
            success: true,
            data: result
        });
    });
};

// ================= GET ALAT BY ID =================
const getAlatById = (req, res) => {
    const { id_alat } = req.params;

    Alat.getAlatById(id_alat, (err, result) => {
        if (err) {
            console.error("ERROR SQL:", err);
            return res.status(500).json({
                success: false,
                message: "Gagal mengambil data alat",
                error: err.sqlMessage || err.message
            });
        }

        if (result.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Alat tidak ditemukan"
            });
        }

        res.json({
            success: true,
            data: result[0]
        });
    });
};

// ================= UPDATE ALAT =================
const updateAlat = (req, res) => {
    const { id_alat } = req.params;
    const { nama_barang, kategori, jumlah, kondisi } = req.body;

    if (!nama_barang || !kategori || jumlah === undefined || !kondisi) {
        return res.status(400).json({
            success: false,
            message: "nama_barang, kategori, jumlah, dan kondisi wajib diisi"
        });
    }

    Alat.updateAlat(
        id_alat,
        { nama_barang, kategori, jumlah, kondisi },
        (err, result) => {
            if (err) {
                console.error("ERROR SQL:", err);
                return res.status(500).json({
                    success: false,
                    message: "Gagal update alat",
                    error: err.sqlMessage || err.message
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    success: false,
                    message: "Alat tidak ditemukan"
                });
            }

            res.json({
                success: true,
                message: "Alat berhasil diperbarui"
            });
        }
    );
};

// ================= DELETE ALAT =================
const deleteAlat = (req, res) => {
    const { id_alat } = req.params;

    Alat.deleteAlat(id_alat, (err, result) => {
        if (err) {
            console.error("ERROR SQL:", err);
            return res.status(500).json({
                success: false,
                message: "Gagal menghapus alat",
                error: err.sqlMessage || err.message
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Alat tidak ditemukan"
            });
        }

        res.json({
            success: true,
            message: "Alat berhasil dihapus"
        });
    });
};

module.exports = {
    tambahAlat,
    getAllAlat,
    getAlatById,
    updateAlat,
    deleteAlat,
};
