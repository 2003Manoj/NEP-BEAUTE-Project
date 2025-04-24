"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useCart } from "../../contexts/CartContext"
import { useWishlist } from "../../contexts/WishlistContext"
import SearchBar from "../SearchBar/SearchBar"
import CurrencySelector from "../CurrencySelector/CurrencySelector"
import { User, ShoppingCart, Heart, LogOut, Package, ChevronDown, Menu, X } from "lucide-react"
import styles from "./Header.module.css"

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isMobileView, setIsMobileView] = useState(false)
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

    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 768)
    }

    window.addEventListener("scroll", handleScroll)
    window.addEventListener("resize", handleResize)

    // Initial check
    handleResize()

    return () => {
      window.removeEventListener("scroll", handleScroll)
      window.removeEventListener("resize", handleResize)
    }
  }, [])

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
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

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li className={styles.dropdown}>
              <span className={styles.dropdownTrigger}>
                Categories <ChevronDown size={16} className={styles.dropdownIcon} />
              </span>
              <div className={styles.dropdownContent}>
                <Link to="/products/skincare">Skincare</Link>
                <Link to="/products/makeup">Makeup</Link>
                <Link to="/products/haircare">Haircare</Link>
                <Link to="/products/fragrance">Fragrance</Link>
              </div>
            </li>
            <li className={styles.dropdown}>
              <span className={styles.dropdownTrigger}>
                Brands <ChevronDown size={16} className={styles.dropdownIcon} />
              </span>
              <div className={styles.dropdownContent}>
                <Link to="/products?brand=Himalaya">Himalaya</Link>
                <Link to="/products?brand=Dabur">Dabur</Link>
                <Link to="/products?brand=Patanjali">Patanjali</Link>
                <Link to="/products?brand=Lotus">Lotus</Link>
                <Link to="/products?brand=Lakme">Lakme</Link>
                <Link to="/products?brand=Maybelline">Maybelline</Link>
              </div>
            </li>
          </ul>
        </nav>

        <div className={styles.actions}>
          <div className={styles.currencySelectorContainer}>
            <CurrencySelector />
          </div>
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

          {isMobileView && (
            <button className={styles.mobileMenuButton} onClick={toggleMobileMenu}>
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileView && (
        <div className={`${styles.mobileNav} ${isMobileMenuOpen ? styles.active : ""}`}>
          <div className={styles.mobileNavContent}>
            <div className={styles.mobileSearchContainer}>
              <SearchBar />
            </div>

            <ul className={styles.mobileNavList}>
              <li className={styles.mobileNavItem}>
                <Link to="/" className={styles.mobileNavLink} onClick={closeMobileMenu}>
                  Home
                </Link>
              </li>
              <li className={styles.mobileNavItem}>
                <Link to="/products" className={styles.mobileNavLink} onClick={closeMobileMenu}>
                  Products
                </Link>
              </li>
              <li className={styles.mobileNavItem}>
                <div
                  className={styles.mobileNavLink}
                  onClick={() => {
                    const subMenu = document.getElementById("categoriesSubMenu")
                    subMenu.classList.toggle(styles.active)
                  }}
                >
                  Categories
                  <ChevronDown size={16} />
                </div>
                <div id="categoriesSubMenu" className={styles.mobileSubMenu}>
                  <Link to="/products/skincare" onClick={closeMobileMenu}>
                    Skincare
                  </Link>
                  <Link to="/products/makeup" onClick={closeMobileMenu}>
                    Makeup
                  </Link>
                  <Link to="/products/haircare" onClick={closeMobileMenu}>
                    Haircare
                  </Link>
                  <Link to="/products/fragrance" onClick={closeMobileMenu}>
                    Fragrance
                  </Link>
                </div>
              </li>
              <li className={styles.mobileNavItem}>
                <div
                  className={styles.mobileNavLink}
                  onClick={() => {
                    const subMenu = document.getElementById("brandsSubMenu")
                    subMenu.classList.toggle(styles.active)
                  }}
                >
                  Brands
                  <ChevronDown size={16} />
                </div>
                <div id="brandsSubMenu" className={styles.mobileSubMenu}>
                  <Link to="/products?brand=Himalaya" onClick={closeMobileMenu}>
                    Himalaya
                  </Link>
                  <Link to="/products?brand=Dabur" onClick={closeMobileMenu}>
                    Dabur
                  </Link>
                  <Link to="/products?brand=Patanjali" onClick={closeMobileMenu}>
                    Patanjali
                  </Link>
                  <Link to="/products?brand=Lotus" onClick={closeMobileMenu}>
                    Lotus
                  </Link>
                  <Link to="/products?brand=Lakme" onClick={closeMobileMenu}>
                    Lakme
                  </Link>
                  <Link to="/products?brand=Maybelline" onClick={closeMobileMenu}>
                    Maybelline
                  </Link>
                </div>
              </li>
              <li className={styles.mobileNavItem}>
                <Link to="/wishlist" className={styles.mobileNavLink} onClick={closeMobileMenu}>
                  My Wishlist
                  {totalWishlistItems > 0 && <span className={styles.mobileNavBadge}>{totalWishlistItems}</span>}
                </Link>
              </li>
              <li className={styles.mobileNavItem}>
                <Link to="/cart" className={styles.mobileNavLink} onClick={closeMobileMenu}>
                  My Cart
                  {totalCartItems > 0 && <span className={styles.mobileNavBadge}>{totalCartItems}</span>}
                </Link>
              </li>
              {user ? (
                <>
                  <li className={styles.mobileNavItem}>
                    <Link to="/profile" className={styles.mobileNavLink} onClick={closeMobileMenu}>
                      My Profile
                    </Link>
                  </li>
                  <li className={styles.mobileNavItem}>
                    <Link to="/orders" className={styles.mobileNavLink} onClick={closeMobileMenu}>
                      My Orders
                    </Link>
                  </li>
                  <li className={styles.mobileNavItem}>
                    <button
                      className={styles.mobileLogoutBtn}
                      onClick={() => {
                        handleLogout()
                        closeMobileMenu()
                      }}
                    >
                      <LogOut size={16} />
                      <span>Logout</span>
                    </button>
                  </li>
                </>
              ) : (
                <li className={styles.mobileNavItem}>
                  <Link to="/login" className={styles.mobileLoginBtn} onClick={closeMobileMenu}>
                    <User size={16} />
                    <span>Login / Register</span>
                  </Link>
                </li>
              )}
            </ul>

            <div className={styles.mobileCurrencySelector}>
              <CurrencySelector />
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

export default Header
