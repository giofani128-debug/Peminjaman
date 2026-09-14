import { useEffect, useState } from "react";

const User = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editId, setEditId] = useState(null);
  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "user",
  });

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    fetch("http://localhost:3000/api/user", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [token]);

  const openEdit = (u) => {
    setEditId(u.id_user);
    setForm({
      username: u.username,
      email: u.email,
      role: u.role,
    });
  };

  const handleUpdate = () => {
    fetch(`http://localhost:3000/api/user/${editId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(form),
    }).then(() => {
      setUsers(
        users.map((u) =>
          u.id_user === editId ? { ...u, ...form } : u
        )
      );
      setEditId(null);
    });
  };

  const handleDelete = (id) => {
    if (!window.confirm("Yakin hapus user?")) return;

    fetch(`http://localhost:3000/api/user/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }).then(() => {
      setUsers(users.filter((u) => u.id_user !== id));
    });
  };

  if (loading) return <p>Loading data user...</p>;

  return (
    <div>
      <h1 style={{ fontSize: 26, marginBottom: 20 }}>
        👥 Manajemen User
      </h1>

      {/* FORM EDIT */}
      {editId && (
        <div style={styles.card}>
          <h3>Edit User</h3>

          <input
            style={styles.input}
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            placeholder="Username"
          />

          <input
            style={styles.input}
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            placeholder="Email"
          />

          <select
            style={styles.input}
            value={form.role}
            onChange={(e) =>
              setForm({ ...form, role: e.target.value })
            }
          >
            <option value="admin">Admin</option>
            <option value="petugas">Petugas</option>
            <option value="user">User</option>
          </select>

          <button style={styles.save} onClick={handleUpdate}>
            Simpan
          </button>
          <button
            style={styles.cancel}
            onClick={() => setEditId(null)}
          >
            Batal
          </button>
        </div>
      )}

      {/* TABLE */}
      <table style={styles.table}>
        <thead style={styles.thead}>
          <tr>
            <th>No</th>
            <th>Username</th>
            <th>Email</th>
            <th>Role</th>
            {role === "admin" && <th>Aksi</th>}
          </tr>
        </thead>
        <tbody>
          {users.map((u, i) => (
            <tr key={u.id_user}>
              <td>{i + 1}</td>
              <td>{u.username}</td>
              <td>{u.email}</td>
              <td>{u.role}</td>
              {role === "admin" && (
                <td>
                  <button
                    style={styles.edit}
                    onClick={() => openEdit(u)}
                  >
                    Edit
                  </button>
                  <button
                    style={styles.delete}
                    onClick={() => handleDelete(u.id_user)}
                  >
                    Hapus
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const styles = {
  table: {
    width: "100%",
    background: "#fff",
    borderCollapse: "collapse",
  },
  thead: {
    background: "#1e293b",
    color: "#fff",
  },
  card: {
    background: "#fff",
    padding: 20,
    marginBottom: 20,
    borderRadius: 12,
    maxWidth: 400,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
  },
  edit: {
    background: "#3b82f6",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
    marginRight: 6,
  },
  delete: {
    background: "#ef4444",
    color: "#fff",
    border: "none",
    padding: "6px 12px",
  },
  save: {
    background: "#22c55e",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
    marginRight: 6,
  },
  cancel: {
    background: "#94a3b8",
    color: "#fff",
    border: "none",
    padding: "8px 14px",
  },
};


export default User;
