"use client"

import { useState, useEffect } from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useCart } from "../../contexts/CartContext"
import { useWishlist } from "../../contexts/WishlistContext"
import { useCompare } from "../../contexts/CompareContext"
import { useRecentlyViewed } from "../../contexts/RecentlyViewedContext"
import { useAuth } from "../../contexts/AuthContext"
import ProductCard from "../../components/ProductCard/ProductCard"

import ReviewList from "../../components/ReviewList/ReviewList"
import ReviewForm from "../../components/ReviewForm/ReviewForm"
import { getProductById, getRelatedProducts } from "../../services/productService"
import { ChevronLeft, ChevronRight, Star, ShoppingBag, Heart, Share2, BarChart2, Check } from "lucide-react"
import styles from "./ProductDetailPage.module.css"


const ProductDetailPage = () => {
  const { id } = useParams()
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { addToCompare, isInCompare } = useCompare()
  const { addToRecentlyViewed } = useRecentlyViewed()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [activeTab, setActiveTab] = useState("description")
  const [activeImage, setActiveImage] = useState(0)
  const [reviews, setReviews] = useState([])

  
  const [productImages, setProductImages] = useState([])

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        const productData = await getProductById(id)
        setProduct(productData)

        
        addToRecentlyViewed(productData)

      
        setProductImages([
          productData.image,
          productData.image.replace("w=600", "w=601"), 
          productData.image.replace("w=600", "w=602"), 
          productData.image.replace("w=600", "w=603"), 
        ])

        // Fetch related products
        const related = await getRelatedProducts(productData.category, id)
        setRelatedProducts(related)

        // Generate mock reviews
        const mockReviews = generateMockReviews(productData.reviewCount, productData.rating)
        setReviews(mockReviews)

        setLoading(false)
      } catch (error) {
        console.error("Error fetching product:", error)
        setLoading(false)
      }
    }

    fetchProduct()
  }, [id, addToRecentlyViewed])

  const generateMockReviews = (count, avgRating) => {
    const mockReviews = []
    const names = [
      "Priya Sharma",
      "Rajesh Thapa",
      "Anita Gurung",
      "Sunil Patel",
      "Meera Joshi",
      "Arun Kumar",
      "Sita Rai",
      "Deepak Shrestha",
    ]
    const titles = [
      "Great product!",
      "Highly recommended",
      "Worth the money",
      "Not what I expected",
      "Amazing results",
      "Will buy again",
      "Good quality",
      "Excellent purchase",
    ]
    const comments = [
      "This product exceeded my expectations. My skin feels so much better after using it for just a week.",
      "I've tried many similar products, but this one is definitely the best. Will purchase again!",
      "The quality is good, but I think it's a bit overpriced for what you get.",
      "I love how this product feels on my skin. It's gentle yet effective.",
      "Not sure if it's working for me. I've been using it for two weeks with minimal results.",
      "The packaging is beautiful and the product works as described. Very happy with my purchase!",
      "This has become an essential part of my daily routine. Can't imagine going without it now.",
      "I bought this based on the reviews and I'm not disappointed. It's as good as everyone says.",
    ]

    // Create a distribution of ratings that averages to avgRating
    const ratingDistribution = createRatingDistribution(count, avgRating)

    for (let i = 0; i < Math.min(count, 20); i++) {
      const rating = ratingDistribution[i] || Math.floor(Math.random() * 3) + 3 // Default to 3-5 stars
      const nameIndex = Math.floor(Math.random() * names.length)
      const titleIndex = Math.floor(Math.random() * titles.length)
      const commentIndex = Math.floor(Math.random() * comments.length)
      const daysAgo = Math.floor(Math.random() * 60) // Random date within last 60 days
      const helpfulCount = Math.floor(Math.random() * 20)
      const verified = Math.random() > 0.3 // 70% chance of being verified

      mockReviews.push({
        id: `review-${i + 1}`,
        userId: `user-${i + 1}`,
        userName: names[nameIndex],
        userImage: `https://randomuser.me/api/portraits/${Math.random() > 0.5 ? "women" : "men"}/${Math.floor(Math.random() * 100)}.jpg`,
        rating,
        title: titles[titleIndex],
        text: comments[commentIndex],
        date: new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString(),
        helpfulCount,
        verified,
      })
    }

    return mockReviews
  }

  // Helper function to create a distribution of ratings that averages to the target
  const createRatingDistribution = (count, targetAvg) => {
    const distribution = []
    let sum = 0

    for (let i = 0; i < count - 1; i++) {
      // Generate ratings between 1 and 5, with a bias toward the target average
      let rating
      if (Math.random() < 0.7) {
        // 70% chance of being close to target
        rating = Math.max(1, Math.min(5, Math.round(targetAvg + (Math.random() - 0.5) * 2)))
      } else {
        // 30% chance of being any rating
        rating = Math.floor(Math.random() * 5) + 1
      }

      distribution.push(rating)
      sum += rating
    }

    // Calculate the last rating to achieve the target average
    const lastRating = Math.round((targetAvg * count - sum) * 10) / 10

    // Ensure the last rating is between 1 and 5
    distribution.push(Math.max(1, Math.min(5, Math.round(lastRating))))

    return distribution
  }

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

  const handleCompareToggle = () => {
    if (product) {
      addToCompare(product)
    }
  }

  const handleShareProduct = () => {
    if (navigator.share) {
      navigator
        .share({
          title: product.name,
          text: `Check out ${product.name} on NepBeaute`,
          url: window.location.href,
        })
        .then(() => console.log("Successful share"))
        .catch((error) => console.log("Error sharing:", error))
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => alert("Link copied to clipboard!"))
        .catch((error) => console.error("Could not copy text: ", error))
    }
  }

  const handleReviewSubmit = (newReview) => {
    setReviews([newReview, ...reviews])
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
  const isProductInCompare = isInCompare(product.id)

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
              <button
                className={styles.imageNav}
                onClick={() => setActiveImage((activeImage - 1 + productImages.length) % productImages.length)}
              >
                <ChevronLeft size={20} />
              </button>

              <img src={productImages[activeImage] || "/placeholder.svg"} alt={product.name} />

              <button
                className={styles.imageNav}
                onClick={() => setActiveImage((activeImage + 1) % productImages.length)}
              >
                <ChevronRight size={20} />
              </button>

              {product.isNew && <div className={`${styles.badge} ${styles.newBadge}`}>NEW</div>}
              {discountPercentage > 0 && (
                <div className={`${styles.badge} ${styles.discountBadge}`}>{discountPercentage}% OFF</div>
              )}
            </div>
          </div>

          {/* Product Info */}
          <div className={styles.productInfo}>
            <div className={styles.productBrand}>{product.brand}</div>
            <h1 className={styles.productName}>{product.name}</h1>

            <div className={styles.productMeta}>
              <div className={styles.rating}>
                <div className={styles.ratingStars}>
                  <Star size={14} fill="currentColor" strokeWidth={0} />
                  <span>{product.rating}</span>
                </div>
                <span className={styles.ratingCount}>({product.reviewCount} reviews)</span>
              </div>

              <div className={styles.stockStatus}>
                <span className={styles.inStock}>
                  <Check size={14} />
                  In Stock
                </span>
              </div>
            </div>

            <div className={styles.priceContainer}>
              <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="xlarge" />
            </div>

            <p className={styles.productDescription}>{product.description}</p>

            <div className={styles.divider}></div>

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
                <ShoppingBag size={18} />
                Add to Cart
              </button>

              <button
                className={`${styles.wishlistBtn} ${isProductInWishlist ? styles.active : ""}`}
                onClick={handleWishlistToggle}
                aria-label={isProductInWishlist ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={18} fill={isProductInWishlist ? "currentColor" : "none"} />
              </button>

              <button
                className={`${styles.compareBtn} ${isProductInCompare ? styles.active : ""}`}
                onClick={handleCompareToggle}
                aria-label="Add to compare"
              >
                <BarChart2 size={18} />
              </button>

              <button className={styles.shareBtn} onClick={handleShareProduct} aria-label="Share product">
                <Share2 size={18} />
              </button>
            </div>

            <div className={styles.divider}></div>

            <div className={styles.productDetails}>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>SKU:</span>
                <span className={styles.detailValue}>{product.id}</span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Category:</span>
                <span className={styles.detailValue}>
                  <Link to={`/products/${product.category}`}>{product.category}</Link>
                </span>
              </div>
              <div className={styles.detailItem}>
                <span className={styles.detailLabel}>Brand:</span>
                <span className={styles.detailValue}>
                  <Link to={`/brands/${product.brand}`}>{product.brand}</Link>
                </span>
              </div>
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
                <ReviewList reviews={reviews} productRating={product.rating} />
                <ReviewForm productId={product.id} onReviewSubmit={handleReviewSubmit} />
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

        {/* Recently Viewed Products */}
        <RecentlyViewed />
      </div>
    </div>
  )
}

export default ProductDetailPage
