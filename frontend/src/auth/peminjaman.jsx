import { useEffect, useState } from "react";
import "../css/Peminjaman.css";


/* ===== HELPER ANTI-UNDEFINED ===== */
const safe = (v) => (v === null || v === undefined ? "" : v);

const Peminjaman = () => {

  const role = localStorage.getItem("role");      // admin / petugas / user
const user_id = localStorage.getItem("user_id");

  const [peminjaman, setPeminjaman] = useState([]);
  const [alat, setAlat] = useState([]);
  const [editId, setEditId] = useState(null);
  const [kategoriFilter, setKategoriFilter] = useState("");
  const [form, setForm] = useState({
    id_alat: "",
    jumlah: "",
    tanggal_pinjam: "",
    nama_peminjam: "",
    nomor_hp: "",
  });
  const [showForm, setShowForm] = useState(false);


  /* ================= FETCH PEMINJAMAN ================= */
  const fetchPeminjaman = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/peminjaman");
      const json = await res.json();

      if (Array.isArray(json)) {
        setPeminjaman(json);
      } else if (Array.isArray(json.data)) {
        setPeminjaman(json.data);
      } else {
        setPeminjaman([]);
      }
    } catch (err) {
      console.error("Fetch peminjaman gagal:", err);
      setPeminjaman([]);
    }
  };

  /* ================= FETCH ALAT ================= */
  const fetchAlat = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/alat");
      const json = await res.json();

      setAlat(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error("Fetch alat gagal:", err);
      setAlat([]);
    }
  };

  useEffect(() => {
    fetchPeminjaman();
    fetchAlat();
  }, []);

  // derive unique categories from alat list
  const categories = Array.from(new Set(alat.map((a) => a.kategori).filter(Boolean)));

  /* ================= HANDLE INPUT ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
  e.preventDefault();

  const token = localStorage.getItem("token");
  if (!token) {
    alert("Silakan login terlebih dahulu");
    return;
  }

  const username = localStorage.getItem("username") || "";

  // Basic client-side validation to avoid sending incomplete data
  if (!form.id_alat || !form.jumlah || !(form.nama_peminjam || username) || !form.tanggal_pinjam) {
    alert("Data tidak lengkap. Silakan isi semua field.");
    return;
  }

  const url = editId
    ? `http://localhost:3000/api/peminjaman/${editId}`
    : "http://localhost:3000/api/peminjaman";

  const method = editId ? "PUT" : "POST";

  const payload = {
    user_id: Number(user_id),
    id_alat: Number(form.id_alat),
    jumlah: Number(form.jumlah),
    tanggal_pinjam: form.tanggal_pinjam,
    nama_peminjam: form.nama_peminjam || username,
    nomor_hp: form.nomor_hp || "",
  };

  try {
    console.log("Kirim payload:", payload);
    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ WAJIB
      },
      body: JSON.stringify(payload),
    });

    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }
    console.log("Server response:", res.status, data);

    if (!res.ok) {
      alert(data.message || "Gagal menyimpan");
      return;
    }

    resetForm();
    fetchPeminjaman();
    fetchAlat();
  } catch (err) {
    console.error("Submit gagal:", err);
  }
};



  /* ================= EDIT ================= */
  const handleEdit = (item) => {
    setForm({
      id_alat: safe(item.id_alat),
      jumlah: safe(item.jumlah),
      tanggal_pinjam: item.tanggal_pinjam
        ? item.tanggal_pinjam.split("T")[0]
        : "",
      nama_peminjam: safe(item.nama_peminjam),
      nomor_hp: safe(item.nomor_hp),
    });

    setEditId(item.id_peminjaman);
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus data peminjaman?")) return;

    try {
      await fetch(`http://localhost:3000/api/peminjaman/${id}`, {
        method: "DELETE",
      });

      fetchPeminjaman();
      fetchAlat();
    } catch (err) {
      console.error("Delete gagal:", err);
    }
  };

  /* ================= RESET FORM ================= */
  const resetForm = () => {
    setForm({
      id_alat: "",
      jumlah: "",
      tanggal_pinjam: "",
      nama_peminjam: "",
      nomor_hp: "",
    });
    setEditId(null);
  };

  const handleKembalikan = async (id) => {
    if (!window.confirm("Yakin ingin mengembalikan alat ini?")) return;

    try {
      await fetch(
        `http://localhost:3000/api/peminjaman/kembalikan/${id}`,
        { method: "PUT" }
      );

      fetchPeminjaman();
      fetchAlat();
    } catch (err) {
      console.error("Gagal mengembalikan:", err);
    }
  };

  const handleSetujui = async (id) => {
  const token = localStorage.getItem("token");
  if (!token || !user_id) {
    alert("Petugas belum login");
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:3000/api/peminjaman/${id}/setujui`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ petugas_id: Number(user_id) }),
      }
    );

    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!res.ok) {
      alert(data.message || "Gagal menyetujui");
      return;
    }

    fetchPeminjaman();
  } catch (err) {
    console.error("Setujui error:", err);
  }
};


const handleTolak = async (id) => {
  const token = localStorage.getItem("token");
  if (!token || !user_id) {
    alert("Petugas belum login");
    return;
  }

  try {
    const res = await fetch(
      `http://localhost:3000/api/peminjaman/${id}/tolak`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ petugas_id: Number(user_id) }),
      }
    );

    const text = await res.text();
    let data;
    try { data = JSON.parse(text); } catch { data = { raw: text }; }

    if (!res.ok) {
      alert(data.message || "Gagal menolak");
      return;
    }

    fetchPeminjaman();
  } catch (err) {
    console.error("Tolak error:", err);
  }
};


  // helper: currently selected alat based on form.id_alat
  const selectedAlat = alat.find((a) => String(a.id_alat) === String(form.id_alat));

  /* ================= FORM (floating modal) ================= */
  return (
    <div className="peminjaman-page">
      <h2 className="peminjaman-title">Data Peminjaman</h2>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 14 }}>
        <button onClick={() => { resetForm(); setShowForm(true); }} style={{ padding: '8px 14px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}>
          {editId ? 'Edit Peminjaman' : 'Tambah Peminjaman'}
        </button>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.5)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 60, zIndex: 9999 }} onClick={() => setShowForm(false)}>
          <div style={{ width: 760, maxWidth: '95%', background: '#fff', borderRadius: 12, padding: 20, boxShadow: '0 20px 60px rgba(2,6,23,0.4)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>{editId ? 'Edit Peminjaman' : 'Tambah Peminjaman'}</h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={() => { resetForm(); setShowForm(false); }} style={{ padding: '6px 10px', borderRadius: 8, background: '#e5e7eb', border: 'none', cursor: 'pointer' }}>Batal</button>
              </div>
            </div>

            <form onSubmit={(e) => { handleSubmit(e); setShowForm(false); }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, alignItems: 'end' }}>
                <div>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Filter Kategori</label>
                  <select value={kategoriFilter} onChange={(e) => setKategoriFilter(e.target.value)} style={{ width: '100%', padding: 10, borderRadius: 8 }}>
                    <option value="">-- Semua Kategori --</option>
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Pilih Alat</label>
                  <select name="id_alat" value={form.id_alat} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 8 }}>
                    <option value="">-- Pilih Alat --</option>
                    {alat
                      .filter((a) => !kategoriFilter || a.kategori === kategoriFilter)
                      .map((a) => (
                        <option key={a.id_alat} value={a.id_alat} disabled={a.jumlah <= 0}>
                          {a.nama_barang} — {a.kategori} (stok: {a.jumlah})
                        </option>
                      ))}
                  </select>
                  {selectedAlat && (
                    <div style={{ marginTop: 8, fontSize: 13, color: '#334155' }}>
                      <strong>Stok:</strong> {selectedAlat.jumlah} • <strong>Kategori:</strong> {selectedAlat.kategori}
                    </div>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Jumlah</label>
                  <input type="number" name="jumlah" value={form.jumlah} onChange={handleChange} required min="1" style={{ width: '100%', padding: 10, borderRadius: 8 }} />
                </div>


                <div>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Nama Peminjam</label>
                  <input
                    type="text"
                    name="nama_peminjam"
                    value={form.nama_peminjam}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: 10, borderRadius: 8 }}
                    placeholder="Nama peminjam"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Nomor HP</label>
                  <input
                    type="text"
                    name="nomor_hp"
                    value={form.nomor_hp}
                    onChange={handleChange}
                    required
                    style={{ width: '100%', padding: 10, borderRadius: 8 }}
                    placeholder="Nomor HP peminjam"
                  />
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Tanggal Pinjam</label>
                  <input type="date" name="tanggal_pinjam" value={form.tanggal_pinjam} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 8 }} />
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <button type="button" onClick={() => { resetForm(); setShowForm(false); }} style={{ flex: 1, padding: 10, borderRadius: 8, background: '#e2e8f0', border: 'none', cursor: 'pointer' }}>Reset</button>
                  <button type="submit" style={{ flex: 2, padding: 10, borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}>{editId ? 'Update Peminjaman' : 'Tambah Peminjaman'}</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================= TABLE ================= */}
      <div className="peminjaman-table-wrapper">
        <table className="peminjaman-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Id Alat</th>
              <th>Kategori</th>
              <th>Jumlah</th>
              <th>Nama</th>
              <th>Nomor HP</th>
              <th>Tanggal Pinjam</th>
              <th>Tanggal Kembali</th>
              <th>Status</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {peminjaman.length === 0 ? (
              <tr>
                <td colSpan="10" style={{ textAlign: "center" }}>
                  Data kosong
                </td>
              </tr>
            ) : (
              peminjaman.map((item) => (
                <tr key={item.id_peminjaman}>
                  <td>{item.id_peminjaman}</td>
                  <td>{item.nama_barang}</td>
                  <td>{item.kategori}</td>
                  <td>{item.jumlah}</td>
                  <td>{item.nama_peminjam}</td>
                  <td>{item.nomor_hp || '-'}</td>
                  <td>{item.tanggal_pinjam?.split("T")[0]}</td>
                  <td>{item.tanggal_kembali?.split("T")[0] || "-"}</td>
                  <td>{item.status}</td>
                  <td className="aksi">
                    {item.status === "dipinjam" && (
                      <button
                        type="button"
                        className="btn-kembalikan"
                        onClick={() => handleKembalikan(item.id_peminjaman)}
                      >
                        Kembalikan
                      </button>
                    )}

                    {role === "petugas" && item.status === "menunggu" && (
  <>
    <button
      type="button"
      onClick={() => handleSetujui(item.id_peminjaman)}
      className="btn-setujui"
    >
      Setujui
    </button>

    <button
      type="button"
      onClick={() => handleTolak(item.id_peminjaman)}
      className="btn-tolak"
    >
      Tolak
    </button>
  </>
)}


                    <button type="button" onClick={() => handleEdit(item)}>
                      Edit
                    </button>

                    <button
                      type="button"
                      onClick={() => handleDelete(item.id_peminjaman)}
                    >
                      Delete
                    </button>
                  </td>

                </tr>

              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Peminjaman;
