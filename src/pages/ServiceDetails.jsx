import { useEffect, useState } from 'react'
import {
  FiCheckCircle,
  FiHeadphones,
  FiLayers,
  FiMessageSquare,
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
    description:
      'Dependable solutions designed to support smooth and consistent business operations.',
    icon: FiCheckCircle,
  },
  {
    title: 'Professional Expertise',
    description:
      'Experienced professionals focused on practical and effective technical solutions.',
    icon: FiUsers,
  },
  {
    title: 'Scalable Solutions',
    description:
      'Flexible solutions that can adapt to your organization as your requirements grow.',
    icon: FiWifi,
  },
  {
    title: 'Ongoing Support',
    description:
      'Responsive support to help keep your technology reliable and productive.',
    icon: FiHeadphones,
  },
]

function LoadingState() {
  return (
    <div className="animate-pulse">
      <div className="h-[420px] bg-[#1a1a1a]" />

      <div className="mifra-container py-16">
        <div className="h-8 w-2/3 rounded bg-[#F5F5F5]" />
        <div className="mt-5 h-28 rounded bg-[#F5F5F5]" />
      </div>
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
          if (data && data.isActive !== false) {
            setService(data)
          } else {
            setNotFound(true)
          }
        }
      } catch (requestError) {
        if (isMounted) {
          if (requestError?.response?.status === 404) {
            setNotFound(true)
          } else {
            setError('Unable to load this service. Please try again.')
          }
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    fetchService()

    return () => {
      isMounted = false
    }
  }, [id, retryCount])

  if (isLoading) {
    return <LoadingState />
  }

  if (error) {
    return (
      <section className="mifra-container flex min-h-[520px] flex-col items-center justify-center py-16 text-center">
        <FiLayers
          className="text-6xl text-[#D4AF37]"
          aria-hidden="true"
        />

        <h1 className="mt-6 text-3xl font-bold text-[#1a1a1a]">
          Unable to Load Service
        </h1>

        <p className="mt-3 text-[#666666]">{error}</p>

        <button
          type="button"
          onClick={() => setRetryCount((count) => count + 1)}
          className="mifra-btn-primary mt-7 min-h-12"
        >
          Retry
        </button>
      </section>
    )
  }

  if (notFound || !service) {
    return (
      <section className="mifra-container flex min-h-[520px] flex-col items-center justify-center py-16 text-center">
        <FiLayers
          className="text-6xl text-[#D4AF37]"
          aria-hidden="true"
        />

        <h1 className="mt-6 text-3xl font-bold text-[#1a1a1a]">
          Service Not Found
        </h1>

        <p className="mt-3 text-[#666666]">
          The service you are looking for could not be found.
        </p>

        <Link
          to="/services"
          className="mifra-btn-primary mt-7 min-h-12"
        >
          <FiArrowLeft aria-hidden="true" />
          Back to Services
        </Link>
      </section>
    )
  }

  return (
    <div className="bg-white">

      {/* Breadcrumb */}
      <div className="border-b border-[#EAEAEA] bg-white">
        <div className="mifra-container py-5">
          <nav
            aria-label="Breadcrumb"
            className="text-sm text-[#666666]"
          >
            <ol className="flex flex-wrap items-center gap-2">
              <li>
                <Link
                  to="/"
                  className="transition-colors hover:text-[#D4AF37]"
                >
                  Home
                </Link>
              </li>

              <li aria-hidden="true">/</li>

              <li>
                <Link
                  to="/services"
                  className="transition-colors hover:text-[#D4AF37]"
                >
                  Services
                </Link>
              </li>

              <li aria-hidden="true">/</li>

              <li
                className="font-medium text-[#1a1a1a]"
                aria-current="page"
              >
                {service.name}
              </li>
            </ol>
          </nav>
        </div>
      </div>

      {/* Hero */}
      <section className="relative overflow-hidden bg-[#111111] text-white">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full border border-[#D4AF37]" />
          <div className="absolute -right-20 -top-20 h-56 w-56 rounded-full border border-[#D4AF37]" />
        </div>

        <div className="mifra-container relative flex min-h-[430px] items-center py-20">
          <div className="max-w-3xl">

            <div className="flex h-16 w-16 items-center justify-center rounded-xl border border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]">
              <FiServer
                className="text-3xl"
                aria-hidden="true"
              />
            </div>

            <p className="mt-8 text-sm font-semibold uppercase tracking-[0.2em] text-[#D4AF37]">
              MIFRA Enterprises
            </p>

            <h1 className="mt-4 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
              {service.name}
            </h1>

            <div className="mt-6 h-1 w-16 bg-[#D4AF37]" />

            <p className="mt-6 max-w-2xl text-base leading-8 text-[#D6D6D6] sm:text-lg">
              {service.description}
            </p>

          </div>
        </div>
      </section>

      {/* Overview */}
      <section
        className="bg-white py-16 sm:py-20 lg:py-24"
        aria-labelledby="overview-heading"
      >
        <div className="mifra-container">
          <div className="grid gap-12 lg:grid-cols-[1.4fr_0.6fr] lg:items-start">

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
                Overview
              </p>

              <h2
                id="overview-heading"
                className="mt-3 text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl"
              >
                Professional Service Built Around Your Needs
              </h2>

              <p className="mt-6 max-w-3xl text-base leading-8 text-[#666666]">
                {service.description}
              </p>

              <p className="mt-5 max-w-3xl text-base leading-8 text-[#666666]">
                Our team works closely with clients to understand their
                requirements, recommend practical solutions, and deliver
                dependable results aligned with their business objectives.
              </p>
            </div>

            {/* Service Highlights */}
            <div className="rounded-2xl border border-[#E5E5E5] bg-[#F8F8F8] p-7">
              <p className="text-sm font-semibold uppercase tracking-[0.14em] text-[#D4AF37]">
                Service Highlights
              </p>

              <ul className="mt-6 space-y-5">
                {[
                  'Professional service delivery',
                  'Practical technical solutions',
                  'Business-focused approach',
                  'Customer-oriented support',
                ].map((item) => (
                  <li
                    key={item}
                    className="flex items-start gap-3"
                  >
                    <FiCheckCircle
                      className="mt-0.5 shrink-0 text-xl text-[#D4AF37]"
                      aria-hidden="true"
                    />

                    <span className="text-sm font-medium leading-6 text-[#444444]">
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

          </div>
        </div>
      </section>

      {/* Benefits */}
      <section
        className="bg-[#F5F5F5] py-16 sm:py-20 lg:py-24"
        aria-labelledby="benefits-heading"
      >
        <div className="mifra-container">

          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
              Our Value
            </p>

            <h2
              id="benefits-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl"
            >
              Why This Service?
            </h2>

            <p className="mt-4 text-base leading-7 text-[#666666]">
              We focus on quality, reliability, and practical results that
              help businesses operate with confidence.
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => {
              const Icon = benefit.icon

              return (
                <article
                  key={benefit.title}
                  className="rounded-xl border border-[#E5E5E5] bg-white p-7 transition-all duration-300 hover:-translate-y-1 hover:border-[#D4AF37] hover:shadow-[0_8px_25px_rgba(0,0,0,0.08)]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-[#D4AF37]/10">
                    <Icon
                      className="text-2xl text-[#D4AF37]"
                      aria-hidden="true"
                    />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold text-[#1a1a1a]">
                    {benefit.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-[#666666]">
                    {benefit.description}
                  </p>
                </article>
              )
            })}
          </div>

        </div>
      </section>

      {/* Why MIFRA */}
      <section
        className="bg-white py-16 sm:py-20 lg:py-24"
        aria-labelledby="why-mifra-heading"
      >
        <div className="mifra-container">
          <div className="mx-auto max-w-3xl text-center">

            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
              Why MIFRA
            </p>

            <h2
              id="why-mifra-heading"
              className="mt-3 text-3xl font-bold tracking-tight text-[#1a1a1a] sm:text-4xl"
            >
              A Reliable Partner for Your Business
            </h2>

            <p className="mt-5 text-base leading-8 text-[#666666]">
              MIFRA combines practical experience, technical understanding,
              and customer-focused service to provide solutions that are
              reliable, useful, and aligned with your requirements.
            </p>

            <div className="mt-8 flex flex-wrap justify-center gap-x-8 gap-y-4">
              {[
                'Experienced Team',
                'Quality Focused',
                'Reliable Support',
              ].map((point) => (
                <div
                  key={point}
                  className="flex items-center gap-2 text-sm font-semibold text-[#1a1a1a]"
                >
                  <FiCheckCircle
                    className="text-[#D4AF37]"
                    aria-hidden="true"
                  />

                  {point}
                </div>
              ))}
            </div>

          </div>
        </div>
      </section>

      {/* Request Service */}
      <section
        className="bg-[#111111] py-16 text-white sm:py-20 lg:py-24"
        aria-labelledby="request-service-heading"
      >
        <div className="mifra-container">

          <div className="mx-auto max-w-4xl rounded-2xl border border-[#333333] bg-[#181818] p-8 text-center sm:p-12">

            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#D4AF37] text-black">
              <FiMessageSquare
                className="text-2xl"
                aria-hidden="true"
              />
            </div>

            <h2
              id="request-service-heading"
              className="mt-6 text-3xl font-bold tracking-tight sm:text-4xl"
            >
              Need This Service?
            </h2>

            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#D0D0D0]">
              Share your requirements with our team and let us help you
              with the right solution for your business.
            </p>

            <button
              type="button"
              onClick={() =>
                setIsRequestFormVisible((isVisible) => !isVisible)
              }
              aria-expanded={isRequestFormVisible}
              className="mifra-btn-primary mt-8 min-h-12 px-7"
            >
              {isRequestFormVisible
                ? 'Close Request Form'
                : 'Request This Service'}
            </button>

          </div>

          {isRequestFormVisible && (
            <div className="mx-auto mt-8 max-w-4xl">
              <ServiceRequestForm service={service} />
            </div>
          )}

        </div>
      </section>

      

    </div>
  )
}

export default ServiceDetails