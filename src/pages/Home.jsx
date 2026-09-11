import { useEffect, useMemo, useRef, useState } from 'react'
import {
  FiArrowRight,
  FiChevronLeft,
  FiChevronRight,
  FiCheckCircle,
  FiServer,
  FiShield,
  FiTool,
} from 'react-icons/fi'
import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'
import { getCategories, getProducts, getServices } from '../services/api'

const capabilitySlides = [
  {
    title: 'Global Procurement & Import Solutions',
    subtitle: 'Reliable sourcing and procurement of specialized products from China, USA, and international markets — including electronics, industrial equipment, chemicals, batteries, and other technical requirements.',
    buttonLabel: 'Explore Our Services',
    to: '/services',
  },
  {
    title: 'Aviation Spare Parts & Technical Equipment',
    subtitle: 'Specialized procurement and sourcing of aviation spare parts, electronic components, and technical equipment from trusted international suppliers.',
    buttonLabel: 'Explore Aviation Solutions',
    to: '/services',
  },
  {
    title: 'Procurement Across Multiple Industries',
    subtitle: 'From electronics and medical equipment to industrial products and specialized technical solutions, we connect businesses with the right products and global suppliers.',
    buttonLabel: 'View Our Products',
    to: '/products',
  },
  {
    title: 'IT Services & Technology Solutions',
    subtitle: 'Professional IT solutions for businesses, including hardware, software, networking, system support, and technology consulting tailored to your requirements.',
    buttonLabel: 'Explore IT Services',
    to: '/services',
  },
  {
    title: 'Heavy-Duty UPS Repair & Maintenance',
    subtitle: 'Reliable repair, troubleshooting, maintenance, and technical support for heavy-duty UPS systems and large-scale power backup equipment.',
    buttonLabel: 'Explore UPS Services',
    to: '/services',
  },
]

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

