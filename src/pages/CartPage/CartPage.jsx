"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../../contexts/CartContext"
import styles from "./CartPage.module.css"

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, totalPrice } = useCart()
  const [couponCode, setCouponCode] = useState("")
  const [couponApplied, setCouponApplied] = useState(false)
  const [discount, setDiscount] = useState(0)
  const navigate = useNavigate()

  const handleQuantityChange = (productId, quantity) => {
    updateQuantity(productId, Number.parseInt(quantity))
  }

  const handleRemoveItem = (productId) => {
    removeFromCart(productId)
  }

  const handleApplyCoupon = (e) => {
    e.preventDefault()

    // Mock coupon validation
    if (couponCode.toLowerCase() === "nepbeaute20") {
      setDiscount(totalPrice * 0.2) // 20% discount
      setCouponApplied(true)
    } else {
      alert("Invalid coupon code")
    }
  }

  const handleProceedToCheckout = () => {
    navigate("/checkout")
  }

  // Calculate totals
  const subtotal = totalPrice
  const deliveryFee = subtotal > 2000 ? 0 : 100 // Free delivery for orders over Rs. 2000
  const total = subtotal + deliveryFee - discount

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <div className={styles.container}>
          <div className={styles.emptyCartContent}>
            <i className="fas fa-shopping-cart"></i>
            <h2>Your cart is empty</h2>
            <p>Looks like you haven't added any products to your cart yet.</p>
            <Link to="/products" className={styles.continueShoppingBtn}>
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.cartPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Shopping Cart</h1>

        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            <div className={styles.cartHeader}>
              <div className={styles.productCol}>Product</div>
              <div className={styles.priceCol}>Price</div>
              <div className={styles.quantityCol}>Quantity</div>
              <div className={styles.totalCol}>Total</div>
              <div className={styles.actionCol}></div>
            </div>

            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.productCol}>
                  <div className={styles.productInfo}>
                    <img src={item.image || "/placeholder.svg"} alt={item.name} />
                    <div>
                      <h3>{item.name}</h3>
                      <p className={styles.productCategory}>{item.category}</p>
                    </div>
                  </div>
                </div>

                <div className={styles.priceCol}>
                  <span>Rs. {item.price.toLocaleString()}</span>
                </div>

                <div className={styles.quantityCol}>
                  <div className={styles.quantitySelector}>
                    <button
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                    />
                    <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>+</button>
                  </div>
                </div>

                <div className={styles.totalCol}>
                  <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>

                <div className={styles.actionCol}>
                  <button className={styles.removeBtn} onClick={() => handleRemoveItem(item.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </div>
              </div>
            ))}

            <div className={styles.cartActions}>
              <Link to="/products" className={styles.continueShoppingBtn}>
                <i className="fas fa-arrow-left"></i> Continue Shopping
              </Link>
            </div>
          </div>

          <div className={styles.cartSummary}>
            <h2>Order Summary</h2>

            <div className={styles.summaryItem}>
              <span>Subtotal</span>
              <span>Rs. {subtotal.toLocaleString()}</span>
            </div>

            <div className={styles.summaryItem}>
              <span>Delivery Fee</span>
              <span>{deliveryFee === 0 ? "Free" : `Rs. ${deliveryFee.toLocaleString()}`}</span>
            </div>

            {couponApplied && (
              <div className={`${styles.summaryItem} ${styles.discount}`}>
                <span>Discount</span>
                <span>- Rs. {discount.toLocaleString()}</span>
              </div>
            )}

            <div className={styles.summaryTotal}>
              <span>Total</span>
              <span>Rs. {total.toLocaleString()}</span>
            </div>

            <form className={styles.couponForm} onSubmit={handleApplyCoupon}>
              <input
                type="text"
                placeholder="Enter coupon code"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                disabled={couponApplied}
              />
              <button type="submit" disabled={couponApplied || !couponCode}>
                Apply
              </button>
            </form>

            {couponApplied && (
              <div className={styles.couponApplied}>
                <i className="fas fa-check-circle"></i>
                <span>Coupon applied successfully!</span>
              </div>
            )}

            <button className={styles.checkoutBtn} onClick={handleProceedToCheckout}>
              Proceed to Checkout
            </button>

            <div className={styles.paymentMethods}>
              <p>We Accept:</p>
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
      </div>
    </div>
  )
}

export default CartPage
