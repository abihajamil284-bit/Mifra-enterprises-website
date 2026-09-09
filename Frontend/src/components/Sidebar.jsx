import { useState } from 'react'
import UserLOgOut from "../assets/Log-Out-userpng.png"
import { useNavigate,Link } from "react-router-dom";


const DashboardIcon = () => (
  <svg viewBox="0 0 20 20" className="nav-icon">
    <rect x="2.5" y="2.5" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11.5" y="2.5" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <rect x="2.5" y="11.5" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <rect x="11.5" y="11.5" width="6" height="6" rx="1" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const ProductsIcon = () => (
  <svg viewBox="0 0 20 20" className="nav-icon">
    <path d="M3 6.5L10 3l7 3.5v7L10 17l-7-3.5v-7Z" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M3.5 6.5L10 10l6.5-3.5M10 10v7" fill="none" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

const ServicesIcon = () => (
  <svg viewBox="0 0 20 20" className="nav-icon">
    <path d="M4 5.5h12M4 10h12M4 14.5h8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const RequestsIcon = () => (
  <svg viewBox="0 0 20 20" className="nav-icon">
    <rect x="3" y="2.5" width="14" height="15" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path d="M6 6h8M6 9.5h8M6 13h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const MessagesIcon = () => (
  <svg viewBox="0 0 20 20" className="nav-icon">
    <path d="M3 4.5h14v9H8l-4 3v-12Z" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M6 8h8M6 11h5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

const SettingsIcon = () => (
  <svg viewBox="0 0 20 20" className="nav-icon">
    <circle cx="10" cy="10" r="3" fill="none" stroke="currentColor" strokeWidth="1.5" />
    <path
      d="M10 2.5v2M10 15.5v2M17.5 10h-2M4.5 10h-2M15.3 4.7l-1.4 1.4M6.1 13.9l-1.4 1.4M15.3 15.3l-1.4-1.4M6.1 6.1L4.7 4.7"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 16 16" className="logout-icon">
    <path
      d="M6 2.5H3.5A1.5 1.5 0 0 0 2 4v8a1.5 1.5 0 0 0 1.5 1.5H6M9.5 5.5L12 8l-2.5 2.5M12 8H6"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

function Sidebar() {
 const navigate = useNavigate();
 const LogoutBtn = () =>{
    navigate("/")
  }
	return(
    <aside className="sidebar">
      <div className="sidebar-top">
        <div className="logo-area">
          <div className="logo-icon-bg">
            M
          </div>
          <div className="logo-text">
            <div className="logo-main">MIFRA</div>
            <div className="logo-sub">ENTERPRISES</div>
          </div>
        </div>
        <nav className="nav-items">
          <Link to="/admin" className="nav-dashboard active">
            <span className="active-bar"></span>
            <DashboardIcon />
            <span className="nav-label">
              Dashboard
            </span>
          </Link>
          <Link to="/admin/products" className="nav-dashboard">
            <ProductsIcon />
            <span className="nav-label">
              Products
            </span>
          </Link>
          <Link to="/admin/services" className="nav-dashboard">
            <ServicesIcon />
            <span className="nav-label">
              Services
            </span>
          </Link>
          <Link to="/admin/requests" className="nav-dashboard customer-request">
            <RequestsIcon />
            <span className="nav-label">
              Customer Requests
            </span>
          </Link>
          <Link to="/admin/messages" className="nav-dashboard">
            <MessagesIcon />
            <span className="nav-label">
              Contact Messages
            </span>
          </Link>
          <Link to="/admin/settings" className="nav-dashboard">
            <SettingsIcon />
            <span className="nav-label">
              Site Settings
            </span>
          </Link>
        </nav>
      </div>
      <div className="sidebar-bottom">
        <div className="user-profile">
          <img
            src={UserLOgOut}
            alt="Mifra Admin"
            className="user-avatar"
          />
          <div className="user-info">
            <div className="user-name">
              Mifra Admin
            </div>
            <div className="user-role">
              Super Admin
            </div>
          </div>
        </div>
        <button className="btn-logout" onClick={LogoutBtn}>
          <LogoutIcon />
          <span>Logout</span>
        </button>
      </div>
    </aside>
	)
}
export default Sidebar