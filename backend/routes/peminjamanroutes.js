const express = require("express");
const router = express.Router();
const peminjamancontrol = require("../controller/peminjamancontrol");

router.put("/:id/setujui", peminjamancontrol.setujuiPeminjaman);
router.put("/:id/tolak", peminjamancontrol.tolakPeminjaman);
router.put("/kembalikan/:id", peminjamancontrol.kembalikanPeminjaman);


router.post("/", peminjamancontrol.tambahPeminjaman);
router.get("/", peminjamancontrol.getAllPeminjaman);
router.get("/:id", peminjamancontrol.getPeminjamanById);
router.put("/:id", peminjamancontrol.updatePeminjaman);
router.delete("/:id", peminjamancontrol.deletePeminjaman);


module.exports = router;
