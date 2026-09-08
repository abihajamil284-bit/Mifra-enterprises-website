import { FaSearch, FaTimes } from "react-icons/fa";

export function PageHeader({ title, description, action }) {
  return <div className="page-header"><div><h1>{title}</h1><p>{description}</p></div>{action}</div>;
}

export function StatusBadge({ status, kind = "status" }) {
  const value = status.toLowerCase().replaceAll(" ", "-");
  return <span className={`status-badge ${kind}-badge ${kind}-${value}`}>{status}</span>;
}

export function SearchFilters({ children, placeholder = "Search..." }) {
  return <div className="filter-bar"><label className="filter-search"><FaSearch aria-hidden="true" /><input type="search" placeholder={placeholder} aria-label={placeholder} /></label>{children}</div>;
}

export function Select({ label, children }) {
  return <label className="filter-select"><span>{label}</span><select defaultValue=""><option value="">All {label}</option>{children}</select></label>;
}

export function Modal({ title, children, onClose }) {
  return <div className="modal-backdrop" role="presentation" onMouseDown={onClose}><section className="modal" role="dialog" aria-modal="true" aria-labelledby="modal-title" onMouseDown={(event) => event.stopPropagation()}><header className="modal-header"><h2 id="modal-title">{title}</h2><button className="icon-button" type="button" aria-label="Close dialog" onClick={onClose}><FaTimes /></button></header>{children}</section></div>;
}

export function FormField({ label, type = "text", placeholder, textarea = false, children }) {
  return <label className="form-field"><span>{label}</span>{children || (textarea ? <textarea placeholder={placeholder} rows="4" /> : <input type={type} placeholder={placeholder} />)}</label>;
}

export function Toggle({ label }) { return <label className="toggle-field"><input type="checkbox" /><span className="toggle" aria-hidden="true" />{label}</label>; }

export function DataTable({ columns, children, label }) {
  return <section className="data-table-card"><div className="table-scroll"><table className="data-table"><thead><tr>{columns.map((column) => <th key={column}>{column}</th>)}</tr></thead><tbody>{children}</tbody></table></div>{label && <div className="table-caption">{label}</div>}</section>;
}
