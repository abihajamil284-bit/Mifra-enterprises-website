import { useEffect, useState } from 'react'
import {
  FiArrowLeft,
  FiCheckCircle,
  FiHeadphones,
  FiLayers,
  FiServer,
  FiUsers,
  FiWifi,
} from 'react-icons/fi'
import { Link, useParams } from 'react-router-dom'
import ServiceRequestForm from '../forms/ServiceRequestForm'
import { getService } from '../services/api'

const benefits = [
  {
    title: 'Reliable Performance',
    description: 'Solutions selected and delivered with dependable performance in mind.',
    icon: FiCheckCircle,
  },
  {
    title: 'Professional Expertise',
    description: 'Practical technical knowledge to guide your project from planning to delivery.',
    icon: FiUsers,
  },
  {
    title: 'Scalable Solutions',
    description: 'Flexible technology foundations that can support your organization as it grows.',
    icon: FiWifi,
  },
  {
    title: 'Ongoing Support',
    description: 'Responsive assistance that helps your systems remain useful and reliable over time.',
    icon: FiHeadphones,
  },
]

function LoadingState() {
  return (
    <div className="animate-pulse" aria-label="Loading service details">
      <div className="h-72 bg-[#1a1a1a]" />
      <div className="mifra-container py-16">
        <div className="h-8 w-2/3 rounded bg-[#F5F5F5]" />
        <div className="mt-6 h-24 rounded bg-[#F5F5F5]" />
      </div>
    </div>
  )
}

function ServiceBadge({ label, value }) {
  return (
    <div className="rounded-md bg-[#F5F5F5] p-4">
      <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#666666]">{label}</p>
      <p className="mt-2 text-sm font-semibold text-[#1a1a1a]">{value}</p>
    </div>
  )
}

