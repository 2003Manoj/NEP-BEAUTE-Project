"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"

const WishlistContext = createContext()

export const useWishlist = () => useContext(WishlistContext)

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([])
  const { user } = useAuth()

  // Load wishlist from localStorage on initial render
  useEffect(() => {
    if (user) {
      const savedWishlist = localStorage.getItem(`nepbeaute-wishlist-${user.id}`)
      if (savedWishlist) {
        try {
          const parsedWishlist = JSON.parse(savedWishlist)
          setWishlistItems(parsedWishlist)
        } catch (error) {
          console.error("Error parsing wishlist from localStorage:", error)
          setWishlistItems([])
        }
      }
    } else {
      // Clear wishlist when user logs out
      setWishlistItems([])
    }
  }, [user])

  // Update localStorage whenever wishlist changes
  useEffect(() => {
    if (user) {
      localStorage.setItem(`nepbeaute-wishlist-${user.id}`, JSON.stringify(wishlistItems))
    }
  }, [wishlistItems, user])

  // Add item to wishlist
  const addToWishlist = (product) => {
    console.log("Adding to wishlist:", product)

    if (!user) {
      // alert("Please log in to add items to your wishlist")
      return false
    }

    setWishlistItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id)

      if (existingItem) {
        // Item already exists in wishlist, do nothing
        return prevItems
      } else {
        // Item doesn't exist in wishlist, add new item
        // alert(`${product.name} added to wishlist!`)
        return [...prevItems, product]
      }
    })
    return true
  }

  // Remove item from wishlist
  const removeFromWishlist = (productId) => {
    setWishlistItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    return wishlistItems.some((item) => item.id === productId)
  }

  // Clear wishlist
  const clearWishlist = () => {
    setWishlistItems([])
  }

  const value = {
    wishlistItems,
    addToWishlist,
    removeFromWishlist,
    isInWishlist,
    clearWishlist,
  }

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
}
