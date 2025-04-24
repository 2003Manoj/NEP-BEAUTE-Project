"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useAuth } from "./AuthContext"

const CompareContext = createContext()

export const useCompare = () => useContext(CompareContext)

export const CompareProvider = ({ children }) => {
  const [compareItems, setCompareItems] = useState([])
  const [showCompareBar, setShowCompareBar] = useState(false)
  const { user } = useAuth()

  // Load compare items from localStorage on initial render
  useEffect(() => {
    if (user) {
      const savedItems = localStorage.getItem(`nepbeaute-compare-${user.id}`)
      if (savedItems) {
        try {
          const parsedItems = JSON.parse(savedItems)
          setCompareItems(parsedItems)
          if (parsedItems.length > 0) {
            setShowCompareBar(true)
          }
        } catch (error) {
          console.error("Error parsing compare items from localStorage:", error)
        }
      }
    } else {
      // For non-logged in users, use a generic key
      const savedItems = localStorage.getItem("nepbeaute-compare-guest")
      if (savedItems) {
        try {
          const parsedItems = JSON.parse(savedItems)
          setCompareItems(parsedItems)
          if (parsedItems.length > 0) {
            setShowCompareBar(true)
          }
        } catch (error) {
          console.error("Error parsing compare items from localStorage:", error)
        }
      }
    }
  }, [user])

  // Update localStorage whenever compare items change
  useEffect(() => {
    const storageKey = user ? `nepbeaute-compare-${user.id}` : "nepbeaute-compare-guest"
    localStorage.setItem(storageKey, JSON.stringify(compareItems))

    // Show compare bar if there are items
    if (compareItems.length > 0) {
      setShowCompareBar(true)
    } else {
      setShowCompareBar(false)
    }
  }, [compareItems, user])

  // Add item to compare
  const addToCompare = (product) => {
    setCompareItems((prevItems) => {
      // Check if we already have 4 items (maximum)
      if (prevItems.length >= 4) {
        alert("You can compare up to 4 products at a time. Please remove a product before adding a new one.")
        return prevItems
      }

      // Check if product already exists
      const existingItem = prevItems.find((item) => item.id === product.id)
      if (existingItem) {
        return prevItems
      }

      return [...prevItems, product]
    })

    return true
  }

  // Remove item from compare
  const removeFromCompare = (productId) => {
    setCompareItems((prevItems) => prevItems.filter((item) => item.id !== productId))
  }

  // Check if product is in compare list
  const isInCompare = (productId) => {
    return compareItems.some((item) => item.id === productId)
  }

  // Clear all compare items
  const clearCompare = () => {
    setCompareItems([])
  }

  // Toggle compare bar visibility
  const toggleCompareBar = () => {
    setShowCompareBar((prev) => !prev)
  }

  const value = {
    compareItems,
    addToCompare,
    removeFromCompare,
    isInCompare,
    clearCompare,
    showCompareBar,
    toggleCompareBar,
  }

  return <CompareContext.Provider value={value}>{children}</CompareContext.Provider>
}
