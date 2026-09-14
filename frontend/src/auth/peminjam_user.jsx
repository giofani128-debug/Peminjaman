import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const PeminjamanUser = () => {
  const rawUserId = localStorage.getItem("user_id");
  const user_id = rawUserId ? parseInt(rawUserId, 10) : null;
  const username = localStorage.getItem("username") || "";
  const navigate = useNavigate();
  const [alat, setAlat] = useState([]);
  const [peminjaman, setPeminjaman] = useState([]);
  const [form, setForm] = useState({
    id_alat: "",
    jumlah: "",
    tanggal_pinjam: "",
    nomor_hp: "",
  });
  const [showForm, setShowForm] = useState(false);

  /* ================= FETCH ALAT ================= */
  const fetchAlat = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/alat");
      const json = await res.json();
      setAlat(Array.isArray(json.data) ? json.data : []);
    } catch (err) {
      console.error(err);
      setAlat([]);
    }
  };

  /* ================= FETCH PEMINJAMAN USER ================= */
  const fetchPeminjaman = async () => {
    try {
      const token = localStorage.getItem("token");
      const rawUserId = localStorage.getItem("user_id");
      if (!token || !rawUserId) return;

      const res = await fetch(
        `http://localhost:3000/api/peminjaman?user_id=${rawUserId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔥 WAJIB
          },
        }
      );

      const json = await res.json();
      setPeminjaman(
        Array.isArray(json) ? json : Array.isArray(json.data) ? json.data : []
      );
    } catch (err) {
      console.error(err);
      setPeminjaman([]);
    }
  };

  useEffect(() => {
    fetchAlat();
    fetchPeminjaman();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // helper: currently selected alat based on form.id_alat
  const selectedAlat = alat.find((a) => String(a.id_alat) === String(form.id_alat));

  /* ================= SUBMIT ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      alert("Silakan login terlebih dahulu");
      return;
    }

    
    const peminjamId = user_id;
    const peminjamName = username;

    if (!peminjamId || !peminjamName) {
      console.error("Peminjam tidak valid:", { peminjamId, peminjamName });
      alert("User belum lengkap, silakan login ulang");
      return;
    }
    if (!form.id_alat || !form.jumlah || !form.tanggal_pinjam) {
      alert("Data tidak lengkap. Silakan isi semua field.");
      return;
    }

    const payload = {
      user_id: peminjamId,
      id_alat: Number(form.id_alat),
      jumlah: Number(form.jumlah),
      tanggal_pinjam: form.tanggal_pinjam,
      nama_peminjam: peminjamName,
      nomor_hp: form.nomor_hp || "",
    };

    console.log("Kirim payload peminjaman user:", payload);
    try {
      const res = await fetch("http://localhost:3000/api/peminjaman", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // 🔥 INI WAJIB
        },
        body: JSON.stringify(payload),
      });

      const text = await res.text();

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("Response bukan JSON:", text);
        alert("Server error (cek backend)");
        return;
      }

      console.log("Response status:", res.status, data);

      if (!res.ok) {
        alert(data.message || "Gagal mengajukan peminjaman");
        return;
      }

      setForm({ id_alat: "", jumlah: "", tanggal_pinjam: "", nomor_hp: "" });
      fetchPeminjaman();
    } catch (err) {
      console.error("Submit gagal:", err);
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Ajukan Peminjaman</h2>

      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginBottom: 12 }}>
        <button type="button" onClick={() => { setForm({ id_alat: '', jumlah: '', tanggal_pinjam: '' }); setShowForm(true); }} style={{ padding: '8px 12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer' }}>
          Ajukan Peminjaman
        </button>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.5)', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: 60, zIndex: 9999 }} onClick={() => setShowForm(false)}>
          <div style={{ width: 640, maxWidth: '96%', background: '#fff', borderRadius: 10, padding: 20, boxShadow: '0 18px 48px rgba(2,6,23,0.36)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
              <h3 style={{ margin: 0 }}>Ajukan Peminjaman</h3>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>✖</button>
            </div>

            <form onSubmit={(e) => { handleSubmit(e); setShowForm(false); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              <div>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Pilih Alat</label>
                <select name="id_alat" value={form.id_alat} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 8 }}>
                  <option value="">-- Pilih Alat --</option>
                  {alat.map((a) => (
                    <option key={a.id_alat} value={a.id_alat} disabled={a.jumlah <= 0}>
                      {a.nama_barang} — {a.kategori} (stok {a.jumlah})
                    </option>
                  ))}
                </select>
                {selectedAlat && <div style={{ marginTop: 8, color: '#374151' }}>Stok: {selectedAlat.jumlah} • Kategori: {selectedAlat.kategori}</div>}
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Jumlah</label>
                <input type="number" name="jumlah" placeholder="Jumlah" value={form.jumlah} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 8 }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Tanggal Pinjam</label>
                <input type="date" name="tanggal_pinjam" value={form.tanggal_pinjam} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 8 }} />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: 13, marginBottom: 6 }}>Nomor HP</label>
                <input type="text" name="nomor_hp" placeholder="Nomor HP" value={form.nomor_hp} onChange={handleChange} required style={{ width: '100%', padding: 10, borderRadius: 8 }} />
              </div>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8 }}>
                <button type="button" onClick={() => { setForm({ id_alat: '', jumlah: '', tanggal_pinjam: '' }); }} style={{ padding: '10px', borderRadius: 8, background: '#e2e8f0', border: 'none', cursor: 'pointer' }}>Reset</button>
                <button type="submit" style={{ padding: '10px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}>Ajukan</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <hr />

      <h3>Riwayat Peminjaman Saya</h3>

      <table border="1" cellPadding="6">
        <thead>
          <tr>
            <th>Kategori</th>
            <th>Barang</th>
            <th>Jumlah</th>
            <th>Nomor HP</th>
            <th>Tanggal</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {peminjaman.length === 0 ? (
            <tr>
              <td colSpan="4">Belum ada data</td>
            </tr>
          ) : (
            peminjaman.map((p) => (
              <tr key={p.id_peminjaman}>
                <td>{p.kategori}</td>
                <td>{p.nama_barang}</td>
                <td>{p.jumlah}</td>
                <td>{p.nomor_hp || '-'}</td>
                <td>{p.tanggal_pinjam?.split("T")[0]}</td>
                <td>{p.status}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PeminjamanUser;
