import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import PublicLayout from './components/PublicLayout';
import AdminRoute from './components/AdminRoute';
import AdminLayout from './components/admin/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import About from './pages/About';
import Gallery from './pages/Gallery';
import Contact from './pages/Contact';
import Dashboard from './pages/admin/Dashboard';
import Products from './pages/admin/Products';
import ProductForm from './pages/admin/ProductForm';
import Categories from './pages/admin/Categories';
import CategoryForm from './pages/admin/CategoryForm';
import Quotes from './pages/admin/Quotes';
import Contacts from './pages/admin/Contacts';
import Team from './pages/admin/Team';
import Settings from './pages/admin/Settings';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';

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
      <Routes>
        {/* Admin routes — own layout, no public navbar/footer */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<Dashboard />} />
          <Route path="products" element={<Products />} />
          <Route path="products/new" element={<ProductForm />} />
          <Route path="products/:id/edit" element={<ProductForm />} />
          <Route path="categories" element={<Categories />} />
          <Route path="categories/new" element={<CategoryForm />} />
          <Route path="categories/:id/edit" element={<CategoryForm />} />
          <Route path="quotes" element={<Quotes />} />
          <Route path="contacts" element={<Contacts />} />
          <Route path="team" element={<Team />} />
          <Route path="settings" element={<Settings />} />
        </Route>

        {/* Auth pages — standalone layout (no navbar/footer) */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Public routes — with navbar, footer, quote modal */}
        <Route
          element={
            <PublicLayout
              onQuoteClick={openQuote}
              quoteOpen={quoteOpen}
              closeQuote={closeQuote}
              preselectedProduct={preselectedProduct}
            />
          }
        >
          <Route path="/" element={<Home onQuoteClick={openQuote} />} />
          <Route path="/about" element={<About />} />
          <Route path="/gallery" element={<Gallery onQuoteClick={openQuote} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Route>
      </Routes>
    </>
  );
}
