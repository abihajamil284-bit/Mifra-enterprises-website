import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaPlus, FaRedo } from "react-icons/fa";
import AdminLayout from "../components/AdminLayout.jsx";
import Metrics from "../components/Metrics.jsx";
import { getAdminRequests, getDashboard } from "../services/api";
import "../App.css";

function QuickActions() {
  return <section className="quick-actions"><h2 className="quick-actions-title">Quick Administrative Actions</h2><div className="buttons-row"><Link className="button button-primary" to="/admin/products"><FaPlus />Add Product</Link><Link className="button button-primary" to="/admin/services"><FaPlus />Add Service</Link><Link className="button button-secondary" to="/admin/requests"><FaEye />View Pending Requests</Link></div></section>;
}

function normalizeMetrics(data) {
  return {
    totalActiveProducts: data.products.total_active,
    inStockProducts: data.products.in_stock,
    lowStockProducts: data.products.low_stock,
    outOfStockProducts: data.products.out_of_stock,
    pendingProductRequests: data.requests.pending_product,
    pendingServiceRequests: data.requests.pending_service,
  };
}

function requestRows(requests) {
  return requests.slice(0, 10).map((request) => ({
    id: request.id,
    customer: request.customer_name,
    type: request.request_type,
    item: request.request_type === "product" ? request.product_id : request.service_id,
    quantity: request.quantity ?? "—",
    status: request.status,
    date: request.created_at,
  }));
}

function formatDate(value) {
  if (!value) return "—";
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? "—" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function RecentInquiries({ requests, isLoading }) {
  return <section className="table-container"><div className="table-header-title-bar"><h2>Recent Customer Inquiries</h2></div><div className="inquiries-table-wrapper"><table className="inquiries-table"><thead><tr><th>Request ID</th><th>Customer</th><th>Type</th><th>Product/Service</th><th>Quantity</th><th>Date</th><th>Status</th><th>Actions</th></tr></thead><tbody>{isLoading ? Array.from({ length: 4 }, (_, index) => <tr key={index}>{Array.from({ length: 8 }, (_, cell) => <td key={cell}><span className="table-skeleton" /></td>)}</tr>) : requests.length > 0 ? requests.map((request) => <tr key={request.id}><td>{request.id}</td><td>{request.customer}</td><td>{request.type}</td><td>{request.item}</td><td className="qty-cell">{request.quantity}</td><td>{formatDate(request.date)}</td><td><span className={`status-badge status-${request.status.replaceAll("_", "-")}`}>{request.status.replaceAll("_", " ")}</span></td><td><div className="inquiry-actions"><Link className="inquiry-action-btn" to="/admin/requests" aria-label={`View ${request.id}`}><FaEye /></Link></div></td></tr>) : <tr><td className="dashboard-empty" colSpan="8">No recent requests found.</td></tr>}</tbody></table></div></section>;
}

function DashboardError({ message, onRetry }) {
  return <section className="dashboard-error" role="alert"><div><strong>Dashboard unavailable</strong><p>{message}</p></div><button className="button button-primary" type="button" onClick={onRetry}><FaRedo />Retry</button></section>;
}

function Admin() {
  const [dashboard, setDashboard] = useState(null);
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  const loadDashboard = useCallback(async () => {
    setIsLoading(true);
    setError("");
    try {
      const result = await getDashboard();
      setDashboard(normalizeMetrics(result));
      setRequests(Array.isArray(result.recent_requests) ? requestRows(result.recent_requests) : requestRows(await getAdminRequests()));
    } catch (loadError) {
      setError(loadError.message || "We could not load dashboard data. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => { void Promise.resolve().then(loadDashboard); }, [loadDashboard]);

  return <AdminLayout><section className="dashboard-header"><div><p className="eyebrow">Operations overview</p><h1>Business at a glance</h1><p>Monitor products, customer inquiries, and service activity.</p></div></section>{error ? <DashboardError message={error} onRetry={loadDashboard} /> : <section className="scroll-content"><Metrics metrics={dashboard} isLoading={isLoading} /><QuickActions /><RecentInquiries requests={requests} isLoading={isLoading} /></section>}</AdminLayout>;
}

export default Admin;
