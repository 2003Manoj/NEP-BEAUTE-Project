"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import ProductCard from "../../components/ProductCard/ProductCard"
import ProductQuickView from "../../components/ProductQuickView/ProductQuickView"
import { getProducts } from "../../services/productService"
import { ChevronRight, Star, TrendingUp, Award, Clock, Facebook, Twitter, Instagram, Youtube, Eye } from "lucide-react"
import styles from "./HomePage.module.css"

const HomePage = () => {
  const [featuredProducts, setFeaturedProducts] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [bestSellers, setBestSellers] = useState([])
  const [trendingProducts, setTrendingProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState("all")
  const [quickViewProduct, setQuickViewProduct] = useState(null)
  const [showQuickView, setShowQuickView] = useState(false)
  const [countdown, setCountdown] = useState({
    days: 2,
    hours: 18,
    minutes: 45,
    seconds: 0,
  })
  const navigate = useNavigate()

  // Featured brands with updated logos
  const featuredBrands = [
    {
      name: "Himalaya",
      logo: "https://images.pexels.com/photos/3737586/pexels-photo-3737586.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Lakme",
      logo: "https://images.pexels.com/photos/2253833/pexels-photo-2253833.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Maybelline",
      logo: "https://images.pexels.com/photos/2688991/pexels-photo-2688991.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Lotus",
      logo: "https://images.pexels.com/photos/3737600/pexels-photo-3737600.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Forest Essentials",
      logo: "https://images.pexels.com/photos/6621333/pexels-photo-6621333.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
    {
      name: "Biotique",
      logo: "https://images.pexels.com/photos/6621462/pexels-photo-6621462.jpeg?auto=compress&cs=tinysrgb&w=600",
    },
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const products = await getProducts()

        // Filter products for different sections
        setFeaturedProducts(products.filter((p) => p.featured).slice(0, 4))
        setNewArrivals(products.filter((p) => p.isNew).slice(0, 8))
        setBestSellers(products.filter((p) => p.bestSeller).slice(0, 8))
        setTrendingProducts(products.filter((p) => p.rating >= 4.5).slice(0, 4))

        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Countdown timer
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prevCountdown) => {
        let { days, hours, minutes, seconds } = prevCountdown

        if (seconds > 0) {
          seconds -= 1
        } else {
          seconds = 59
          if (minutes > 0) {
            minutes -= 1
          } else {
            minutes = 59
            if (hours > 0) {
              hours -= 1
            } else {
              hours = 23
              if (days > 0) {
                days -= 1
              } else {
                // Timer finished
                clearInterval(timer)
                return prevCountdown
              }
            }
          }
        }

        return { days, hours, minutes, seconds }
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  const filterProductsByCategory = (products) => {
    if (activeCategory === "all") return products
    return products.filter((product) => product.category === activeCategory)
  }

  const handleQuickView = (product) => {
    console.log("Opening quick view for product:", product)
    if (!product) {
      console.error("Attempted to open quick view with undefined product")
      return
    }
    setQuickViewProduct(product)
    setShowQuickView(true)
    // Prevent scrolling when modal is open
    document.body.style.overflow = "hidden"
  }

  const closeQuickView = () => {
    console.log("Closing quick view")
    setShowQuickView(false)
    // Re-enable scrolling when modal is closed
    document.body.style.overflow = "auto"
    // Use setTimeout to avoid state update conflicts
    setTimeout(() => {
      setQuickViewProduct(null)
    }, 300)
  }

  const handleBrandClick = (brandName) => {
    navigate(`/products?brand=${encodeURIComponent(brandName)}`)
  }

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`)
  }

  return (
    <div className={styles.homePage}>
      {/* Quick View Modal */}
      {showQuickView && quickViewProduct && <ProductQuickView product={quickViewProduct} onClose={closeQuickView} />}

      {/* Hero Section */}
      <section className={styles.heroSection}>
        <div className={styles.heroContent}>
          <h1>Discover Your Natural Beauty</h1>
          <p>Premium beauty products for every skin type</p>
          <div className={styles.heroBtns}>
            <Link to="/products" className={styles.primaryBtn}>
              Shop Now
            </Link>
            <Link to="/products/new-arrivals" className={styles.secondaryBtn}>
              New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Brands Section */}
      <section className={styles.featuredBrandsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Featured Brands</h2>
            <Link to="/brands" className={styles.viewAllLink}>
              View All <ChevronRight size={16} />
            </Link>
          </div>

          <div className={styles.brandsGrid}>
            {featuredBrands.map((brand) => (
              <div
                key={brand.name}
                className={styles.brandCard}
                onClick={() => handleBrandClick(brand.name)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    handleBrandClick(brand.name)
                  }
                }}
              >
                <div className={styles.brandLogo}>
                  <img src={brand.logo || "/placeholder.svg"} alt={brand.name} />
                </div>
                <span className={styles.brandName}>{brand.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className={styles.categoriesSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Shop by Category</h2>
          </div>
          <div className={styles.categories}>
            <Link to="/products/skincare" className={styles.categoryCard}>
              <div className={styles.categoryImage}>
                <img
                  src="https://images.pexels.com/photos/3737586/pexels-photo-3737586.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Skincare"
                />
              </div>
              <div className={styles.categoryContent}>
                <h3>Skincare</h3>
                <p>Nourish your skin with natural ingredients</p>
                <span className={styles.categoryLink}>
                  Shop Now <ChevronRight size={16} />
                </span>
              </div>
            </Link>
            <Link to="/products/makeup" className={styles.categoryCard}>
              <div className={styles.categoryImage}>
                <img
                  src="https://images.pexels.com/photos/2253833/pexels-photo-2253833.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Makeup"
                />
              </div>
              <div className={styles.categoryContent}>
                <h3>Makeup</h3>
                <p>Enhance your natural beauty</p>
                <span className={styles.categoryLink}>
                  Shop Now <ChevronRight size={16} />
                </span>
              </div>
            </Link>
            <Link to="/products/haircare" className={styles.categoryCard}>
              <div className={styles.categoryImage}>
                <img
                  src="https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Haircare"
                />
              </div>
              <div className={styles.categoryContent}>
                <h3>Haircare</h3>
                <p>Revitalize your hair with premium products</p>
                <span className={styles.categoryLink}>
                  Shop Now <ChevronRight size={16} />
                </span>
              </div>
            </Link>
            <Link to="/products/fragrance" className={styles.categoryCard}>
              <div className={styles.categoryImage}>
                <img
                  src="https://images.pexels.com/photos/965989/pexels-photo-965989.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Fragrance"
                />
              </div>
              <div className={styles.categoryContent}>
                <h3>Fragrance</h3>
                <p>Discover scents that define you</p>
                <span className={styles.categoryLink}>
                  Shop Now <ChevronRight size={16} />
                </span>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      <section className={styles.trendingSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>
              <TrendingUp size={24} />
              <span>Trending Now</span>
            </h2>
            <Link to="/products/trending" className={styles.viewAllLink}>
              View All <ChevronRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className={styles.loadingSpinner}></div>
          ) : (
            <div className={styles.trendingGrid}>
              {trendingProducts.map((product) => (
                <div key={product.id} className={styles.trendingProduct} onClick={() => handleProductClick(product)}>
                  <div className={styles.trendingRank}>
                    <span>{trendingProducts.indexOf(product) + 1}</span>
                  </div>
                  <div className={styles.trendingImage}>
                    <img src={product.image || "/placeholder.svg"} alt={product.name} />
                  </div>
                  <div className={styles.trendingInfo}>
                    <div className={styles.trendingBrand}>{product.brand}</div>
                    <h3 className={styles.trendingName}>{product.name}</h3>
                    <div className={styles.trendingRating}>
                      <Star size={14} fill="currentColor" />
                      <span>{product.rating}</span>
                      <span className={styles.trendingReviews}>({product.reviewCount})</span>
                    </div>
                    <div className={styles.trendingPrice}>
                      <span>Rs. {product.price.toLocaleString()}</span>
                      {product.originalPrice && (
                        <span className={styles.trendingOriginalPrice}>
                          Rs. {product.originalPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <div className={styles.trendingActions}>
                      <button
                        className={styles.trendingCartBtn}
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          handleQuickView(product)
                        }}
                      >
                        <Eye size={16} />
                        <span>Quick View</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Banner Section */}
      <section className={styles.bannerSection}>
        <div className={styles.bannerContent}>
          <div className={styles.bannerTag}>Limited Time Offer</div>
          <h2>Special Discount</h2>
          <p>Get 20% off on all Himalayan Skincare products</p>
          <div className={styles.bannerTimer}>
            <div className={styles.timerUnit}>
              <span className={styles.timerNumber}>{countdown.days}</span>
              <span className={styles.timerLabel}>Days</span>
            </div>
            <div className={styles.timerUnit}>
              <span className={styles.timerNumber}>{countdown.hours.toString().padStart(2, "0")}</span>
              <span className={styles.timerLabel}>Hours</span>
            </div>
            <div className={styles.timerUnit}>
              <span className={styles.timerNumber}>{countdown.minutes.toString().padStart(2, "0")}</span>
              <span className={styles.timerLabel}>Minutes</span>
            </div>
            <div className={styles.timerUnit}>
              <span className={styles.timerNumber}>{countdown.seconds.toString().padStart(2, "0")}</span>
              <span className={styles.timerLabel}>Seconds</span>
            </div>
          </div>
          <Link to="/products?brand=Himalaya" className={styles.bannerBtn}>
            Shop Now
          </Link>
        </div>
      </section>

      {/* New Arrivals Section */}
      <section className={styles.newArrivalsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>
              <Award size={24} />
              <span>New Arrivals</span>
            </h2>
            <div className={styles.categoryTabs}>
              <button
                className={activeCategory === "all" ? styles.active : ""}
                onClick={() => setActiveCategory("all")}
              >
                All
              </button>
              <button
                className={activeCategory === "skincare" ? styles.active : ""}
                onClick={() => setActiveCategory("skincare")}
              >
                Skincare
              </button>
              <button
                className={activeCategory === "makeup" ? styles.active : ""}
                onClick={() => setActiveCategory("makeup")}
              >
                Makeup
              </button>
              <button
                className={activeCategory === "haircare" ? styles.active : ""}
                onClick={() => setActiveCategory("haircare")}
              >
                Haircare
              </button>
            </div>
          </div>

          {loading ? (
            <div className={styles.loadingSpinner}></div>
          ) : (
            <div className={styles.productsGrid}>
              {filterProductsByCategory(newArrivals).map((product) => (
                <div
                  key={product.id}
                  style={{ cursor: "pointer" }}
                  onClick={(e) => {
                    // Only navigate if not clicking on a button
                    if (e.target.tagName !== "BUTTON" && !e.target.closest("button")) {
                      handleProductClick(product)
                    }
                  }}
                >
                  <ProductCard product={product} onQuickView={handleQuickView} />
                </div>
              ))}
            </div>
          )}

          <div className={styles.viewAllContainer}>
            <Link to="/products/new-arrivals" className={styles.viewAllBtn}>
              View All New Arrivals
            </Link>
          </div>
        </div>
      </section>

      {/* Beauty Advice Section */}
      <section className={styles.beautyAdviceSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>Beauty Advice & Tips</h2>
          </div>

          <div className={styles.adviceGrid}>
            <div className={styles.adviceCard}>
              <div className={styles.adviceImage}>
                <img
                  src="https://images.pexels.com/photos/3737586/pexels-photo-3737586.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Skincare Routine"
                />
              </div>
              <div className={styles.adviceContent}>
                <div className={styles.adviceTag}>
                  <Clock size={14} />
                  <span>Skincare</span>
                </div>
                <h3>5-Step Morning Skincare Routine for Glowing Skin</h3>
                <p>
                  Learn the essential steps to achieve that perfect morning glow with our expert-recommended routine.
                </p>
                <Link to="/blog/skincare-routine" className={styles.adviceLink}>
                  Read More <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            <div className={styles.adviceCard}>
              <div className={styles.adviceImage}>
                <img
                  src="https://images.pexels.com/photos/2253833/pexels-photo-2253833.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Makeup Tips"
                />
              </div>
              <div className={styles.adviceContent}>
                <div className={styles.adviceTag}>
                  <Clock size={14} />
                  <span>Makeup</span>
                </div>
                <h3>Monsoon Makeup Tips: How to Make Your Makeup Last Longer</h3>
                <p>
                  Discover the secrets to keeping your makeup intact during the rainy season with these professional
                  tips.
                </p>
                <Link to="/blog/monsoon-makeup" className={styles.adviceLink}>
                  Read More <ChevronRight size={16} />
                </Link>
              </div>
            </div>

            <div className={styles.adviceCard}>
              <div className={styles.adviceImage}>
                <img
                  src="https://images.pexels.com/photos/3997989/pexels-photo-3997989.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Hair Care"
                />
              </div>
              <div className={styles.adviceContent}>
                <div className={styles.adviceTag}>
                  <Clock size={14} />
                  <span>Haircare</span>
                </div>
                <h3>Natural Remedies for Dry and Damaged Hair</h3>
                <p>Revitalize your hair with these effective home remedies using ingredients from your kitchen.</p>
                <Link to="/blog/natural-hair-remedies" className={styles.adviceLink}>
                  Read More <ChevronRight size={16} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className={styles.testimonialsSection}>
        <div className={styles.container}>
          <div className={styles.sectionHeader}>
            <h2>What Our Customers Say</h2>
          </div>

          <div className={styles.testimonials}>
            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <div className={styles.testimonialQuote}>"</div>
                <p>
                  I've been using NepBeaute products for 3 months now, and my skin has never looked better! The
                  Kumkumadi Face Oil is a game-changer.
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Customer" />
                <div>
                  <h4>Priya Sharma</h4>
                  <div className={styles.rating}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <div className={styles.testimonialQuote}>"</div>
                <p>
                  The delivery was super fast, and the products were packaged beautifully. I love the natural
                  ingredients used in all their products!
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Customer" />
                <div>
                  <h4>Rajesh Thapa</h4>
                  <div className={styles.rating}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill={i < 4 ? "currentColor" : "none"} />
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.testimonialCard}>
              <div className={styles.testimonialContent}>
                <div className={styles.testimonialQuote}>"</div>
                <p>
                  As someone with sensitive skin, finding the right products has always been a challenge. NepBeaute's
                  gentle formulations have been perfect for me.
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Customer" />
                <div>
                  <h4>Anita Gurung</h4>
                  <div className={styles.rating}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={14} fill="currentColor" />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className={styles.newsletterSection}>
        <div className={styles.container}>
          <div className={styles.newsletterContent}>
            <h2>Subscribe to Our Newsletter</h2>
            <p>Stay updated with our latest products and exclusive offers</p>
            <form className={styles.newsletterForm}>
              <input type="email" placeholder="Your email address" required />
              <button type="submit">Subscribe</button>
            </form>
            <div className={styles.socialLinks}>
              <a href="#" className={styles.socialLink}>
                <Facebook size={20} />
              </a>
              <a href="#" className={styles.socialLink}>
                <Twitter size={20} />
              </a>
              <a href="#" className={styles.socialLink}>
                <Instagram size={20} />
              </a>
              <a href="#" className={styles.socialLink}>
                <Youtube size={20} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
