"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { X, Loader } from "lucide-react"
import styles from "./OrdersPage.module.css"

const OrdersPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }

    // Fetch user orders
    const fetchOrders = async () => {
      setLoading(true)
      try {
        // Get orders from localStorage
        const userOrdersJSON = localStorage.getItem(`orders-${user.id}`)
        console.log("User orders from localStorage:", userOrdersJSON)

        if (userOrdersJSON) {
          const userOrders = JSON.parse(userOrdersJSON)
          console.log("Parsed user orders:", userOrders)
          setOrders(userOrders)
        } else {
          // If no orders exist yet, create an empty array
          console.log("No orders found for user:", user.id)
          setOrders([])
        }

        setError(null)
      } catch (err) {
        console.error("Error fetching orders:", err)
        setError("Failed to load your orders. Please try again later.")
      } finally {
        setLoading(false)
      }
    }

    fetchOrders()
  }, [user, navigate])

  const filteredOrders =
    activeTab === "all"
      ? orders
      : orders.filter((order) => {
          if (activeTab === "delivered") return order.status === "Delivered"
          if (activeTab === "processing") return order.status === "Processing"
          if (activeTab === "cancelled") return order.status === "Cancelled"
          return true
        })

  if (!user) {
    return null
  }

  const handleViewDetails = (order) => {
    setSelectedOrder(order)
    setShowOrderDetails(true)
  }

  const closeOrderDetails = () => {
    setShowOrderDetails(false)
    setSelectedOrder(null)
  }

  const handleCancelOrder = async (orderId) => {
    try {
      setLoading(true)

      // In a real app, this would be an API call
      // Example: await fetch(`/api/orders/${orderId}/cancel`, { method: 'PUT' })

      // For now, we'll update the order in our local state
      const updatedOrders = orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status: "Cancelled",
              cancellationDate: new Date().toISOString().split("T")[0],
              cancellationReason: "Cancelled by customer",
            }
          : order,
      )

      setOrders(updatedOrders)

      // Update in localStorage
      localStorage.setItem(`orders-${user.id}`, JSON.stringify(updatedOrders))

      // If we're viewing the details of the cancelled order, update it
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder({
          ...selectedOrder,
          status: "Cancelled",
          cancellationDate: new Date().toISOString().split("T")[0],
          cancellationReason: "Cancelled by customer",
        })
      }

      alert("Order cancelled successfully")
    } catch (err) {
      console.error("Error cancelling order:", err)
      alert("Failed to cancel order. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const handleWriteReview = (orderId, productId) => {
    // Navigate to review form with order and product info
    navigate(`/review?orderId=${orderId}&productId=${productId}`)
  }

  return (
    <div className={styles.ordersPage}>
      <div className={styles.container}>
        <h1 className={styles.pageTitle}>My Orders</h1>

        <div className={styles.ordersTabs}>
          <button
            className={`${styles.tabButton} ${activeTab === "all" ? styles.active : ""}`}
            onClick={() => setActiveTab("all")}
          >
            All Orders
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "processing" ? styles.active : ""}`}
            onClick={() => setActiveTab("processing")}
          >
            Processing
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "delivered" ? styles.active : ""}`}
            onClick={() => setActiveTab("delivered")}
          >
            Delivered
          </button>
          <button
            className={`${styles.tabButton} ${activeTab === "cancelled" ? styles.active : ""}`}
            onClick={() => setActiveTab("cancelled")}
          >
            Cancelled
          </button>
        </div>

        {loading ? (
          <div className={styles.loadingState}>
            <Loader className={styles.spinner} />
            <p>Loading your orders...</p>
          </div>
        ) : error ? (
          <div className={styles.errorState}>
            <p>{error}</p>
            <button className={styles.retryButton} onClick={() => window.location.reload()}>
              Retry
            </button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyStateIcon}>
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
                <line x1="3" y1="6" x2="21" y2="6"></line>
                <path d="M16 10a4 4 0 0 1-8 0"></path>
              </svg>
            </div>
            <p className={styles.emptyStateText}>
              {activeTab === "all"
                ? "You haven't placed any orders yet."
                : `You don't have any ${activeTab.toLowerCase()} orders.`}
            </p>
            <Link to="/products" className={styles.shopNowBtn}>
              Shop Now
            </Link>
          </div>
        ) : (
          <div className={styles.ordersList}>
            {filteredOrders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <div className={styles.orderInfo}>
                    <h3>Order #{order.id}</h3>
                    <p>Placed on {new Date(order.date).toLocaleDateString()}</p>
                  </div>
                  <div className={styles.orderStatus}>
                    <span
                      className={`${styles.statusBadge} ${
                        order.status === "Delivered"
                          ? styles.delivered
                          : order.status === "Processing"
                            ? styles.processing
                            : styles.cancelled
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className={styles.orderItems}>
                  {order.items.map((item) => (
                    <div key={item.id} className={styles.orderItem}>
                      <div className={styles.itemImage}>
                        <img src={item.image || "/placeholder.svg?height=80&width=80"} alt={item.name} />
                      </div>
                      <div className={styles.itemInfo}>
                        <h4>{item.name}</h4>
                        <p className={styles.itemPrice}>Rs. {item.price.toLocaleString()}</p>
                        <p className={styles.itemQuantity}>Quantity: {item.quantity}</p>
                      </div>
                      <div className={styles.itemTotal}>
                        <p>Total</p>
                        <p className={styles.totalPrice}>Rs. {(item.quantity * item.price).toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className={styles.orderFooter}>
                  <div className={styles.orderTotal}>
                    <span>Order Total:</span>
                    <span>Rs. {order.total.toLocaleString()}</span>
                  </div>
                  <div className={styles.orderActions}>
                    <button className={styles.viewDetailsBtn} onClick={() => handleViewDetails(order)}>
                      View Order Details
                    </button>
                    {order.status === "Delivered" && (
                      <button
                        className={styles.writeReviewBtn}
                        onClick={() => handleWriteReview(order.id, order.items[0].id)}
                      >
                        Write a Review
                      </button>
                    )}
                    {order.status === "Processing" && (
                      <button
                        className={styles.cancelOrderBtn}
                        onClick={() => handleCancelOrder(order.id)}
                        disabled={loading}
                      >
                        {loading ? "Cancelling..." : "Cancel Order"}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {showOrderDetails && selectedOrder && (
        <div className={styles.orderDetailsModal}>
          <div className={styles.orderDetailsContent}>
            <div className={styles.orderDetailsHeader}>
              <h2>Order Details</h2>
              <button className={styles.closeModalBtn} onClick={closeOrderDetails}>
                <X size={24} />
              </button>
            </div>

            <div className={styles.orderDetailsBody}>
              <div className={styles.orderDetailsSection}>
                <h3>Order Information</h3>
                <div className={styles.orderDetailsList}>
                  <div className={styles.orderDetailItem}>
                    <span className={styles.detailLabel}>Order Number:</span>
                    <span className={styles.detailValue}>{selectedOrder.id}</span>
                  </div>
                  <div className={styles.orderDetailItem}>
                    <span className={styles.detailLabel}>Order Date:</span>
                    <span className={styles.detailValue}>{new Date(selectedOrder.date).toLocaleDateString()}</span>
                  </div>
                  <div className={styles.orderDetailItem}>
                    <span className={styles.detailLabel}>Order Status:</span>
                    <span
                      className={`${styles.detailValue} ${styles.statusText} ${
                        selectedOrder.status === "Delivered"
                          ? styles.deliveredText
                          : selectedOrder.status === "Processing"
                            ? styles.processingText
                            : styles.cancelledText
                      }`}
                    >
                      {selectedOrder.status}
                    </span>
                  </div>
                  <div className={styles.orderDetailItem}>
                    <span className={styles.detailLabel}>Payment Method:</span>
                    <span className={styles.detailValue}>{selectedOrder.paymentMethod}</span>
                  </div>
                  {selectedOrder.trackingNumber && (
                    <div className={styles.orderDetailItem}>
                      <span className={styles.detailLabel}>Tracking Number:</span>
                      <span className={styles.detailValue}>{selectedOrder.trackingNumber}</span>
                    </div>
                  )}
                  {selectedOrder.deliveryDate && (
                    <div className={styles.orderDetailItem}>
                      <span className={styles.detailLabel}>Delivery Date:</span>
                      <span className={styles.detailValue}>{selectedOrder.deliveryDate}</span>
                    </div>
                  )}
                  {selectedOrder.estimatedDelivery && (
                    <div className={styles.orderDetailItem}>
                      <span className={styles.detailLabel}>Estimated Delivery:</span>
                      <span className={styles.detailValue}>{selectedOrder.estimatedDelivery}</span>
                    </div>
                  )}
                  {selectedOrder.cancellationReason && (
                    <div className={styles.orderDetailItem}>
                      <span className={styles.detailLabel}>Cancellation Reason:</span>
                      <span className={styles.detailValue}>{selectedOrder.cancellationReason}</span>
                    </div>
                  )}
                  {selectedOrder.cancellationDate && (
                    <div className={styles.orderDetailItem}>
                      <span className={styles.detailLabel}>Cancelled On:</span>
                      <span className={styles.detailValue}>{selectedOrder.cancellationDate}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className={styles.orderDetailsSection}>
                <h3>Shipping Address</h3>
                <div className={styles.addressDetails}>
                  <p>{selectedOrder.shippingAddress.name}</p>
                  <p>{selectedOrder.shippingAddress.street}</p>
                  <p>
                    {selectedOrder.shippingAddress.city}, {selectedOrder.shippingAddress.state}{" "}
                    {selectedOrder.shippingAddress.zip}
                  </p>
                  <p>{selectedOrder.shippingAddress.country}</p>
                  <p>{selectedOrder.shippingAddress.phone}</p>
                </div>
              </div>

              <div className={styles.orderDetailsSection}>
                <h3>Order Items</h3>
                <div className={styles.orderItemsTable}>
                  <div className={styles.orderItemsHeader}>
                    <div className={styles.itemCol}>Item</div>
                    <div className={styles.priceCol}>Price</div>
                    <div className={styles.qtyCol}>Qty</div>
                    <div className={styles.totalCol}>Total</div>
                  </div>
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className={styles.orderItemRow}>
                      <div className={styles.itemCol}>
                        <div className={styles.itemDetail}>
                          <img src={item.image || "/placeholder.svg?height=50&width=50"} alt={item.name} />
                          <span>{item.name}</span>
                        </div>
                      </div>
                      <div className={styles.priceCol}>Rs. {item.price.toLocaleString()}</div>
                      <div className={styles.qtyCol}>{item.quantity}</div>
                      <div className={styles.totalCol}>Rs. {(item.price * item.quantity).toLocaleString()}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.orderSummary}>
                <div className={styles.summaryRow}>
                  <span>Subtotal:</span>
                  <span>Rs. {selectedOrder.total.toLocaleString()}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span>Shipping:</span>
                  <span>Free</span>
                </div>
                <div className={`${styles.summaryRow} ${styles.orderTotal}`}>
                  <span>Total:</span>
                  <span>Rs. {selectedOrder.total.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div className={styles.orderDetailsFooter}>
              {selectedOrder.status === "Processing" && (
                <button
                  className={styles.cancelOrderBtn}
                  onClick={() => {
                    handleCancelOrder(selectedOrder.id)
                    closeOrderDetails()
                  }}
                  disabled={loading}
                >
                  {loading ? "Cancelling..." : "Cancel Order"}
                </button>
              )}
              {selectedOrder.status === "Delivered" && (
                <button
                  className={styles.writeReviewBtn}
                  onClick={() => {
                    handleWriteReview(selectedOrder.id, selectedOrder.items[0].id)
                    closeOrderDetails()
                  }}
                >
                  Write a Review
                </button>
              )}
              <button className={styles.closeBtn} onClick={closeOrderDetails}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default OrdersPage
