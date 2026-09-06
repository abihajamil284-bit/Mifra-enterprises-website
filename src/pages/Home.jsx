import { useEffect, useState } from 'react'
import {
  FiArrowRight,
  FiCheckCircle,
  FiServer,
  FiShield,
  FiTool,
} from 'react-icons/fi'
import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'
import { getProducts, getServices, getSiteSettings } from '../services/api'

const fallbackAboutText = 'MIFRA Enterprises delivers reliable IT, networking, and industrial technology solutions designed to help businesses operate smarter and more efficiently.'

const reasons = [
  {
    title: 'Reliable Solutions',
    description:
      'Technology solutions selected with reliability, performance, and long-term value in mind.',
    icon: FiCheckCircle,
  },
  {
    title: 'Technical Expertise',
    description:
      'Professional knowledge across IT infrastructure, networking, and industrial technology.',
    icon: FiShield,
  },
  {
    title: 'Customer Focus',
    description:
      'We work closely with customers to understand their requirements and deliver practical solutions.',
    icon: FiTool,
  },
]

function SectionIntro({ title, subtitle, light = false, id }) {
  return (
    <div className="max-w-2xl">
      <h2
        id={id}
        className={`text-3xl font-bold tracking-tight sm:text-4xl ${light ? 'text-white' : 'text-[#1a1a1a]'}`}
      >
        {title}
      </h2>
      <p className={`mt-4 text-base leading-7 ${light ? 'text-[#E0E0E0]' : 'text-[#666666]'}`}>
        {subtitle}
      </p>
    </div>
  )
}