function ProductCard({ product, categoryName }) {
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
        {categoryName && <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#666666]">{categoryName}</p>}
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
            to={`/products/${product.id}`}
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
        to={`/services/${service.id}`}
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

function CapabilitySlider() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updatePreference = () => setPrefersReducedMotion(mediaQuery.matches)

    updatePreference()
    mediaQuery.addEventListener('change', updatePreference)
    return () => mediaQuery.removeEventListener('change', updatePreference)
  }, [])

  useEffect(() => {
    if (isPaused || prefersReducedMotion) return undefined

    const intervalId = window.setInterval(() => {
      setActiveIndex((index) => (index + 1) % capabilitySlides.length)
    }, 3500)

    return () => window.clearInterval(intervalId)
  }, [isPaused, prefersReducedMotion])

  const goToSlide = (index) => setActiveIndex((index + capabilitySlides.length) % capabilitySlides.length)
  const slide = capabilitySlides[activeIndex]

  const handleKeyDown = (event) => {
    if (event.key === 'ArrowLeft') {
      event.preventDefault()
      goToSlide(activeIndex - 1)
    }
    if (event.key === 'ArrowRight') {
      event.preventDefault()
      goToSlide(activeIndex + 1)
    }
  }

  return (
    <section className="overflow-hidden bg-[#F5F5F5] py-12 sm:py-16" aria-labelledby="capabilities-heading">
      <div className="mifra-container">
        <div
          className="relative overflow-hidden rounded-lg bg-[#1a1a1a] px-6 py-10 text-white shadow-[0_8px_24px_rgba(0,0,0,0.16)] sm:px-10 sm:py-14 lg:px-16"
          role="region"
          aria-roledescription="carousel"
          aria-label="MIFRA business capabilities"
          tabIndex="0"
          onKeyDown={handleKeyDown}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onFocus={() => setIsPaused(true)}
          onBlur={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget)) setIsPaused(false)
          }}
        >
          <span className="absolute right-0 top-0 h-24 w-24 border-b-2 border-l-2 border-[#D4AF37] opacity-80" aria-hidden="true" />
          <span className="absolute bottom-0 left-0 h-16 w-16 border-r-2 border-t-2 border-[#D4AF37] opacity-80" aria-hidden="true" />

          <div key={activeIndex} className="relative max-w-3xl motion-safe:animate-[mifra-slide-enter_450ms_ease-out_both]">
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">MIFRA Enterprises</p>
            <h2 id="capabilities-heading" className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {slide.title}
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-[#E0E0E0] sm:text-lg">
              {slide.subtitle}
            </p>
            <Link to={slide.to} className="mifra-btn-primary mt-7 min-h-12">
              {slide.buttonLabel}
              <FiArrowRight aria-hidden="true" />
            </Link>
          </div>

          <div className="relative mt-8 flex items-center justify-between gap-4">
            <div className="flex gap-2" aria-label="Capability slide selection">
              {capabilitySlides.map((capability, index) => (
                <button
                  key={capability.title}
                  type="button"
                  onClick={() => goToSlide(index)}
                  className={`h-3 w-3 rounded-full transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${index === activeIndex ? 'bg-[#D4AF37]' : 'bg-white/40 hover:bg-white/70'}`}
                  aria-label={`Show slide ${index + 1}: ${capability.title}`}
                  aria-current={index === activeIndex ? 'true' : undefined}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button type="button" onClick={() => goToSlide(activeIndex - 1)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded border border-[#D4AF37] text-[#D4AF37] transition-colors duration-200 hover:bg-[#D4AF37] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]" aria-label="Previous capability slide">
                <FiChevronLeft aria-hidden="true" />
              </button>
              <button type="button" onClick={() => goToSlide(activeIndex + 1)} className="inline-flex min-h-11 min-w-11 items-center justify-center rounded border border-[#D4AF37] text-[#D4AF37] transition-colors duration-200 hover:bg-[#D4AF37] hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]" aria-label="Next capability slide">
                <FiChevronRight aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function Home() {
  const [products, setProducts] = useState([])
  const [categoryNames, setCategoryNames] = useState({})
  const [services, setServices] = useState([])
  const [isProductsLoading, setIsProductsLoading] = useState(true)
  const [isServicesLoading, setIsServicesLoading] = useState(true)
  const [productsError, setProductsError] = useState('')
  const [servicesError, setServicesError] = useState('')
  const productCarouselRef = useRef(null)
  const [isProductCarouselVisible, setIsProductCarouselVisible] = useState(false)
  const [isProductCarouselPaused, setIsProductCarouselPaused] = useState(false)

  useEffect(() => {
    const carousel = productCarouselRef.current
    if (!carousel) return undefined

    const observer = new IntersectionObserver(
      ([entry]) => setIsProductCarouselVisible(entry.isIntersecting),
      { rootMargin: '120px 0px' },
    )

    observer.observe(carousel)
    return () => observer.disconnect()
  }, [isProductsLoading, products.length])

  const featuredProducts = useMemo(() => (
    [...products].sort((firstProduct, secondProduct) => {
      const firstFeatured = firstProduct.featured === true || firstProduct.isFeatured === true
      const secondFeatured = secondProduct.featured === true || secondProduct.isFeatured === true
      if (firstFeatured !== secondFeatured) return firstFeatured ? -1 : 1

      const firstOrder = Number(firstProduct.displayOrder)
      const secondOrder = Number(secondProduct.displayOrder)
      if (Number.isNaN(firstOrder)) return Number.isNaN(secondOrder) ? 0 : 1
      if (Number.isNaN(secondOrder)) return -1
      return firstOrder - secondOrder
    })
  ), [products])

  useEffect(() => {
    let isMounted = true

    const fetchHomepageData = async () => {
      const [productsResult, servicesResult, categoriesResult] = await Promise.allSettled([getProducts(), getServices(), getCategories()])

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

      if (categoriesResult.status === 'fulfilled') {
        const data = categoriesResult.value
        const categories = Array.isArray(data) ? data : data?.categories || data?.data || []
        const namesById = categories.reduce((names, category) => {
          const categoryId = category.id || category._id || category.categoryId
          const categoryName = category.name

          if (typeof categoryId === 'string' && categoryId.trim() && typeof categoryName === 'string' && categoryName.trim()) {
            names[categoryId] = categoryName
          }

          return names
        }, {})
        setCategoryNames(namesById)
      }

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
        @keyframes mifra-slide-enter {
          from { opacity: 0; transform: translateX(18px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes mifra-product-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(calc(-50% - 0.75rem)); }
        }
      `}</style>

      <div>
        <CapabilitySlider />

        <section className="bg-white py-16 sm:py-20 lg:py-24" aria-labelledby="featured-products-heading">
          <div className="mifra-container">
            <SectionIntro
              id="featured-products-heading"
              title="Featured Products"
              subtitle="Explore our latest technology and industrial solutions."
            />
            <div className="mt-10">
              {isProductsLoading ? <LoadingCards count={4} className="grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" /> : productsError ? <SectionMessage>{productsError}</SectionMessage> : featuredProducts.length === 0 ? <SectionMessage>No products found.</SectionMessage> : (
                <div
                  ref={productCarouselRef}
                  className="overflow-hidden"
                  aria-label="Continuously moving featured products carousel"
                  onMouseEnter={() => setIsProductCarouselPaused(true)}
                  onMouseLeave={() => setIsProductCarouselPaused(false)}
                  onFocus={() => setIsProductCarouselPaused(true)}
                  onBlur={(event) => {
                    if (!event.currentTarget.contains(event.relatedTarget)) setIsProductCarouselPaused(false)
                  }}
                >
                  <div
                    className="flex w-max gap-6 motion-safe:animate-[mifra-product-marquee_32s_linear_infinite]"
                    style={{ animationPlayState: isProductCarouselVisible && !isProductCarouselPaused ? 'running' : 'paused' }}
                  >
                    {[0, 1].map((copyIndex) => (
                      <div key={copyIndex} className="flex shrink-0 gap-6" aria-hidden={copyIndex === 1 ? 'true' : undefined} inert={copyIndex === 1 ? '' : undefined}>
                        {featuredProducts.map((product) => (
                          <div key={`${copyIndex}-${product.id}`} className="w-[min(84vw,20rem)] shrink-0 sm:w-72 lg:w-[19rem]">
                            <ProductCard product={product} categoryName={categoryNames[product.category]} />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              )}
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
