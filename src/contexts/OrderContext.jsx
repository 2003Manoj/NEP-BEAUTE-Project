"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { useAuth } from "./AuthContext"

const OrderContext = createContext()

export const useOrders = () => {
  return useContext(OrderContext)
}

export const OrderProvider = ({ children }) => {
  const { user } = useAuth()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  // Load orders from localStorage when component mounts or user changes
  useEffect(() => {
    if (user) {
      const loadOrders = () => {
        const userOrders = localStorage.getItem(`orders-${user.id}`)
        if (userOrders) {
          setOrders(JSON.parse(userOrders))
        } else {
          setOrders([])
        }
        setLoading(false)
      }

      loadOrders()
    } else {
      setOrders([])
      setLoading(false)
    }
  }, [user])

  // Save orders to localStorage whenever they change
  useEffect(() => {
    if (user && orders.length > 0) {
      localStorage.setItem(`orders-${user.id}`, JSON.stringify(orders))
    }
  }, [orders, user])

  // Create a new order
  const createOrder = (orderData) => {
    if (!user) return null

    const newOrder = {
      id: `ORD${Math.floor(100000 + Math.random() * 900000)}`, // Generate random order ID
      date: new Date().toISOString().split("T")[0], // Current date
      status: "Processing",
      ...orderData,
    }

    const updatedOrders = [...orders, newOrder]
    setOrders(updatedOrders)
    localStorage.setItem(`orders-${user.id}`, JSON.stringify(updatedOrders))

    return newOrder
  }

  // Get a specific order by ID
  const getOrder = (orderId) => {
    return orders.find((order) => order.id === orderId) || null
  }

  // Update an order's status
  const updateOrderStatus = (orderId, status, additionalData = {}) => {
    if (!user) return false

    const updatedOrders = orders.map((order) =>
      order.id === orderId ? { ...order, status, ...additionalData } : order,
    )

    setOrders(updatedOrders)
    localStorage.setItem(`orders-${user.id}`, JSON.stringify(updatedOrders))

    return true
  }

  // Cancel an order
  const cancelOrder = (orderId, reason = "Cancelled by customer") => {
    return updateOrderStatus(orderId, "Cancelled", {
      cancellationReason: reason,
      cancellationDate: new Date().toISOString().split("T")[0],
    })
  }

  const value = {
    orders,
    loading,
    createOrder,
    getOrder,
    updateOrderStatus,
    cancelOrder,
  }

  return <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
}

export default OrderContext
