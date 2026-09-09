import { FiBriefcase, FiMail, FiMapPin, FiPhone } from 'react-icons/fi'
import ContactForm from '../forms/ContactForm'

const contactInfo = {
    companyName: 'MIFRA ENTERPRISES SMC PVT LTD',
    ceo: 'M. Ramzan',
    email: 'mifraenterprise786@gmail.com',

    phone1: '03005410228',
    phone2: '03077875228',

    address1:
        'New Shakrial, Bannd Kanna Road, Abdullah Mosque Street #2, Rawalpindi',

    address2:
        'Murree Road, Ground Floor, Talha Heights, Rawalpindi',

    whatsapp: 'https://wa.me/923005410228',

    about:
        'MIFRA Enterprises deals in IT, electronics, network equipment, aviation spares, software solutions, repair services, government contracting, and general order supply.',
}

function Contact() {
    return (
        <div>
            {/* Page Header */}
            <section
                className="bg-[#F5F5F5] py-14 sm:py-16"
                aria-labelledby="contact-heading"
            >
                <div className="mifra-container">
                    <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
                        MIFRA Enterprises
                    </p>

                    <h1
                        id="contact-heading"
                        className="mt-3 text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-5xl"
                    >
                        Get in Touch
                    </h1>

                    <p className="mt-4 max-w-2xl text-base leading-7 text-[#666666]">
                        Have a question or a technology requirement? Our team is
                        ready to understand your needs and help you find a
                        practical solution.
                    </p>
                </div>
            </section>

            {/* Contact Section */}
            <section className="bg-white py-16 sm:py-20 lg:py-24">
                <div className="mifra-container grid gap-10 lg:grid-cols-[0.85fr_1.15fr] lg:gap-16 lg:items-start">

                    {/* Contact Information */}
                    <div>
                        <h2 className="text-2xl font-bold text-[#1a1a1a] sm:text-3xl">
                            Let&apos;s Talk
                        </h2>

                        {/* Company */}
                        <div className="mt-6 flex items-start gap-4">
                            <FiBriefcase
                                className="mt-1 shrink-0 text-2xl text-[#D4AF37]"
                                aria-hidden="true"
                            />

                            <div>
                                <p className="text-sm font-semibold text-[#1a1a1a]">
                                    {contactInfo.companyName}
                                </p>

                                <p className="mt-1 text-sm text-[#666666]">
                                    CEO &amp; Founder: {contactInfo.ceo}
                                </p>
                            </div>
                        </div>

                        <p className="mt-5 text-base leading-7 text-[#666666]">
                            {contactInfo.about}
                        </p>

                        <address className="mt-8 space-y-6 not-italic">

                            {/* Address 1 */}
                            <div className="flex items-start gap-4">
                                <FiMapPin
                                    className="mt-1 shrink-0 text-2xl text-[#D4AF37]"
                                    aria-hidden="true"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-[#1a1a1a]">
                                        Address 1
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-[#666666]">
                                        {contactInfo.address1}
                                    </p>
                                </div>
                            </div>

                            {/* Address 2 */}
                            <div className="flex items-start gap-4">
                                <FiMapPin
                                    className="mt-1 shrink-0 text-2xl text-[#D4AF37]"
                                    aria-hidden="true"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-[#1a1a1a]">
                                        Address 2
                                    </p>

                                    <p className="mt-1 text-sm leading-6 text-[#666666]">
                                        {contactInfo.address2}
                                    </p>
                                </div>
                            </div>

                            {/* Phone 1 */}
                            <div className="flex items-start gap-4">
                                <FiPhone
                                    className="mt-1 shrink-0 text-2xl text-[#D4AF37]"
                                    aria-hidden="true"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-[#1a1a1a]">
                                        Phone 1
                                    </p>

                                    <a
                                        href={`tel:${contactInfo.phone1}`}
                                        className="mt-1 inline-block text-sm leading-6 text-[#666666] transition-colors hover:text-[#D4AF37]"
                                    >
                                        {contactInfo.phone1}
                                    </a>
                                </div>
                            </div>

                            {/* Phone 2 */}
                            <div className="flex items-start gap-4">
                                <FiPhone
                                    className="mt-1 shrink-0 text-2xl text-[#D4AF37]"
                                    aria-hidden="true"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-[#1a1a1a]">
                                        Phone 2
                                    </p>

                                    <a
                                        href={`tel:${contactInfo.phone2}`}
                                        className="mt-1 inline-block text-sm leading-6 text-[#666666] transition-colors hover:text-[#D4AF37]"
                                    >
                                        {contactInfo.phone2}
                                    </a>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-4">
                                <FiMail
                                    className="mt-1 shrink-0 text-2xl text-[#D4AF37]"
                                    aria-hidden="true"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-[#1a1a1a]">
                                        Email
                                    </p>

                                    <a
                                        href={`mailto:${contactInfo.email}`}
                                        className="mt-1 inline-block break-all text-sm leading-6 text-[#666666] transition-colors hover:text-[#D4AF37]"
                                    >
                                        {contactInfo.email}
                                    </a>
                                </div>
                            </div>

                            {/* WhatsApp */}
                            <div className="flex items-start gap-4">
                                <FiPhone
                                    className="mt-1 shrink-0 text-2xl text-[#D4AF37]"
                                    aria-hidden="true"
                                />

                                <div>
                                    <p className="text-sm font-semibold text-[#1a1a1a]">
                                        WhatsApp
                                    </p>

                                    <a
                                        href={contactInfo.whatsapp}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="mt-1 inline-block text-sm leading-6 text-[#666666] transition-colors hover:text-[#D4AF37]"
                                    >
                                        Message us on WhatsApp
                                    </a>
                                </div>
                            </div>

                        </address>
                    </div>

                    {/* Contact Form */}
                    <div>
                        <h2 className="sr-only">
                            Contact form
                        </h2>

                        <ContactForm />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default Contact