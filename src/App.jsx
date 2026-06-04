import { Suspense, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/common/Header';
import Footer from './components/common/Footer';
import { ToastProvider } from './components/common/Toast';
import { LoadingSpinner } from './components/common/Skeleton';
import './index.css';

// Import pages
import Home from './pages/Home';
import Products from './pages/Products';
import ProductDetail from './pages/ProductDetail';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Register from './pages/Register';
import Account from './pages/Account';
import TrackOrder from './pages/TrackOrder';
import UploadPrescription from './pages/UploadPrescription';
import Wishlist from './pages/Wishlist';
import Blogs from './pages/Blogs';
import BlogDetail from './pages/BlogDetail';
import FAQ from './pages/FAQ';
import About from './pages/About';
import Contact from './pages/Contact';
import CustomerCare from './pages/CustomerCare';
import PolicyPage from './pages/PolicyPage';

const ScrollToTop = () => {
  const { pathname, search } = useLocation();

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, search]);

  return null;
};

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <ScrollToTop />
        <div className="flex flex-col min-h-screen">
          <Header />
          <main className="flex-grow">
            <Suspense fallback={<LoadingSpinner />}>
              <Routes>
                {/* Main Pages */}
                <Route path="/" element={<Home />} />
                <Route path="/products" element={<Products />} />
                <Route path="/products/:id" element={<ProductDetail />} />

                {/* Shopping Flow */}
                <Route path="/cart" element={<Cart />} />
                <Route path="/checkout" element={<Checkout />} />

                {/* Authentication */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* User Pages */}
                <Route path="/account" element={<Account />} />
                <Route path="/track-order" element={<TrackOrder />} />
                <Route path="/upload-prescription" element={<UploadPrescription />} />
                <Route path="/wishlist" element={<Wishlist />} />

                {/* Blog Pages */}
                <Route path="/blogs" element={<Blogs />} />
                <Route path="/blog/:slug" element={<BlogDetail />} />

                {/* Info Pages */}
                <Route path="/faq" element={<FAQ />} />
                <Route path="/customer-care" element={<CustomerCare />} />
                <Route path="/privacy-policy" element={<PolicyPage type="privacy" />} />
                <Route path="/terms-of-service" element={<PolicyPage type="terms" />} />
                <Route path="/refund-policy" element={<PolicyPage type="refund" />} />
                <Route path="/about-us" element={<About />} />
                <Route path="/contact-us" element={<Contact />} />

                {/* 404 Page */}
                <Route
                  path="*"
                  element={
                    <div className="max-w-7xl mx-auto px-4 py-12 text-center">
                      <h1 className="text-4xl font-bold mb-4">404</h1>
                      <p className="text-xl text-gray-600 mb-4">Page not found</p>
                      <a href="/" className="btn-primary inline-block">
                        Back to Home
                      </a>
                    </div>
                  }
                />
              </Routes>
            </Suspense>
          </main>
          <Footer />
        </div>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
