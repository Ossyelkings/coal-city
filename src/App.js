import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import QuoteModal from './components/QuoteModal';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
}

export default function App() {
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [preselectedProduct, setPreselectedProduct] = useState('');

  const openQuote = (product) => {
    setPreselectedProduct(product || '');
    setQuoteOpen(true);
  };

  const closeQuote = () => {
    setQuoteOpen(false);
    setPreselectedProduct('');
  };

  return (
    <>
      <ScrollToTop />
      <Navbar onQuoteClick={() => openQuote()} />
      <main>
        <Routes>
          <Route path="/" element={<Home onQuoteClick={openQuote} />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery onQuoteClick={openQuote} />} />
          <Route path="/contact" element={<Contact />} />
        </Routes>
      </main>
      <Footer />
      <QuoteModal
        isOpen={quoteOpen}
        onClose={closeQuote}
        preselectedProduct={preselectedProduct}
      />
    </>
  );
}
