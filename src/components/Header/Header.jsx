"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useCart } from "../../contexts/CartContext"
import { useWishlist } from "../../contexts/WishlistContext"
import SearchBar from "../SearchBar/SearchBar"
// import CurrencySelector from "../CurrencySelector/CurrencySelector"
import { User, ShoppingCart, Heart, LogOut, Package, ChevronDown, Menu, X, Search } from 'lucide-react'
import styles from "./Header.module.css"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const { user, logout } = useAuth()
  const { cartItems } = useCart()
  const { wishlistItems } = useWishlist()
  const navigate = useNavigate()

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const totalCartItems = cartItems.reduce((total, item) => total + item.quantity, 0)
  const totalWishlistItems = wishlistItems.length

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">
            <h1>NepBeaute</h1>
          </Link>
        </div>

        <div className={styles.searchContainer}>
          <SearchBar />
        </div>

        <nav className={`${styles.nav} ${isMobileMenuOpen ? styles.active : ""}`}>
          <ul className={styles.navList}>
            <li>
              <Link to="/" onClick={() => setIsMobileMenuOpen(false)}>
                Home
              </Link>
            </li>
            <li>
              <Link to="/products" onClick={() => setIsMobileMenuOpen(false)}>
                Products
              </Link>
            </li>
            <li className={styles.dropdown}>
              <span className={styles.dropdownTrigger}>
                Categories <ChevronDown size={16} className={styles.dropdownIcon} />
              </span>
              <div className={styles.dropdownContent}>
                <Link to="/products/skincare" onClick={() => setIsMobileMenuOpen(false)}>
                  Skincare
                </Link>
                <Link to="/products/makeup" onClick={() => setIsMobileMenuOpen(false)}>
                  Makeup
                </Link>
                <Link to="/products/haircare" onClick={() => setIsMobileMenuOpen(false)}>
                  Haircare
                </Link>
                <Link to="/products/fragrance" onClick={() => setIsMobileMenuOpen(false)}>
                  Fragrance
                </Link>
              </div>
            </li>
            <li className={styles.dropdown}>
              <span className={styles.dropdownTrigger}>
                Brands <ChevronDown size={16} className={styles.dropdownIcon} />
              </span>
              <div className={styles.dropdownContent}>
                <Link to="/products?brand=Himalaya" onClick={() => setIsMobileMenuOpen(false)}>
                  Himalaya
                </Link>
                <Link to="/products?brand=Dabur" onClick={() => setIsMobileMenuOpen(false)}>
                  Dabur
                </Link>
                <Link to="/products?brand=Patanjali" onClick={() => setIsMobileMenuOpen(false)}>
                  Patanjali
                </Link>
                <Link to="/products?brand=Lotus" onClick={() => setIsMobileMenuOpen(false)}>
                  Lotus
                </Link>
                <Link to="/products?brand=Lakme" onClick={() => setIsMobileMenuOpen(false)}>
                  Lakme
                </Link>
                <Link to="/products?brand=Maybelline" onClick={() => setIsMobileMenuOpen(false)}>
                  Maybelline
                </Link>
              </div>
            </li>
          </ul>
        </nav>

        <div className={styles.actions}>
          
          <Link to="/wishlist" className={styles.wishlistIcon}>
            <Heart size={20} />
            {totalWishlistItems > 0 && <span className={styles.wishlistCount}>{totalWishlistItems}</span>}
          </Link>

          <Link to="/cart" className={styles.cartIcon}>
            <ShoppingCart size={20} />
            {totalCartItems > 0 && <span className={styles.cartCount}>{totalCartItems}</span>}
          </Link>

          {user ? (
            <div className={styles.userMenu}>
              <button className={styles.userButton}>
                <User size={20} />
              </button>
              <div className={styles.userDropdown}>
                <Link to="/profile">
                  <User size={16} />
                  <span>My Profile</span>
                </Link>
                <Link to="/orders">
                  <Package size={16} />
                  <span>My Orders</span>
                </Link>
                <Link to="/wishlist">
                  <Heart size={16} />
                  <span>My Wishlist</span>
                </Link>
                <button onClick={handleLogout}>
                  <LogOut size={16} />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className={styles.loginButton}>
              <User size={16} />
              <span>Login</span>
            </Link>
          )}

          <button className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
