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
      logo: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/fd3d9d66-b1e5-4200-b76c-6c83d37f8291.png",
    },
    {
      name: "Lakme",
      logo: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/5c0d8dac-3cf8-4cbe-a232-7bf1c6109d58.png",
    },
    {
      name: "Maybelline",
      logo: "https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/6c5b38fd-a7d5-4374-aa84-9bd584f6c342.png",    },
    {
      name: "Lotus",
      logo: "data:image/jpeg;base64,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",    },
    {
      name: "Dabur",
      logo: "data:image/png;base64,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",    },
    {
      name: "Patanjali",
      logo: "data:image/png;base64,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",    },
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
                  src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/1ad81ea0-7a60-43a4-afe9-8921d3e1b45b.png"
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
                  src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/c5f91ab3-4d08-4650-a44e-177c2f3bbc58.png"
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
                  src="https://storage.googleapis.com/workspace-0f70711f-8b4e-4d94-86f1-2a93ccde5887/image/3b61f54d-05c7-496e-ba32-127148ebbc56.png"
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
                  I've been using NepBeaute products for 3 months now, and my skin has  looked better! The
                  Kumkumadi Face Oil is a game-changer.
                </p>
              </div>
              <div className={styles.testimonialAuthor}>
                <img src="https://placehold.co/600x400" alt="Customer" />
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
                <img src="https://placehold.co/600x400" alt="Customer" />
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
                <img src="https://placehold.co/600x400" alt="Customer" />
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
                <Facebook size={20}  />
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
