import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [newUser, setNewUser] = useState({ username: '', email: '', password: '', role: 'petugas' });
  const [createMessage, setCreateMessage] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!role) {
      setMessage("Pilih role terlebih dahulu");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });

      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { raw: text }; }
      console.log("LOGIN RESPONSE status:", res.status, data);

      if (!res.ok) {
        setMessage(data.message || "Login gagal");
        return;
      }

      // success
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.dataUser.role);
      localStorage.setItem("user_id", data.dataUser.id_user);
      localStorage.setItem("username", data.dataUser.username);

      if (data.dataUser.role === "admin") {
        navigate("/dashboard", { replace: true });
      } else if (data.dataUser.role === "petugas") {
        navigate("/dashboard/peminjaman", { replace: true });
      } else if (data.dataUser.role === "user") {
        navigate("/user/peminjaman", { replace: true });
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  const handleCreateUser = async (e) => {
    e.preventDefault();
    setCreateMessage('');
    // Basic validation
    const { username, email: newEmail, password: newPassword, role: newRole } = newUser;
    if (!username || !newEmail || !newPassword || !newRole) {
      setCreateMessage('Lengkapi semua field pembuatan user');
      return;
    }

    try {
      // backend exposes registration at /api/register
      const res = await fetch('http://localhost:3000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email: newEmail, password: newPassword, role: newRole }),
      });
      const text = await res.text();
      let data;
      try { data = JSON.parse(text); } catch { data = { raw: text }; }
      if (!res.ok) {
        setCreateMessage(data.message || (data.raw ? String(data.raw) : 'Gagal membuat user'));
        return;
      }
      setCreateMessage('User berhasil dibuat');
      setNewUser({ username: '', email: '', password: '', role: 'petugas' });
    } catch (err) {
      console.error('Create user error', err);
      setCreateMessage('Server error saat membuat user');
    }
  };


  return (
    <div style={styles.wrapper}>
      <form style={styles.card} onSubmit={handleLogin}>
        <div style={styles.header}>
          <div style={styles.logo}>Login</div>
          <h2 style={styles.title}>Masuk Akun</h2>
          <p style={styles.subtitle}>Silakan masuk menggunakan akun terdaftar</p>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Email</label>
          <input
            type="email"
            placeholder="contoh@domain.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={styles.input}
            required
          />
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Password</label>
          <div style={styles.passwordWrap}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Masukkan password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ ...styles.input, paddingRight: 44 }}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword((s) => !s)}
              style={styles.eyeButton}
              aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
            >
              {showPassword ? "lihat" : "tutup"}
            </button>
          </div>
        </div>

        <div style={styles.field}>
          <label style={styles.label}>Role</label>
          <select
            value={role}
            onChange={(e) => setRole(e.target.value)}
            style={styles.input}
            required
          >
            <option value="">-- Pilih Role --</option>
            <option value="admin">Admin</option>
            <option value="petugas">Petugas</option>
            <option value="user">User</option>
          </select>
        </div>

        <button type="submit" style={styles.button}>
          Masuk
        </button>

        {message && <p style={styles.message}>{message}</p>}

        {/* Create user panel for quick admin/petugas creation */}
        <div style={{ marginTop: 8, borderTop: '1px dashed #e6e6e6', paddingTop: 10 }}>
          <button type="button" onClick={() => setShowCreate((s) => !s)} style={{ background: 'transparent', border: 'none', color: '#2563eb', cursor: 'pointer', padding: 0 }}>
            {showCreate ? 'Tutup buat user' : 'Buat akun baru'}
          </button>

          {showCreate && (
            <div style={{ marginTop: 10, display: 'grid', gap: 8 }}>
              <input placeholder="Username" value={newUser.username} onChange={(e) => setNewUser({ ...newUser, username: e.target.value })} style={styles.input} />
              <input placeholder="Email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} style={styles.input} />
              <input placeholder="Password" type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} style={styles.input} />
              <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} style={styles.input}>
                <option value="petugas">Petugas</option>
                <option value="admin">Admin</option>
                <option value="user">User</option>
              </select>
              <div style={{ display: 'flex', gap: 8 }}>
                <button type="button" onClick={handleCreateUser} style={{ padding: '10px', borderRadius: 8, background: '#10b981', color: '#fff', border: 'none', cursor: 'pointer' }}>Buat User</button>
                <button type="button" onClick={() => { setShowCreate(false); setNewUser({ username: '', email: '', password: '', role: 'petugas' }); setCreateMessage(''); }} style={{ padding: '10px', borderRadius: 8, background: '#e5e7eb', border: 'none', cursor: 'pointer' }}>Batal</button>
              </div>
              {createMessage && <div style={{ fontSize: 13, color: createMessage.includes('berhasil') ? '#059669' : '#b91c1c' }}>{createMessage}</div>}
            </div>
          )}
        </div>

      </form>
    </div>
  );
};

const styles = {
  wrapper: {
    display: "flex",
    width: "100vw",
    height: "100vh",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #4558a6, #6b4aa3)",
  },
  card: {
    background: "linear-gradient(180deg, #ffffffee, #ffffffcc)",
    padding: "32px",
    width: "420px",
    maxWidth: "92%",
    borderRadius: "14px",
    boxShadow: "0 16px 40px rgba(3,3,3,0.2)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  title: {
    textAlign: "center",
    margin: "4px 0 0",
    fontSize: "22px",
    color: "#222",
  },
  header: {
    textAlign: 'center'
  },
  logo: {
    fontWeight: 'bold',
    color: '#fff',
    background: 'linear-gradient(90deg,#2d7be4,#7b4bd6)',
    display: 'inline-block',
    padding: '8px 14px',
    borderRadius: 8,
    fontSize: 14,
    marginBottom: 8
  },
  subtitle: {
    fontSize: 13,
    color: '#444',
    marginTop: 6,
    marginBottom: 8
  },
  input: {
    padding: "12px",
    fontSize: "14px",
    borderRadius: "8px",
    border: "1px solid #d0d7de",
    outline: 'none',
    transition: 'box-shadow .15s, border-color .15s',
    boxShadow: 'inset 0 1px 2px rgba(16,24,40,0.03)'
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: 6
  },
  label: {
    fontSize: 12,
    color: '#444'
  },
  passwordWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center'
  },
  eyeButton: {
    position: 'absolute',
    right: 8,
    top: 6,
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    fontSize: 18
  },
  button: {
    padding: "12px",
    background: "#4b6ef6",
    color: "#fff",
    border: "none",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "700",
    boxShadow: '0 8px 20px rgba(75,110,246,0.24)',
    transition: 'transform .12s ease, box-shadow .12s ease'
  },
  footerNote: {
    marginTop: 10,
    fontSize: 12,
    color: '#666',
    textAlign: 'center'
  },
  message: {
    textAlign: "center",
    fontSize: "14px",
    marginTop: "5px",
  },
};

export default Login;
