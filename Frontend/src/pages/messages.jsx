import { useEffect, useMemo, useState } from "react";
import { FaEye, FaRedo } from "react-icons/fa";
import AdminLayout from "../components/AdminLayout";
import { DataTable, FormField, Modal, PageHeader, StatusBadge } from "../components/AdminUI";
import { getAdminMessages, updateAdminMessage } from "../services/api";

function messageId(message) {
	return message.id || message._id || message.message_id;
}

function messageName(message) {
	return message.name || message.customer_name || "Unknown Customer";
}

function messageEmail(message) {
	return message.email || message.customer_email || "-";
}

function messagePhone(message) {
	return message.phone || message.customer_phone || "-";
}

function formatDate(value) {
	if (!value) return "-";
	const date = new Date(value);
	return Number.isNaN(date.getTime()) ? "-" : new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric", hour: "numeric", minute: "2-digit" }).format(date);
}

function Details({ message, statuses, onClose, onStatusUpdate }) {
	const [status, setStatus] = useState(message.status || "");
	const [saving, setSaving] = useState(false);
	const handleUpdate = async () => {
		setSaving(true);
		try {
			await onStatusUpdate(messageId(message), status);
			onClose();
		} finally {
			setSaving(false);
		}
	};

	return <Modal title="Message details" onClose={onClose}>
		<div className="detail-grid">
			<div><span>Name</span><strong>{messageName(message)}</strong></div>
			<div><span>Email</span><strong>{messageEmail(message)}</strong></div>
			<div><span>Phone</span><strong>{messagePhone(message)}</strong></div>
			<div><span>Date</span><strong>{formatDate(message.created_at || message.createdAt)}</strong></div>
			<div><span>Subject</span><strong>{message.subject || "-"}</strong></div>
			<div><span>Status</span><StatusBadge status={message.status || "Unknown"} kind="message" /></div>
		</div>
		<FormField label="Message" textarea value={message.message || "-"} readOnly />
		<div className="form-actions"><select aria-label="Update message status" value={status} onChange={(event) => setStatus(event.target.value)}>{statuses.map((value) => <option key={value}>{value}</option>)}</select><button className="button button-primary" type="button" onClick={handleUpdate} disabled={saving}>{saving ? "Updating..." : "Update Status"}</button></div>
	</Modal>;
}

function Messages() {
	const [messages, setMessages] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [feedback, setFeedback] = useState("");
	const [selected, setSelected] = useState(null);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("");

	const loadMessages = async () => {
		setLoading(true);
		setError("");
		try {
			const data = await getAdminMessages();
			setMessages(Array.isArray(data) ? data : data?.messages || []);
		} catch (loadError) {
			setError(loadError.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		let isMounted = true;
		getAdminMessages().then((data) => {
			if (isMounted) setMessages(Array.isArray(data) ? data : data?.messages || []);
		}).catch((loadError) => {
			if (isMounted) setError(loadError.message);
		}).finally(() => {
			if (isMounted) setLoading(false);
		});
		return () => { isMounted = false; };
	}, []);

	const statuses = useMemo(() => [...new Set(messages.map((message) => message.status).filter(Boolean))], [messages]);
	const visibleMessages = useMemo(() => messages.filter((message) => {
		const query = search.toLowerCase();
		const matchesSearch = [messageName(message), messageEmail(message), messagePhone(message), message.subject || "", message.message || ""].some((value) => value.toLowerCase().includes(query));
		return matchesSearch && (!statusFilter || message.status === statusFilter);
	}), [messages, search, statusFilter]);
	const handleStatusUpdate = async (id, status) => {
		await updateAdminMessage(id, { status });
		setFeedback("Message status updated successfully.");
		await loadMessages();
	};

	return <AdminLayout>
		<PageHeader title="Messages" description="Customer inquiries and contact messages" />
		{feedback && <p className="success-message" role="status">{feedback}</p>}
		{error && <section className="dashboard-error" role="alert"><div><strong>Messages unavailable</strong><p>{error}</p></div><button className="button button-primary" type="button" onClick={loadMessages}><FaRedo />Retry</button></section>}
		<div className="filter-bar"><label className="filter-search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Search messages..." aria-label="Search messages" value={search} onChange={(event) => setSearch(event.target.value)} /></label><label className="filter-select"><span>Status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">All Status</option>{statuses.map((status) => <option key={status}>{status}</option>)}</select></label></div>
		{loading ? <p className="loading-state">Loading messages...</p> : <DataTable columns={["Sender", "Email", "Subject", "Date", "Status", "Actions"]} label={`Showing ${visibleMessages.length} of ${messages.length} messages`}>{visibleMessages.length ? visibleMessages.map((message) => <tr key={messageId(message)}><td><strong>{messageName(message)}</strong><small>{messagePhone(message)}</small></td><td>{messageEmail(message)}</td><td>{message.subject || "-"}</td><td>{formatDate(message.created_at || message.createdAt)}</td><td><StatusBadge status={message.status || "Unknown"} kind="message" /></td><td><button className="button button-outline compact-button" type="button" onClick={() => setSelected(message)}><FaEye />View</button></td></tr>) : <tr><td colSpan="6">No messages found.</td></tr>}</DataTable>}
		{selected && <Details message={selected} statuses={statuses.length ? statuses : [selected.status || "Pending"]} onClose={() => setSelected(null)} onStatusUpdate={handleStatusUpdate} />}
	</AdminLayout>;
}

export default Messages;
