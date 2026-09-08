import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";

function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="admin-shell">
      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        onLogout={handleLogout}
      />
      <main className="admin-main">
        <TopBar
          onMenuToggle={() => setIsSidebarOpen((isOpen) => !isOpen)}
          onLogout={handleLogout}
        />
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}

export default AdminLayout;
