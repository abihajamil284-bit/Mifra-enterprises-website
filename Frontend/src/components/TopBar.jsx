import { useLocation } from "react-router-dom";
import AdminLogo from "../assets/AdminPhoto.png"

const pageTitles = {
  "/admin": "Dashboard Overview",
  "/admin/products": "Products",
  "/admin/services": "Services",
  "/admin/requests": "Customer Requests",
  "/admin/messages": "Contact Messages",
  "/admin/settings": "Site Settings",
};

function TopBar({ onMenuToggle, onLogout }) {
	const { pathname } = useLocation();
	return(
       <header className="top-bar">
      <div className="topbar-heading">
        <button className="menu-toggle" type="button" aria-label="Open navigation menu" onClick={onMenuToggle}>☰</button>
        <div className="page-title">{pageTitles[pathname] || "Administration"}</div>
      </div>
      <div className="top-bar-right">
        <div className="search-container">
          <svg
            className="search-icon"
            viewBox="0 0 16 16"
            fill="none"
          >
            <circle
              cx="7"
              cy="7"
              r="4.5"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <path
              d="M10.5 10.5L14 14"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>

          <input type="search" aria-label="Search admin records" placeholder="Search inquiries..." />
        </div>
        <button className="bell-container" type="button" aria-label="View 4 notifications">
          <svg
            className="bell"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M4.5 7.5C4.5 4.74 6.07 2.5 9 2.5C11.93 2.5 13.5 4.74 13.5 7.5V9.5L15 12H3L4.5 9.5V7.5Z"
              stroke="#1E1E1F"
              strokeWidth="1.6"
              strokeLinejoin="round"
            />
            <path
              d="M7 14C7.4 14.8 8 15.5 9 15.5C10 15.5 10.6 14.8 11 14"
              stroke="#1E1E1F"
              strokeWidth="1.6"
              strokeLinecap="round"
            />
          </svg>
          <span className="red-badge">4</span>
        </button>
        <div className="topbar-divider"></div>
        <div className="topbar-user-profile">
          <span className="topbar-user-name">
            Mifra Admin
          </span>
          <img
            src={AdminLogo}
            alt="Mifra Admin"
            className="topbar-user-avatar"
          />
        </div>
        <button className="topbar-logout" type="button" onClick={onLogout}>Logout</button>
      </div>
    </header>
	)
}
export default TopBar
