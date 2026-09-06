import { useEffect, useState } from 'react'
import {
  FiArrowLeft,
  FiClock,
  FiInfo,
  FiX,
} from 'react-icons/fi'
import { Link, useParams } from 'react-router-dom'
import heroImage from '../assets/hero.png'
import ProductRequestForm from '../forms/ProductRequestForm'
import { getProduct } from '../services/api'

const stockClasses = {
  'In Stock': 'bg-[#27AE60] text-white',
  'Limited Stock': 'bg-[#F39C12] text-black',
  'Out of Stock': 'bg-[#E74C3C] text-white',
}

function handleImageError(event) {
  event.currentTarget.onerror = null
  event.currentTarget.src = heroImage
}

function LoadingState() {
  return (
    <div className="mifra-container animate-pulse py-16" aria-label="Loading product details">
      <div className="h-4 w-48 rounded bg-[#F5F5F5]" />
      <div className="mt-8 grid gap-10 lg:grid-cols-2">
        <div className="aspect-square rounded-md bg-[#F5F5F5]" />
        <div className="space-y-5">
          <div className="h-8 w-3/4 rounded bg-[#F5F5F5]" />
          <div className="h-5 w-1/3 rounded bg-[#F5F5F5]" />
          <div className="h-24 rounded bg-[#F5F5F5]" />
        </div>
      </div>
    </div>
  )
}

function StockBadge({ status }) {
  return <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${stockClasses[status]}`}>{status}</span>
}

function ProductDetails() {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [isRequestFormOpen, setIsRequestFormOpen] = useState(false)

  useEffect(() => {
    let isMounted = true

    const loadProduct = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await getProduct(id)
        const apiProduct = response?.product || response?.data || response
        const stockQuantity = Number(apiProduct?.stockQuantity) || 0
        const lowStockThreshold = Number(apiProduct?.lowStockThreshold) || 0

        if (isMounted) {
          setProduct({
            ...apiProduct,
            image: apiProduct?.image || heroImage,
            stockStatus: stockQuantity <= 0
              ? 'Out of Stock'
              : stockQuantity <= lowStockThreshold
                ? 'Limited Stock'
                : 'In Stock',
            stockMessage: stockQuantity <= 0
              ? 'Currently unavailable.'
              : `${stockQuantity} available.`,
          })
        }
      } catch {
        if (isMounted) {
          setError('Sorry, the product could not be loaded.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadProduct()

    return () => {
      isMounted = false
    }
  }, [id])

  if (isLoading) return <LoadingState />

  if (error || !product) {
    return (
      <section className="mifra-container flex min-h-[520px] flex-col items-center justify-center py-16 text-center">
        <FiInfo className="text-6xl text-[#D4AF37]" aria-hidden="true" />
        <h1 className="mt-6 text-3xl font-bold text-[#1a1a1a]">Product Unavailable</h1>
        <p className="mt-3 text-[#666666]">{error || 'Sorry, the product you are looking for could not be found.'}</p>
        <Link to="/products" className="mifra-btn-primary mt-7 min-h-12"><FiArrowLeft aria-hidden="true" /> Back to Products</Link>
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
            <li><Link to="/products" className="transition-colors hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]">Products</Link></li>
            <li aria-hidden="true">&gt;</li>
            <li><Link to={`/products?category=${encodeURIComponent(product.category)}`} className="transition-colors hover:text-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]">{product.category}</Link></li>
            <li aria-hidden="true">&gt;</li>
            <li className="font-medium text-[#1a1a1a]" aria-current="page">{product.name}</li>
          </ol>
        </nav>

        <section className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:gap-16" aria-labelledby="product-name">
          <div>
            <div className="relative aspect-square max-w-2xl overflow-hidden rounded-md bg-white p-8 shadow-[0_2px_8px_rgba(0,0,0,0.1)] sm:p-14">
              <img src={product.image} onError={handleImageError} alt={`${product.name} product image`} className="h-full w-full object-contain" />
            </div>
            <div className="mt-4 flex h-20 w-20 items-center justify-center rounded border-2 border-[#D4AF37] bg-[#1a1a1a] p-3" aria-label="Product image gallery">
              <img src={product.image} onError={handleImageError} alt="" className="h-full w-full object-contain" />
            </div>
          </div>

          <div className="flex flex-col justify-center">
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm font-semibold uppercase tracking-[0.12em] text-[#666666]">{product.category}</p>
            </div>
            <h1 id="product-name" className="mt-4 text-3xl font-bold leading-tight text-[#1a1a1a] sm:text-4xl">{product.name}</h1>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <StockBadge status={product.stockStatus} />
              <span className="flex items-center gap-2 text-sm text-[#666666]"><FiClock aria-hidden="true" /> {product.stockMessage}</span>
            </div>
            <p className="mt-6 text-3xl font-bold text-[#D4AF37]">${(Number(product.price) || 0).toLocaleString()}</p>
            <p className="mt-6 text-base leading-7 text-[#666666]">{product.description}</p>
            <button type="button" onClick={() => setIsRequestFormOpen(true)} className="mifra-btn-primary mt-8 min-h-12 w-full sm:w-fit">Request This Product</button>
          </div>
        </section>

        {isRequestFormOpen && (
          <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 px-4 py-8" role="presentation">
            <div className="mx-auto max-w-4xl" role="dialog" aria-modal="true" aria-labelledby="product-request-heading">
              <div className="mb-4 flex items-center justify-between rounded-md bg-white px-5 py-4 shadow-[0_2px_8px_rgba(0,0,0,0.1)]">
                <h2 id="product-request-heading" className="text-xl font-bold text-[#1a1a1a]">Request This Product</h2>
                <button type="button" onClick={() => setIsRequestFormOpen(false)} className="rounded p-2 text-[#666666] transition-colors hover:bg-[#F5F5F5] hover:text-[#1a1a1a]" aria-label="Close product request form">
                  <FiX aria-hidden="true" />
                </button>
              </div>
              <ProductRequestForm product={product} />
            </div>
          </div>
        )}

        <section className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]" aria-labelledby="specifications-heading">
          <div>
            <h2 id="specifications-heading" className="text-2xl font-bold text-[#1a1a1a]">Technical Specifications</h2>
            <dl className="mt-5 divide-y divide-[#E0E0E0] rounded-md border border-[#E0E0E0]">
              {Object.entries({ Category: product.category, Stock: product.stockQuantity ?? 0, LowStockThreshold: product.lowStockThreshold ?? 0 }).map(([label, value]) => (
                <div key={label} className="grid grid-cols-1 gap-1 px-4 py-4 sm:grid-cols-[minmax(140px,0.35fr)_1fr] sm:gap-5">
                  <dt className="text-sm font-semibold text-[#1a1a1a]">{label}</dt>
                  <dd className="text-sm text-[#666666]">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div>
            <h2 className="text-2xl font-bold text-[#1a1a1a]">Product Details</h2>
            <p className="mt-5 text-base leading-7 text-[#666666]">{product.description}</p>
          </div>
        </section>
      </div>
    </div>
  )
}

export default ProductDetails