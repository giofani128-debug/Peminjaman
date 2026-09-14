import { useEffect, useState } from "react";
import "../css/Alat.css";

const Alat = () => {
  const [alat, setAlat] = useState([]);

  // ===== FORM STATE =====
  const [form, setForm] = useState({
    nama_barang: "",
    kategori: "",
    jumlah: "",
    kondisi: "baik",
  });

  const [editId, setEditId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  // ===== GET DATA =====
  const fetchAlat = async () => {
    const res = await fetch("http://localhost:3000/api/alat");
    const data = await res.json();
    setAlat(data.data || []);
  };

  useEffect(() => {
    fetchAlat();
  }, []);

  // ===== HANDLE INPUT =====
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ===== TAMBAH / UPDATE =====
  const handleSubmit = async (e) => {
    e.preventDefault();

    const url = editId
      ? `http://localhost:3000/api/alat/${editId}`
      : "http://localhost:3000/api/alat";

    const method = editId ? "PUT" : "POST";

    await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setForm({
      nama_barang: "",
      kategori: "",
      jumlah: "",
      kondisi: "baik",
    });

    setEditId(null);
    setShowForm(false);
    fetchAlat();
  };

  // ===== EDIT =====
  const handleEdit = (item) => {
    setForm({
      nama_barang: item.nama_barang,
      kategori: item.kategori,
      jumlah: item.jumlah,
      kondisi: item.kondisi,
    });
    setEditId(item.id_alat);
    setShowForm(true); // open modal when editing
  };

  // ===== DELETE =====
  const handleDelete = async (id) => {
    if (!window.confirm("Yakin hapus alat ini?")) return;

    await fetch(`http://localhost:3000/api/alat/${id}`, {
      method: "DELETE",
    });

    fetchAlat();
  };

  return (
    <div className="alat-page">
      <h2 className="alat-title">Data Alat</h2>

      <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 12 }}>
        <button type="button" onClick={() => { setForm({ nama_barang: '', kategori: '', jumlah: '', kondisi: 'baik' }); setEditId(null); setShowForm(true); }} style={{ padding: '8px 12px', borderRadius: 8, background: '#2563eb', color: '#fff', border: 'none', cursor: 'pointer' }}>
          Tambah Buku
        </button>
      </div>

      {showForm && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(2,6,23,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999 }} onClick={() => setShowForm(false)}>
          <div style={{ width: 520, maxWidth: '96%', background: '#fff', borderRadius: 12, padding: 18, boxShadow: '0 18px 48px rgba(2,6,23,0.36)' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
              <h3 style={{ margin: 0 }}>{editId ? 'Edit Alat' : 'Tambah Alat'}</h3>
              <button type="button" onClick={() => setShowForm(false)} style={{ background: 'transparent', border: 'none', cursor: 'pointer' }}>✖</button>
            </div>

            <form onSubmit={(e) => { handleSubmit(e); setShowForm(false); }} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              <input type="text" name="nama_barang" placeholder="Nama Barang" value={form.nama_barang} onChange={handleChange} required style={{ padding: 10, borderRadius: 8 }} />

              <select name="kategori" value={form.kategori} onChange={handleChange} required style={{ padding: 10, borderRadius: 8 }}>
                <option value="">Pilih Kategori</option>
                <option value="Anak-Anak">Anak-Anak</option>
                <option value="Sejarah">Sejarah</option>
                <option value="Dewasa">Dewasa</option>
              </select>

              <input type="number" name="jumlah" placeholder="Jumlah" value={form.jumlah} onChange={handleChange} required style={{ padding: 10, borderRadius: 8 }} />

              <select name="kondisi" value={form.kondisi} onChange={handleChange} style={{ padding: 10, borderRadius: 8 }}>
                <option value="baik">Baik</option>
                <option value="rusak">Rusak</option>
                <option value="perlu perbaikan">Perlu Perbaikan</option>
              </select>

              <div style={{ gridColumn: '1 / -1', display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 6 }}>
                <button type="button" onClick={() => { setForm({ nama_barang: '', kategori: '', jumlah: '', kondisi: 'baik' }); setEditId(null); }} style={{ padding: '8px 12px', borderRadius: 8, background: '#e5e7eb', border: 'none', cursor: 'pointer' }}>Reset</button>
                <button type="submit" style={{ padding: '8px 14px', borderRadius: 8, background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer' }}>{editId ? 'Update Alat' : 'Tambah Alat'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ===== TABLE ===== */}
      <div className="alat-table-wrapper">
        <table className="alat-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Nama Barang</th>
              <th>Kategori</th>
              <th>Jumlah</th>
              <th>Kondisi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {alat.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  Data kosong
                </td>
              </tr>
            ) : (
              alat.map((item) => (
                <tr key={item.id_alat}>
                  <td>{item.id_alat}</td>
                  <td>{item.nama_barang}</td>
                  <td>{item.kategori}</td>
                  <td>{item.jumlah}</td>
                  <td>
                    <span className={`kondisi ${item.kondisi.replace(/\s/g, "")}`}>
                      {item.kondisi}
                    </span>
                  </td>
                  <td className="aksi">
                    <button type="button" onClick={() => handleEdit(item)}>
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(item.id_alat)}
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

export default Alat;
