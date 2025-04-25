"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"
import styles from "./RegisterPage.module.css"

const RegisterPage = () => {
  const { register } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  })

  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  // Mock database for existing users
  const [existingUsers, setExistingUsers] = useState([])

  useEffect(() => {
    // Simulate fetching existing users from localStorage
    const storedUsers = localStorage.getItem("registeredUsers")
    if (storedUsers) {
      setExistingUsers(JSON.parse(storedUsers))
    } else {
      // Initialize with some mock data
      const mockUsers = [
        { email: "test@example.com", phone: "9876543210" },
        { email: "user@nepbeaute.com", phone: "9812345678" },
      ]
      localStorage.setItem("registeredUsers", JSON.stringify(mockUsers))
      setExistingUsers(mockUsers)
    }
  }, [])

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

    if (!formData.firstName.trim()) newErrors.firstName = "First name is required"
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required"

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    } else if (existingUsers.some((user) => user.email === formData.email)) {
      newErrors.email = "Email is already registered"
      toast.error("This email is already registered. Please use a different email or login.")
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^9\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Phone number should be 10 digits starting with 9"
    } else if (existingUsers.some((user) => user.phone === formData.phone)) {
      newErrors.phone = "Phone number is already registered"
      toast.error("This phone number is already registered. Please use a different number or login.")
    }

    if (!formData.password) {
      newErrors.password = "Password is required"
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters"
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (!formData.agreeTerms) {
      newErrors.agreeTerms = "You must agree to the terms and conditions"
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
      // Create user object without sensitive data
      const userData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
      }

      // Add user to "database"
      const updatedUsers = [...existingUsers, { email: formData.email, phone: formData.phone }]
      localStorage.setItem("registeredUsers", JSON.stringify(updatedUsers))

      register(userData)
      setIsLoading(false)
      toast.success("Registration successful! Redirecting to homepage...")

      // Redirect after toast is shown
      setTimeout(() => {
        navigate("/")
      }, 2000)
    }, 1500)
  }

  return (
    <div className={styles.registerPage}>
      <ToastContainer position="top-right" autoClose={3000} />
      <div className={styles.container}>
        <div className={styles.registerContainer}>
          <div className={styles.registerImage}>
            <img
              src="https://images.unsplash.com/photo-1571875257727-256c39da42af?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
              alt="Beauty Products"
            />
          </div>

          <div className={styles.registerForm}>
            <div className={styles.formHeader}>
              <h1>Create an Account</h1>
              <p>Join NepBeaute to discover premium beauty products.</p>
            </div>

            <form onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <div className={styles.formGroup}>
                  <label htmlFor="firstName">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    placeholder="Enter your first name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className={errors.firstName ? styles.errorInput : ""}
                  />
                  {errors.firstName && <span className={styles.errorMessage}>{errors.firstName}</span>}
                </div>

                <div className={styles.formGroup}>
                  <label htmlFor="lastName">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    placeholder="Enter your last name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className={errors.lastName ? styles.errorInput : ""}
                  />
                  {errors.lastName && <span className={styles.errorMessage}>{errors.lastName}</span>}
                </div>
              </div>

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
                <label htmlFor="phone">Phone Number</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="9XXXXXXXXX"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className={errors.phone ? styles.errorInput : ""}
                />
                {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  placeholder="Create a password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={errors.password ? styles.errorInput : ""}
                />
                {errors.password && <span className={styles.errorMessage}>{errors.password}</span>}
              </div>

              <div className={styles.formGroup}>
                <label htmlFor="confirmPassword">Confirm Password</label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  placeholder="Confirm your password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={errors.confirmPassword ? styles.errorInput : ""}
                />
                {errors.confirmPassword && <span className={styles.errorMessage}>{errors.confirmPassword}</span>}
              </div>

              <div className={styles.termsCheckbox}>
                <label className={errors.agreeTerms ? styles.errorLabel : ""}>
                  <input type="checkbox" name="agreeTerms" checked={formData.agreeTerms} onChange={handleInputChange} />
                  <span>
                    I agree to the{" "}
                    <Link to="/terms" className={styles.termsLink}>
                      Terms and Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" className={styles.termsLink}>
                      Privacy Policy
                    </Link>
                  </span>
                </label>
                {errors.agreeTerms && <span className={styles.errorMessage}>{errors.agreeTerms}</span>}
              </div>

              <button type="submit" className={styles.registerButton} disabled={isLoading}>
                {isLoading ? "Creating Account..." : "Create Account"}
              </button>

              <div className={styles.orDivider}>
                <span>OR</span>
              </div>

              <button type="button" className={styles.googleButton}>
                <i className="fab fa-google"></i>
                Sign up with Google
              </button>

              <div className={styles.loginLink}>
                Already have an account?{" "}
                <Link to="/login" className={styles.signinLink}>
                  Sign in
                </Link>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RegisterPage
