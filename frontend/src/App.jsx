import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./auth/login";
import Dashboard from "./auth/dashboard";
import Alat from "./auth/Alat";
import Peminjaman from "./auth/peminjaman";
import Laporan from "./auth/laporan";
import Dashboardhome from "./auth/Dashboardhome";
import User from "./auth/user";
import PeminjamanUser from "./auth/peminjam_user";


function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* LOGIN */}
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />

        {/* HALAMAN USER */}
        <Route path="/user/peminjaman" element={<Dashboard />}>
          <Route index element={<PeminjamanUser />} />
        </Route>

        {/* DASHBOARD */}
        <Route path="/dashboard" element={<Dashboard />}>
          <Route index element={<Dashboardhome />} />
          <Route path="alat" element={<Alat />} />
          <Route path="peminjaman" element={<Peminjaman />} />
          <Route path="peminjaman-user" element={<PeminjamanUser />} />
          <Route path="laporan" element={<Laporan />} />
          <Route path="user" element={<User />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