function ServiceDetails() {
  const { id } = useParams()
  const [service, setService] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [notFound, setNotFound] = useState(false)
  const [retryCount, setRetryCount] = useState(0)
  const [isRequestFormVisible, setIsRequestFormVisible] = useState(false)

  useEffect(() => {
    let isMounted = true

    const fetchService = async () => {
      setIsLoading(true)
      setError('')
      setNotFound(false)
      setService(null)

      if (!id) {
        setNotFound(true)
        setIsLoading(false)
        return
      }

      try {
        const data = await getService(id)
        if (isMounted) {
          if (data && data.isActive !== false) setService(data)
          else setNotFound(true)
        }
      } catch (requestError) {
        if (isMounted) {
          if (requestError?.response?.status === 404) setNotFound(true)
          else setError('Unable to load this service. Please try again.')
        }
      } finally {
        if (isMounted) setIsLoading(false)
      }
    }

    fetchService()

    return () => {
      isMounted = false
    }
  }, [id, retryCount])

  if (isLoading) return <LoadingState />

  if (error) {
    return (
      <section className="mifra-container flex min-h-[520px] flex-col items-center justify-center py-16 text-center">
        <FiLayers className="text-6xl text-[#D4AF37]" aria-hidden="true" />
        <h1 className="mt-6 text-3xl font-bold text-[#1a1a1a]">Unable to Load Service</h1>
        <p className="mt-3 text-[#666666]">{error}</p>
        <button type="button" onClick={() => setRetryCount((count) => count + 1)} className="mifra-btn-primary mt-7 min-h-12">
          Retry
        </button>
      </section>
    )
  }

  if (notFound || !service) {
    return (
      <section className="mifra-container flex min-h-[520px] flex-col items-center justify-center py-16 text-center">
        <FiLayers className="text-6xl text-[#D4AF37]" aria-hidden="true" />
        <h1 className="mt-6 text-3xl font-bold text-[#1a1a1a]">Service Not Found</h1>
        <p className="mt-3 text-[#666666]">The service you are looking for could not be found.</p>
        <Link to="/services" className="mifra-btn-primary mt-7 min-h-12">
          <FiArrowLeft aria-hidden="true" /> Back to Services
        </Link>
      </section>
    )
  }

  return (
    <div className="bg-white">
      <div className="mifra-container py-6 sm:py-8">
        <nav aria-label="Breadcrumb" className="text-sm text-[#666666]">
          <ol className="flex flex-wrap items-center gap-2">
            <li><Link to="/" className="transition-colors hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]">Home</Link></li>
            <li aria-hidden="true">&gt;</li>
            <li><Link to="/services" className="transition-colors hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]">Services</Link></li>
            <li aria-hidden="true">&gt;</li>
            <li className="font-medium text-[#1a1a1a]" aria-current="page">{service.name}</li>
          </ol>
        </nav>
      </div>

      <section className="bg-[#1a1a1a] text-white" aria-labelledby="service-name-heading">
        <div className="mifra-container flex min-h-[360px] flex-col items-center justify-center py-16 text-center sm:min-h-[400px]">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border border-[#D4AF37] bg-black text-[#D4AF37]">
            <FiServer className="text-4xl" aria-hidden="true" />
          </div>
          <h1 id="service-name-heading" className="mt-7 text-4xl font-bold tracking-tight sm:text-5xl">{service.name}</h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-[#E0E0E0] sm:text-lg">{service.description}</p>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20" aria-labelledby="service-overview-heading">
        <div className="mifra-container grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16">
          <div>
            <h2 id="service-overview-heading" className="text-3xl font-bold text-[#1a1a1a]">Service Overview</h2>
            <p className="mt-5 max-w-2xl text-base leading-8 text-[#666666]">{service.description} MIFRA works with your team to understand the operating environment, define a practical approach, and deliver technology support aligned with your business priorities.</p>
          </div>
          <aside className="rounded-md border border-[#E0E0E0] bg-white p-6 shadow-[0_2px_8px_rgba(0,0,0,0.1)]" aria-label="Service information">
            <h3 className="text-lg font-semibold text-[#1a1a1a]">Service Information</h3>
            <div className="mt-5 grid gap-3">
              <ServiceBadge label="Price" value={service.price ?? 'Not specified'} />
              <ServiceBadge label="Category" value={service.category || 'Not specified'} />
              <ServiceBadge label="Featured" value={service.featured ? 'Yes' : 'No'} />
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-[#F5F5F5] py-16 sm:py-20" aria-labelledby="included-heading">
        <div className="mifra-container">
          <h2 id="included-heading" className="text-3xl font-bold text-[#1a1a1a]">What&apos;s Included</h2>
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <ServiceBadge label="Category" value={service.category || 'Not specified'} />
            <ServiceBadge label="Display Order" value={service.displayOrder ?? 'Not specified'} />
            <ServiceBadge label="Featured" value={service.featured ? 'Yes' : 'No'} />
          </div>
        </div>
      </section>

      <section className="bg-white py-16 sm:py-20" aria-labelledby="benefits-heading">
        <div className="mifra-container">
          <h2 id="benefits-heading" className="text-3xl font-bold text-[#1a1a1a]">Benefits</h2>
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon

              return (
                <article key={benefit.title} className="mifra-card p-6">
                  <Icon className="text-4xl text-[#D4AF37]" aria-hidden="true" />
                  <h3 className="mt-5 text-lg font-semibold text-[#1a1a1a]">{benefit.title}</h3>
                  <p className="mt-3 text-sm leading-6 text-[#666666]">{benefit.description}</p>
                </article>
              )
            })}
          </div>
        </div>
      </section>

      <section className="bg-[#F5F5F5] py-16 sm:py-20" aria-labelledby="why-mifra-heading">
        <div className="mifra-container grid gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:items-center">
          <h2 id="why-mifra-heading" className="text-3xl font-bold text-[#1a1a1a] sm:text-4xl">Why Choose MIFRA?</h2>
          <div>
            <p className="text-base leading-8 text-[#666666]">MIFRA provides professional, reliable, and customer-focused technology solutions. Our team combines practical experience with careful technical thinking to help organizations make confident decisions and keep their operations moving.</p>
            <ul className="mt-6 grid gap-3 sm:grid-cols-3">
              {['Experienced team', 'Quality-focused solutions', 'Customer support'].map((point) => (
                <li key={point} className="flex items-start gap-2 text-sm font-semibold text-[#1a1a1a]"><FiCheckCircle className="mt-0.5 shrink-0 text-[#D4AF37]" aria-hidden="true" />{point}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="bg-[#1a1a1a] py-16 text-white sm:py-20" aria-labelledby="service-cta-heading">
        <div className="mifra-container flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <h2 id="service-cta-heading" className="text-3xl font-bold sm:text-4xl">Ready to Get Started?</h2>
            <p className="mt-4 text-base leading-7 text-[#E0E0E0]">Tell us what you need and our team will help you find the right solution.</p>
          </div>
          <button
            type="button"
            onClick={() => setIsRequestFormVisible((isVisible) => !isVisible)}
            aria-expanded={isRequestFormVisible}
            className="mifra-btn-primary min-h-12 shrink-0"
          >
            Request This Service
          </button>
        </div>
        {isRequestFormVisible && <div className="mifra-container mt-8"><ServiceRequestForm service={service} /></div>}
      </section>

      <section className="bg-white py-16 sm:py-20" aria-labelledby="related-services-heading">
        <div className="mifra-container">
          <h2 id="related-services-heading" className="text-3xl font-bold text-[#1a1a1a]">Related Services</h2>
          <p className="mt-8 text-base leading-7 text-[#666666]">Related services will be available soon.</p>
        </div>
      </section>
    </div>
  )
}

export default ServiceDetails