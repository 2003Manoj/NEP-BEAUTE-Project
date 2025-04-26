"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../../contexts/CartContext"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
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
    // Using toastify for confirmation instead of window.confirm
    const toastId = toast.info(
      <div>
        <p>Are you sure you want to remove this item from your cart?</p>
        <button 
          onClick={() => {
            // First dismiss the confirmation toast
            toast.dismiss(toastId)
            // Then remove the item and show success message
            removeFromCart(productId)
            toast.success("Item removed from cart")
          }}
          style={{ marginRight: '10px', padding: '5px 10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Yes, Remove
        </button>
        <button 
          onClick={() => toast.dismiss(toastId)}
          style={{ padding: '5px 10px', background: '#7f8c8d', color: 'white', border: 'none', borderRadius: '4px' }}
        >
          Cancel
        </button>
      </div>,
      {
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false
      }
    )
  }

  const handleApplyCoupon = (e) => {
    e.preventDefault()

    if (couponCode.toLowerCase() === "nepbeaute20") {
      setDiscount(totalPrice * 0.2) 
      setCouponApplied(true)
      toast.success("Coupon applied successfully! 20% discount added to your order.")
    } else {
      toast.error("Invalid coupon code. Please try again.")
    }
  }

  const handleProceedToCheckout = () => {
    navigate("/checkout")
  }

  const subtotal = totalPrice
  const deliveryFee = subtotal > 2000 ? 0 : 100 
  const total = subtotal + deliveryFee - discount

  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyCart}>
        <ToastContainer 
          position="bottom-right" 
          autoClose={3000} 
          hideProgressBar={false} 
          newestOnTop
          closeOnClick
          pauseOnHover
          draggable
          style={{ zIndex: 9999 }}
        />
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
      {/* Toast container with fixed position and high z-index */}
      <ToastContainer 
        position="bottom-right" 
        autoClose={3000} 
        hideProgressBar={false} 
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        style={{ zIndex: 9999 }}
      />
      
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Shopping Cart</h1>

        <div className={styles.cartContent}>
          <div className={styles.cartItems}>
            <div className={styles.cartHeader}>
              <div className={styles.productCol}>Product</div>
              <div className={styles.priceCol}>Price</div>
              <div className={styles.quantityCol}>Quantity</div>
              <div className={styles.totalCol}>Total</div>
              <div className={styles.actionCol}>Actions</div>
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
                      onClick={() => {
                        if (item.quantity > 1) {
                          handleQuantityChange(item.id, item.quantity - 1)
                          toast.info(`Quantity updated to ${item.quantity - 1}`)
                        }
                      }}
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <input
                      type="number"
                      min="1"
                      value={item.quantity}
                      onChange={(e) => {
                        const newQty = Number.parseInt(e.target.value) || 1
                        handleQuantityChange(item.id, newQty)
                        toast.info(`Quantity updated to ${newQty}`)
                      }}
                    />
                    <button onClick={() => {
                      handleQuantityChange(item.id, item.quantity + 1)
                      toast.info(`Quantity updated to ${item.quantity + 1}`)
                    }}>+</button>
                  </div>
                </div>

                <div className={styles.totalCol}>
                  <span>Rs. {(item.price * item.quantity).toLocaleString()}</span>
                </div>

                <div className={styles.actionCol}>
                  <button 
                    className={styles.removeBtn} 
                    onClick={() => handleRemoveItem(item.id)}
                    aria-label="Remove item"
                    title="Remove item"
                  >
                    <i className="fas fa-trash"></i> Remove
                  </button>
                </div>
              </div>
            ))}

            <div className={styles.cartActions}>
              <Link to="/products" className={styles.continueShoppingBtn}>
                <i className="fas fa-arrow-left"></i> Continue Shopping
              </Link>
              <button 
                className={styles.clearCartBtn}
                onClick={() => {
                  const clearToastId = toast.info(
                    <div>
                      <p>Are you sure you want to clear your entire cart?</p>
                      <button 
                        onClick={() => {
                          // First dismiss this confirmation toast
                          toast.dismiss(clearToastId)
                          // Then clear the cart and show success message
                          cartItems.forEach(item => removeFromCart(item.id));
                          toast.success("Cart cleared successfully!")
                        }}
                        style={{ marginRight: '10px', padding: '5px 10px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '4px' }}
                      >
                        Yes, Clear Cart
                      </button>
                      <button 
                        onClick={() => toast.dismiss(clearToastId)}
                        style={{ padding: '5px 10px', background: '#7f8c8d', color: 'white', border: 'none', borderRadius: '4px' }}
                      >
                        Cancel
                      </button>
                    </div>,
                    {
                      autoClose: false,
                      closeOnClick: false,
                      draggable: false,
                      closeButton: false
                    }
                  )
                }}
              >
                <i className="fas fa-trash-alt"></i> Clear Cart
              </button>
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

            <button 
              className={styles.checkoutBtn} 
              onClick={() => {
                handleProceedToCheckout()
                toast.success("Proceeding to checkout!")
              }}
            >
              Proceed to Checkout
            </button>

            <div className={styles.paymentMethods}>
              <p>We Accept:</p>
              <div className={styles.paymentIcons}>
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