"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useCart } from "../../contexts/CartContext"
import { useAuth } from "../../contexts/AuthContext"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import styles from "./CheckoutPage.module.css"

// Custom currency hook
const useCurrency = () => {
  const formatPrice = (price) => {
    return `Rs. ${price.toLocaleString()}`;
  };

  return { formatPrice };
};

const CheckoutPage = () => {
  const { cartItems, totalPrice, clearCart } = useCart()
  const { user } = useAuth()
  const navigate = useNavigate()
  const { formatPrice } = useCurrency()

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: "Kathmandu",
    area: "",
    zipCode: "",
    paymentMethod: "cod",
    saveInfo: true,
  })

  const [errors, setErrors] = useState({})
  const [orderPlaced, setOrderPlaced] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [pageLoaded, setPageLoaded] = useState(false)

 
  const subtotal = totalPrice || 0
  const deliveryFee = subtotal > 2000 ? 0 : 100 
  const total = subtotal + deliveryFee

  useEffect(() => {
  
    const timer = setTimeout(() => {
      setPageLoaded(true)
      if (cartItems.length === 0 && !orderPlaced) {
        navigate("/cart")
      }
    }, 100)
    
    return () => clearTimeout(timer)
  }, [cartItems, orderPlaced, navigate])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))


    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^9\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Phone number should be 10 digits starting with 9"
    }
    if (!formData.address.trim()) newErrors.address = "Address is required"
    if (!formData.city.trim()) newErrors.city = "City is required"
    if (!formData.area.trim()) newErrors.area = "Area is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const saveOrderToLocalStorage = () => {
    if (!user) return;
    
    
    const orderId = "ORD" + Math.floor(100000 + Math.random() * 900000);
    
  
    const newOrder = {
      id: orderId,
      date: new Date().toISOString(),
      status: "Processing",
      total: total,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        image: item.image
      })),
      paymentMethod: formData.paymentMethod === "cod" ? "Cash on Delivery" : 
                     formData.paymentMethod === "khalti" ? "Khalti" : "eSewa",
      shippingAddress: {
        name: `${formData.firstName} ${formData.lastName}`,
        street: `${formData.address}, ${formData.area}`,
        city: formData.city,
        state: "Bagmati",
        zip: formData.zipCode || "44600",
        country: "Nepal",
        phone: formData.phone
      },
      estimatedDelivery: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };
    
  
    let orders = [];
    const existingOrders = localStorage.getItem(`orders-${user.id}`);
    
    if (existingOrders) {
      try {
        orders = JSON.parse(existingOrders);
      } catch (error) {
        console.error("Error parsing existing orders:", error);
        orders = [];
      }
    }
    
   
    orders.unshift(newOrder);
    
    
    localStorage.setItem(`orders-${user.id}`, JSON.stringify(orders));
    
    return orderId;
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsProcessing(true)
    toast.info("Processing your order...")

    
    const orderId = saveOrderToLocalStorage();

    
    setTimeout(() => {
      setOrderPlaced(true)
      clearCart()
      toast.success(`Order #${orderId} placed successfully!`)

   
      setTimeout(() => {
        navigate("/profile")
      }, 3000)
    }, 2000)
  }

 
  if (!pageLoaded) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading checkout...</p>
      </div>
    )
  }

  
  if (orderPlaced) {
    return (
      <div className={styles.orderSuccess}>
        <ToastContainer position="top-right" autoClose={3000} />
        <div className={styles.container}>
          <div className={styles.successContent}>
            <div className={styles.successIcon}>
              <i className="fas fa-check-circle"></i>
            </div>
            <h1>Order Placed Successfully!</h1>
            <p>Thank you for your purchase. Your order has been received and is being processed.</p>
            <p>You will receive a confirmation email shortly.</p>
            <p>Redirecting to your profile page...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.checkoutPage}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>Checkout</h1>

        <div className={`${styles.checkoutContent} ${pageLoaded ? styles.loaded : ''}`}>
          <div className={styles.checkoutForm}>
            <form onSubmit={handleSubmit}>
              <div className={styles.formSection}>
                <h2>Contact Information</h2>
                <div className={styles.formGrid}>
                  <div className={styles.formGroup}>
                    <label htmlFor="firstName">First Name *</label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className={errors.firstName ? styles.errorInput : ""}
                    />
                    {errors.firstName && <span className={styles.errorMessage}>{errors.firstName}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="lastName">Last Name *</label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className={errors.lastName ? styles.errorInput : ""}
                    />
                    {errors.lastName && <span className={styles.errorMessage}>{errors.lastName}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="email">Email *</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={errors.email ? styles.errorInput : ""}
                    />
                    {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="phone">Phone Number *</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="9XXXXXXXXX"
                      className={errors.phone ? styles.errorInput : ""}
                    />
                    {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
                  </div>
                </div>
              </div>

              <div className={styles.formSection}>
                <h2>Shipping Address</h2>
                <div className={styles.formGrid}>
                  <div className={`${styles.formGroup} ${styles.fullWidth}`}>
                    <label htmlFor="address">Street Address *</label>
                    <input
                      type="text"
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      className={errors.address ? styles.errorInput : ""}
                    />
                    {errors.address && <span className={styles.errorMessage}>{errors.address}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="city">City *</label>
                    <select
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className={errors.city ? styles.errorInput : ""}
                    >
                      <option value="Kathmandu">Kathmandu</option>
                      <option value="Lalitpur">Lalitpur</option>
                      <option value="Bhaktapur">Bhaktapur</option>
                      <option value="Pokhara">Pokhara</option>
                      <option value="Biratnagar">Biratnagar</option>
                      <option value="Birgunj">Birgunj</option>
                    </select>
                    {errors.city && <span className={styles.errorMessage}>{errors.city}</span>}
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="area">Area/Tole *</label>
                    <input
                      type="text"
                      id="area"
                      name="area"
                      value={formData.area}
                      onChange={handleInputChange}
                      className={errors.area ? styles.errorInput : ""}
                    />
                    {errors.area && <span className={styles.errorMessage}>{errors.area}</span>}
                  </div>

                 
                </div>
              </div>

              <div className={styles.formSection}>
                <h2>Payment Method</h2>
                <div className={styles.paymentOptions}>
                  <label className={styles.paymentOption}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="cod"
                      checked={formData.paymentMethod === "cod"}
                      onChange={handleInputChange}
                    />
                    <div className={styles.paymentOptionContent}>
                      <img src="https://cdn-icons-png.flaticon.com/512/1554/1554401.png" alt="Cash on Delivery" />
                      <div>
                        <h3>Cash on Delivery</h3>
                        <p>Pay when you receive your order</p>
                      </div>
                    </div>
                  </label>

                  <label className={styles.paymentOption}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="khalti"
                      checked={formData.paymentMethod === "khalti"}
                      onChange={handleInputChange}
                    />
                    
                  </label>

                  <label className={styles.paymentOption}>
                    <input
                      type="radio"
                      name="paymentMethod"
                      value="esewa"
                      checked={formData.paymentMethod === "esewa"}
                      onChange={handleInputChange}
                    />
                    <div className={styles.paymentOptionContent}>
                      <img src="https://esewa.com.np/common/images/esewa_logo.png" alt="eSewa" />
                      <div>
                        <h3>eSewa</h3>
                        <p>Pay using eSewa digital wallet</p>
                      </div>
                    </div>
                  </label>
                </div>

                <div className={styles.saveInfoCheckbox}>
                  <label>
                    <input type="checkbox" name="saveInfo" checked={formData.saveInfo} onChange={handleInputChange} />
                    <span>Save this information for next time</span>
                  </label>
                </div>
              </div>

              <button type="submit" className={styles.placeOrderBtn} disabled={isProcessing}>
                {isProcessing ? "Processing..." : "Place Order"}
              </button>
            </form>
          </div>

          <div className={styles.orderSummary}>
            <h2>Order Summary</h2>

            <div className={styles.orderItems}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.orderItem}>
                  <div className={styles.itemInfo}>
                    <img src={item.image || "/placeholder.svg"} alt={item.name} />
                    <div>
                      <h3>{item.name}</h3>
                      <p>Quantity: {item.quantity}</p>
                    </div>
                  </div>
                  <div className={styles.itemPrice}>{formatPrice(item.price * item.quantity)}</div>
                </div>
              ))}
            </div>

            <div className={styles.orderTotal}>
              <div className={styles.totalItem}>
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>

              <div className={styles.totalItem}>
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? "Free" : `${formatPrice(deliveryFee)}`}</span>
              </div>

              <div className={`${styles.totalItem} ${styles.finalTotal}`}>
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CheckoutPage