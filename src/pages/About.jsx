function About() {
  return (
    <main className="bg-white text-[#1a1a1a]">
      {/* Hero */}
      <section className="bg-black py-16 text-white sm:py-20 lg:py-24">
        <div className="mifra-container">
          <div className="max-w-3xl">
            <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-[#D4AF37]">
              About MIFRA Enterprises
            </p>

            <h1 className="text-4xl font-bold leading-tight sm:text-5xl lg:text-6xl">
              Technology & Supply Solutions Built for Businesses
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-7 text-gray-300 sm:text-lg">
              MIFRA ENTERPRISES SMC PVT LTD is a trusted business partner
              providing technology, electronics, networking, aviation and
              general order supply solutions for organizations and businesses.
            </p>
          </div>
        </div>
      </section>

      {/* Company Overview */}
      <section className="py-16 sm:py-20">
        <div className="mifra-container">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#C59B27]">
                Who We Are
              </p>

              <h2 className="text-3xl font-bold sm:text-4xl">
                Your Reliable Business Solutions Partner
              </h2>

              <div className="mt-6 space-y-4 leading-7 text-gray-600">
                <p>
                  MIFRA ENTERPRISES SMC PVT LTD is committed to delivering
                  reliable products and professional supply solutions tailored
                  to the needs of modern businesses.
                </p>

                <p>
                  We deal in IT equipment, electronics, networking products,
                  aviation-related spare parts and general order supplies.
                  Our focus is on quality, reliability and timely service.
                </p>

                <p>
                  We aim to build long-term relationships with our clients by
                  understanding their requirements and providing practical,
                  dependable solutions.
                </p>
              </div>
            </div>

            {/* Highlight Card */}
            <div className="rounded-2xl bg-[#1a1a1a] p-8 text-white shadow-xl sm:p-10">
              <div className="mb-8 h-1 w-16 bg-[#D4AF37]" />

              <h3 className="text-2xl font-bold">
                What We Deliver
              </h3>

              <ul className="mt-6 space-y-5">
                {[
                  "IT & Technology Solutions",
                  "Electronics & Networking Equipment",
                  "Aviation Spare Parts",
                  "General Order Supplies",
                  "Professional Business Support",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-[#D4AF37]" />
                    <span className="text-gray-300">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Our Approach */}
      <section className="bg-gray-50 py-16 sm:py-20">
        <div className="mifra-container">
          <div className="mx-auto max-w-3xl text-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#C59B27]">
              Our Approach
            </p>

            <h2 className="text-3xl font-bold sm:text-4xl">
              Built Around Quality & Reliability
            </h2>

            <p className="mt-5 leading-7 text-gray-600">
              We believe successful business partnerships are built on
              reliability, responsiveness and consistent quality. Every
              requirement is handled with a professional and solution-focused
              approach.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="rounded-2xl border border-gray-200 bg-white p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-xl text-[#D4AF37]">
                ✓
              </div>

              <h3 className="text-xl font-bold">Quality</h3>

              <p className="mt-3 leading-6 text-gray-600">
                We focus on dependable products and solutions that meet
                business requirements.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-xl text-[#D4AF37]">
                ⚡
              </div>

              <h3 className="text-xl font-bold">Reliability</h3>

              <p className="mt-3 leading-6 text-gray-600">
                We work to provide consistent service and dependable supply
                support to our clients.
              </p>
            </div>

            <div className="rounded-2xl border border-gray-200 bg-white p-7">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-black text-xl text-[#D4AF37]">
                ★
              </div>

              <h3 className="text-xl font-bold">Professional Service</h3>

              <p className="mt-3 leading-6 text-gray-600">
                We understand requirements and provide practical solutions
                with a professional approach.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-black py-14 text-white sm:py-16">
        <div className="mifra-container flex flex-col items-start justify-between gap-7 lg:flex-row lg:items-center">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
              Let's Work Together
            </p>

            <h2 className="mt-2 text-3xl font-bold sm:text-4xl">
              Looking for a Reliable Business Partner?
            </h2>

            <p className="mt-3 max-w-2xl text-gray-300">
              Get in touch with MIFRA ENTERPRISES to discuss your product or
              supply requirements.
            </p>
          </div>

          <a
            href="/contact"
            className="mifra-btn-primary min-h-12 shrink-0"
          >
            Contact Us
          </a>
        </div>
      </section>
    </main>
  )
}

export default About
