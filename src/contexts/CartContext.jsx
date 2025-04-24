"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"

const CartContext = createContext()

export const useCart = () => useContext(CartContext)

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([])
  const [totalPrice, setTotalPrice] = useState(0)
  const { user } = useAuth()

  // Load cart from localStorage on initial render or when user changes
  useEffect(() => {
    loadCartFromStorage()
  }, [user])

  // Load cart based on user authentication status
  const loadCartFromStorage = () => {
    try {
      let savedCart

      if (user) {
        // If user is logged in, load their specific cart
        savedCart = localStorage.getItem(`nepbeaute-cart-${user.id}`)
      } else {
        // If no user is logged in, load anonymous cart
        savedCart = localStorage.getItem("nepbeaute-cart-anonymous")
      }

      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        setCartItems(parsedCart)
      } else {
        // If no cart exists for this user, start with empty cart
        setCartItems([])
      }
    } catch (error) {
      console.error("Error loading cart from localStorage:", error)
      setCartItems([])
    }
  }

  // Update localStorage and calculate total price whenever cart changes
  useEffect(() => {
    if (cartItems.length > 0) {
      const storageKey = user ? `nepbeaute-cart-${user.id}` : "nepbeaute-cart-anonymous"
      localStorage.setItem(storageKey, JSON.stringify(cartItems))
    }

    const total = cartItems.reduce((sum, item) => {
      return sum + item.price * item.quantity
    }, 0)

    setTotalPrice(total)
  }, [cartItems, user])

  // Add item to cart
  const addToCart = (product, quantity) => {
    setCartItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex((item) => item.id === product.id)

      if (existingItemIndex !== -1) {
        // Item already exists in cart, update quantity
        const updatedItems = [...prevItems]
        updatedItems[existingItemIndex] = {
          ...updatedItems[existingItemIndex],
          quantity: updatedItems[existingItemIndex].quantity + quantity,
        }
        return updatedItems
      } else {
        // Item doesn't exist in cart, add new item
        return [...prevItems, { ...product, quantity }]
      }
    })
  }

  // Update item quantity
  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCartItems((prevItems) => prevItems.map((item) => (item.id === productId ? { ...item, quantity } : item)))
  }

  // Remove item from cart
  const removeFromCart = (productId) => {
    setCartItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  // Clear cart
  const clearCart = () => {
    setCartItems([])
    const storageKey = user ? `nepbeaute-cart-${user.id}` : "nepbeaute-cart-anonymous"
    localStorage.removeItem(storageKey)
  }

  // Merge anonymous cart with user cart on login
  const mergeAnonymousCart = (userId) => {
    try {
      const anonymousCart = localStorage.getItem("nepbeaute-cart-anonymous")
      const userCart = localStorage.getItem(`nepbeaute-cart-${userId}`)

      if (anonymousCart) {
        const anonymousItems = JSON.parse(anonymousCart)

        if (userCart) {
          // If user already has a cart, merge items
          const userItems = JSON.parse(userCart)

          // Create a new array with merged items
          const mergedItems = [...userItems]

          // Add anonymous items, combining quantities for duplicates
          anonymousItems.forEach((anonymousItem) => {
            const existingItemIndex = mergedItems.findIndex((item) => item.id === anonymousItem.id)

            if (existingItemIndex !== -1) {
              // Item exists in user cart, add quantities
              mergedItems[existingItemIndex].quantity += anonymousItem.quantity
            } else {
              // Item doesn't exist in user cart, add it
              mergedItems.push(anonymousItem)
            }
          })

          // Update localStorage and state
          localStorage.setItem(`nepbeaute-cart-${userId}`, JSON.stringify(mergedItems))
          setCartItems(mergedItems)
        } else {
          // If user doesn't have a cart yet, just use the anonymous cart
          localStorage.setItem(`nepbeaute-cart-${userId}`, JSON.stringify(anonymousItems))
          setCartItems(anonymousItems)
        }

        // Clear anonymous cart
        localStorage.removeItem("nepbeaute-cart-anonymous")
      }
    } catch (error) {
      console.error("Error merging carts:", error)
    }
  }

  const value = {
    cartItems,
    totalPrice,
    addToCart,
    updateQuantity,
    removeFromCart,
    clearCart,
    mergeAnonymousCart,
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}
