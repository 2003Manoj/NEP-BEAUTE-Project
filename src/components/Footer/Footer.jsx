import { Link } from "react-router-dom"
import {
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Mail,
  Phone,
  MapPin,
  CreditCard,
  Truck,
  Shield,
  Heart,
} from "lucide-react"
import styles from "./Footer.module.css"

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerTop}>
        <div className={styles.container}>
          <div className={styles.featuresGrid}>
            <div className={styles.featureItem}>
              <Truck size={24} className={styles.featureIcon} />
              <div className={styles.featureContent}>
                <h3>Free Shipping</h3>
                <p>On orders over Rs. 1000</p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <Shield size={24} className={styles.featureIcon} />
              <div className={styles.featureContent}>
                <h3>Secure Payment</h3>
                <p>100% secure payment</p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <CreditCard size={24} className={styles.featureIcon} />
              <div className={styles.featureContent}>
                <h3>Easy Returns</h3>
                <p>10 days return policy</p>
              </div>
            </div>
            <div className={styles.featureItem}>
              <Heart size={24} className={styles.featureIcon} />
              <div className={styles.featureContent}>
                <h3>100% Authentic</h3>
                <p>Guaranteed products</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footerMain}>
        <div className={styles.container}>
          <div className={styles.footerGrid}>
            <div className={styles.footerAbout}>
              <div className={styles.footerLogo}>
                <h2>NepBeaute</h2>
              </div>
              <p className={styles.aboutText}>
                NepBeaute is Nepal's premier beauty destination, offering a curated selection of authentic skincare,
                makeup, haircare, and fragrance products.
              </p>
              <div className={styles.contactInfo}>
                <div className={styles.contactItem}>
                  <MapPin size={16} />
                  <span>Thamel, Kathmandu, Nepal</span>
                </div>
                <div className={styles.contactItem}>
                  <Phone size={16} />
                  <span>+977 1-4123456</span>
                </div>
                <div className={styles.contactItem}>
                  <Mail size={16} />
                  <span>info@nepbeaute.com</span>
                </div>
              </div>
              <div className={styles.socialLinks}>
                <a href="#" className={styles.socialLink}>
                  <Facebook size={18} />
                </a>
                <a href="#" className={styles.socialLink}>
                  <Twitter size={18} />
                </a>
                <a href="#" className={styles.socialLink}>
                  <Instagram size={18} />
                </a>
                <a href="#" className={styles.socialLink}>
                  <Youtube size={18} />
                </a>
              </div>
            </div>

            <div className={styles.footerLinks}>
              <h3>Quick Links</h3>
              <ul>
                <li>
                  <Link to="/">Home</Link>
                </li>
                <li>
                  <Link to="/products">Shop All</Link>
                </li>
                <li>
                  <Link to="/products/new-arrivals">New Arrivals</Link>
                </li>
                <li>
                  <Link to="/products/bestsellers">Bestsellers</Link>
                </li>
                <li>
                  <Link to="/products/offers">Special Offers</Link>
                </li>
              </ul>
            </div>

            <div className={styles.footerLinks}>
              <h3>Categories</h3>
              <ul>
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
                  <Link to="/products/tools">Beauty Tools</Link>
                </li>
              </ul>
            </div>

            <div className={styles.footerLinks}>
              <h3>Customer Service</h3>
              <ul>
                <li>
                  <Link to="/contact">Contact Us</Link>
                </li>
                <li>
                  <Link to="/faqs">FAQs</Link>
                </li>
                <li>
                  <Link to="/shipping">Shipping & Delivery</Link>
                </li>
                <li>
                  <Link to="/returns">Returns & Refunds</Link>
                </li>
                <li>
                  <Link to="/privacy">Privacy Policy</Link>
                </li>
              </ul>
            </div>

            <div className={styles.footerNewsletter}>
              <h3>Newsletter</h3>
              <p>Subscribe to receive updates, access to exclusive deals, and more.</p>
              <form className={styles.newsletterForm}>
                <input type="email" placeholder="Your email address" required />
                <button type="submit">
                  <Mail size={18} />
                </button>
              </form>
              <div className={styles.paymentMethods}>
                <img src="/images/payment-methods.png" alt="Payment Methods" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.footerBottom}>
        <div className={styles.container}>
          <p>&copy; {new Date().getFullYear()} NepBeaute. All Rights Reserved.</p>
          <div className={styles.footerBottomLinks}>
            <Link to="/terms">Terms of Service</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/sitemap">Sitemap</Link>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
