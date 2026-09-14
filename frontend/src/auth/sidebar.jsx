import { NavLink } from "react-router-dom";



const Sidebar = () => {

  const role = localStorage.getItem("role");
  
  return (
   <aside style={styles.sidebar}>
  {/* If user role, show only their peminjaman */}
  {role === "user" && (
    <NavLink
      to="/dashboard/peminjaman-user"
      style={({ isActive }) => (isActive ? styles.menuActive : styles.menu)}
    >
      🔄 Peminjaman Saya
    </NavLink>
  )}
  {/* If admin/petugas, show full menu */}
  {(role === "admin" || role === "petugas") && (
    <>
      <NavLink
        to="/dashboard"
        end
        style={({ isActive }) =>
          isActive ? styles.menuActive : styles.menu
        }
      >
        📊 Dashboard
      </NavLink>

      <NavLink
        to="/dashboard/peminjaman"
        style={({ isActive }) =>
          isActive ? styles.menuActive : styles.menu
        }
      >
        🔄 Peminjaman
      </NavLink>

      {role === "petugas" && (
        <NavLink
          to="/dashboard/peminjaman-user"
          style={({ isActive }) =>
            isActive ? styles.menuActive : styles.menu
          }
        >
          👥 Peminjaman User
        </NavLink>
      )}
    </>
  )}

  {/* ADMIN ONLY */}
  {role === "admin" && (
    <>
      <NavLink
        to="/dashboard/laporan"
        style={({ isActive }) =>
          isActive ? styles.menuActive : styles.menu
        }
      >
        📄 Laporan
      </NavLink>

      <NavLink
        to="/dashboard/alat"
        style={({ isActive }) =>
          isActive ? styles.menuActive : styles.menu
        }
      >
        🧰 Tambah Buku
      </NavLink>

      <NavLink
        to="/dashboard/user"
        style={({ isActive }) =>
          isActive ? styles.menuActive : styles.menu
        }
      >
        👥 User
      </NavLink>
    </>
  )}
</aside>

  );
};

const styles = {
  sidebar: {
    width: "240px",
    background: "#51576eff",
    padding: "28px 20px",
    display: "flex",
    flexDirection: "column",
    gap: "14px",
    height: "100vh",
  },

  menu: {
    display: "block",        // 🔥 PENTING
    textDecoration: "none",  // 🔥 hilangkan underline
    background: "transparent",
    color: "#ffffffff",
    padding: "12px 16px",
    borderRadius: "12px",
    fontSize: "15px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },

  menuActive: {
    display: "block",        // 🔥 PENTING
    textDecoration: "none",
    background: "#000000ff",
    color: "#fff",
    padding: "12px 16px",
    borderRadius: "12px",
    fontSize: "15px",
    fontWeight: "bold",
  },
};

export default Sidebar;
