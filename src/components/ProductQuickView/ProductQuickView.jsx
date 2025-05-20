"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../../contexts/CartContext"
import { useWishlist } from "../../contexts/WishlistContext"
import { X, Heart, ShoppingBag, Star, ChevronLeft, ChevronRight } from "lucide-react"
import styles from "./ProductQuickView.module.css"
import PriceDisplay from "../PriceDisplay/PriceDisplay"

const ProductQuickView = ({ product, onClose }) => {
  console.log("Rendering ProductQuickView with product:", product)

  // Safety check - if product is undefined, return null
  if (!product) {
    console.error("ProductQuickView received undefined product")
    return null
  }

  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  // Generate additional images by adding query parameters to the original URL
  const generateAdditionalImages = (originalUrl) => {
    if (!originalUrl) return ["/placeholder.svg", "/placeholder.svg", "/placeholder.svg"]

    // Extract base URL and query parameters
    const [baseUrl, queryParams] = originalUrl.split("?")

    // Create variations by adding different query parameters
    return [
      originalUrl,
      `${baseUrl}?${queryParams ? queryParams + "&" : ""}v=1`,
      `${baseUrl}?${queryParams ? queryParams + "&" : ""}v=2`,
    ]
  }

  // Use the product's actual image and generate variations
  const productImages = generateAdditionalImages(product?.image)

  useEffect(() => {
    // Prevent body scroll when modal is open
    document.body.style.overflow = "hidden"

    // Cleanup function
    return () => {
      document.body.style.overflow = "auto"
    }
  }, [])

  const handleAddToCart = () => {
    addToCart(product, quantity)
    onClose()
  }

  const handleWishlistToggle = () => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
    } else {
      addToWishlist(product)
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
  const discountPercentage = product?.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div
      className={styles.overlay}
      onClick={(e) => {
        // Only close if clicking directly on the overlay, not its children
        if (e.target === e.currentTarget) {
          onClose()
        }
      }}
    >
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose} aria-label="Close">
          <X size={20} />
        </button>

        <div className={styles.modalContent}>
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
            <h2 className={styles.productName}>{product.name}</h2>

            

            <div className={styles.priceContainer}>
              <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="large" />
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
                className={`${styles.wishlistBtn} ${isInWishlist(product.id) ? styles.active : ""}`}
                onClick={handleWishlistToggle}
                aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
              >
                <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
              </button>
            </div>

            <Link to={`/product/${product.id}`} className={styles.viewDetailsLink}>
              View Full Details
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductQuickView
