import { useEffect, useState } from 'react'
import {
  FiCheckCircle,
  FiHeadphones,
  FiInbox,
  FiServer,
  FiUsers,
  FiWifi,
} from 'react-icons/fi'
import { Link } from 'react-router-dom'
import { getServices } from '../services/api'

const benefits = [
  {
    title: 'Experienced Professionals',
    description: 'Practical expertise across IT, networking, and industrial technology environments.',
    icon: FiUsers,
  },
  {
    title: 'Reliable Solutions',
    description: 'Technology recommendations selected for performance, continuity, and long-term value.',
    icon: FiCheckCircle,
  },
  {
    title: 'Customer-Focused Support',
    description: 'Clear communication and responsive support built around your business requirements.',
    icon: FiHeadphones,
  },
  {
    title: 'Quality & Technical Expertise',
    description: 'A quality-minded approach backed by thoughtful technical planning and delivery.',
    icon: FiWifi,
  },
]

function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" aria-label="Loading services">
      {Array.from({ length: 6 }, (_, index) => (
        <div key={index} className="h-80 animate-pulse rounded-md bg-[#F5F5F5]" />
      ))}
    </div>
  )
}

function ServiceCard({ service }) {
  return (
    <article className="mifra-card group flex h-full flex-col items-center p-7 text-center transition duration-300 hover:-translate-y-1 hover:text-[#D4AF37]">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-[#F5F5F5] transition-colors duration-300 group-hover:bg-[#D4AF37]">
        <FiServer className="text-4xl text-[#1a1a1a] transition-colors duration-300 group-hover:text-black" aria-hidden="true" />
      </div>
      <h2 className="mt-6 text-xl font-semibold text-[#1a1a1a] transition-colors duration-300 group-hover:text-[#D4AF37]">
        {service.name}
      </h2>
      <p className="mt-3 text-sm leading-6 text-[#666666]">{service.description}</p>
      <Link
        to={`/services/${service.id}`}
        className="mifra-btn-outline mt-6 min-h-12 px-5 text-sm group-hover:border-[#D4AF37]"
      >
        Learn More
      </Link>
    </article>
  )
}

function Services() {
  const [services, setServices] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let isMounted = true

    const fetchServices = async () => {
      setIsLoading(true)
      setError('')

      try {
        const data = await getServices()
        if (isMounted) setServices(Array.isArray(data) ? data : [])
      } catch {
        if (isMounted) {
          setServices([])
          setError('Unable to load services. Please try again.')
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchServices()

    return () => {
      isMounted = false
    }
  }, [retryCount])

  const visibleServices = services.filter((service) => service.isActive !== false)

  return (
    <div>
      <section className="bg-[#F5F5F5] py-14 sm:py-16" aria-labelledby="services-page-heading">
        <div className="mifra-container">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">MIFRA Enterprises</p>
          <h1 id="services-page-heading" className="mt-3 text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-5xl">
            Our Services
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#666666]">
            Professional technology and business solutions tailored to your needs.
          </p>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="service-list-heading">
        <div className="mifra-container">
          <div className="mb-10 max-w-2xl">
            <h2 id="service-list-heading" className="text-2xl font-bold text-[#1a1a1a] sm:text-3xl">How We Can Help</h2>
            <p className="mt-3 text-base leading-7 text-[#666666]">Explore practical services that support your technology and business goals.</p>
          </div>

          {isLoading ? <LoadingState /> : error ? (
            <div className="flex flex-col items-center justify-center rounded-md bg-[#F5F5F5] px-6 py-16 text-center">
              <p className="text-base text-[#666666]">{error}</p>
              <button type="button" onClick={() => setRetryCount((count) => count + 1)} className="mifra-btn-outline mt-6 min-h-12 px-5 text-sm">
                Retry
              </button>
            </div>
          ) : visibleServices.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleServices.map((service) => <ServiceCard key={service.id} service={service} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-md bg-[#F5F5F5] px-6 py-16 text-center">
              <FiInbox className="text-5xl text-[#D4AF37]" aria-hidden="true" />
              <h3 className="mt-5 text-xl font-semibold text-[#1a1a1a]">No services found</h3>
            </div>
          )}
        </div>
      </section>

      <section className="bg-[#F5F5F5] py-16 sm:py-20 lg:py-24" aria-labelledby="benefits-heading">
        <div className="mifra-container">
          <div className="max-w-2xl">
            <h2 id="benefits-heading" className="text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl">Why Choose MIFRA?</h2>
            <p className="mt-4 text-base leading-7 text-[#666666]">Reliable support and technical thinking for every stage of your technology journey.</p>
          </div>
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon

              return (
                <article key={benefit.title} className="rounded-md bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                  <Icon className="text-4xl text-[#D4AF37]" aria-hidden="true" />
                  <h3 className="mt-5 text-lg font-semibold text-[#1a1a1a]">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#666666]">{benefit.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#1a1a1a] py-16 text-white sm:py-20" aria-labelledby="services-cta-heading">
        <div className="mifra-container flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 id="services-cta-heading" className="text-3xl font-bold tracking-tight sm:text-4xl">Need a Custom Solution?</h2>
            <p className="mt-4 text-base leading-7 text-[#E0E0E0]">Talk to our team and let us help you find the right technology solution for your business.</p>
          </div>
          <Link to="/contact" className="mifra-btn-primary min-h-12 shrink-0">Request a Service</Link>
        </div>
      </section>
    </div>
  )
}

export default Services