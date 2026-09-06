import { useEffect, useState } from 'react'
import { FiMenu, FiX } from 'react-icons/fi'
import { NavLink } from 'react-router-dom'
import mifraLogo from "../assets/mifra-logo.png";
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
      : 'text-[#1a1a1a] after:scale-x-0 hover:text-[#D4AF37] hover:after:scale-x-100',
  ].join(' ')

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [settings, setSettings] = useState({ company_name: 'MIFRA Enterprises', logo: '' })

  useEffect(() => {
    let isMounted = true

    const fetchSiteSettings = async () => {
      try {
        const data = await getSiteSettings()
        if (isMounted && data) setSettings(data)
      } catch {
        if (isMounted) setSettings({ company_name: 'MIFRA Enterprises', logo: '' })
      }
    }

    fetchSiteSettings()

    return () => {
      isMounted = false
    }
  }, [])

  const closeMenu = () => setIsMenuOpen(false)
  const companyName = settings.company_name || 'MIFRA Enterprises'
  const logoSource = typeof settings.logo === 'string' && settings.logo.trim() ? settings.logo : mifraLogo

  return (
    <header className="sticky top-0 z-50 border-b border-[#E0E0E0] bg-white/95 shadow-[0_2px_10px_rgba(0,0,0,0.06)] backdrop-blur-sm">
      <div className="mifra-container flex h-14 items-center justify-between lg:h-[68px]">
        <NavLink
          to="/"
          onClick={closeMenu}
          className="flex items-center transition-colors duration-200 hover:opacity-80"
        >
          <img
            src={logoSource}
            alt={companyName}
            className="h-auto max-h-10 w-auto object-contain sm:max-h-11"
          />
        </NavLink>

        <nav className="hidden items-center gap-5 lg:flex" aria-label="Primary navigation">
          {navigationItems.map((item) => (
            <NavLink key={item.to} to={item.to} className={linkClasses}>
              {item.label}
            </NavLink>
          ))}

          <NavLink
            to="/contact"
            className="mifra-btn-primary ml-2 min-h-12 px-5 text-sm"
          >
            Get in Touch
          </NavLink>
        </nav>

        <button
          type="button"
          className="inline-flex min-h-12 min-w-12 items-center justify-center text-2xl text-[#1a1a1a] transition-colors duration-200 hover:text-[#D4AF37] lg:hidden"
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
        className={`${isMenuOpen ? 'block' : 'hidden'} border-t border-[#E0E0E0] bg-white lg:hidden`}
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