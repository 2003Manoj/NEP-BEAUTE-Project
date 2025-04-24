"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"

const RecentlyViewedContext = createContext()

export const useRecentlyViewed = () => useContext(RecentlyViewedContext)

export const RecentlyViewedProvider = ({ children }) => {
  const [recentlyViewedItems, setRecentlyViewedItems] = useState([])
  const { user } = useAuth()
  const MAX_ITEMS = 10 // Maximum number of recently viewed items to store

  // Load recently viewed items from localStorage on initial render
  useEffect(() => {
    if (user) {
      const savedItems = localStorage.getItem(`nepbeaute-recently-viewed-${user.id}`)
      if (savedItems) {
        try {
          const parsedItems = JSON.parse(savedItems)
          setRecentlyViewedItems(parsedItems)
        } catch (error) {
          console.error("Error parsing recently viewed items from localStorage:", error)
        }
      }
    } else {
      // For non-logged in users, use a generic key
      const savedItems = localStorage.getItem("nepbeaute-recently-viewed-guest")
      if (savedItems) {
        try {
          const parsedItems = JSON.parse(savedItems)
          setRecentlyViewedItems(parsedItems)
        } catch (error) {
          console.error("Error parsing recently viewed items from localStorage:", error)
        }
      }
    }
  }, [user])

  // Update localStorage whenever recently viewed items change
  useEffect(() => {
    const storageKey = user ? `nepbeaute-recently-viewed-${user.id}` : "nepbeaute-recently-viewed-guest"
    localStorage.setItem(storageKey, JSON.stringify(recentlyViewedItems))
  }, [recentlyViewedItems, user])

  // Add item to recently viewed
  const addToRecentlyViewed = (product) => {
    setRecentlyViewedItems((prevItems) => {
      // Remove the product if it already exists (to move it to the front)
      const filteredItems = prevItems.filter((item) => item.id !== product.id)

      // Add the new product to the beginning of the array
      const newItems = [product, ...filteredItems]

      // Limit the array to MAX_ITEMS
      return newItems.slice(0, MAX_ITEMS)
    })
  }

  // Clear all recently viewed items
  const clearRecentlyViewed = () => {
    setRecentlyViewedItems([])
  }

  const value = {
    recentlyViewedItems,
    addToRecentlyViewed,
    clearRecentlyViewed,
  }

  return <RecentlyViewedContext.Provider value={value}>{children}</RecentlyViewedContext.Provider>
}
