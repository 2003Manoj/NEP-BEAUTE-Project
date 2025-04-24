"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  // Get cart context functions (will be undefined on first render)
  const cartContext = useContext(AuthContext)

  // Load user from localStorage on initial render
  useEffect(() => {
    const savedUser = localStorage.getItem("nepbeaute-user")
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing user from localStorage:", error)
      }
    }
    setLoading(false)
  }, [])

  // Update localStorage whenever user changes
  useEffect(() => {
    if (user) {
      localStorage.setItem("nepbeaute-user", JSON.stringify(user))
    } else {
      localStorage.removeItem("nepbeaute-user")
    }
  }, [user])

  // Login function
  const login = (userData) => {
    setUser(userData)

    // Merge anonymous cart with user cart after login
    // We need to use a timeout to ensure the CartContext is available
    setTimeout(() => {
      if (cartContext && cartContext.mergeAnonymousCart) {
        cartContext.mergeAnonymousCart(userData.id)
      }
    }, 0)

    return true
  }

  // Register function
  const register = (userData) => {
    // In a real app, you would send this data to your backend
    // For now, we'll just simulate a successful registration
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    setUser(newUser)

    // Merge anonymous cart with new user cart after registration
    // We need to use a timeout to ensure the CartContext is available
    setTimeout(() => {
      if (cartContext && cartContext.mergeAnonymousCart) {
        cartContext.mergeAnonymousCart(newUser.id)
      }
    }, 0)

    return true
  }

  // Logout function
  const logout = () => {
    setUser(null)
  }

  // Update user profile
  const updateProfile = (updatedData) => {
    setUser((prevUser) => ({
      ...prevUser,
      ...updatedData,
    }))
    return true
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
