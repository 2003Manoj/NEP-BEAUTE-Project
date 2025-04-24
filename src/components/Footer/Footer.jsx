"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Send } from "lucide-react"
import styles from "./Footer.module.css"

const Footer = () => {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubscribe = (e) => {
    e.preventDefault()
    if (email) {
      // In a real app, you would send this to your backend
      console.log("Subscribed with email:", email)
      setSubscribed(true)
      setEmail("")

      // Reset the subscribed message after 5 seconds
      setTimeout(() => {
        setSubscribed(false)
      }, 5000)
    }
  }

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>NepBeaute</h3>
            <p className={styles.footerText}>
              Premium beauty products made with natural ingredients from the Himalayas. Discover your natural beauty
              with NepBeaute.
            </p>
            <div className={styles.socialIcons}>
              <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
                <Facebook size={18} />
              </a>
              <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                <Instagram size={18} />
              </a>
              <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
                <Twitter size={18} />
              </a>
              <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" aria-label="YouTube">
                <Youtube size={18} />
              </a>
            </div>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Quick Links</h3>
            <ul className={styles.footerLinks}>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/products">Shop</Link>
              </li>
              <li>
                <Link to="/about">About Us</Link>
              </li>
              <li>
                <Link to="/contact">Contact</Link>
              </li>
              <li>
                <Link to="/blog">Blog</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Categories</h3>
            <ul className={styles.footerLinks}>
              <li>
                <Link to="/products/skincare">Skincare</Link>
              </li>
              <li>
                <Link to="/products/makeup">Makeup</Link>
              </li>
              <li>
                <Link to="/products/haircare">Haircare</Link>
              </li>
              <li>
                <Link to="/products/fragrance">Fragrance</Link>
              </li>
              <li>
                <Link to="/products/new-arrivals">New Arrivals</Link>
              </li>
            </ul>
          </div>

          <div className={styles.footerSection}>
            <h3 className={styles.footerTitle}>Contact Us</h3>
            <ul className={styles.contactInfo}>
              <li>
                <MapPin size={18} />
                <span>123 Durbar Marg, Kathmandu, Nepal</span>
              </li>
              <li>
                <Phone size={18} />
                <span>+977 1234567890</span>
              </li>
              <li>
                <Mail size={18} />
                <span>info@nepbeaute.com</span>
              </li>
            </ul>
            <div className={styles.footerNewsletter}>
              <form className={styles.newsletterForm} onSubmit={handleSubscribe}>
                <input
                  type="email"
                  placeholder="Your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <button type="submit">
                  <Send size={16} />
                </button>
              </form>
              {subscribed && <p className={styles.subscribeMessage}>Thank you for subscribing!</p>}
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <div className={styles.paymentMethods}>
            <span>We Accept:</span>
            <div className={styles.paymentIcons}>
              <img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-1.2.1&auto=format&fit=crop&w=200&q=80"
                alt="Payment Methods"
              />
            </div>
          </div>
          <div className={styles.copyright}>
            <p>&copy; {new Date().getFullYear()} NepBeaute. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
