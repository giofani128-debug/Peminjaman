require("dotenv").config();
const express = require("express");
const cors = require("cors");
const userRoutes = require("./routes/routes");
const alatRoutes = require("./routes/alatroutes");
const peminjamanRoute = require("./routes/peminjamanroutes");
const dashboardRoutes = require("./routes/dashboardroutes");


const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// JSON parse error handler: catch invalid JSON and return 400 JSON response
app.use((err, req, res, next) => {
  // body parser sets err.type === 'entity.parse.failed' for parse failures
  if (err && (err.type === 'entity.parse.failed' || (err instanceof SyntaxError && err.status === 400 && 'body' in err))) {
    console.error('Invalid JSON received:', err.message);
    return res.status(400).json({ message: 'JSON tidak valid' });
  }
  next(err);
});

app.use("/api", userRoutes);
app.use("/api/alat", alatRoutes);
app.use("/api/peminjaman", peminjamanRoute);
app.use("/api/dashboard", dashboardRoutes);

// final error handler: always respond JSON (avoid Express HTML error page)
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err && (err.stack || err));
  res.status(err && err.status ? err.status : 500).json({ message: err && err.message ? err.message : 'Internal Server Error' });
});


app.listen(port, () => {
  console.log(` Server berjalan di port ${port}`);
});
