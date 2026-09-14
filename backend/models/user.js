const db = require("./db");

const User = {
  insertUser: (username, email, password, role, callback) => {
    const sql = `
      INSERT INTO users (username, email, password, role)
      VALUES (?, ?, ?, ?)
    `;
    db.query(sql, [username, email, password, role], callback);
  },

  getUser: (callback) => {
    const sql = `
      SELECT id_user, username, email, role
      FROM users
    `;
    db.query(sql, callback);
  },

  selectUserById: (id_user, callback) => {
    const sql = `
      SELECT id_user, username, email, role
      FROM users
      WHERE id_user = ?
    `;
    db.query(sql, [id_user], callback);
  },

  selectUserByEmail: (email, callback) => {
    const sql = `
      SELECT id_user, username, email, password, role
      FROM users
      WHERE email = ?
    `;
    db.query(sql, [email], callback);
  },

  deleteUser: (id_user, callback) => {
    const sql = `
      DELETE FROM users
      WHERE id_user = ?
    `;
    db.query(sql, [id_user], callback);
  },
};

module.exports = User;
