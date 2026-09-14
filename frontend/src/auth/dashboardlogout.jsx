const handleLogout = async () => {
  const token = localStorage.getItem("token");

  await fetch("http://localhost:3000/api/logout", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`
    }
  });

  localStorage.removeItem("token");
  localStorage.removeItem("role");

  window.location.href = "/";
};

<button onClick={handleLogout}>Logout</button>
