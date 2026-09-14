const express = require("express");
const router = express.Router();
const alatcontrol = require("../controller/alatcontrol");

router.post("/", alatcontrol.tambahAlat);
router.get("/", alatcontrol.getAllAlat);
router.get("/:id_alat", alatcontrol.getAlatById);
router.put("/:id_alat", alatcontrol.updateAlat);
router.delete("/:id_alat", alatcontrol.deleteAlat);

module.exports = router;
