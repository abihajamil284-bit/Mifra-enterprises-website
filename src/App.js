import React, { useState } from 'react';
import { productsData } from './productsData';
import './App.css';

// Product Card Sub-component
const ProductCard = ({ item }) => {
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/500x300?text=Product+Image';
  };

  return (
    <div className="card">
      <div className="card-top">
        <img src={item.img} alt={item.title} onError={handleImageError} />
        <div className="card-title">{item.title}</div>
        <div className="card-model">{item.model}</div>
        <div className="card-desc">{item.desc}</div>
      </div>
      <div className="card-bottom">
        <div className="card-price">Rs {item.price.toLocaleString()}</div>
        <button 
          className="card-btn" 
          onClick={() => alert(`Request submitted for ${item.title}`)}
        >
          Request This Product
        </button>
        <div>
          <span className={`card-badge badge-${item.stockType}`}>{item.status}</span>
        </div>
      </div>
    </div>
  );
};

// Main Component
function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('default');

  const handleLogoClick = () => {
    window.location.reload();
  };

  const getProcessedProducts = () => {
    let filtered = productsData.filter(p =>
      p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.desc.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (sortOption === 'low-high') {
      filtered.sort((a, b) => a.price - b.price);
    } else if (sortOption === 'high-low') {
      filtered.sort((a, b) => b.price - a.price);
    }

    return filtered;
  };

  const processedProducts = getProcessedProducts();
  const itProducts = processedProducts.filter(p => p.category === 'IT');
  const industrialProducts = processedProducts.filter(p => p.category === 'Industrial');

  return (
    <>
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-logo" id="logoReload" onClick={handleLogoClick}>
          <span className="logo-icon">M</span>
          <span className="logo-text">Mirfa Enterprise</span>
        </div>
        <ul className="nav-links">
          <li><a href="#home" className="nav-item">Home</a></li>
          <li><a href="#about" className="nav-item">About</a></li>
          <li><a href="#products" className="nav-item active">Product & Service Category</a></li>
          <li><a href="#contact" className="nav-item">Contact Us</a></li>
        </ul>
        <div className="nav-search-header">
          <span className="header-tag">Module 3 Catalog</span>
        </div>
      </nav>

      {/* Main Container */}
      <main className="container">
        {/* Top Control Bar */}
        <section className="top-control-bar">
          <div className="control-left">
            <label htmlFor="priceSort">Sort Price: </label>
            <select 
              id="priceSort" 
              value={sortOption} 
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="default">Default</option>
              <option value="low-high">Price: Low to High</option>
              <option value="high-low">Price: High to Low</option>
            </select>
          </div>

          <div className="control-center">
            <h2>Products & Services Category</h2>
            <p>Explore our wide range of enterprise IT hardware and industrial automation solutions tailored for modern infrastructure.</p>
          </div>

          <div className="control-right">
            <input 
              type="text" 
              id="searchInput" 
              placeholder="Search IT or Industrial products..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </section>

        {/* IT Equipment Section */}
        <section className="category-section" id="it-section">
          <div className="section-header">
            <h3>IT Equipment</h3>
            <p>High-performance networking gear, enterprise servers, and power backup solutions for scalable corporate environments.</p>
          </div>

          <div className="products-grid">
            {itProducts.map(item => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Industrial Equipment Section */}
        <section className="category-section" id="industrial-section">
          <div className="section-header">
            <h3>Industrial Automation & Systems</h3>
            <p>Precision sensors, robust PLC units, and automated control systems designed for demanding industrial operations.</p>
          </div>

          <div className="products-grid">
            {industrialProducts.map(item => (
              <ProductCard key={item.id} item={item} />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="catalog-summary">
          <p>Mirfa Enterprise delivers end-to-end technology solutions across IT infrastructure and industrial automation. All products are backed by official warranty, standard compliance, and dedicated technical support.</p>
        </footer>
      </main>
    </>
  );
}

export default App;