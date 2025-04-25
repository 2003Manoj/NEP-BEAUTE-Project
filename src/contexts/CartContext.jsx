"use client"

import { createContext, useState, useContext, useEffect } from "react"
import { useAuth } from "./AuthContext"

const CartContext = createContext()

export const useCart = () => {
  return useContext(CartContext)
}

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const { user } = useAuth()

  // Get cart key based on user status
  const getCartKey = () => {
    return user ? `cart_${user.id}` : "cart_anonymous"
  }

  // Calculate total price
  const totalPrice = cartItems.reduce((total, item) => total + item.price * item.quantity, 0)

  useEffect(() => {
    // Load cart items from localStorage based on user status
    const loadCartItems = () => {
      const cartKey = getCartKey()
      const storedCart = localStorage.getItem(cartKey)
      if (storedCart) {
        try {
          setCartItems(JSON.parse(storedCart))
        } catch (error) {
          console.error("Error parsing cart from localStorage:", error)
          setCartItems([])
        }
      }
    }

    loadCartItems()
  }, [user]) // Re-run when user changes (login/logout)

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    const cartKey = getCartKey()
    localStorage.setItem(cartKey, JSON.stringify(cartItems))
  }, [cartItems, user])

  const addToCart = (product, quantity = 1) => {
    console.log("Adding to cart:", product, "quantity:", quantity)

    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        return prevItems.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item,
        )
      } else {
        return [...prevItems, { ...product, quantity }]
      }
    })

    // Remove the alert
    // alert(`${product.name} added to cart!`)
    return true
  }

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  const clearCart = () => {
    setCartItems([])
  }

  const mergeAnonymousCart = (userId) => {
    // Get anonymous cart
    const anonymousCart = JSON.parse(localStorage.getItem("cart_anonymous") || "[]")

    // Get user cart if it exists
    const userCart = JSON.parse(localStorage.getItem(`cart_${userId}`) || "[]")

    if (anonymousCart.length === 0) {
      // No anonymous items to merge
      return
    }

    // Merge carts
    const mergedCart = [...userCart]

    anonymousCart.forEach((anonymousItem) => {
      const existingItemIndex = mergedCart.findIndex((item) => item.id === anonymousItem.id)

      if (existingItemIndex >= 0) {
        // Item exists in user cart, update quantity
        mergedCart[existingItemIndex].quantity += anonymousItem.quantity
      } else {
        // Item doesn't exist in user cart, add it
        mergedCart.push(anonymousItem)
      }
    })

    // Update state with merged cart
    setCartItems(mergedCart)

    // Clear anonymous cart
    localStorage.removeItem("cart_anonymous")
  }

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    mergeAnonymousCart,
    totalPrice,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

export default CartContext
