"use client"
import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../../contexts/CartContext"
import { useWishlist } from "../../contexts/WishlistContext"
import { useAuth } from "../../contexts/AuthContext"
import { Heart, ShoppingBag, Eye, Star, Award, TrendingUp } from "lucide-react"
import { toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import styles from "./ProductCard.module.css"
import PriceDisplay from "../PriceDisplay/PriceDisplay"

const ProductCard = ({ product, horizontal = false, onQuickView }) => {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    const success = addToCart(product, 1)
    if (success) {
      toast.success(`${product.name} added to cart!`)
    }
  }

  const handleWishlistToggle = (e) => {
    e.preventDefault()
    e.stopPropagation()

    if (!user) {
      navigate("/login")
      return
    }

    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id)
      toast.info(`${product.name} removed from wishlist`)
    } else {
      const success = addToWishlist(product)
      if (success) {
        toast.success(`${product.name} added to wishlist!`)
      }
    }
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()

    console.log("Quick view clicked for product:", product)

    // Directly call the onQuickView function with the product
    if (typeof onQuickView === "function") {
      onQuickView(product)
    } else {
      console.error("onQuickView is not a function or not provided")
      // Fallback to the old method if onQuickView is not available
      localStorage.setItem("quickViewProduct", JSON.stringify(product))
      navigate("/quick-view")
    }
  }

  // Calculate discount percentage
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <div
      className={`${styles.productCard} ${horizontal ? styles.horizontal : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/product/${product.id}`} className={styles.productLink} onClick={(e) => e.stopPropagation()}>
        <div className={styles.imageContainer}>
          <img src={product.image || "/placeholder.svg"} alt={product.name} className={styles.productImage} />

          {product.isNew && (
            <div className={`${styles.badge} ${styles.newBadge}`}>
              <Award size={14} />
              <span>NEW</span>
            </div>
          )}

          {product.bestSeller && (
            <div className={`${styles.badge} ${styles.bestsellerBadge}`}>
              <TrendingUp size={14} />
              <span>BESTSELLER</span>
            </div>
          )}

          {discountPercentage > 0 && (
            <div className={`${styles.badge} ${styles.discountBadge}`}>{discountPercentage}% OFF</div>
          )}

          <div className={`${styles.actions} ${isHovered ? styles.visible : ""}`}>
            <button className={styles.actionButton} onClick={handleAddToCart} aria-label="Add to cart">
              <ShoppingBag size={18} />
              <span className={styles.actionTooltip}>Add to Cart</span>
            </button>

            <button
              className={`${styles.actionButton} ${isInWishlist(product.id) ? styles.active : ""}`}
              onClick={handleWishlistToggle}
              aria-label={isInWishlist(product.id) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={18} fill={isInWishlist(product.id) ? "currentColor" : "none"} />
              <span className={styles.actionTooltip}>
                {isInWishlist(product.id) ? "Remove from Wishlist" : "Add to Wishlist"}
              </span>
            </button>

            <button className={styles.actionButton} onClick={handleQuickView} aria-label="Quick view">
              <Eye size={18} />
              <span className={styles.actionTooltip}>Quick View</span>
            </button>
          </div>
        </div>

        <div className={styles.productInfo}>
          <div className={styles.brandName}>{product.brand}</div>
          <h3 className={styles.productName}>{product.name}</h3>

          <div className={styles.productMeta}>
            <div className={styles.rating}>
              <div className={styles.ratingStars}>
                <Star size={14} fill="currentColor" strokeWidth={0} />
                <span>{product.rating}</span>
              </div>
              <span className={styles.ratingCount}>({product.reviewCount})</span>
            </div>

            <div className={styles.priceContainer}>
              <PriceDisplay price={product.price} originalPrice={product.originalPrice} size="small" />
            </div>
          </div>

          {horizontal && (
            <div className={styles.productDescription}>
              <p>{product.description}</p>
              <button className={styles.addToCartBtn} onClick={handleAddToCart}>
                <ShoppingBag size={16} />
                <span>Add to Cart</span>
              </button>
            </div>
          )}
        </div>
      </Link>
    </div>
  )
}

export default ProductCard
