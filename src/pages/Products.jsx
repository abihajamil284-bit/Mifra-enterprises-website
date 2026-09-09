import { useEffect, useMemo, useState } from 'react'
import {
  FiChevronLeft,
  FiChevronRight,
  FiInbox,
  FiPackage,
  FiSearch,
} from 'react-icons/fi'
import { Link } from 'react-router-dom'
import heroImage from '../assets/hero.png'
import { getProducts } from '../services/api'

const PAGE_SIZE = 8
const sortOptions = [
  { value: 'name-asc', label: 'Name: A-Z' },
  { value: 'name-desc', label: 'Name: Z-A' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'newest', label: 'Newest' },
]

const inputClasses =
  'h-12 w-full rounded border border-[#E0E0E0] bg-white px-3 text-sm text-[#1a1a1a] transition-colors duration-200 focus:border-[#D4AF37] focus:outline-none focus:ring-2 focus:ring-[#D4AF37]/20'

function LoadingState() {
  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4" aria-label="Loading products">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="h-96 animate-pulse rounded-md bg-[#F5F5F5]" />
      ))}
    </div>
  )
}

function StockBadge({ status }) {
  const statusClasses = {
    'In Stock': 'bg-[#27AE60] text-white',
    'Limited Stock': 'bg-[#F39C12] text-black',
    'Out of Stock': 'bg-[#E74C3C] text-white',
  }

  return (
    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${statusClasses[status]}`}>
      {status}
    </span>
  )
}

function ProductCard({ product }) {
  return (
    <article className="mifra-card group flex h-full flex-col overflow-hidden bg-white transition duration-300 hover:-translate-y-1">
      <div className="aspect-[4/3] overflow-hidden bg-[#1a1a1a] p-8">
        <img
          src={product.image}
          alt={`${product.name} product preview`}
          loading="lazy"
          className="h-full w-full object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <p className="text-xs font-semibold uppercase tracking-[0.12em] text-[#666666]">
          {product.brand} / {product.model}
        </p>
        <h2 className="mt-2 text-lg font-semibold text-[#1a1a1a]">{product.name}</h2>
        <p className="mt-3 flex-1 text-sm leading-6 text-[#666666]">{product.description}</p>
        <div className="mt-5 flex items-end justify-between gap-3">
          <div>
            <p className="text-lg font-semibold text-[#D4AF37]">
              ${product.price.toLocaleString()}
            </p>
            <div className="mt-2">
              <StockBadge status={product.stockStatus} />
            </div>
          </div>
          <Link
            to={`/products/${product.id}`}
            className="inline-flex min-h-12 items-center justify-center rounded border border-[#1a1a1a] px-3 text-center text-sm font-semibold text-[#1a1a1a] transition-colors duration-200 hover:border-[#D4AF37] hover:bg-[#D4AF37] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
          >
            View Product
          </Link>
        </div>
      </div>
    </article>
  )
}

function Products() {
  const [searchTerm, setSearchTerm] = useState('')
  const [category, setCategory] = useState('')
  const [availability, setAvailability] = useState('')
  const [sortBy, setSortBy] = useState('name-asc')
  const [currentPage, setCurrentPage] = useState(1)
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [retryAttempt, setRetryAttempt] = useState(0)

  useEffect(() => {
    let isMounted = true

    const loadProducts = async () => {
      setIsLoading(true)
      setError('')

      try {
        const response = await getProducts()
        const apiProducts = Array.isArray(response) ? response : response?.products || response?.data || []
        const activeProducts = apiProducts
          .filter((product) => product.isActive !== false)
          .map((product) => {
            const stockQuantity = Number(product.stockQuantity) || 0
            const lowStockThreshold = Number(product.lowStockThreshold) || 0

            return {
              ...product,
              id: product.id || product._id,
              brand: product.brand || 'MIFRA Enterprises',
              model: product.model || 'Product',
              image: product.image || heroImage,
              stockStatus: stockQuantity <= 0
                ? 'Out of Stock'
                : stockQuantity <= lowStockThreshold
                  ? 'Limited Stock'
                  : 'In Stock',
              isNew: false,
            }
          })

        if (isMounted) {
          setProducts(activeProducts)
        }
      } catch {
        if (isMounted) {
          setError('Unable to load products. Please try again.')
        }
      } finally {
        if (isMounted) {
          setIsLoading(false)
        }
      }
    }

    loadProducts()

    return () => {
      isMounted = false
    }
  }, [retryAttempt])

  const categories = useMemo(() => [...new Set(products.map((product) => product.category))], [products])

  const filteredProducts = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase()
    const matchingProducts = products.filter((product) => {
      const searchableText = [product.name, product.brand, product.model, product.description]
        .join(' ')
        .toLowerCase()
      const matchesSearch = !normalizedSearch || searchableText.includes(normalizedSearch)
      const matchesCategory = !category || product.category === category
      const matchesAvailability = !availability || product.stockStatus === availability

      return matchesSearch && matchesCategory && matchesAvailability
    })

    return matchingProducts.sort((firstProduct, secondProduct) => {
      switch (sortBy) {
        case 'name-desc':
          return secondProduct.name.localeCompare(firstProduct.name)
        case 'price-asc':
          return firstProduct.price - secondProduct.price
        case 'price-desc':
          return secondProduct.price - firstProduct.price
        case 'newest':
          return Number(secondProduct.isNew) - Number(firstProduct.isNew)
        case 'name-asc':
        default:
          return firstProduct.name.localeCompare(secondProduct.name)
      }
    })
  }, [availability, category, products, searchTerm, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredProducts.length / PAGE_SIZE))
  const pageStart = (currentPage - 1) * PAGE_SIZE
  const visibleProducts = filteredProducts.slice(pageStart, pageStart + PAGE_SIZE)
  const hasActiveFilters = Boolean(searchTerm || category || availability || sortBy !== 'name-asc')

  const clearFilters = () => {
    setSearchTerm('')
    setCategory('')
    setAvailability('')
    setSortBy('name-asc')
    setCurrentPage(1)
  }

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value)
    setCurrentPage(1)
  }

  const handleCategoryChange = (event) => {
    setCategory(event.target.value)
    setCurrentPage(1)
  }

  const handleAvailabilityChange = (event) => {
    setAvailability(event.target.value)
    setCurrentPage(1)
  }

  const handleSortChange = (event) => {
    setSortBy(event.target.value)
    setCurrentPage(1)
  }

  const handleRetry = () => {
    setRetryAttempt((attempt) => attempt + 1)
  }

  return (
    <div>
      <section className="bg-[#F5F5F5] py-14 sm:py-16" aria-labelledby="products-page-heading">
        <div className="mifra-container">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#D4AF37]">MIFRA Enterprises</p>
          <h1 id="products-page-heading" className="mt-3 text-4xl font-bold tracking-tight text-[#1a1a1a] sm:text-5xl">
            Product Catalogue
          </h1>
          <p className="mt-4 max-w-2xl text-base leading-7 text-[#666666]">
            Browse our extensive range of IT and industrial technology solutions.
          </p>
        </div>
      </section>

      <section className="bg-white py-10 sm:py-14" aria-labelledby="product-search-heading">
        <div className="mifra-container">
          <h2 id="product-search-heading" className="sr-only">Search and filter products</h2>
          <div className="rounded-md border border-[#E0E0E0] bg-[#F5F5F5] p-4 sm:p-6">
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[minmax(260px,1.6fr)_repeat(3,minmax(150px,1fr))_auto] lg:items-end">
              <div>
                <label htmlFor="product-search" className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                  Search products
                </label>
                <div className="relative">
                  <FiSearch className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#666666]" aria-hidden="true" />
                  <input
                    id="product-search"
                    type="search"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Search products..."
                    className={`${inputClasses} pl-10`}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="product-category" className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                  Category
                </label>
                <select
                  id="product-category"
                  value={category}
                  onChange={handleCategoryChange}
                  className={inputClasses}
                >
                  <option value="">All Categories</option>
                  {categories.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </div>

              <div>
                <label htmlFor="product-availability" className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                  Availability
                </label>
                <select
                  id="product-availability"
                  value={availability}
                  onChange={handleAvailabilityChange}
                  className={inputClasses}
                >
                  <option value="">All Availability</option>
                  <option value="In Stock">In Stock</option>
                  <option value="Limited Stock">Limited Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <div>
                <label htmlFor="product-sort" className="mb-2 block text-sm font-semibold text-[#1a1a1a]">
                  Sort by
                </label>
                <select
                  id="product-sort"
                  value={sortBy}
                  onChange={handleSortChange}
                  className={inputClasses}
                >
                  {sortOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select>
              </div>

              <button
                type="button"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="inline-flex min-h-12 items-center justify-center rounded border border-[#1a1a1a] px-4 text-sm font-semibold text-[#1a1a1a] transition-colors duration-200 hover:border-[#D4AF37] hover:bg-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-16 sm:pb-20" aria-labelledby="product-results-heading">
        <div className="mifra-container">
          <div className="mb-6 flex items-center justify-between gap-4">
            <h2 id="product-results-heading" className="text-2xl font-bold text-[#1a1a1a]">Products</h2>
            <p className="text-sm text-[#666666]" aria-live="polite">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'result' : 'results'}
            </p>
          </div>

          {isLoading ? <LoadingState /> : error ? (
            <div className="flex flex-col items-center justify-center rounded-md bg-[#F5F5F5] px-6 py-16 text-center">
              <FiInbox className="text-5xl text-[#D4AF37]" aria-hidden="true" />
              <h3 className="mt-5 text-xl font-semibold text-[#1a1a1a]">Unable to load products.</h3>
              <p className="mt-2 text-sm text-[#666666]">{error}</p>
              <button type="button" onClick={handleRetry} className="mifra-btn-primary mt-6 min-h-12">
                Retry
              </button>
            </div>
          ) : visibleProducts.length > 0 ? (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {visibleProducts.map((product) => <ProductCard key={product.id} product={product} />)}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-md bg-[#F5F5F5] px-6 py-16 text-center">
              <FiInbox className="text-5xl text-[#D4AF37]" aria-hidden="true" />
              <h3 className="mt-5 text-xl font-semibold text-[#1a1a1a]">
                {products.length === 0 ? 'No active products available.' : 'No products match your search.'}
              </h3>
              <p className="mt-2 text-sm text-[#666666]">Try adjusting your search or filters.</p>
              <button type="button" onClick={clearFilters} className="mifra-btn-primary mt-6 min-h-12">
                Clear Filters
              </button>
            </div>
          )}

          {visibleProducts.length > 0 && (
            <nav className="mt-10 flex items-center justify-center gap-2" aria-label="Product pagination">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="inline-flex min-h-12 min-w-12 items-center justify-center rounded border border-[#E0E0E0] text-[#1a1a1a] transition-colors duration-200 hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
                aria-label="Previous page"
              >
                <FiChevronLeft aria-hidden="true" />
              </button>
              {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  aria-current={currentPage === page ? 'page' : undefined}
                  className={`inline-flex min-h-12 min-w-12 items-center justify-center rounded border text-sm font-semibold transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37] ${currentPage === page ? 'border-[#D4AF37] bg-[#D4AF37] text-black' : 'border-[#E0E0E0] text-[#1a1a1a] hover:border-[#D4AF37] hover:text-[#D4AF37]'}`}
                >
                  {page}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))}
                disabled={currentPage === totalPages}
                className="inline-flex min-h-12 min-w-12 items-center justify-center rounded border border-[#E0E0E0] text-[#1a1a1a] transition-colors duration-200 hover:border-[#D4AF37] hover:text-[#D4AF37] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]"
                aria-label="Next page"
              >
                <FiChevronRight aria-hidden="true" />
              </button>
            </nav>
          )}
        </div>
      </section>

      <section className="bg-[#F5F5F5] py-12" aria-label="Product catalogue note">
        <div className="mifra-container flex flex-col items-center justify-center gap-3 text-center sm:flex-row sm:text-left">
          <FiPackage className="text-2xl text-[#D4AF37]" aria-hidden="true" />
          <p className="text-sm text-[#666666]">Product availability and catalogue data will be connected to the MIFRA product service soon.</p>
        </div>
      </section>
    </div>
  )
}

export default Products