import { useState } from 'react'
import { createProductRequest } from '../services/api'

const initialForm = {
	fullName: '',
	email: '',
	phone: '',
	companyName: '',
	productName: '',
	productId: '',
	quantity: '1',
	message: '',
}

const inputClasses =
	'mt-2 h-12 w-full rounded border border-[#E0E0E0] bg-white px-3 text-sm text-[#1a1a1a] transition-colors duration-200 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 disabled:cursor-not-allowed disabled:bg-[#F5F5F5]'

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function FieldError({ message, id }) {
	return message ? <p id={id} className="mt-1 text-sm text-[#E74C3C]">{message}</p> : null
}

function ProductRequestForm({ product }) {
	const [form, setForm] = useState({
		...initialForm,
		productName: product?.name || '',
		productId: product?.id || '',
	})
	const [errors, setErrors] = useState({})
	const [isSubmitting, setIsSubmitting] = useState(false)
	const [successMessage, setSuccessMessage] = useState('')
	const [submitError, setSubmitError] = useState('')

	const updateField = (event) => {
		const { name, value } = event.target
		setForm((currentForm) => ({ ...currentForm, [name]: value }))
		setErrors((currentErrors) => ({ ...currentErrors, [name]: '' }))
		setSuccessMessage('')
		setSubmitError('')
	}

	const validate = () => {
		const nextErrors = {}
		if (!form.fullName.trim()) nextErrors.fullName = 'Full name is required.'
		if (!form.email.trim()) nextErrors.email = 'Email is required.'
		else if (!emailPattern.test(form.email)) nextErrors.email = 'Enter a valid email address.'
		if (!form.phone.trim()) nextErrors.phone = 'Phone is required.'
		if (!form.productName.trim()) nextErrors.productName = 'Product name is required.'
		if (!form.quantity || Number(form.quantity) <= 0) nextErrors.quantity = 'Quantity must be a positive number.'
		return nextErrors
	}

	const handleSubmit = async (event) => {
		event.preventDefault()
		const nextErrors = validate()
		if (Object.keys(nextErrors).length > 0) {
			setErrors(nextErrors)
			return
		}

		setIsSubmitting(true)
		setSubmitError('')
		setSuccessMessage('')
		try {
			const payload = {
				product_id: product?.id || '',
				customer_name: form.fullName,
				customer_email: form.email,
				customer_phone: form.phone,
				quantity: Number(form.quantity),
				message: form.message || null,
			}
			await createProductRequest(payload)
			setForm(initialForm)
			setErrors({})
			setSuccessMessage('Your product request has been submitted successfully. Our team will contact you shortly.')
		} catch (error) {
			if (error?.response?.status === 422) {
				const responseData = error.response.data
				setSubmitError(
					typeof responseData === 'string'
						? responseData
						: responseData?.detail || responseData?.message || 'Please check the submitted information and try again.',
				)
			} else {
				setSubmitError('Something went wrong. Please try again.')
			}
		} finally {
			setIsSubmitting(false)
		}
	}

	const fieldProps = (name) => ({
		name,
		value: form[name],
		onChange: updateField,
		disabled: isSubmitting,
		'aria-invalid': Boolean(errors[name]),
		'aria-describedby': errors[name] ? `${name}-error` : undefined,
	})

	return (
		<form onSubmit={handleSubmit} className="rounded-md bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] sm:p-8" noValidate>
			<div className="grid gap-5 sm:grid-cols-2">
				<label className="text-sm font-semibold text-[#1a1a1a]">Full Name <span className="text-[#E74C3C]">*</span><input {...fieldProps('fullName')} type="text" className={inputClasses} autoComplete="name" /><FieldError id="fullName-error" message={errors.fullName} /></label>
				<label className="text-sm font-semibold text-[#1a1a1a]">Email <span className="text-[#E74C3C]">*</span><input {...fieldProps('email')} type="email" className={inputClasses} autoComplete="email" /><FieldError id="email-error" message={errors.email} /></label>
				<label className="text-sm font-semibold text-[#1a1a1a]">Phone <span className="text-[#E74C3C]">*</span><input {...fieldProps('phone')} type="tel" className={inputClasses} autoComplete="tel" /><FieldError id="phone-error" message={errors.phone} /></label>
				<label className="text-sm font-semibold text-[#1a1a1a]">Company Name<input {...fieldProps('companyName')} type="text" className={inputClasses} autoComplete="organization" /></label>
				<label className="text-sm font-semibold text-[#1a1a1a]">Product Name <span className="text-[#E74C3C]">*</span><input {...fieldProps('productName')} type="text" className={inputClasses} /><FieldError id="productName-error" message={errors.productName} /></label>
				<label className="text-sm font-semibold text-[#1a1a1a]">Product ID<input {...fieldProps('productId')} type="text" className={inputClasses} /></label>
				<label className="text-sm font-semibold text-[#1a1a1a] sm:max-w-[180px]">Quantity <span className="text-[#E74C3C]">*</span><input {...fieldProps('quantity')} type="number" min="1" className={inputClasses} /><FieldError id="quantity-error" message={errors.quantity} /></label>
			</div>
			<label className="mt-5 block text-sm font-semibold text-[#1a1a1a]">Message / Requirements<textarea {...fieldProps('message')} rows="5" className={`${inputClasses} h-auto py-3`} placeholder="Tell us what you need..." /></label>
			{submitError && <p className="mt-5 text-sm text-[#E74C3C]" role="alert">{submitError}</p>}
			{successMessage && <p className="mt-5 text-sm text-[#27AE60]" role="status">{successMessage}</p>}
			<button type="submit" disabled={isSubmitting} className="mifra-btn-primary mt-6 min-h-12 w-full sm:w-auto">
				{isSubmitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" aria-hidden="true" />}
				{isSubmitting ? 'Submitting...' : 'Request Product'}
			</button>
		</form>
	)
}

export default ProductRequestForm
