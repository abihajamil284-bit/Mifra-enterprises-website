import { useEffect, useState } from "react";
import AdminLayout from "../components/AdminLayout";
import { FormField, PageHeader } from "../components/AdminUI";
import { getSiteSettings, updateAdminSettings } from "../services/api";

const emptySettings = {
	company_name: "",
	email: "",
	phone: "",
	address: "",
	logo: "",
	about_text: "",
	facebook: "",
	instagram: "",
	whatsapp: "",
};

function settingsData(data) {
	return { ...emptySettings, ...(data?.settings || data) };
}

function Settings() {
	const [settings, setSettings] = useState(emptySettings);
	const [savedSettings, setSavedSettings] = useState(emptySettings);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [error, setError] = useState("");
	const [formError, setFormError] = useState("");
	const [feedback, setFeedback] = useState("");

	const loadSettings = async () => {
		setLoading(true);
		setError("");
		try {
			const data = settingsData(await getSiteSettings());
			setSettings(data);
			setSavedSettings(data);
		} catch (loadError) {
			setError(loadError.message);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		let isMounted = true;
		getSiteSettings().then((response) => {
			if (!isMounted) return;
			const data = settingsData(response);
			setSettings(data);
			setSavedSettings(data);
		}).catch((loadError) => {
			if (isMounted) setError(loadError.message);
		}).finally(() => {
			if (isMounted) setLoading(false);
		});
		return () => { isMounted = false; };
	}, []);

	const setField = (field, value) => setSettings((current) => ({ ...current, [field]: value }));
	const handleCancel = () => { setSettings(savedSettings); setFormError(""); };
	const handleSubmit = async (event) => {
		event.preventDefault();
		if (!settings.company_name.trim() || !settings.email.trim() || !settings.phone.trim() || !settings.address.trim()) {
			setFormError("Company name, email, phone, and address are required.");
			return;
		}
		setSaving(true);
		setFormError("");
		setFeedback("");
		try {
			const payload = Object.fromEntries(Object.entries(settings).map(([key, value]) => [key, value.trim() || null]));
			await updateAdminSettings({ ...payload, company_name: settings.company_name.trim(), email: settings.email.trim(), phone: settings.phone.trim(), address: settings.address.trim() });
			const saved = settingsData(payload);
			setSettings(saved);
			setSavedSettings(saved);
			setFeedback("Settings saved successfully.");
		} catch (saveError) {
			setFormError(saveError.message);
		} finally {
			setSaving(false);
		}
	};

	return <AdminLayout>
		<PageHeader title="Settings" description="Manage company information, branding and social presence" />
		{loading ? <p className="loading-state">Loading settings...</p> : <>
			{error && <div className="error-message" role="alert"><span>{error}</span><button className="button button-secondary" type="button" onClick={loadSettings}>Retry</button></div>}
			{feedback && <p className="success-message" role="status">{feedback}</p>}
			<form className="settings-form" onSubmit={handleSubmit}>
				<section className="settings-section"><div className="section-heading"><h2>Company Information</h2><p>Core details shown across MIFRA customer communications.</p></div><div className="form-grid"><FormField label="Company Name" value={settings.company_name} onChange={(event) => setField("company_name", event.target.value)} /><FormField label="Email" type="email" value={settings.email} onChange={(event) => setField("email", event.target.value)} /><FormField label="Phone" value={settings.phone} onChange={(event) => setField("phone", event.target.value)} /><FormField label="Address" value={settings.address} onChange={(event) => setField("address", event.target.value)} /></div></section>
				<section className="settings-section"><div className="section-heading"><h2>Branding</h2><p>Keep your identity consistent across the platform.</p></div><div className="form-grid"><FormField label="Company Logo URL" placeholder="https://..." value={settings.logo} onChange={(event) => setField("logo", event.target.value)} /><FormField label="About Text" textarea placeholder="Tell customers about MIFRA Enterprises." value={settings.about_text} onChange={(event) => setField("about_text", event.target.value)} /></div></section>
				<section className="settings-section"><div className="section-heading"><h2>Social Links</h2><p>Optional public contact channels.</p></div><div className="form-grid"><FormField label="Facebook" placeholder="https://facebook.com/..." value={settings.facebook} onChange={(event) => setField("facebook", event.target.value)} /><FormField label="Instagram" placeholder="https://instagram.com/..." value={settings.instagram} onChange={(event) => setField("instagram", event.target.value)} /><FormField label="WhatsApp" placeholder="https://wa.me/..." value={settings.whatsapp} onChange={(event) => setField("whatsapp", event.target.value)} /></div></section>
				{formError && <p className="form-error" role="alert">{formError}</p>}
				<div className="form-actions settings-actions"><button className="button button-secondary" type="button" onClick={handleCancel}>Cancel</button><button className="button button-primary" type="submit" disabled={saving}>{saving ? "Saving..." : "Save Changes"}</button></div>
			</form>
		</>}
	</AdminLayout>;
}

export default Settings;
