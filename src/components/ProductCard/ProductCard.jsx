"use client"
import { useState } from "react"
import { Link } from "react-router-dom"
import { useCart } from "../../contexts/CartContext"
import { useWishlist } from "../../contexts/WishlistContext"
import { useAuth } from "../../contexts/AuthContext"
import { useNavigate } from "react-router-dom"
import { Heart, ShoppingBag, Eye, Star, Award, TrendingUp } from "lucide-react"
import styles from "./ProductCard.module.css"

import ProductQuickView from "../ProductQuickView/ProductQuickView"

const ProductCard = ({ product, horizontal = false }) => {
  const { addToCart } = useCart()
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isHovered, setIsHovered] = useState(false)
  const [showQuickView, setShowQuickView] = useState(false)

  const handleAddToCart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    addToCart(product, 1)
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
    } else {
      addToWishlist(product)
    }
  }

  const handleQuickView = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setShowQuickView(true)
  }

  // Calculate discount percentage
  const discountPercentage = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0

  return (
    <>
      <div
        className={`${styles.productCard} ${horizontal ? styles.horizontal : ""}`}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <Link to={`/product/${product.id}`} className={styles.productLink}>
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

      {showQuickView && <ProductQuickView product={product} onClose={() => setShowQuickView(false)} />}
    </>
  )
}

export default ProductCard
