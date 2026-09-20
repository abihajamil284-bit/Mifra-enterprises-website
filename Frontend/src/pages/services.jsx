import { useEffect, useMemo, useState } from "react";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import AdminLayout from "../components/AdminLayout";
import { DataTable, FormField, Modal, PageHeader, StatusBadge, Toggle } from "../components/AdminUI";
import { createAdminService, deleteAdminService, getServices, updateAdminService } from "../services/api";

const emptyService = {
	name: "",
	description: "",
	price: "",
	category: "",
	image: "",
	isActive: true,
	featured: false,
	displayOrder: "",
};

function serviceId(service) {
	return service.id || service._id || service.service_id;
}

function ServiceForm({ service, onClose, onSave }) {
	const [form, setForm] = useState(service || emptyService);
	const [formError, setFormError] = useState("");
	const [saving, setSaving] = useState(false);
	const isEditing = Boolean(service);
	const setField = (field, value) => setForm((current) => ({ ...current, [field]: value }));

	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!form.name.trim() || !form.description.trim() || !form.category.trim() || form.price === "" || form.displayOrder === "") {
			setFormError("Please complete all required fields.");
			return;
		}
		const price = Number(form.price);
		const displayOrder = Number(form.displayOrder);
		if (!Number.isFinite(price) || price < 0 || !Number.isInteger(displayOrder) || displayOrder < 0) {
			setFormError("Enter valid non-negative numbers for price and display order.");
			return;
		}
		setSaving(true);
		setFormError("");
		try {
			await onSave({
				...form,
				name: form.name.trim(),
				description: form.description.trim(),
				category: form.category.trim(),
				image: form.image.trim() || null,
				price,
				displayOrder,
			});
		} catch (error) {
			setFormError(error.message);
			setSaving(false);
		}
	};

	return <Modal title={isEditing ? "Edit Service" : "Add Service"} onClose={onClose}>
		<form className="admin-form" onSubmit={handleSubmit}>
			<div className="form-grid">
				<FormField label="Name" placeholder="Service name" value={form.name} onChange={(event) => setField("name", event.target.value)} />
				<FormField label="Price" type="number" placeholder="0.00" value={form.price} onChange={(event) => setField("price", event.target.value)} />
				<FormField label="Category" placeholder="Service category" value={form.category} onChange={(event) => setField("category", event.target.value)} />
				<FormField label="Image URL" placeholder="https://..." value={form.image} onChange={(event) => setField("image", event.target.value)} />
				<FormField label="Display Order" type="number" placeholder="1" value={form.displayOrder} onChange={(event) => setField("displayOrder", event.target.value)} />
			</div>
			<FormField label="Description" textarea placeholder="Brief service description" value={form.description} onChange={(event) => setField("description", event.target.value)} />
			<div className="toggle-row">
				<Toggle label="Active" checked={form.isActive} onChange={(event) => setField("isActive", event.target.checked)} />
				<Toggle label="Featured" checked={form.featured} onChange={(event) => setField("featured", event.target.checked)} />
			</div>
			{formError && <p className="form-error" role="alert">{formError}</p>}
			<div className="form-actions">
				<button className="button button-secondary" type="button" onClick={onClose}>Cancel</button>
				<button className="button button-primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save Service"}</button>
			</div>
		</form>
	</Modal>;
}

function Services() {
	const [services, setServices] = useState([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState("");
	const [feedback, setFeedback] = useState("");
	const [showForm, setShowForm] = useState(false);
	const [editingService, setEditingService] = useState(null);
	const [search, setSearch] = useState("");
	const [statusFilter, setStatusFilter] = useState("");

	const loadServices = async () => {
		setLoading(true);
		setError("");
		try {
			const data = await getServices();
			setServices(Array.isArray(data) ? data : data?.services || []);
		} catch (loadError) {
			setError(loadError.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		let isMounted = true;
		getServices().then((data) => {
			if (isMounted) setServices(Array.isArray(data) ? data : data?.services || []);
		}).catch((loadError) => {
			if (isMounted) setError(loadError.message);
		}).finally(() => {
			if (isMounted) setLoading(false);
		});
		return () => { isMounted = false; };
	}, []);

	const visibleServices = useMemo(() => services.filter((service) => {
		const query = search.toLowerCase();
		const matchesSearch = service.name.toLowerCase().includes(query) || service.category?.toLowerCase().includes(query);
		const matchesStatus = !statusFilter || (statusFilter === "Active" ? service.isActive === true : service.isActive === false);
		return matchesSearch && matchesStatus;
	}), [services, search, statusFilter]);

	const openAdd = () => { setEditingService(null); setShowForm(true); };
	const openEdit = (service) => { setEditingService({ ...service, image: service.image || "" }); setShowForm(true); };
	const saveService = async (payload) => {
		if (editingService) await updateAdminService(serviceId(editingService), payload);
		else await createAdminService(payload);
		setShowForm(false);
		setFeedback(editingService ? "Service updated successfully." : "Service added successfully.");
		await loadServices();
	};
	const removeService = async (service) => {
		if (!window.confirm(`Deactivate ${service.name}?`)) return;
		try {
			await deleteAdminService(serviceId(service));
			setServices((current) => current.map((item) => serviceId(item) === serviceId(service) ? { ...item, isActive: false } : item));
			setFeedback("Service deactivated successfully.");
			await loadServices();
		} catch (deleteError) {
			setError(deleteError.message);
		}
	};

	return <AdminLayout>
		<PageHeader title="Services" description="Manage your business services" action={<button className="button button-primary" type="button" onClick={openAdd}><FaPlus />Add Service</button>} />
		{feedback && <p className="success-message" role="status">{feedback}</p>}
		{error && <div className="error-message" role="alert"><span>{error}</span><button className="button button-secondary" type="button" onClick={loadServices}>Retry</button></div>}
		<div className="filter-bar">
			<label className="filter-search"><span aria-hidden="true">⌕</span><input type="search" placeholder="Search services..." aria-label="Search services" value={search} onChange={(event) => setSearch(event.target.value)} /></label>
			<label className="filter-select"><span>Status</span><select value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}><option value="">All Status</option><option>Active</option><option>Inactive</option></select></label>
		</div>
		{loading ? <p className="loading-state">Loading services...</p> : <DataTable columns={["Service", "Description", "Price", "Category", "Active", "Featured", "Order", "Actions"]} label={`Showing ${visibleServices.length} of ${services.length} services`}>
			{visibleServices.length ? visibleServices.map((service) => <tr key={serviceId(service)}><td><strong>{service.name}</strong></td><td>{service.description}</td><td>${Number(service.price).toLocaleString()}</td><td>{service.category}</td><td><StatusBadge status={service.isActive ? "Active" : "Inactive"} kind="status" /></td><td>{service.featured ? <span className="featured-mark">Featured</span> : "-"}</td><td>{service.displayOrder}</td><td><div className="table-actions"><button className="icon-button" type="button" aria-label={`Edit ${service.name}`} onClick={() => openEdit(service)}><FaEdit /></button><button className="icon-button danger-icon" type="button" aria-label={`Delete ${service.name}`} onClick={() => removeService(service)}><FaTrash /></button></div></td></tr>) : <tr><td colSpan="8">No services found.</td></tr>}
		</DataTable>}
		{showForm && <ServiceForm service={editingService} onClose={() => setShowForm(false)} onSave={saveService} />}
	</AdminLayout>;
}

export default Services;
