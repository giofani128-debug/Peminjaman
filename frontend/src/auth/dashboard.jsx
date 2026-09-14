import { useEffect, useState } from "react";
import {  Outlet, useNavigate } from "react-router-dom";
import Sidebar from "./sidebar";
// import "./Dashboard.css";

const Dashboard = () => { 
  const navigate = useNavigate();
  const [currentRole, setCurrentRole] = useState(localStorage.getItem("role") || "");

  useEffect(() => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // ❌ Belum login
  if (!token) {
    navigate("/login");
    return;
  }

  // Hanya izinkan peran yang valid. Jika tidak valid, kembali ke login.
  if (!["admin", "petugas", "user"].includes(role)) {
    navigate("/login");
    return;
  }

  // Jangan redirect user — biarkan Dashboard menampilkan halaman yang sesuai (sidebar sudah menyesuaikan)
}, [navigate]);


  const handleLogout = async () => {
    try {
      await fetch("http://localhost:3000/api/logout", {
        method: "POST",
      });
      alert("Logout berhasil");
      localStorage.removeItem("token");
      navigate("/login");
    } catch (err) {
      console.error("Logout gagal:", err);
    }
  };

  // Quick role switcher: update localStorage.role and navigate accordingly
  const handleRoleSwitch = (newRole) => {
    if (!newRole) return;
    localStorage.setItem("role", newRole);
    setCurrentRole(newRole);

    // choose target route for each role
    if (newRole === "admin") navigate("/dashboard");
    else if (newRole === "petugas") navigate("/dashboard/peminjaman");
    else if (newRole === "user") navigate("/user/peminjaman");
  };

  return (
    <div style={styles.app}>
      {/* HEADER */}
      <header style={styles.header}>
        <div style={styles.brand}>
          <div style={styles.brandIcon}>📦</div>
          <div>
            <h2 style={{ margin: 0, fontSize: 18 }}>Inventory System</h2>
            <div style={{ fontSize: 12, color: '#e6eefc' }}>Kelola inventaris lab</div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <input placeholder="Cari barang atau peminjaman..." style={styles.search} />
          <div style={styles.userPanel}>
            <div style={styles.avatar}>{(localStorage.getItem('username')||'U').charAt(0).toUpperCase()}</div>
            <div style={{ marginLeft: 8, textAlign: 'right' }}>
              <div style={{ fontSize: 13 }}>{localStorage.getItem('username') || 'User'}</div>
              <div style={{ fontSize: 11, color: '#cfe0ff' }}>{localStorage.getItem('role') || ''}</div>
            </div>
          </div>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </header>

      <div style={styles.main}>
        <Sidebar />

        {/* CONTENT */}
        <section style={styles.content}>
          <Outlet /> {/* 🔥 INI KUNCI UTAMA */}
        </section>
      </div>
    </div>
  );
};



const styles = {
 app: {
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  flexDirection: "column",
  background: 'linear-gradient(180deg,#f3f7ff 0%, #ffffff 60%)',
  fontFamily: "Inter, system-ui, sans-serif",
},

/* HEADER */
header: {
  height: "72px",
  minHeight: "72px",
  padding: "10px 28px",
  background: 'linear-gradient(90deg,#254286, #3b5bb0)',
  color: "#fff",
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  flexShrink: 0,
  boxShadow: '0 6px 18px rgba(37,66,134,0.18)'
},

brand: {
  display: "flex",
  alignItems: "center",
  gap: "10px",
},

brandIcon: {
  fontSize: "20px",
  background: 'rgba(255,255,255,0.08)',
  padding: 10,
  borderRadius: 10,
},

logoutBtn: {
  background: "#ff6b6b",
  border: "none",
  padding: "8px 14px",
  borderRadius: "10px",
  color: "#fff",
  cursor: "pointer",
  fontWeight: 600
},

search: {
  padding: '8px 12px',
  borderRadius: 10,
  border: '1px solid rgba(255,255,255,0.12)',
  background: 'rgba(255,255,255,0.06)',
  color: '#fff',
  minWidth: 260
},

userPanel: {
  display: 'flex',
  alignItems: 'center'
},

avatar: {
  width: 38,
  height: 38,
  borderRadius: 999,
  background: '#dbeafe',
  color: '#0b3b73',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontWeight: 700
},

/* MAIN */
main: {
  flex: 1,
  display: "flex",
},

/* SIDEBAR */
sidebar: {
  width: "220px",
  height: "100%",
  background: 'linear-gradient(180deg,#0f172a, #14213d)',
  padding: "22px 18px",
  display: "flex",
  flexDirection: "column",
  gap: "12px",
  color: '#dbeafe'
},

menu: {
  background: "transparent",
  color: "#c7d2fe",
  border: "none",
  padding: "10px 14px",
  borderRadius: "10px",
  textAlign: "left",
  cursor: "pointer",
  transition: 'all .12s ease'
},

menuActive: {
  background: "rgba(255,255,255,0.06)",
  color: "#fff",
  padding: "10px 14px",
  borderRadius: "10px",
  border: "none",
  textAlign: "left",
},

/* CONTENT */
content: {
  flex: 1,
  height: "100%",
  padding: "24px 40px",
  color:"#071124",
  overflowY: "auto",
},

contentHeader: {
  marginBottom: "32px",
},

/* CARD */
cardGrid: {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
  gap: "28px",
},

card: {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "20px",
  boxShadow: "0 8px 30px rgba(9,30,66,0.06)",
  display: "flex",
  flexDirection: "column",
  gap: "10px",
},

cardTitle: {
  fontSize: "18px",
  marginBottom: "10px",
},

cardInfo: {
  display: "flex",
  justifyContent: "space-between",
  color: "#475569",
  fontSize: "14px",
},

status: {
  marginTop: "14px",
  alignSelf: "flex-start",
  padding: "6px 16px",
  borderRadius: "999px",
  fontSize: "12px",
  color: "#fff",
},

};



export default Dashboard;
