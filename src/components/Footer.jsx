import {
	FiFacebook,
	FiInstagram,
	FiLinkedin,
	FiMail,
	FiMessageCircle,
	FiMapPin,
	FiPhone,
} from 'react-icons/fi'
import { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { getServices, getSiteSettings } from '../services/api'

const fallbackSiteSettings = {
	company_name: 'MIFRA ENTERPRISES SMC PVT LTD',
	email: 'mifraenterprise786@gmail.com',
	phone: ['03005410228', '03077875228'],
	address: [
		'New Shakrial, Bannd Kanna Road, Abdullah Mosque Street #2, Rawalpindi',
		'Murree Road, Ground Floor, Talha Heights, Rawalpindi',
	],
	about_text: 'Deals in IT, Electronics, Network Equipment, Aviation Spares & Software Solutions. All Types of Repair Services. Government Contractor & General Order Supplier.',
	whatsapp: 'https://wa.me/923005410228',
}

const quickLinks = [
	{ label: 'Home', to: '/' },
	{ label: 'About', to: '/about' },
	{ label: 'Products', to: '/products' },
	{ label: 'Services', to: '/services' },
	{ label: 'Contact', to: '/contact' },
]

const footerLinkClasses =
	'inline-flex min-h-10 items-center text-sm text-[#E0E0E0] transition-colors duration-200 hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]'

function Footer() {
	const [siteSettings, setSiteSettings] = useState(fallbackSiteSettings)
	const [services, setServices] = useState([])

	useEffect(() => {
		let isMounted = true

		const fetchSiteSettings = async () => {
			try {
				const data = await getSiteSettings()
				if (isMounted) setSiteSettings(data || fallbackSiteSettings)
			} catch {
				if (isMounted) setSiteSettings(fallbackSiteSettings)
			}
		}

		fetchSiteSettings()

		return () => {
			isMounted = false
		}
	}, [])

	useEffect(() => {
		let isMounted = true

		const fetchServices = async () => {
			try {
				const data = await getServices()
				const activeServices = (Array.isArray(data) ? data : data?.services || data?.data || [])
					.filter((service) => service.isActive !== false)
					.sort((firstService, secondService) => {
						const firstOrder = Number(firstService.displayOrder)
						const secondOrder = Number(secondService.displayOrder)
						if (Number.isNaN(firstOrder)) return Number.isNaN(secondOrder) ? 0 : 1
						if (Number.isNaN(secondOrder)) return -1
						return firstOrder - secondOrder
					})
				if (isMounted) setServices(activeServices)
			} catch {
				if (isMounted) setServices([])
			}
		}

		fetchServices()

		return () => {
			isMounted = false
		}
	}, [])

	const companyName = siteSettings.company_name || fallbackSiteSettings.company_name
	const aboutText = siteSettings.about_text || fallbackSiteSettings.about_text
	const phoneNumbers = Array.isArray(siteSettings.phone) ? siteSettings.phone : siteSettings.phone ? [siteSettings.phone] : []
	const addresses = Array.isArray(siteSettings.address) ? siteSettings.address : siteSettings.address ? [siteSettings.address] : []

	return (
		<footer className="bg-black text-white">
			<div className="mifra-container py-12 sm:py-14 lg:py-16">
				<div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
					<section>
						<NavLink
							to="/"
							className="inline-block text-lg font-bold tracking-[0.12em] text-white transition-colors duration-200 hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#D4AF37]"
						>
							{siteSettings.logo ? <img src={siteSettings.logo} alt={companyName} className="h-auto max-h-10 w-auto object-contain" /> : companyName}
						</NavLink>
						<p className="mt-3 text-sm font-semibold text-[#D4AF37]">CEO &amp; Founder: M. Ramzan</p>
						<p className="mt-4 max-w-xs text-sm leading-7 text-[#E0E0E0]">
							{aboutText}
						</p>

						<div className="mt-6">
							<p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
								Connect with us
							</p>
							<div className="mt-3 flex gap-2" aria-label="Social media">
								<span
									className="inline-flex h-10 w-10 items-center justify-center text-lg text-[#D4AF37]"
									title="LinkedIn coming soon"
									aria-label="LinkedIn coming soon"
								>
									<FiLinkedin aria-hidden="true" />
								</span>
								{siteSettings.facebook ? <a
									href={siteSettings.facebook}
									className="inline-flex h-10 w-10 items-center justify-center text-lg text-[#D4AF37]"
									title="Facebook"
									aria-label="Facebook"
								>
									<FiFacebook aria-hidden="true" />
								</a> : <span
									className="inline-flex h-10 w-10 items-center justify-center text-lg text-[#D4AF37]"
									title="Facebook coming soon"
									aria-label="Facebook coming soon"
								>
									<FiFacebook aria-hidden="true" />
								</span>}
								{siteSettings.instagram ? <a
									href={siteSettings.instagram}
									className="inline-flex h-10 w-10 items-center justify-center text-lg text-[#D4AF37]"
									title="Instagram"
									aria-label="Instagram"
								>
									<FiInstagram aria-hidden="true" />
								</a> : <span
									className="inline-flex h-10 w-10 items-center justify-center text-lg text-[#D4AF37]"
									title="Instagram coming soon"
									aria-label="Instagram coming soon"
								>
									<FiInstagram aria-hidden="true" />
								</span>}
							</div>
						</div>
					</section>

					<nav aria-label="Footer quick links">
						<h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
							Quick Links
						</h2>
						<ul className="mt-4 space-y-1">
							{quickLinks.map((link) => (
								<li key={link.to}>
									<NavLink to={link.to} className={footerLinkClasses}>
										{link.label}
									</NavLink>
								</li>
							))}
						</ul>
					</nav>

					<nav aria-label="Footer services">
						<h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
							Services
						</h2>
						<ul className="mt-4 space-y-1">
							{services.map((service) => (
								<li key={service.id}>
									<NavLink to={`/services/${service.id}`} className={footerLinkClasses}>{service.name}</NavLink>
								</li>
							))}
						</ul>
					</nav>

					<section>
						<h2 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
							Contact
						</h2>
						<address className="mt-4 not-italic">
							<ul className="space-y-3 text-sm leading-6 text-[#E0E0E0]">
								<li className="flex items-start gap-3">
									<FiMapPin className="mt-1 shrink-0 text-[#D4AF37]" aria-hidden="true" />
										<span>{addresses[0]}</span>
								</li>
									{addresses.slice(1).map((address) => <li key={address} className="flex items-start gap-3"><FiMapPin className="mt-1 shrink-0 text-[#D4AF37]" aria-hidden="true" /><span>{address}</span></li>)}
								<li className="flex items-start gap-3">
									<FiPhone className="mt-1 shrink-0 text-[#D4AF37]" aria-hidden="true" />
									<span className="flex flex-col items-start">
											{phoneNumbers.map((phone) => <a key={phone} href={`tel:${phone}`} className="transition-colors hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]">{phone}</a>)}
									</span>
								</li>
								<li className="flex items-start gap-3">
									<FiMail className="mt-1 shrink-0 text-[#D4AF37]" aria-hidden="true" />
										<a href={`mailto:${siteSettings.email || fallbackSiteSettings.email}`} className="break-all transition-colors hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]">{siteSettings.email || fallbackSiteSettings.email}</a>
								</li>
								<li className="flex items-start gap-3">
									<FiMessageCircle className="mt-1 shrink-0 text-[#D4AF37]" aria-hidden="true" />
										{siteSettings.whatsapp ? <a href={siteSettings.whatsapp} className="transition-colors hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]">WhatsApp</a> : <span>WhatsApp</span>}
								</li>
							</ul>
						</address>
					</section>
				</div>

				<div className="mt-10 border-t border-[#1a1a1a] pt-6 text-xs text-[#999999]">
					<p>© 2026 {companyName}. All rights reserved.</p>
				</div>
			</div>
		</footer>
	)
}

export default Footer
