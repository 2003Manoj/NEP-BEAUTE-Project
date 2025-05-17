"use client"

import { createContext, useContext, useState, useEffect } from "react"

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  const cartContext = useContext(AuthContext)


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

 
  useEffect(() => {
    if (user) {
      localStorage.setItem("nepbeaute-user", JSON.stringify(user))
    } else {
      localStorage.removeItem("nepbeaute-user")
    }
  }, [user])

 
  const login = (userData) => {
    setUser(userData)

    
    setTimeout(() => {
      if (cartContext && cartContext.mergeAnonymousCart) {
        cartContext.mergeAnonymousCart(userData.id)
      }
    }, 0)

    return true
  }

 
  const register = (userData) => {
    
    const newUser = {
      ...userData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    setUser(newUser)

    setTimeout(() => {
      if (cartContext && cartContext.mergeAnonymousCart) {
        cartContext.mergeAnonymousCart(newUser.id)
      }
    }, 0)

    return true
  }

 
  const logout = () => {
    setUser(null)
  }


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
