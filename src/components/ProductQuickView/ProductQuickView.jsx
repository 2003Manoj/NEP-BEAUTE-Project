"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../../contexts/CartContext"
import { useWishlist } from "../../contexts/WishlistContext"
import { X, Heart, ShoppingBag, Star, ChevronLeft, ChevronRight } from "lucide-react"
import styles from "./ProductQuickView.module.css"

const ProductQuickView = ({ product, onClose }) => {
  const [quantity, setQuantity] = useState(1)
  const [activeImage, setActiveImage] = useState(0)
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()

  // Mock product images
  const productImages = [
    product.image,
    `https://source.unsplash.com/random/600x800/?${product.category},beauty,1`,
    `https://source.unsplash.com/random/600x800/?${product.category},beauty,2`,
  ]

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
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeButton} onClick={onClose}>
          <X size={20} />
        </button>

        <div className={styles.modalContent}>
          <div className={styles.productImages}>
            <div className={styles.mainImage}>
              <button className={styles.imageNav} onClick={prevImage}>
                <ChevronLeft size={20} />
              </button>

              <img src={productImages[activeImage] || "/placeholder.svg"} alt={product.name} />

              <button className={styles.imageNav} onClick={nextImage}>
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

            <div className={styles.rating}>
              <div className={styles.ratingStars}>
                <Star size={14} fill="currentColor" strokeWidth={0} />
                <span>{product.rating}</span>
              </div>
              <span className={styles.ratingCount}>({product.reviewCount} reviews)</span>
            </div>

            <div className={styles.priceContainer}>
              <span className={styles.price}>Rs. {product.price.toLocaleString()}</span>
              {product.originalPrice && (
                <span className={styles.originalPrice}>Rs. {product.originalPrice.toLocaleString()}</span>
              )}
            </div>

            <div className={styles.description}>
              <p>{product.description}</p>
            </div>

            <div className={styles.actions}>
              <div className={styles.quantitySelector}>
                <button onClick={decreaseQuantity}>-</button>
                <input
                  type="number"
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, Number.parseInt(e.target.value) || 1))}
                />
                <button onClick={increaseQuantity}>+</button>
              </div>

              <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                <ShoppingBag size={18} />
                <span>Add to Cart</span>
              </button>

              <button
                className={`${styles.wishlistBtn} ${isInWishlist(product.id) ? styles.active : ""}`}
                onClick={handleWishlistToggle}
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
