"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useCart } from "../../contexts/CartContext"
import { useWishlist } from "../../contexts/WishlistContext"
import { useAuth } from "../../contexts/AuthContext"
import ProductCard from "../../components/ProductCard/ProductCard"
import { getProductById, getRelatedProducts } from "../../services/productService"
import styles from "./ProductDetailPage.module.css"

const ProductDetailPage = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [activeImage, setActiveImage] = useState(0)

  // Mock product images
  const [productImages, setProductImages] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const productData = await getProductById(id)
        setProduct(productData)

        // Generate multiple images for the product
        setProductImages([
          productData.image,
          `https://source.unsplash.com/random/600x800/?${productData.category},beauty,1`,
          `https://source.unsplash.com/random/600x800/?${productData.category},beauty,2`,
          `https://source.unsplash.com/random/600x800/?${productData.category},beauty,3`,
        ])

        // Fetch related products
        const related = await getRelatedProducts(productData.category, id)
        setRelatedProducts(related)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching product:", error)
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id])

  const handleQuantityChange = (e) => {
    const value = Number.parseInt(e.target.value)
    setQuantity(value)
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const handleAddToCart = () => {
    if (product) {
      addToCart(product, quantity)
    }
  }

  const handleWishlistToggle = () => {
    if (!user) {
      navigate("/login")
      return
    }

    if (product) {
      if (isInWishlist(product.id)) {
        removeFromWishlist(product.id)
      } else {
        addToWishlist(product)
      }
    }
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className={styles.errorContainer}>
        <h2>Product Not Found</h2>
        <p>Sorry, the product you are looking for does not exist.</p>
        <Link to="/products" className={styles.backButton}>
          Back to Products
        </Link>
      </div>
    )
  }

  // Calculate discount percentage
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  const isProductInWishlist = isInWishlist(product.id)

  return (
    <div className={styles.productDetailPage}>
      <div className={styles.container}>
        <div className={styles.breadcrumbs}>
          <Link to="/">Home</Link>
          <span>/</span>
          <Link to="/products">Products</Link>
          <span>/</span>
          <Link to={`/products/${product.category}`}>{product.category}</Link>
          <span>/</span>
          <span>{product.name}</span>
        </div>

        <div className={styles.productContent}>
          {/* Product Images */}
          <div className={styles.productImages}>
            <div className={styles.thumbnails}>
              {productImages.map((image, index) => (
                <div
                  key={index}
                  className={`${styles.thumbnail} ${activeImage === index ? styles.active : ""}`}
                  onClick={() => setActiveImage(index)}
                >
                  <img src={image || "/placeholder.svg"} alt={`${product.name} - View ${index + 1}`} />
                </div>
              ))}
            </div>
            <div className={styles.mainImage}>
              <img src={productImages[activeImage] || "/placeholder.svg"} alt={product.name} />
              {product.isNew && <span className={`${styles.badge} ${styles.newBadge}`}>New</span>}
              {discountPercentage > 0 && (
                <span className={`${styles.badge} ${styles.discountBadge}`}>-{discountPercentage}%</span>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className={styles.productInfo}>
            <h1 className={styles.productName}>{product.name}</h1>

            <div className={styles.productMeta}>
              <div className={styles.rating}>
                {[...Array(5)].map((_, i) => (
                  <i key={i} className={`fas fa-star ${i < product.rating ? styles.filled : styles.empty}`}></i>
                ))}
                <span className={styles.ratingCount}>({product.reviewCount} reviews)</span>
              </div>

              <div className={styles.brand}>
                <span>Brand:</span> {product.brand}
              </div>
            </div>

            <div className={styles.priceContainer}>
              <span className={styles.price}>Rs. {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className={styles.originalPrice}>Rs. {product.originalPrice.toLocaleString()}</span>
              )}
            </div>

            <p className={styles.productDescription}>{product.description}</p>

            <div className={styles.quantitySelector}>
              <span>Quantity:</span>
              <div className={styles.quantityControls}>
                <button onClick={decreaseQuantity}>-</button>
                <input type="number" min="1" value={quantity} onChange={handleQuantityChange} />
                <button onClick={increaseQuantity}>+</button>
              </div>
            </div>

            <div className={styles.actions}>
              <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                <i className="fas fa-shopping-cart"></i> Add to Cart
              </button>
              <button
                className={`${styles.wishlistBtn} ${isProductInWishlist ? styles.inWishlist : ""}`}
                onClick={handleWishlistToggle}
              >
                <i className={isProductInWishlist ? "fas fa-heart" : "far fa-heart"}></i>
                {isProductInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}
              </button>
            </div>

            <div className={styles.deliveryInfo}>
              <div className={styles.infoItem}>
                <i className="fas fa-truck"></i>
                <span>Free delivery in Kathmandu Valley</span>
              </div>
              <div className={styles.infoItem}>
                <i className="fas fa-undo"></i>
                <span>7 days return policy</span>
              </div>
              <div className={styles.infoItem}>
                <i className="fas fa-shield-alt"></i>
                <span>100% authentic products</span>
              </div>
            </div>

            <div className={styles.paymentMethods}>
              <span>Payment Methods:</span>
              <div className={styles.paymentIcons}>
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/5/5e/Khalti_Digital_Wallet_Logo.png"
                  alt="Khalti"
                />
                <img src="https://esewa.com.np/common/images/esewa_logo.png" alt="eSewa" />
                <img src="https://cdn-icons-png.flaticon.com/512/1554/1554401.png" alt="Cash on Delivery" />
              </div>
            </div>
          </div>
        </div>

        {/* Product Tabs */}
        <div className={styles.productTabs}>
          <div className={styles.tabsHeader}>
            <button
              className={activeTab === "description" ? styles.active : ""}
              onClick={() => setActiveTab("description")}
            >
              Description
            </button>
            <button className={activeTab === "details" ? styles.active : ""} onClick={() => setActiveTab("details")}>
              Details
            </button>
            <button className={activeTab === "reviews" ? styles.active : ""} onClick={() => setActiveTab("reviews")}>
              Reviews ({product.reviewCount})
            </button>
          </div>

          <div className={styles.tabContent}>
            {activeTab === "description" && (
              <div className={styles.descriptionTab}>
                <p>{product.description}</p>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl eget ultricies tincidunt,
                  nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl. Nullam auctor, nisl eget ultricies
                  tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget nisl.
                </p>
                <p>
                  Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl eget
                  nisl. Nullam auctor, nisl eget ultricies tincidunt, nisl nisl aliquam nisl, eget ultricies nisl nisl
                  eget nisl.
                </p>
              </div>
            )}

            {activeTab === "details" && (
              <div className={styles.detailsTab}>
                <table className={styles.detailsTable}>
                  <tbody>
                    <tr>
                      <td>Brand</td>
                      <td>{product.brand}</td>
                    </tr>
                    <tr>
                      <td>Category</td>
                      <td>{product.category}</td>
                    </tr>
                    <tr>
                      <td>Weight</td>
                      <td>100g</td>
                    </tr>
                    <tr>
                      <td>Ingredients</td>
                      <td>Natural extracts, Essential oils, Herbal ingredients</td>
                    </tr>
                    <tr>
                      <td>Made in</td>
                      <td>Nepal</td>
                    </tr>
                    <tr>
                      <td>Shelf Life</td>
                      <td>24 months</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === "reviews" && (
              <div className={styles.reviewsTab}>
                <div className={styles.reviewSummary}>
                  <div className={styles.averageRating}>
                    <span className={styles.ratingNumber}>{product.rating}</span>
                    <div className={styles.ratingStars}>
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fas fa-star ${i < product.rating ? styles.filled : styles.empty}`}></i>
                      ))}
                      <span>Based on {product.reviewCount} reviews</span>
                    </div>
                  </div>

                  <div className={styles.ratingBars}>
                    {[5, 4, 3, 2, 1].map((star) => (
                      <div key={star} className={styles.ratingBar}>
                        <span>{star} star</span>
                        <div className={styles.barContainer}>
                          <div className={styles.bar} style={{ width: `${Math.random() * 100}%` }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className={styles.reviewsList}>
                  {/* Mock reviews */}
                  <div className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewerInfo}>
                        <img src="https://randomuser.me/api/portraits/women/32.jpg" alt="Reviewer" />
                        <div>
                          <h4>Priya Sharma</h4>
                          <span>2 days ago</span>
                        </div>
                      </div>
                      <div className={styles.reviewRating}>
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`fas fa-star ${i < 5 ? styles.filled : styles.empty}`}></i>
                        ))}
                      </div>
                    </div>
                    <p className={styles.reviewText}>
                      I've been using this product for a month now and I'm very happy with the results. My skin feels
                      much smoother and looks brighter. Will definitely purchase again!
                    </p>
                  </div>

                  <div className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewerInfo}>
                        <img src="https://randomuser.me/api/portraits/men/45.jpg" alt="Reviewer" />
                        <div>
                          <h4>Rajesh Thapa</h4>
                          <span>1 week ago</span>
                        </div>
                      </div>
                      <div className={styles.reviewRating}>
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`fas fa-star ${i < 4 ? styles.filled : styles.empty}`}></i>
                        ))}
                      </div>
                    </div>
                    <p className={styles.reviewText}>
                      Good product for the price. The packaging is nice and the delivery was quick. I would recommend it
                      to others.
                    </p>
                  </div>

                  <div className={styles.reviewItem}>
                    <div className={styles.reviewHeader}>
                      <div className={styles.reviewerInfo}>
                        <img src="https://randomuser.me/api/portraits/women/68.jpg" alt="Reviewer" />
                        <div>
                          <h4>Anita Gurung</h4>
                          <span>2 weeks ago</span>
                        </div>
                      </div>
                      <div className={styles.reviewRating}>
                        {[...Array(5)].map((_, i) => (
                          <i key={i} className={`fas fa-star ${i < 5 ? styles.filled : styles.empty}`}></i>
                        ))}
                      </div>
                    </div>
                    <p className={styles.reviewText}>
                      Absolutely love this product! It has a nice fragrance and works really well for my sensitive skin.
                      The natural ingredients make it stand out from other similar products in the market.
                    </p>
                  </div>
                </div>

                <div className={styles.writeReview}>
                  <h3>Write a Review</h3>
                  <form className={styles.reviewForm}>
                    <div className={styles.formGroup}>
                      <label>Your Rating</label>
                      <div className={styles.ratingSelector}>
                        {[1, 2, 3, 4, 5].map((star) => (
                          <i key={star} className="far fa-star"></i>
                        ))}
                      </div>
                    </div>
                    <div className={styles.formGroup}>
                      <label>Your Review</label>
                      <textarea rows="4" placeholder="Write your review here..."></textarea>
                    </div>
                    <button type="submit" className={styles.submitReviewBtn}>
                      Submit Review
                    </button>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Related Products */}
        <div className={styles.relatedProducts}>
          <h2>Related Products</h2>
          <div className={styles.relatedProductsGrid}>
            {relatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetailPage
