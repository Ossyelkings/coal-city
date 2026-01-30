import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import QuoteModal from './QuoteModal';

export default function PublicLayout({ onQuoteClick, quoteOpen, closeQuote, preselectedProduct }) {
  return (
    <>
      <Navbar onQuoteClick={() => onQuoteClick()} />
      <main>
        <Outlet />
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
