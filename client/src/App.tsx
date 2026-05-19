import { lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { PerformanceProvider } from './context/PerformanceContext';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import { AuthGuard, AdminGuard, GuestGuard } from './components/guards/Guards';
import ErrorBoundary from './components/guards/ErrorBoundary';
import pixelForgeLogo from './assets/logo-pixel-forge.png';

// Lazy loaded pages for code splitting
const Landing = lazy(() => import('./pages/Landing'));
const Products = lazy(() => import('./pages/Products'));
const ProductDetails = lazy(() => import('./pages/ProductDetails'));
const Cart = lazy(() => import('./pages/Cart'));
const Checkout = lazy(() => import('./pages/Checkout'));
const Contact = lazy(() => import('./pages/Contact'));
const UserDashboard = lazy(() => import('./pages/UserDashboard'));
const AdminDashboard = lazy(() => import('./pages/AdminDashboard'));

// Auth pages need named exports
const AuthPages = lazy(() => import('./pages/Auth').then(m => ({ default: m.Login })));
const RegisterPage = lazy(() => import('./pages/Auth').then(m => ({ default: m.Register })));

const PageLoader = () => (
  <div className="min-h-screen flex items-center justify-center bg-matte-black px-6">
    <div className="flex flex-col items-center gap-8 relative z-10">
      <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-3xl bg-white/5 flex items-center justify-center border border-white/10 p-4 shadow-[0_0_50px_rgba(124,58,237,0.2)] animate-pulse overflow-hidden">
        <img src={pixelForgeLogo} alt="Pixel Forge Logo" className="w-full h-full object-contain" />
      </div>
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-2 border-luxury-cyan border-t-transparent rounded-full animate-spin" />
        <p className="text-text-secondary text-xs font-bold tracking-[0.4em] uppercase animate-pulse opacity-80">Loading Assets...</p>
      </div>
    </div>
  </div>
);

function App() {
  return (
    <BrowserRouter>
      <PerformanceProvider>
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen bg-matte-black text-text-primary flex flex-col">
              <Navbar />
            <main className="flex-1">
              <Suspense fallback={<PageLoader />}>
                <ErrorBoundary>
                  <AnimatePresence mode="wait">
                    <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:slug" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/contact" element={<Contact />} />

                    {/* Guest-only Routes */}
                    <Route path="/login" element={<GuestGuard><AuthPages /></GuestGuard>} />
                    <Route path="/register" element={<GuestGuard><RegisterPage /></GuestGuard>} />

                    {/* Protected Routes */}
                    <Route path="/checkout" element={<AuthGuard><Checkout /></AuthGuard>} />
                    <Route path="/dashboard" element={<AuthGuard><UserDashboard /></AuthGuard>} />

                    {/* Admin Routes (hidden from navigation) */}
                    <Route path="/admin" element={<AdminGuard><AdminDashboard /></AdminGuard>} />

                    {/* 404 */}
                    <Route path="*" element={
                      <div className="min-h-screen pt-24 flex items-center justify-center">
                        <div className="text-center">
                          <h1 className="font-heading text-6xl font-bold text-luxury-cyan mb-4">404</h1>
                          <p className="text-text-secondary mb-6">Page not found</p>
                          <a href="/" className="text-luxury-cyan hover:text-luxury-cyan/80 transition-colors">Go Home</a>
                        </div>
                      </div>
                    } />
                  </Routes>
                </AnimatePresence>
                </ErrorBoundary>
              </Suspense>
            </main>
            <Footer />
          </div>

          <Toaster
            position="top-right"
            toastOptions={{
              style: {
                background: '#151525',
                color: '#E8E8F0',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '12px',
                fontSize: '14px',
              },
              success: { iconTheme: { primary: '#39FF14', secondary: '#0A0A0F' } },
              error: { iconTheme: { primary: '#FF3131', secondary: '#0A0A0F' } },
            }}
          />
        </CartProvider>
      </AuthProvider>
    </PerformanceProvider>
  </BrowserRouter>
  );
}

export default App;
