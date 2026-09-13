import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";
import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import "../admin-shell.css";

function AdminLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthStateChanged(auth, (nextUser) => {
      if (isMounted) setUser(nextUser);
    });
    return () => { isMounted = false; unsubscribe(); };
  }, []);

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
        user={user}
      />
      <main className="admin-main">
        <TopBar
          onMenuToggle={() => setIsSidebarOpen((isOpen) => !isOpen)}
          onLogout={handleLogout}
          user={user}
        />
        <div className="admin-content">{children}</div>
      </main>
    </div>
  );
}

export default AdminLayout;
