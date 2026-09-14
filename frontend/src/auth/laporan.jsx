import { useEffect, useState } from "react";
import "../css/Laporan.css";

const API_URL = "http://localhost:3000/api/peminjaman";

const Laporan = () => {
  const [data, setData] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filter, setFilter] = useState({
    dari: "",
    sampai: "",
    status: "",
    kategori: "",
  });

  // ===== GET DATA =====
  const fetchData = async () => {
    const res = await fetch(API_URL);
    const json = await res.json();

    if (Array.isArray(json)) {
      setData(json);

      // derive categories
      const cats = Array.from(new Set(json.map((i) => i.kategori).filter(Boolean)));
      setCategories(cats);
    } else if (Array.isArray(json.data)) {
      setData(json.data);
      const cats = Array.from(new Set(json.data.map((i) => i.kategori).filter(Boolean)));
      setCategories(cats);
    } else {
      setData([]);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ===== FILTER DATA =====
  const filteredData = data.filter((item) => {
    const tgl = item.tanggal_pinjam
      ? item.tanggal_pinjam.split("T")[0]
      : "";
    const dari = filter.dari;
    const sampai = filter.sampai;

    return (
      (!filter.status || item.status === filter.status) &&
      (!filter.kategori || item.kategori === filter.kategori) &&
      (!dari || tgl >= dari) &&
      (!sampai || tgl <= sampai)
    );
  });

  return (
    <div className="laporan-page">
      <h2 className="laporan-title">Laporan Peminjaman</h2>

      {/* FILTER */}
      <div className="laporan-filter">
        <input
          type="date"
          value={filter.dari}
          onChange={(e) => setFilter({ ...filter, dari: e.target.value })}
        />

        <input
          type="date"
          value={filter.sampai}
          onChange={(e) => setFilter({ ...filter, sampai: e.target.value })}
        />

        <select
          value={filter.status}
          onChange={(e) => setFilter({ ...filter, status: e.target.value })}
        >
          <option value="">Semua Status</option>
          <option value="dipinjam">Dipinjam</option>
          <option value="dikembalikan">Dikembalikan</option>
        </select>

        <select
          value={filter.kategori}
          onChange={(e) => setFilter({ ...filter, kategori: e.target.value })}
        >
          <option value="">Semua Kategori</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>

        <button onClick={() => window.print()}>
          Cetak Laporan
        </button>
      </div>

      {/* TABLE */}
      <table className="laporan-table">
        <thead>
          <tr>
            <th>No</th>
            <th>Nama Peminjam</th>
            <th>Kategori</th>
            <th>Buku</th>
            <th>Jumlah</th>
            <th>Tanggal Pinjam</th>
            <th>Tanggal Kembali</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={item.id_peminjaman}>
                <td>{index + 1}</td>
                <td>{item.nama_peminjam}</td>
                <td>{item.kategori ?? "-"}</td>
                <td>{item.nama_barang || "-"}</td>
                <td>{item.jumlah ?? 0}</td>
                <td>{item.tanggal_pinjam?.split("T")[0]}</td>
                <td>{item.tanggal_kembali ? item.tanggal_kembali.split("T")[0] : "-"}</td>
                <td>{item.status}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ textAlign: "center" }}>
                Tidak ada data
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Laporan;
