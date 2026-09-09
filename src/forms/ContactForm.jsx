import { useState } from 'react'
import { createContactMessage } from '../services/api'

const initialForm = { fullName: '', email: '', phone: '', subject: '', message: '' }
const inputClasses = 'mt-2 h-12 w-full rounded border border-[#E0E0E0] bg-white px-3 text-sm text-[#1a1a1a] transition-colors duration-200 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20 disabled:cursor-not-allowed disabled:bg-[#F5F5F5]'
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function FieldError({ message, id }) {
	return message ? <p id={id} className="mt-1 text-sm text-[#E74C3C]">{message}</p> : null
}

function ContactForm() {
	const [form, setForm] = useState(initialForm)
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
		if (!form.subject.trim()) nextErrors.subject = 'Subject is required.'
		if (!form.message.trim()) nextErrors.message = 'Message is required.'
		else if (form.message.trim().length < 10) nextErrors.message = 'Message must be at least 10 characters.'
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
			await createContactMessage({
				name: form.fullName,
				email: form.email,
				phone: form.phone || null,
				subject: form.subject || null,
				message: form.message,
			})
			setForm(initialForm)
			setErrors({})
			setSuccessMessage('Thank you for contacting MIFRA Enterprises. We will get back to you shortly.')
		} catch {
			setSubmitError('Something went wrong. Please try again.')
		} finally {
			setIsSubmitting(false)
		}
	}

	const fieldProps = (name) => ({ name, value: form[name], onChange: updateField, disabled: isSubmitting, 'aria-invalid': Boolean(errors[name]), 'aria-describedby': errors[name] ? `${name}-error` : undefined })

	return (
		<form onSubmit={handleSubmit} className="rounded-md bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)] sm:p-8" noValidate>
			<div className="grid gap-5 sm:grid-cols-2">
				<label className="text-sm font-semibold text-[#1a1a1a]">Full Name <span className="text-[#E74C3C]">*</span><input {...fieldProps('fullName')} type="text" className={inputClasses} autoComplete="name" /><FieldError id="fullName-error" message={errors.fullName} /></label>
				<label className="text-sm font-semibold text-[#1a1a1a]">Email <span className="text-[#E74C3C]">*</span><input {...fieldProps('email')} type="email" className={inputClasses} autoComplete="email" /><FieldError id="email-error" message={errors.email} /></label>
				<label className="text-sm font-semibold text-[#1a1a1a]">Phone<input {...fieldProps('phone')} type="tel" className={inputClasses} autoComplete="tel" /></label>
				<label className="text-sm font-semibold text-[#1a1a1a]">Subject <span className="text-[#E74C3C]">*</span><input {...fieldProps('subject')} type="text" className={inputClasses} /><FieldError id="subject-error" message={errors.subject} /></label>
			</div>
			<label className="mt-5 block text-sm font-semibold text-[#1a1a1a]">Message <span className="text-[#E74C3C]">*</span><textarea {...fieldProps('message')} rows="7" className={`${inputClasses} h-auto py-3`} placeholder="How can we help?" /><FieldError id="message-error" message={errors.message} /></label>
			{submitError && <p className="mt-5 text-sm text-[#E74C3C]" role="alert">{submitError}</p>}
			{successMessage && <p className="mt-5 text-sm text-[#27AE60]" role="status">{successMessage}</p>}
			<button type="submit" disabled={isSubmitting} className="mifra-btn-primary mt-6 min-h-12 w-full sm:w-auto">{isSubmitting && <span className="h-4 w-4 animate-spin rounded-full border-2 border-black border-t-transparent" aria-hidden="true" />}{isSubmitting ? 'Sending...' : 'Send Message'}</button>
		</form>
	)
}

export default ContactForm
