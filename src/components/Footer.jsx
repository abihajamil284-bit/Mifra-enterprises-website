import {
    FiMail,
    FiMapPin,
    FiMessageCircle,
    FiPhone,
} from 'react-icons/fi'
import { NavLink } from 'react-router-dom'

const companyName = 'MIFRA ENTERPRISES SMC PVT LTD'

const contactInfo = {
    email: 'mifraenterprise786@gmail.com',
    phones: ['03005410228', '03077875228'],
    addresses: [
        'New Shakrial, Bannd Kanna Road, Abdullah Mosque Street #2, Rawalpindi',
        'Murree Road, Ground Floor, Talha Heights, Rawalpindi',
    ],
    whatsapp: 'https://wa.me/923005410228',
}

const quickLinks = [
    { name: 'Home', path: '/' },
    { name: 'About', path: '/about' },
    { name: 'Products', path: '/products' },
    { name: 'Services', path: '/services' },
    { name: 'Contact', path: '/contact' },
]

const services = [
    'IT & Electronics',
    'Network Equipment',
    'Aviation Spares',
    'Software Solutions',
    'Repair Services',
    'Government Contracting',
]

function Footer() {
    return (
        <footer className="bg-[#0B0B0B] text-white">
            {/* Main Footer */}
            <div className="mx-auto max-w-7xl px-6 py-14 lg:px-8">
                <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">

                    {/* Company */}
                    <div>
                        <h2 className="text-xl font-bold tracking-wide text-white">
                            {companyName}
                        </h2>

                        <div className="mt-3 h-0.5 w-12 bg-[#D4AF37]" />

                        <p className="mt-4 text-sm font-semibold text-[#D4AF37]">
                            CEO &amp; Founder: M. Ramzan
                        </p>

                        <p className="mt-4 max-w-sm text-sm leading-7 text-[#BDBDBD]">
                            MIFRA Enterprises deals in IT, electronics,
                            network equipment, aviation spares, software
                            solutions, repair services, government
                            contracting, and general order supply.
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            Quick Links
                        </h3>

                        <div className="mt-3 h-0.5 w-10 bg-[#D4AF37]" />

                        <ul className="mt-5 space-y-3">
                            {quickLinks.map((link) => (
                                <li key={link.path}>
                                    <NavLink
                                        to={link.path}
                                        className="text-sm text-[#BDBDBD] transition-colors duration-200 hover:text-[#D4AF37]"
                                    >
                                        {link.name}
                                    </NavLink>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Services */}
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            Our Services
                        </h3>

                        <div className="mt-3 h-0.5 w-10 bg-[#D4AF37]" />

                        <ul className="mt-5 space-y-3">
                            {services.map((service) => (
                                <li
                                    key={service}
                                    className="text-sm text-[#BDBDBD]"
                                >
                                    {service}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact */}
                    <div>
                        <h3 className="text-lg font-semibold text-white">
                            Contact Us
                        </h3>

                        <div className="mt-3 h-0.5 w-10 bg-[#D4AF37]" />

                        <ul className="mt-5 space-y-4">

                            {/* Address 1 */}
                            <li className="flex items-start gap-3">
                                <FiMapPin
                                    className="mt-1 shrink-0 text-xl text-[#D4AF37]"
                                    aria-hidden="true"
                                />

                                <span className="text-sm leading-6 text-[#BDBDBD]">
                                    {contactInfo.addresses[0]}
                                </span>
                            </li>

                            {/* Address 2 */}
                            <li className="flex items-start gap-3">
                                <FiMapPin
                                    className="mt-1 shrink-0 text-xl text-[#D4AF37]"
                                    aria-hidden="true"
                                />

                                <span className="text-sm leading-6 text-[#BDBDBD]">
                                    {contactInfo.addresses[1]}
                                </span>
                            </li>

                            {/* Phone 1 */}
                            <li className="flex items-center gap-3">
                                <FiPhone
                                    className="shrink-0 text-xl text-[#D4AF37]"
                                    aria-hidden="true"
                                />

                                <a
                                    href={`tel:${contactInfo.phones[0]}`}
                                    className="text-sm text-[#BDBDBD] transition-colors duration-200 hover:text-[#D4AF37]"
                                >
                                    {contactInfo.phones[0]}
                                </a>
                            </li>

                            {/* Phone 2 */}
                            <li className="flex items-center gap-3">
                                <FiPhone
                                    className="shrink-0 text-xl text-[#D4AF37]"
                                    aria-hidden="true"
                                />

                                <a
                                    href={`tel:${contactInfo.phones[1]}`}
                                    className="text-sm text-[#BDBDBD] transition-colors duration-200 hover:text-[#D4AF37]"
                                >
                                    {contactInfo.phones[1]}
                                </a>
                            </li>

                            {/* Email */}
                            <li className="flex items-center gap-3">
                                <FiMail
                                    className="shrink-0 text-xl text-[#D4AF37]"
                                    aria-hidden="true"
                                />

                                <a
                                    href={`mailto:${contactInfo.email}`}
                                    className="break-all text-sm text-[#BDBDBD] transition-colors duration-200 hover:text-[#D4AF37]"
                                >
                                    {contactInfo.email}
                                </a>
                            </li>

                            {/* WhatsApp */}
                            <li className="flex items-center gap-3">
                                <FiMessageCircle
                                    className="shrink-0 text-xl text-[#D4AF37]"
                                    aria-hidden="true"
                                />

                                <a
                                    href={contactInfo.whatsapp}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-[#BDBDBD] transition-colors duration-200 hover:text-[#D4AF37]"
                                >
                                    WhatsApp
                                </a>
                            </li>

                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-[#252525]">
                <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-6 py-5 text-center sm:flex-row sm:text-left lg:px-8">
                    <p className="text-sm text-[#888888]">
                        © {new Date().getFullYear()} {companyName}. All rights reserved.
                    </p>

                    <p className="text-sm text-[#888888]">
                        Professional Solutions. Trusted Service.
                    </p>
                </div>
            </div>
        </footer>
    )
}

export default Footer