import { useEffect, useState } from 'react'
import { FiBriefcase, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import ContactForm from '../forms/ContactForm'
import { getSiteSettings } from '../services/api'

const fallbackSiteSettings = {
    company_name: 'MIFRA ENTERPRISES SMC PVT LTD',
    email: 'mifraenterprise786@gmail.com',
    phone: ['03005410228', '03077875228'],
    address: [
        'New Shakrial, Bannd Kanna Road, Abdullah Mosque Street #2, Rawalpindi',
        'Murree Road, Ground Floor, Talha Heights, Rawalpindi',
    ],
    about_text: 'MIFRA Enterprises deals in IT, electronics, network equipment, aviation spares, software solutions, all types of repair services, government contracting, and general order supply.',
    whatsapp: 'https://wa.me/923005410228',
}

function Contact() {
    const [siteSettings, setSiteSettings] = useState(fallbackSiteSettings)

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

    const companyName = siteSettings.company_name || fallbackSiteSettings.company_name
    const aboutText = siteSettings.about_text || fallbackSiteSettings.about_text
    const phoneNumbers = Array.isArray(siteSettings.phone) ? siteSettings.phone : siteSettings.phone ? [siteSettings.phone] : []
    const addresses = Array.isArray(siteSettings.address) ? siteSettings.address : siteSettings.address ? [siteSettings.address] : []

    return (
        <div>
            <section className="bg-[#F5F5F5] py-14 sm:py-16" aria-labelledby="contact-heading">
                <div className="mifra-container">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">MIFRA Enterprises</p>
                    <h1 id="contact-heading" className="mt-3 text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-5xl">Get in Touch</h1>
                    <p className="mt-4 max-w-2xl text-base leading-7 text-[#666666]">Have a question or a technology requirement? Our team is ready to understand your needs and help you find a practical solution.</p>
                </div>
            </section>

            <section className="bg-white py-16 sm:py-20 lg:py-24">
                <div className="mifra-container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:items-start">
                    <div>
                        <h2 className="text-2xl font-bold text-[#1a1a1a] sm:text-3xl">Let&apos;s Talk</h2>
                        <div className="mt-5 flex items-start gap-4">
                            <FiBriefcase className="mt-1 shrink-0 text-2xl text-[#D4AF37]" aria-hidden="true" />
                            <div>
                                <p className="text-sm font-semibold text-[#1a1a1a]">{companyName}</p>
                                <p className="mt-1 text-sm text-[#666666]">CEO &amp; Founder: M. Ramzan</p>
                            </div>
                        </div>
                        <p className="mt-5 text-base leading-7 text-[#666666]">{aboutText}</p>
                        <address className="mt-8 space-y-5 not-italic">
                            <div className="flex items-start gap-4">
                                <FiMapPin className="mt-1 shrink-0 text-2xl text-[#D4AF37]" aria-hidden="true" />
                                <div>
                                    <p className="text-sm font-semibold text-[#1a1a1a]">Address 1</p>
                                    <p className="mt-1 text-sm leading-6 text-[#666666]">{addresses[0]}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <FiMapPin className="mt-1 shrink-0 text-2xl text-[#D4AF37]" aria-hidden="true" />
                                <div>
                                    <p className="text-sm font-semibold text-[#1a1a1a]">Address 2</p>
                                    <p className="mt-1 text-sm leading-6 text-[#666666]">{addresses[1]}</p>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <FiPhone className="mt-1 shrink-0 text-2xl text-[#D4AF37]" aria-hidden="true" />
                                <div>
                                    <p className="text-sm font-semibold text-[#1a1a1a]">Phone</p>
                                    <div className="mt-1 flex flex-col items-start gap-1 text-sm leading-6 text-[#666666]">
                                        {phoneNumbers.map((phone) => <a key={phone} href={`tel:${phone}`} className="transition-colors hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]">{phone}</a>)}
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <FiMail className="mt-1 shrink-0 text-2xl text-[#D4AF37]" aria-hidden="true" />
                                <div>
                                    <p className="text-sm font-semibold text-[#1a1a1a]">Email</p>
                                    <a href={`mailto:${siteSettings.email || fallbackSiteSettings.email}`} className="mt-1 inline-block text-sm leading-6 text-[#666666] transition-colors hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]">{siteSettings.email || fallbackSiteSettings.email}</a>
                                </div>
                            </div>
                            <div className="flex items-start gap-4">
                                <FiPhone className="mt-1 shrink-0 text-2xl text-[#D4AF37]" aria-hidden="true" />
                                <div>
                                    <p className="text-sm font-semibold text-[#1a1a1a]">WhatsApp</p>
                                    {siteSettings.whatsapp ? <a href={siteSettings.whatsapp} className="mt-1 inline-block text-sm leading-6 text-[#666666] transition-colors hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]">Message us on WhatsApp</a> : <span className="mt-1 inline-block text-sm leading-6 text-[#666666]">Message us on WhatsApp</span>}
                                </div>
                            </div>
                        </address>
                    </div>
                    <div>
                        <h2 className="sr-only">Contact form</h2>
                        <ContactForm />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Contact