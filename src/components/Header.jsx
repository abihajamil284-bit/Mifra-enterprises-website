import { useEffect, useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'
import mifraLogo from '../assets/mifra-logo.png'
import { getSiteSettings } from '../services/api'

const navigationItems = [
  { label: 'Home', to: '/' },
  { label: 'About', to: '/about' },
  { label: 'Products', to: '/products' },
  { label: 'Services', to: '/services' },
  { label: 'Contact', to: '/contact' },
]

const linkClasses = ({ isActive }) =>
  [
    'relative inline-flex min-h-12 items-center px-2 text-sm font-medium transition-colors duration-200',
    'after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-[#D4AF37] after:transition-transform after:duration-200',
    'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D4AF37]',
    isActive
      ? 'text-[#D4AF37] after:scale-x-100'
      : 'text-[#E0E0E0] after:scale-x-0 hover:text-[#D4AF37] hover:after:scale-x-100',
  ].join(' ')

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [settings, setSettings] = useState({
    company_name: 'MIFRA ENTERPRISES SMC PVT LTD',
    logo: '',
  })

  useEffect(() => {
    let isMounted = true

    const fetchSiteSettings = async () => {
      try {
        const data = await getSiteSettings()
        if (isMounted && data) setSettings(data)
      } catch {
        if (isMounted) {
          setSettings({
            company_name: 'MIFRA ENTERPRISES SMC PVT LTD',
            logo: '',
          })
        }
      }
    }

    fetchSiteSettings()

    return () => {
      isMounted = false
    }
  }, [])

  const closeMenu = () => setIsMenuOpen(false)
  const companyName = settings.company_name || 'MIFRA ENTERPRISES SMC PVT LTD'
  const logoSource = typeof settings.logo === 'string' && settings.logo.trim() ? settings.logo : mifraLogo

  return (
    <header className="sticky top-0 z-50 border-b border-[#D4AF37]/40 bg-[#000000] text-white shadow-[0_6px_20px_rgba(0,0,0,0.18)]">
      <div className="mifra-container flex min-h-[76px] items-center justify-between gap-6 py-3 lg:min-h-[84px]">
        <NavLink
          to="/"
          onClick={closeMenu}
          className="flex min-w-0 flex-1 items-center gap-3 transition-colors duration-200 hover:opacity-80"
        >
          <img
            src={logoSource}
            alt={companyName}
            className="h-auto max-h-9 w-auto max-w-[88px] shrink-0 object-contain sm:max-h-11 sm:max-w-[120px] lg:max-h-12 lg:max-w-[150px]"
          />
          <span className="min-w-0 border-l border-[#D4AF37]/60 pl-3">
            <span className="block max-w-[150px] break-words text-[10px] font-bold leading-tight tracking-[0.06em] text-white sm:max-w-[230px] sm:text-sm sm:tracking-[0.08em] lg:max-w-[360px] lg:text-base lg:tracking-[0.1em]">{companyName}</span>
          </span>
        </NavLink>

        <nav className="hidden items-center gap-4 lg:flex" aria-label="Primary navigation">
          {navigationItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClasses}>
              {item.label}
            </NavLink>
          ))}

          <NavLink
            to="/contact"
            className="ml-2 inline-flex min-h-12 items-center justify-center gap-2 rounded border border-[#D4AF37] bg-[#D4AF37] px-5 text-sm font-semibold text-black transition hover:bg-[#E2C45B]"
          >
            Get in Touch
          </NavLink>
        </nav>

        <button
          type="button"
          className="inline-flex min-h-12 min-w-12 items-center justify-center text-2xl text-white transition-colors duration-200 hover:text-[#D4AF37] lg:hidden"
          onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
          aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          aria-expanded={isMenuOpen}
          aria-controls="mobile-navigation"
        >
          {isMenuOpen ? <FiX aria-hidden="true" /> : <FiMenu aria-hidden="true" />}
        </button>
      </div>

      <nav
        id="mobile-navigation"
        className={`${isMenuOpen ? 'block' : 'hidden'} border-t border-white/10 bg-[#000000] lg:hidden`}
        aria-label="Mobile navigation"
      >
        <div className="mifra-container flex flex-col py-2">
          {navigationItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClasses} onClick={closeMenu}>
              {item.label}
            </NavLink>
          ))}

          <NavLink to="/contact" onClick={closeMenu} className="mifra-btn-primary my-2 min-h-12">
            Get in Touch
          </NavLink>
        </div>
      </nav>
    </header>
  )
}

export default Header