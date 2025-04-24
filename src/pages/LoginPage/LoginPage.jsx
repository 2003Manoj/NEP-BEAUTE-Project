"use client"

import { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import styles from "./LoginPage.module.css"

const LoginPage = () => {
  const { login } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsLoading(true)

    // Simulate API call
    setTimeout(() => {
      // Mock user data
      const userData = {
        id: "user123",
        firstName: "John",
        lastName: "Doe",
        email: formData.email,
        phone: "9876543210",
        address: "Thamel, Kathmandu",
      }

      login(userData)
      setIsLoading(false)
      navigate("/")
    }, 1500)
  }

  return (
    <div className={styles.loginPage}>
      <div className={styles.container}>
        <div className={styles.loginContainer}>
          <div className={styles.loginForm}>
            <div className={styles.formHeader}>
              <h1>Login to Your Account</h1>
              <p>Welcome back! Please enter your details to access your account.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formGroup}>
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={errors.email ? styles.errorInput : ""}
                />
                {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? styles.errorInput : ""}
                />
                {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
              </div>

              <div className={styles.formOptions}>
                <label className={styles.rememberMe}>
                  <input type="checkbox" name="rememberMe" checked={formData.rememberMe} onChange={handleInputChange} />
                  <span>Remember me</span>
                </label>

                <Link to="/forgot-password" className={styles.forgotPassword}>
                  Forgot password?
                </Link>
              </div>

              <button type="submit" className={styles.loginButton} disabled={isLoading}>
                {isLoading ? "Logging in..." : "Login"}
              </button>

              <div className={styles.orDivider}>
                <span>OR</span>
              </div>

              <button type="button" className={styles.googleButton}>
                <i className="fab fa-google"></i>
                Continue with Google
              </button>

              <div className={styles.registerLink}>
                Don't have an account?{" "}
                <Link to="/register" className={styles.signupLink}>
                  Sign up
                </Link>
              </div>
            </form>
          </div>

          <div className={styles.loginImage}>
            <img
              src="https://images.unsplash.com/photo-1596462502278-27bfdc403348?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Beauty Products"
            />
          </div>
        </div>
      </div>
    </div>
  )
}

export default LoginPage
