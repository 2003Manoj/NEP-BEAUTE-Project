"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate, useParams, useLocation } from "react-router-dom"
import { useCart } from "../../contexts/CartContext"
import { useWishlist } from "../../contexts/WishlistContext"
import { X, Heart, ShoppingBag, Star, ChevronLeft, ChevronRight } from "lucide-react"
import styles from "./QuickViewPage.module.css"

const QuickViewPage = () => {
  const [product, setProduct] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const navigate = useNavigate()
  const location = useLocation()
  const params = useParams()

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true)
        
        
        if (location.state?.product) {
          console.log("Product found in location state:", location.state.product)
          setProduct(location.state.product)
          return
        }
        
      
        const storedProduct = localStorage.getItem("quickViewProduct")
        if (storedProduct) {
          console.log("Product found in localStorage")
          setProduct(JSON.parse(storedProduct))
          return
        }
        
       
        if (params.id) {
          console.log("Trying to fetch product by ID:", params.id)
        
          const storedProducts = localStorage.getItem("products")
          if (storedProducts) {
            const allProducts = JSON.parse(storedProducts)
            const foundProduct = allProducts.find(p => p.id === params.id)
            if (foundProduct) {
              setProduct(foundProduct)
              return
            }
          }
        }
        
        
        setError("Product not found")
        
      } catch (err) {
        console.error("Error loading product:", err)
        setError("Error loading product data")
      } finally {
        setLoading(false)
      }
    }

    fetchProduct()
  }, [location.state, params.id])

  
  useEffect(() => {
    console.log("QuickViewPage mounted")
    console.log("Current product state:", product)
    console.log("Loading state:", loading)
    console.log("Error state:", error)
    
    return () => {
      console.log("QuickViewPage unmounted")
    }
  }, [product, loading, error])

  
  const generateAdditionalImages = (originalUrl) => {
    if (!originalUrl) return ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]

    
    const [baseUrl, queryParams] = originalUrl.split("?")

    
    return [
      originalUrl,
      `${baseUrl}?${queryParams ? queryParams + "&" : ""}v=1`,
      `${baseUrl}?${queryParams ? queryParams + "&" : ""}v=2`,
    ]
  }

  const productImages = product ? generateAdditionalImages(product.image) : []

  const handleAddToCart = () => {
    if (product) {
      const success = addToCart(product, quantity)
      console.log("Add to cart result:", success)

      // Navigate back to previous page after adding to cart
      navigate(-1)
    }
  }

  const handleWishlistToggle = () => {
    if (!product) return

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      const success = addToWishlist(product)
      console.log("Add to wishlist result:", success)
    }
  }

  const decreaseQuantity = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1)
    }
  }

  const increaseQuantity = () => {
    setQuantity(quantity + 1)
  }

  const nextImage = () => {
    setActiveImage((prev) => (prev + 1) % productImages.length)
  }

  const prevImage = () => {
    setActiveImage((prev) => (prev - 1 + productImages.length) % productImages.length)
  }

  // Calculate discount percentage
  const discountPercentage = product?.originalPrice && product?.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  console.log("Rendering QuickViewPage with product:", product)

  // If loading, show loading spinner
  if (loading) {
    return (
      <div className={styles.quickViewPage}>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}></div>
          <p>Loading product...</p>
        </div>
      </div>
    )
  }

  // If error or no product, show error message
  if (error || !product) {
    return (
      <div className={styles.quickViewPage}>
        <div className={styles.errorContainer}>
          <p>{error || "Product not found"}</p>
          <button className={styles.backButton} onClick={() => navigate(-1)}>
            Go Back
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.quickViewPage} style={{ margin: '20px auto', padding: '20px' }}>
      <button className={styles.closeButton} onClick={() => navigate(-1)} aria-label="Close">
        <X size={20} />
      </button>

      <div className={styles.productContent}>
        <div className={styles.productImages}>
          <div className={styles.mainImage}>
            <button className={styles.imageNav} onClick={prevImage} aria-label="Previous image">
              <ChevronLeft size={20} />
            </button>

            <img src={productImages[activeImage] || "/placeholder.svg"} alt={product.name} />

            <button className={styles.imageNav} onClick={nextImage} aria-label="Next image">
              <ChevronRight size={20} />
            </button>

            {discountPercentage > 0 && <div className={styles.discountBadge}>{discountPercentage}% OFF</div>}
          </div>

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
        </div>

        <div className={styles.productInfo}>
          <div className={styles.brandName}>{product.brand}</div>
          <h1 className={styles.productName}>{product.name}</h1>

         

          <div className={styles.priceContainer}>
            <span className={styles.price}>${product.price?.toFixed(2) || "0.00"}</span>
            {product.originalPrice && (
              <span className={styles.originalPrice}>${product.originalPrice.toFixed(2)}</span>
            )}
          </div>

          <div className={styles.description}>
            <p>{product.description}</p>
          </div>

          <div className={styles.actions}>
            <div className={styles.quantitySelector}>
              <button onClick={decreaseQuantity} aria-label="Decrease quantity">
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                aria-label="Quantity"
              />
              <button onClick={increaseQuantity} aria-label="Increase quantity">
                +
              </button>
            </div>

            <button className={styles.addToCartBtn} onClick={handleAddToCart}>
              <ShoppingBag size={18} />
              <span>Add to Cart</span>
            </button>

            <button
              className={`${styles.wishlistBtn} ${isInWishlist?.(product.id) ? styles.active : ""}`}
              onClick={handleWishlistToggle}
              aria-label={isInWishlist?.(product.id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={18} fill={isInWishlist?.(product.id) ? "currentColor" : "none"} />
            </button>
          </div>

          <Link
            to={`/product/${product.id}`}
            className={styles.viewDetailsLink}
          >
            View Full Details
          </Link>
        </div>
      </div>
    </div>
  )
}

export default QuickViewPage