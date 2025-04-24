"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import styles from "./OrdersPage.module.css"

const OrdersPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [activeTab, setActiveTab] = useState("all")

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
                    <button className={styles.viewDetailsBtn}>View Order Details</button>
                    {order.status === "Delivered" && <button className={styles.writeReviewBtn}>Write a Review</button>}
                    {order.status === "Processing" && <button className={styles.cancelOrderBtn}>Cancel Order</button>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default OrdersPage