function ProductCard({ product }) {
  const stockQuantity = Number(product.stockQuantity) || 0
  const lowStockThreshold = Number(product.lowStockThreshold) || 0
  const stockStatus = stockQuantity <= 0
    ? 'Out of Stock'
    : stockQuantity <= lowStockThreshold
      ? 'Limited Stock'
      : 'In Stock'

  return (
    <article className="mifra-card group flex h-full flex-col overflow-hidden bg-white transition duration-300 hover:-translate-y-1">
      <div className="aspect-[4/3] overflow-hidden bg-[#1a1a1a] p-8">
        <img
          src={product.image || heroImage}
          alt={`${product.name} product preview`}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#666666]">{product.category}</p>
        <h3 className="mt-2 text-lg font-semibold text-[#1a1a1a]">{product.name}</h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-[#666666]">{product.description}</p>
        <div className="mt-5 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-[#D4AF37]">{product.price == null ? 'Quote on request' : `$${Number(product.price).toLocaleString()}`}</p>
            <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${stockStatus === 'In Stock' ? 'bg-[#EAF6ED] text-[#287A3D]' : stockStatus === 'Limited Stock' ? 'bg-[#FFF4E5] text-[#9A5B00]' : 'bg-[#FDECEC] text-[#B42318]'}`}>
              {stockStatus}
            </span>
          </div>
          <Link
            to="/products"
            className="inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-[#1a1a1a] transition-colors duration-200 hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
          >
            View Product
            <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </div>
    </article>
  )
}

function ServiceCard({ service }) {
  return (
    <article className="mifra-card group h-full bg-white p-6 transition duration-300 hover:-translate-y-1 hover:text-[#D4AF37]">
      <FiServer className="text-5xl text-[#1a1a1a] transition-colors duration-200 group-hover:text-[#D4AF37]" aria-hidden="true" />
      <h3 className="mt-5 text-xl font-semibold text-[#1a1a1a] transition-colors duration-200 group-hover:text-[#D4AF37]">
        {service.name}
      </h3>
      <p className="mt-3 text-sm leading-6 text-[#666666]">{service.description}</p>
      <Link
        to="/services"
        className="mt-5 inline-flex min-h-12 items-center gap-2 text-sm font-semibold text-[#1a1a1a] transition-colors duration-200 hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
      >
        Learn More
        <FiArrowRight aria-hidden="true" />
      </Link>
    </article>
  )
}

function LoadingCards({ count, className }) {
  return (
    <div className={`grid ${className}`} aria-label="Loading content">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className="h-80 animate-pulse rounded-md bg-[#F5F5F5]" />
      ))}
    </div>
  )
}

function SectionMessage({ children }) {
  return <div className="rounded-md bg-[#F5F5F5] px-6 py-16 text-center text-sm text-[#666666]">{children}</div>
}

function Home() {
  const [aboutText, setAboutText] = useState(fallbackAboutText)
  const [products, setProducts] = useState([])
  const [services, setServices] = useState([])
  const [isProductsLoading, setIsProductsLoading] = useState(true)
  const [isServicesLoading, setIsServicesLoading] = useState(true)
  const [productsError, setProductsError] = useState('')
  const [servicesError, setServicesError] = useState('')

  useEffect(() => {
    let isMounted = true

    const fetchSiteSettings = async () => {
      try {
        const settings = await getSiteSettings()
        if (isMounted && typeof settings?.about_text === 'string' && settings.about_text.trim()) {
          setAboutText(settings.about_text)
        }
      } catch {
        if (isMounted) setAboutText(fallbackAboutText)
      }
    }

    fetchSiteSettings()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const fetchHomepageData = async () => {
      const [productsResult, servicesResult] = await Promise.allSettled([getProducts(), getServices()])

      if (!isMounted) return

      if (productsResult.status === 'fulfilled') {
        const data = productsResult.value
        const activeProducts = (Array.isArray(data) ? data : data?.products || data?.data || [])
          .filter((product) => product.isActive !== false)
        setProducts(activeProducts)
      } else {
        setProductsError('Unable to load products.')
      }
      setIsProductsLoading(false)

      if (servicesResult.status === 'fulfilled') {
        const data = servicesResult.value
        const activeServices = (Array.isArray(data) ? data : data?.services || data?.data || [])
          .filter((service) => service.isActive !== false)
          .sort((firstService, secondService) => {
            const firstOrder = Number(firstService.displayOrder)
            const secondOrder = Number(secondService.displayOrder)
            if (Number.isNaN(firstOrder)) return Number.isNaN(secondOrder) ? 0 : 1
            if (Number.isNaN(secondOrder)) return -1
            return firstOrder - secondOrder
          })
        setServices(activeServices)
      } else {
        setServicesError('Unable to load services.')
      }
      setIsServicesLoading(false)
    }

    fetchHomepageData()

    return () => {
      isMounted = false
    }
  }, [])

  return (
    <>
      <style>{`
        @keyframes mifra-hero-enter {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @media (prefers-reduced-motion: reduce) {
          .mifra-hero-motion { animation: none !important; }
        }
      `}</style>

      <div>
        <section className="overflow-hidden bg-[#1a1a1a] text-white">
          <div className="mifra-container grid min-h-[520px] items-center gap-12 py-16 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-24">
            <div className="mifra-hero-motion max-w-2xl motion-safe:animate-[mifra-hero-enter_500ms_ease-out_both]">
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">
                IT &amp; Industrial Technology Solutions
              </p>
              <h1 className="mt-5 text-4xl font-bold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
                Technology Solutions Built for Business
              </h1>
              <p className="mt-6 max-w-xl text-base leading-8 text-[#E0E0E0] sm:text-lg">
                {aboutText}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link to="/products" className="mifra-btn-primary min-h-12">
                  Browse Products
                </Link>
                <Link
                  to="/services"
                  className="inline-flex min-h-12 items-center justify-center rounded border border-[#D4AF37] px-6 text-sm font-semibold text-[#D4AF37] transition-colors duration-200 hover:bg-[#D4AF37] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
                >
                  View Services
                </Link>
              </div>
            </div>

            <div className="relative mx-auto w-full max-w-xl lg:justify-self-end">
              <span className="absolute -right-3 -top-3 h-20 w-20 border-r-2 border-t-2 border-[#D4AF37] sm:-right-4 sm:-top-4" aria-hidden="true" />
              <div className="mifra-hero-motion relative aspect-[4/3] overflow-hidden rounded-lg bg-black p-6 shadow-2xl motion-safe:animate-[mifra-hero-enter_500ms_ease-out_both] sm:p-10">
                <img
                  src={heroImage}
                  alt="Abstract MIFRA technology platform illustration"
                  className="h-full w-full object-contain"
                />
              </div>
              <span className="absolute -bottom-3 -left-3 h-14 w-14 border-b-2 border-l-2 border-[#D4AF37] sm:-bottom-4 sm:-left-4" aria-hidden="true" />
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="featured-products-heading">
          <div className="mifra-container">
            <SectionIntro
              id="featured-products-heading"
              title="Featured Products"
              subtitle="Explore our latest technology and industrial solutions."
            />
            <div className="mt-10">
              {isProductsLoading ? <LoadingCards count={4} className="grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" /> : productsError ? <SectionMessage>{productsError}</SectionMessage> : products.length === 0 ? <SectionMessage>No products found.</SectionMessage> : <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">{products.map((product) => <ProductCard key={product.id} product={product} />)}</div>}
            </div>
            <div className="mt-10">
              <Link to="/products" className="mifra-btn-primary min-h-12">
                View All Products
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-[#F5F5F5] py-16 sm:py-20 lg:py-24" aria-labelledby="services-heading">
          <div className="mifra-container">
            <SectionIntro
              id="services-heading"
              title="Our Services"
              subtitle="Professional technology services designed around your business needs."
            />
            <div className="mt-10">
              {isServicesLoading ? <LoadingCards count={6} className="grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3" /> : servicesError ? <SectionMessage>{servicesError}</SectionMessage> : services.length === 0 ? <SectionMessage>No services found.</SectionMessage> : <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">{services.map((service) => <ServiceCard key={service.id} service={service} />)}</div>}
            </div>
            <div className="mt-10">
              <Link to="/services" className="mifra-btn-primary min-h-12">
                Explore All Services
              </Link>
            </div>
          </div>
        </section>

        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="why-mifra-heading">
          <div className="mifra-container">
            <SectionIntro
              id="why-mifra-heading"
              title="Why Choose MIFRA?"
              subtitle="Reliable technology solutions backed by quality, expertise, and professional support."
            />
            <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-3">
              {reasons.map((reason) => {
                const Icon = reason.icon

                return (
                  <article key={reason.title} className="rounded-md bg-[#F5F5F5] p-7">
                    <Icon className="text-4xl text-[#D4AF37]" aria-hidden="true" />
                    <h3 className="mt-6 text-2xl font-semibold text-[#1a1a1a]">{reason.title}</h3>
                    <p className="mt-3 text-sm leading-7 text-[#666666]">{reason.description}</p>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="bg-[#1a1a1a] py-16 text-white sm:py-20 lg:py-24" aria-labelledby="cta-heading">
          <div className="mifra-container flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <SectionIntro
                id="cta-heading"
                title="Ready to Find the Right Solution?"
                subtitle="Tell us what your business needs and our team will help you find the right technology solution."
                light
              />
            </div>
            <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
              <Link to="/contact" className="mifra-btn-primary min-h-12">
                Get in Touch
              </Link>
              <Link
                to="/products"
                className="inline-flex min-h-12 items-center justify-center rounded border border-[#D4AF37] px-6 text-sm font-semibold text-[#D4AF37] transition-colors duration-200 hover:bg-[#D4AF37] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
              >
                Browse Products
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  )
}

export default Home