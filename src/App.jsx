import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import { CartProvider } from "./contexts/CartContext"
import { WishlistProvider } from "./contexts/WishlistContext"
import { CompareProvider } from "./contexts/CompareContext"
import { RecentlyViewedProvider } from "./contexts/RecentlyViewedContext"
import Header from "./components/Header/Header"
import Footer from "./components/Footer/Footer"
import HomePage from "./pages/HomePage/HomePage"
import ProductsPage from "./pages/ProductsPage/ProductsPage"
import ProductDetailPage from "./pages/ProductDetailPage/ProductDetailPage"
import CartPage from "./pages/CartPage/CartPage"
import CheckoutPage from "./pages/CheckoutPage/CheckoutPage"
import LoginPage from "./pages/LoginPage/LoginPage"
import RegisterPage from "./pages/RegisterPage/RegisterPage"
import WishlistPage from "./pages/WishlistPage/WishlistPage"
import ComparePage from "./pages/ComparePage/ComparePage"
import ProfilePage from "./pages/ProfilePage/ProfilePage"
import OrdersPage from "./pages/OrdersPage/OrdersPage"
import CompareBar from "./components/CompareBar/CompareBar"
import QuickViewPage from "./pages/QuickViewPage/QuickViewPage"
import "./App.css"

function App() {
  return (
    <Router>
      <AuthProvider>
        <CartProvider>
          <WishlistProvider>
            <CompareProvider>
              <RecentlyViewedProvider>
                
                  <div className="app">
                    <Header />
                    <main className="main-content">
                      <Routes>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/products" element={<ProductsPage />} />
                        <Route path="/products/:category" element={<ProductsPage />} />
                        <Route path="/product/:id" element={<ProductDetailPage />} />
                        <Route path="/cart" element={<CartPage />} />
                        <Route path="/checkout" element={<CheckoutPage />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/register" element={<RegisterPage />} />
                        <Route path="/wishlist" element={<WishlistPage />} />
                        <Route path="/compare" element={<ComparePage />} />
                        <Route path="/profile" element={<ProfilePage />} />
                        <Route path="/orders" element={<OrdersPage />} />
                        <Route path="/quick-view" element={<QuickViewPage />} />
                      </Routes>
                    </main>
                    <CompareBar />
                    <Footer />
                  </div>
                
              </RecentlyViewedProvider>
            </CompareProvider>
          </WishlistProvider>
        </CartProvider>
      </AuthProvider>
    </Router>
  )
}

export default App
