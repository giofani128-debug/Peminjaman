import { useEffect, useState } from "react";

const DashboardHome = () => {
  const [stats, setStats] = useState({
    totalAlat: 0,
    dipinjam: 0,
    tersedia: 0,
    terlambat: 0,
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://localhost:3000/api/dashboard/stats", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Gagal ambil data dashboard:", err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  return (
    <>
      <h1 style={styles.title}>Dashboard</h1>

      <div style={styles.grid}>
        <Card title="Total Buku" value={stats.totalAlat} />
        <Card title="Dipinjam" value={stats.dipinjam} color="#3b82f6" />
        <Card title="Tersedia" value={stats.tersedia} color="#22c55e" />
        <Card title="Terlambat" value={stats.terlambat} color="#ef4444" />
      </div>
    </>
  );
};

const Card = ({ title, value, color }) => (
  <div style={{ ...styles.card, borderLeft: `6px solid ${color || "#0f172a"}` }}>
    <p style={styles.cardTitle}>{title}</p>
    <h2 style={styles.cardValue}>{value}</h2>
  </div>
);

const styles = {
  title: {
    fontSize: "28px",
    fontWeight: "600",
    marginBottom: "32px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
    gap: "28px",
  },
  card: {
    background: "#fff",
    borderRadius: "22px",
    padding: "28px",
    boxShadow: "0 10px 25px rgba(0,0,0,0.08)",
  },
  cardTitle: {
    fontSize: "16px",
    color: "#64748b",
  },
  cardValue: {
    fontSize: "36px",
    fontWeight: "700",
    color: "#0f172a",
  },
};

export default DashboardHome;
