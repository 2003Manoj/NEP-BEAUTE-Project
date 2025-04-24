"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useWishlist } from "../../contexts/WishlistContext"
import { useCart } from "../../contexts/CartContext"
import { useAuth } from "../../contexts/AuthContext"
import styles from "./WishlistPage.module.css"

const WishlistPage = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist } = useWishlist()
  const { addToCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [selectedItems, setSelectedItems] = useState([])
  const [selectAll, setSelectAll] = useState(false)

  // Redirect to login if not authenticated
  if (!user) {
    navigate("/login")
    return null
  }

  const handleRemoveItem = (productId) => {
    removeFromWishlist(productId)
    setSelectedItems(selectedItems.filter((id) => id !== productId))
  }

  const handleAddToCart = (product) => {
    addToCart(product, 1)
  }

  const handleAddAllToCart = () => {
    selectedItems.forEach((productId) => {
      const product = wishlistItems.find((item) => item.id === productId)
      if (product) {
        addToCart(product, 1)
      }
    })
  }

  const handleRemoveSelected = () => {
    selectedItems.forEach((productId) => {
      removeFromWishlist(productId)
    })
    setSelectedItems([])
  }

  const handleSelectItem = (productId) => {
    if (selectedItems.includes(productId)) {
      setSelectedItems(selectedItems.filter((id) => id !== productId))
    } else {
      setSelectedItems([...selectedItems, productId])
    }
  }

  const handleSelectAll = () => {
    if (selectAll) {
      setSelectedItems([])
    } else {
      setSelectedItems(wishlistItems.map((item) => item.id))
    }
    setSelectAll(!selectAll)
  }

  return (
    <div className={styles.wishlistPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>My Wishlist</h1>

        {wishlistItems.length === 0 ? (
          <div className={styles.emptyWishlist}>
            <div className={styles.emptyWishlistContent}>
              <i className="far fa-heart"></i>
              <h2>Your wishlist is empty</h2>
              <p>Add items you love to your wishlist. Review them anytime and easily move them to the cart.</p>
              <Link to="/products" className={styles.continueShoppingBtn}>
                Continue Shopping
              </Link>
            </div>
          </div>
        ) : (
          <div className={styles.wishlistContent}>
            <div className={styles.wishlistActions}>
              <div className={styles.selectAllContainer}>
                <label className={styles.selectAllLabel}>
                  <input type="checkbox" checked={selectAll} onChange={handleSelectAll} />
                  <span>Select All Items ({wishlistItems.length})</span>
                </label>
              </div>
              <div className={styles.bulkActions}>
                <button
                  className={styles.addSelectedBtn}
                  onClick={handleAddAllToCart}
                  disabled={selectedItems.length === 0}
                >
                  <i className="fas fa-shopping-cart"></i> Add Selected to Cart
                </button>
                <button
                  className={styles.removeSelectedBtn}
                  onClick={handleRemoveSelected}
                  disabled={selectedItems.length === 0}
                >
                  <i className="fas fa-trash"></i> Remove Selected
                </button>
              </div>
            </div>

            <div className={styles.wishlistItems}>
              {wishlistItems.map((item) => (
                <div key={item.id} className={styles.wishlistItem}>
                  <div className={styles.itemCheckbox}>
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(item.id)}
                      onChange={() => handleSelectItem(item.id)}
                    />
                  </div>
                  <div className={styles.itemImage}>
                    <img src={item.image || "/placeholder.svg"} alt={item.name} />
                  </div>
                  <div className={styles.itemInfo}>
                    <Link to={`/product/${item.id}`} className={styles.itemName}>
                      {item.name}
                    </Link>
                    <div className={styles.itemCategory}>{item.category}</div>
                    <div className={styles.itemRating}>
                      {[...Array(5)].map((_, i) => (
                        <i key={i} className={`fas fa-star ${i < item.rating ? styles.filled : styles.empty}`}></i>
                      ))}
                      <span>({item.reviewCount})</span>
                    </div>
                  </div>
                  <div className={styles.itemPrice}>
                    <div className={styles.currentPrice}>Rs. {item.price.toLocaleString()}</div>
                    {item.originalPrice && (
                      <div className={styles.originalPrice}>Rs. {item.originalPrice.toLocaleString()}</div>
                    )}
                  </div>
                  <div className={styles.itemActions}>
                    <button className={styles.addToCartBtn} onClick={() => handleAddToCart(item)}>
                      <i className="fas fa-shopping-cart"></i> Add to Cart
                    </button>
                    <button className={styles.removeBtn} onClick={() => handleRemoveItem(item.id)}>
                      <i className="fas fa-trash"></i> Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.wishlistFooter}>
              <Link to="/products" className={styles.continueShoppingBtn}>
                <i className="fas fa-arrow-left"></i> Continue Shopping
              </Link>
              <button className={styles.clearWishlistBtn} onClick={clearWishlist}>
                <i className="fas fa-trash"></i> Clear Wishlist
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default WishlistPage
