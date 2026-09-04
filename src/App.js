import React, { useState } from 'react';
import productsData from './productsData';
import './App.css';

// Product Card Sub-component
const ProductCard = ({ item, onRequest }) => {
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/500x300?text=Product+Image';
  };

  return (
    <div className="card">
      <div className="card-top">
        <img src={item.img || item.image} alt={item.title} onError={handleImageError} />
        <div className="card-title">{item.title}</div>
        <div className="card-model">{item.model}</div>
        <div className="card-desc">{item.desc}</div>
      </div>
      <div className="card-bottom">
        {item.price && <div className="card-price">Rs {item.price.toLocaleString()}</div>}
        <button className="card-btn" onClick={() => onRequest(item.title)}>
          Request This Product
        </button>
        {item.status && (
          <div>
            <span className={`card-badge badge-${item.stockType || 'stock'}`}>{item.status}</span>
          </div>
        )}
      </div>
    </div>
  );
};

function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState('');

  const handleLogoClick = () => {
    window.location.reload();
  };

  const handleRequestClick = (itemName) => {
    setSelectedItem(itemName);
    setModalOpen(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert(`Request submitted successfully for: ${selectedItem}`);
    setModalOpen(false);
  };

  // Filter & Sort Products
  const getProcessedProducts = () => {
    let filtered = productsData.filter(
      (p) =>
        p.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.desc?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOption === 'low-high') {
      filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
    } else if (sortOption === 'high-low') {
      filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
    }

    return filtered;
  };

  const processedProducts = getProcessedProducts();
  const itProducts = processedProducts.filter((p) => p.category === 'IT');
  const industrialProducts = processedProducts.filter((p) => p.category === 'Industrial');

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-logo" id="logoClick" onClick={handleLogoClick}>
          <svg className="logo-svg" viewBox="0 0 100 100" width="36" height="36">
            <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill="none" stroke="#D4AF37" strokeWidth="8" />
            <text x="50" y="62" fontSize="36" fontWeight="bold" fill="#D4AF37" textAnchor="middle">
              M
            </text>
          </svg>
          <span className="logo-text">Mifra Enterprise</span>
        </div>

        <button className="mobile-menu-btn" id="mobileMenuBtn">☰</button>

        <ul className="nav-links" id="navLinks">
          <li><a href="#home" className="nav-item active">Home</a></li>
          <li><a href="#about" className="nav-item">About Us</a></li>
          <li><a href="#products" className="nav-item">Products</a></li>
          <li><a href="#services" className="nav-item">Services</a></li>
          <li><a href="#contact" className="nav-item">Contact Us</a></li>
        </ul>

        <div className="nav-cta">
          <a href="#contact" className="cta-btn">Get in Touch</a>
        </div>
      </nav>

      {/* Hero Section */}
      <header className="hero-section" id="home">
        <div className="hero-content animated-element">
          <h1 className="hero-title">Empowering Modern Industrial Infrastructure</h1>
          <p className="hero-subtitle">
            Leading provider of enterprise IT hardware, networking gear, and precision automation systems.
          </p>
          <div className="hero-buttons">
            <a href="#products" className="btn-primary">Explore Products</a>
            <a href="#services" className="btn-secondary">Our Services</a>
          </div>
        </div>
      </header>

      <main className="container">
        {/* Why Mifra Section */}
        <section className="info-section animated-element">
          <div className="section-title-box">
            <h2>Why Mifra Enterprise?</h2>
            <div className="gold-divider"></div>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <h3>Enterprise Reliability</h3>
              <p>Tested hardware designed for continuous operations in demanding environments.</p>
            </div>
            <div className="feature-card">
              <h3>Technical Expertise</h3>
              <p>Dedicated engineers providing end-to-end IT & industrial automation support.</p>
            </div>
            <div className="feature-card">
              <h3>Fast Deployment</h3>
              <p>Streamlined supply chain for rapid delivery and system integration.</p>
            </div>
          </div>
        </section>

        {/* About Section */}
        <section className="about-section animated-element" id="about">
          <div className="section-title-box">
            <h2>About Us & Capabilities</h2>
            <div className="gold-divider"></div>
          </div>
          <p className="about-text">
            Mifra Enterprise is a premier technology solutions provider specializing in robust IT infrastructure and modern industrial automation. We deliver enterprise-grade hardware, high-speed networking gear, precision PLC controllers, and custom power backup systems engineered for continuous 24/7 operations. Our mission is to empower businesses with dependable technology, seamless system integration, and dedicated technical support to drive maximum operational efficiency.
          </p>
        </section>

        {/* Products Module */}
        <section className="products-module animated-element" id="products">
          <div className="top-control-bar">
            <div className="control-left">
              <label htmlFor="priceSort">Sort Price:</label>
              <select id="priceSort" value={sortOption} onChange={(e) => setSortOption(e.target.value)}>
                <option value="default">Default</option>
                <option value="low-high">Price: Low to High</option>
                <option value="high-low">Price: High to Low</option>
              </select>
            </div>

            <div className="control-center">
              <h2>Product Catalog</h2>
            </div>

            <div className="control-right">
              <input
                type="text"
                id="searchInput"
                placeholder="Search products or models..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          {/* IT Section */}
          <div className="category-section">
            <div className="category-header-box">
              <h3>IT Equipment</h3>
              <p className="category-desc">
                High-performance network switches, servers, edge routers, and reliable hardware security systems engineered for 24/7 business continuity.
              </p>
            </div>
            <div className="products-grid">
              {itProducts.map((item) => (
                <ProductCard key={item.id} item={item} onRequest={handleRequestClick} />
              ))}
            </div>
          </div>

          {/* Industrial Section */}
          <div className="category-section">
            <div className="category-header-box">
              <h3>Industrial Automation</h3>
              <p className="category-desc">
                Precision PLC units, HMI operator panels, variable frequency drives, and smart access controllers built for rugged industrial environments.
              </p>
            </div>
            <div className="products-grid">
              {industrialProducts.map((item) => (
                <ProductCard key={item.id} item={item} onRequest={handleRequestClick} />
              ))}
            </div>
          </div>
        </section>

       {/* Services Module */}
        <section className="services-module animated-element" id="services">
          <div className="section-title-box">
            <h2>Our Professional Services</h2>
            <div className="gold-divider"></div>
          </div>
          
          <div className="services-grid">
            {[
              {
                title: "Network Infrastructure Design",
                desc: "Complete enterprise network planning and structured cabling solutions."
              },
              {
                title: "Industrial Automation Setup",
                desc: "PLC programming, HMI setup, and custom control panel assembly."
              },
              {
                title: "Server Room Deployment",
                desc: "Rack deployment, cooling management, and online UPS configuration."
              },
              {
                title: "Access Control Integration",
                desc: "Biometric and RFID security gate setup for facilities."
              },
              {
                title: "Power System Audits",
                desc: "Industrial power audits, solar, and power backup health checks."
              },
              {
                title: "Annual Maintenance Contracts",
                desc: "24/7 technical support and hardware maintenance services."
              }
            ].map((service, index) => (
              <div key={index} className="card">
                <div className="card-top">
                  <div className="card-title" style={{ marginTop: '10px' }}>{service.title}</div>
                  <div className="card-desc">{service.desc}</div>
                </div>
                <div className="card-bottom">
                  <div className="card-price">Quote Based</div>
                  <button 
                    className="card-btn" 
                    onClick={() => handleRequestClick(service.title)}
                  >
                    Request This Service
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section className="contact-section animated-element" id="contact">
          <div className="section-title-box">
            <h2>Contact Us</h2>
            <div className="gold-divider"></div>
          </div>
          <div className="contact-container">
            <form className="contact-form" onSubmit={(e) => { e.preventDefault(); alert('Message Sent!'); }}>
              <div className="form-group">
                <input type="text" placeholder="Your Full Name" required />
              </div>
              <div className="form-group">
                <input type="email" placeholder="Your Email Address" required />
              </div>
              <div className="form-group">
                <input type="tel" placeholder="Your Phone Number" required />
              </div>
              <div className="form-group">
                <textarea rows="4" placeholder="Your Message..." required></textarea>
              </div>
              <button type="submit" className="cta-btn form-submit">Send Message</button>
            </form>

            <div className="map-box">
              <h3>Location</h3>
              <p>Karachi, Sindh, Pakistan</p>
              <div className="map-placeholder">
                <iframe
                  title="Location Map"
                  src="https://maps.google.com/maps?q=Karachi&t=&z=13&ie=UTF8&iwloc=&output=embed"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen=""
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Request Modal */}
      {modalOpen && (
        <div className="modal" style={{ display: 'flex' }}>
          <div className="modal-content">
            <span className="close-btn" onClick={() => setModalOpen(false)}>&times;</span>
            <h3>Request: {selectedItem}</h3>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Your Name *</label>
                <input type="text" required placeholder="Enter full name" />
              </div>
              <div className="form-group">
                <label>Email Address *</label>
                <input type="email" required placeholder="name@company.com" />
              </div>
              <div className="form-group">
                <label>Phone Number *</label>
                <input type="tel" required placeholder="+92 300 0000000" />
              </div>
              <div className="form-group">
                <label>Notes / Requirements</label>
                <textarea rows="3" placeholder="Additional details..."></textarea>
              </div>
              <button type="submit" className="cta-btn form-submit">Submit Request</button>
            </form>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="catalog-summary">
        <p>&copy; 2026 Mifra Enterprise. All rights reserved.</p>
      </footer>
    </>
  );
}

export default App;