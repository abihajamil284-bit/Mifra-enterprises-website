import { useEffect, useMemo, useState } from "react";
import { FaEye, FaRedo } from "react-icons/fa";
import AdminLayout from "../components/AdminLayout";
import { DataTable, FormField, Modal, PageHeader, StatusBadge } from "../components/AdminUI";
import { getAdminRequests, updateAdminRequest } from "../services/api";
import { loadRequestRelations, requestItemName } from "../services/requestRelations";

function formatDate(value) {
	if (!value) return "-";
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? "-" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function requestId(request) {
	return request.id || request._id || request.request_id;
}

function requestType(request) {
	return request.request_type?.toLowerCase() === "service" ? "Service" : "Product";
}

function requestCustomer(request) {
	return {
		name: request.customer_name || "Unknown Customer",
		email: request.customer_email || "-",
		phone: request.customer_phone || "-",
	};
}

function Details({ request, itemName, statuses, onClose, onStatusUpdate }) {
	const [status, setStatus] = useState(request.status || "");
	const [saving, setSaving] = useState(false);
	const customer = requestCustomer(request);
	const handleUpdate = async () => {
		setSaving(true);
		try {
			await onStatusUpdate(requestId(request), status);
			onClose();
		} finally {
			setSaving(false);
		}
	};

	return <Modal title="Request details" onClose={onClose}>
		<div className="detail-grid">
			<div><span>Customer</span><strong>{customer.name}</strong></div>
			<div><span>Email</span><strong>{customer.email}</strong></div>
			<div><span>Phone</span><strong>{customer.phone}</strong></div>
			<div><span>Request type</span><strong>{requestType(request)}</strong></div>
			<div><span>Requested item</span><strong>{itemName}</strong></div>
			<div><span>Quantity</span><strong>{requestType(request) === "Product" ? request.quantity ?? "-" : "-"}</strong></div>
			<div><span>Date</span><strong>{formatDate(request.created_at)}</strong></div>
		</div>
		<FormField label="Customer message" textarea value={request.message || "-"} readOnly />
		<div className="form-actions"><select aria-label="Update request status" value={status} onChange={(event) => setStatus(event.target.value)}>{statuses.map((value) => <option key={value}>{value}</option>)}</select><button className="button button-primary" type="button" onClick={handleUpdate} disabled={saving}>{saving ? "Updating..." : "Update Status"}</button></div>
	</Modal>;
}

function Requests() {
	const [requests, setRequests] = useState([]);
	const [productMap, setProductMap] = useState(new Map());
	const [serviceMap, setServiceMap] = useState(new Map());
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [feedback, setFeedback] = useState("");
	const [selected, setSelected] = useState(null);
	const [search, setSearch] = useState("");
	const [typeFilter, setTypeFilter] = useState("All");
	const [statusFilter, setStatusFilter] = useState("");

	const loadRequests = async () => {
		setLoading(true);
		setError("");
		try {
			const data = await getAdminRequests();
			const loadedRequests = Array.isArray(data) ? data : data?.requests || [];
			const relations = await loadRequestRelations(loadedRequests);
			setRequests(loadedRequests);
			setProductMap(relations.productMap);
			setServiceMap(relations.serviceMap);
		} catch (loadError) {
			setError(loadError.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		let cancelled = false;
		const loadInitialRequests = async () => {
			try {
				const data = await getAdminRequests();
				const loadedRequests = Array.isArray(data) ? data : data?.requests || [];
				const relations = await loadRequestRelations(loadedRequests);
				if (!cancelled) { setRequests(loadedRequests); setProductMap(relations.productMap); setServiceMap(relations.serviceMap); }
			} catch (loadError) {
				if (!cancelled) setError(loadError.message);
			} finally {
				if (!cancelled) setLoading(false);
			}
		};
		loadInitialRequests();
		return () => { cancelled = true; };
	}, []);

	const statuses = useMemo(() => [...new Set(requests.map((request) => request.status).filter(Boolean))], [requests]);
	const visibleRequests = useMemo(() => requests.filter((request) => {
		const itemName = requestItemName(request, productMap, serviceMap);
		const customer = requestCustomer(request);
		const query = search.toLowerCase();
		const matchesSearch = [customer.name, customer.email, customer.phone, itemName].some((value) => value.toLowerCase().includes(query));
		const matchesType = typeFilter === "All" || requestType(request) === typeFilter;
		const matchesStatus = !statusFilter || request.status === statusFilter;
		return matchesSearch && matchesType && matchesStatus;
	}), [requests, productMap, serviceMap, search, typeFilter, statusFilter]);

	const handleStatusUpdate = async (id, status) => {
		await updateAdminRequest(id, { status });
		setFeedback("Request status updated successfully.");
		await loadRequests();
	};

	return <AdminLayout>
		<PageHeader title="Requests" description="Review and manage customer product and service requests" />
		{feedback && <p className="success-message" role="status">{feedback}</p>}
		{error && <section className="dashboard-error" role="alert"><div><strong>Requests unavailable</strong><p>{error}</p></div><button className="button button-primary" type="button" onClick={loadRequests}><FaRedo />Retry</button></section>}
		<div className="tabs" role="tablist">{["All", "Product", "Service"].map((type) => <button key={type} className={typeFilter === type ? "tab active" : "tab"} type="button" onClick={() => setTypeFilter(type)} role="tab" aria-selected={typeFilter === type}>{type === "All" ? type : `${type} Requests`}</button>)}</div>
		<div className="filter-bar"><label className="filter-search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Search requests..." aria-label="Search requests" value={search} onChange={(event) => setSearch(event.target.value)} /></label><label className="filter-select"><span>Status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">All Status</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label></div>
		{loading ? <p className="loading-state">Loading requests...</p> : <DataTable columns={["Customer", "Type", "Product / Service", "Quantity", "Date", "Status", "Actions"]} label={`Showing ${visibleRequests.length} of ${requests.length} requests`}>{visibleRequests.length ? visibleRequests.map((request) => { const customer = requestCustomer(request); return <tr key={requestId(request)}><td><strong>{customer.name}</strong><small>{customer.email}</small><small>{customer.phone}</small></td><td>{requestType(request)}</td><td>{requestItemName(request, productMap, serviceMap)}</td><td>{requestType(request) === "Product" ? request.quantity ?? "-" : "-"}</td><td>{formatDate(request.created_at)}</td><td><StatusBadge status={request.status || "Unknown"} /></td><td><button className="button button-outline compact-button" type="button" onClick={() => setSelected(request)}><FaEye />View</button></td></tr>; }) : <tr><td className="dashboard-empty" colSpan="7">No requests found.</td></tr>}</DataTable>}
		{selected && <Details request={selected} itemName={requestItemName(selected, productMap, serviceMap)} statuses={statuses.length ? statuses : [selected.status || "Pending"]} onClose={() => setSelected(null)} onStatusUpdate={handleStatusUpdate} />}
	</AdminLayout>;
}

export default Requests;
