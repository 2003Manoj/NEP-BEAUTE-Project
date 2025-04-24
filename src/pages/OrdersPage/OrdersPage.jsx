"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { X } from "lucide-react"
import styles from "./OrdersPage.module.css"

const OrdersPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [showOrderDetails, setShowOrderDetails] = useState(false)

  // Mock orders data
  const orders = [
    {
      id: "ORD123456",
      date: "2023-06-15",
      status: "Delivered",
      total: 2500,
      items: [
        {
          id: 1,
          name: "Himalayan Face Wash",
          quantity: 1,
          price: 850,
          image:
            "https://images.unsplash.com/photo-1556228578-8c89e6adf883?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
        {
          id: 2,
          name: "Aloe Vera Gel",
          quantity: 2,
          price: 825,
          image:
            "https://images.unsplash.com/photo-1597931752949-98c74b5b159a?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
      ],
      shippingAddress: {
        name: "John Doe",
        street: "123 Main Street",
        city: "Kathmandu",
        state: "Bagmati",
        zip: "44600",
        country: "Nepal",
        phone: "+977 9812345678",
      },
      paymentMethod: "Cash on Delivery",
      deliveryDate: "2023-06-20",
      trackingNumber: "NB-TRK-987654",
    },
    {
      id: "ORD123457",
      date: "2023-05-28",
      status: "Processing",
      total: 1750,
      items: [
        {
          id: 3,
          name: "Rose Water Toner",
          quantity: 1,
          price: 650,
          image:
            "https://images.unsplash.com/photo-1601049541289-9b1b7bbbfe19?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
        {
          id: 4,
          name: "Kumkumadi Face Oil",
          quantity: 1,
          price: 1100,
          image:
            "https://images.unsplash.com/photo-1608248597279-f99d160bfcbc?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
      ],
      shippingAddress: {
        name: "John Doe",
        street: "123 Main Street",
        city: "Kathmandu",
        state: "Bagmati",
        zip: "44600",
        country: "Nepal",
        phone: "+977 9812345678",
      },
      paymentMethod: "Credit Card",
      estimatedDelivery: "2023-06-05",
      trackingNumber: "NB-TRK-123456",
    },
    {
      id: "ORD123458",
      date: "2023-04-10",
      status: "Delivered",
      total: 3200,
      items: [
        {
          id: 5,
          name: "Sandalwood Face Pack",
          quantity: 1,
          price: 950,
          image:
            "https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
        {
          id: 6,
          name: "Hair Oil",
          quantity: 1,
          price: 750,
          image:
            "https://images.unsplash.com/photo-1526947425960-945c6e72858f?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
        {
          id: 7,
          name: "Kajal",
          quantity: 2,
          price: 750,
          image:
            "https://images.unsplash.com/photo-1631730359585-38a4935cbec4?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
      ],
      shippingAddress: {
        name: "John Doe",
        street: "123 Main Street",
        city: "Kathmandu",
        state: "Bagmati",
        zip: "44600",
        country: "Nepal",
        phone: "+977 9812345678",
      },
      paymentMethod: "Cash on Delivery",
      deliveryDate: "2023-04-15",
      trackingNumber: "NB-TRK-456789",
    },
    {
      id: "ORD123459",
      date: "2023-03-05",
      status: "Cancelled",
      total: 1200,
      items: [
        {
          id: 8,
          name: "Lip Balm",
          quantity: 2,
          price: 600,
          image:
            "https://images.unsplash.com/photo-1625772299848-391b6a87d7b3?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60",
        },
      ],
      shippingAddress: {
        name: "John Doe",
        street: "123 Main Street",
        city: "Kathmandu",
        state: "Bagmati",
        zip: "44600",
        country: "Nepal",
        phone: "+977 9812345678",
      },
      paymentMethod: "Credit Card",
      cancellationReason: "Changed my mind",
      cancellationDate: "2023-03-06",
    },
  ]

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
    navigate("/login")
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

        {filteredOrders.length === 0 ? (
          <div className={styles.emptyState}>
            <i className="fas fa-shopping-bag"></i>
            <p>No orders found in this category.</p>
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
                        <img src={item.image || "/placeholder.svg"} alt={item.name} />
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
                    {order.status === "Delivered" && <button className={styles.writeReviewBtn}>Write a Review</button>}
                    {order.status === "Processing" && <button className={styles.cancelOrderBtn}>Cancel Order</button>}
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
                          <img src={item.image || "/placeholder.svg"} alt={item.name} />
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
              {selectedOrder.status === "Processing" && <button className={styles.cancelOrderBtn}>Cancel Order</button>}
              {selectedOrder.status === "Delivered" && (
                <button className={styles.writeReviewBtn}>Write a Review</button>
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
