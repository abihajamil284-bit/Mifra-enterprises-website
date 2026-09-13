import { useEffect, useRef, useState } from "react";
import { FaBell, FaChevronDown, FaClipboardList, FaEnvelope } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { getAdminMessages, getAdminRequests } from "../services/api";

const pageMeta = {
  "/admin": { title: "Dashboard Overview", subtitle: "Your operations at a glance" },
  "/admin/products": { title: "Products", subtitle: "Manage your product catalogue" },
  "/admin/services": { title: "Services", subtitle: "Manage your business services" },
  "/admin/requests": { title: "Customer Requests", subtitle: "Review and respond to incoming requests" },
  "/admin/messages": { title: "Contact Messages", subtitle: "Stay on top of customer conversations" },
  "/admin/settings": { title: "Site Settings", subtitle: "Manage your company information" },
};

function initials(user) {
  const source = user?.displayName || user?.email || "Admin";
  return source.split(/[\s@]+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join("");
}

function isUnread(item) {
  const status = String(item.status || "").toLowerCase();
  return status === "new" || status === "unread";
}

function TopBar({ onMenuToggle, onLogout, user }) {
  const { pathname } = useLocation();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notificationData, setNotificationData] = useState({ requests: 0, messages: 0 });
  const containerRef = useRef(null);
  const meta = pageMeta[pathname] || { title: "Administration", subtitle: "Mifra Enterprises admin portal" };
  const userName = user?.displayName || user?.email || "Admin";
  const notificationCount = notificationData.requests + notificationData.messages;

  useEffect(() => {
    let cancelled = false;
    Promise.all([getAdminRequests(), getAdminMessages()]).then(([requestData, messageData]) => {
      if (cancelled) return;
      const requests = Array.isArray(requestData) ? requestData : requestData?.requests || [];
      const messages = Array.isArray(messageData) ? messageData : messageData?.messages || [];
      setNotificationData({ requests: requests.filter(isUnread).length, messages: messages.filter(isUnread).length });
    }).catch(() => {
      if (!cancelled) setNotificationData({ requests: 0, messages: 0 });
    });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    const closeMenus = (event) => {
      if (!containerRef.current?.contains(event.target)) {
        setNotificationsOpen(false);
        setProfileOpen(false);
      }
    };
    document.addEventListener("mousedown", closeMenus);
    return () => document.removeEventListener("mousedown", closeMenus);
  }, []);

  const closeMenus = () => { setNotificationsOpen(false); setProfileOpen(false); };
  const toggleNotifications = () => { setNotificationsOpen((open) => !open); setProfileOpen(false); };
  const toggleProfile = () => { setProfileOpen((open) => !open); setNotificationsOpen(false); };

  return <header className="top-bar">
    <div className="topbar-heading">
      <button className="menu-toggle" type="button" aria-label="Open navigation menu" onClick={onMenuToggle}>☰</button>
      <div><div className="page-title">{meta.title}</div><div className="page-subtitle">{meta.subtitle}</div></div>
    </div>
    <div className="top-bar-right" ref={containerRef}>
      <button className="bell-container" type="button" aria-label={notificationCount ? `View ${notificationCount} notifications` : "View notifications"} aria-expanded={notificationsOpen} onClick={toggleNotifications}>
        <FaBell className="bell" />
        {notificationCount > 0 && <span className="red-badge">{notificationCount > 99 ? "99+" : notificationCount}</span>}
      </button>
      {notificationsOpen && <div className="topbar-popover notification-popover"><div className="popover-heading"><strong>Notifications</strong><span>{notificationCount ? `${notificationCount} new` : "Up to date"}</span></div><Link to="/admin/requests" onClick={closeMenus} className="notification-item"><span className="notification-icon"><FaClipboardList /></span><span><strong>New Requests</strong><small>{notificationData.requests ? `${notificationData.requests} awaiting review` : "No new requests"}</small></span></Link><Link to="/admin/messages" onClick={closeMenus} className="notification-item"><span className="notification-icon"><FaEnvelope /></span><span><strong>New Messages</strong><small>{notificationData.messages ? `${notificationData.messages} unread messages` : "No new messages"}</small></span></Link></div>}
      <div className="topbar-divider" />
      <button className="topbar-profile-trigger" type="button" aria-expanded={profileOpen} onClick={toggleProfile}>
        {user?.photoURL ? <img src={user.photoURL} alt={userName} className="topbar-user-avatar" /> : <span className="topbar-user-avatar topbar-avatar-fallback" aria-hidden="true">{initials(user)}</span>}
        <span className="topbar-user-copy"><strong>{userName}</strong><small>Admin</small></span><FaChevronDown className="profile-chevron" />
      </button>
      {profileOpen && <div className="topbar-popover profile-popover"><div className="profile-popover-header"><strong>{userName}</strong><small>{user?.email || ""}</small></div><Link to="/admin/settings" onClick={closeMenus}>Manage Account / Settings</Link><button type="button" onClick={() => { closeMenus(); onLogout(); }}>Logout</button></div>}
    </div>
  </header>;
}

export default TopBar;
