"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { useAuth } from "../../contexts/AuthContext"
import { useCart } from "../../contexts/CartContext"
import { useWishlist } from "../../contexts/WishlistContext"
import { User, ShoppingBag, Heart, MapPin, Lock, LogOut, Edit, Save, X } from "lucide-react"
import styles from "./ProfilePage.module.css"

const ProfilePage = () => {
  const { user, updateProfile, logout } = useAuth()
  const { cartItems, totalPrice } = useCart()
  const { wishlistItems } = useWishlist()
  const navigate = useNavigate()

  const [activeTab, setActiveTab] = useState("profile")
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "Kathmandu",
    zipCode: user?.zipCode || "",
  })

  const [errors, setErrors] = useState({})
  const [orders, setOrders] = useState([])

  // Load orders from localStorage
  useEffect(() => {
    if (user) {
      const savedOrders = localStorage.getItem(`nepbeaute-orders-${user.id}`)
      if (savedOrders) {
        try {
          const parsedOrders = JSON.parse(savedOrders)
          setOrders(parsedOrders)
        } catch (error) {
          console.error("Error parsing orders:", error)
          setOrders([])
        }
      } else {
        // If no orders exist, create mock data for demo purposes
        const mockOrders = [
          {
            id: "ORD" + Math.floor(100000 + Math.random() * 900000),
            date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
            status: Math.random() > 0.5 ? "Delivered" : "Processing",
            total: Math.floor(1500 + Math.random() * 3000),
            items:
              cartItems.length > 0
                ? cartItems.slice(0, Math.min(3, cartItems.length))
                : [
                    { id: 1, name: "Himalayan Face Wash", quantity: 1, price: 850 },
                    { id: 2, name: "Aloe Vera Gel", quantity: 2, price: 825 },
                  ],
          },
          {
            id: "ORD" + Math.floor(100000 + Math.random() * 900000),
            date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
            status: Math.random() > 0.5 ? "Delivered" : "Processing",
            total: Math.floor(1500 + Math.random() * 3000),
            items:
              cartItems.length > 0
                ? cartItems.slice(0, Math.min(3, cartItems.length))
                : [{ id: 3, name: "Herbal Shampoo", quantity: 1, price: 750 }],
          },
          {
            id: "ORD" + Math.floor(100000 + Math.random() * 900000),
            date: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000).toISOString(),
            status: "Delivered",
            total: Math.floor(1500 + Math.random() * 3000),
            items: [
              { id: 4, name: "Ayurvedic Hair Oil", quantity: 2, price: 495 },
              { id: 5, name: "Herbal Face Pack", quantity: 1, price: 345 },
            ],
          },
        ]
        setOrders(mockOrders)
        localStorage.setItem(`nepbeaute-orders-${user.id}`, JSON.stringify(mockOrders))
      }
    }
  }, [user, cartItems])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
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
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    } else if (!/^9\d{9}$/.test(formData.phone)) {
      newErrors.phone = "Phone number should be 10 digits starting with 9"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleEditProfile = () => {
    setIsEditing(true)
  }

  const handleCancelEdit = () => {
    // Reset form data to user data
    setFormData({
      firstName: user?.firstName || "",
      lastName: user?.lastName || "",
      email: user?.email || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "Kathmandu",
      zipCode: user?.zipCode || "",
    })
    setIsEditing(false)
    setErrors({})
  }

  const handleSaveProfile = () => {
    if (!validateForm()) {
      return
    }

    updateProfile(formData)
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    navigate("/")
  }

  // New navigation handlers
  const navigateToOrders = () => {
    navigate("/orders")
  }

  const navigateToWishlist = () => {
    navigate("/wishlist")
  }

  if (!user) {
    navigate("/login")
    return null
  }

  return (
    <div className={styles.profilePage}>
      <div className={styles.container}>
        <div className={styles.profileContainer}>
          <div className={styles.sidebar}>
            <div className={styles.userInfo}>
              <div className={styles.userAvatar}>
                <img
                  src={`https://ui-avatars.com/api/?name=${user.firstName}+${user.lastName}&background=FF6B81&color=fff`}
                  alt={`${user.firstName} ${user.lastName}`}
                />
              </div>
              <h3>{`${user.firstName} ${user.lastName}`}</h3>
              <p>{user.email}</p>
            </div>

            <nav className={styles.sidebarNav}>
              <button
                className={`${styles.navItem} ${activeTab === "profile" ? styles.active : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                <User size={18} />
                My Profile
              </button>
              <button className={`${styles.navItem}`} onClick={navigateToOrders}>
                <ShoppingBag size={18} />
                My Orders
                <span className={styles.badge}>{orders.length}</span>
              </button>
              <button className={`${styles.navItem}`} onClick={navigateToWishlist}>
                <Heart size={18} />
                My Wishlist
                <span className={styles.badge}>{wishlistItems.length}</span>
              </button>
              <button
                className={`${styles.navItem} ${activeTab === "addresses" ? styles.active : ""}`}
                onClick={() => setActiveTab("addresses")}
              >
                <MapPin size={18} />
                My Addresses
              </button>
              <button
                className={`${styles.navItem} ${activeTab === "password" ? styles.active : ""}`}
                onClick={() => setActiveTab("password")}
              >
                <Lock size={18} />
                Change Password
              </button>
              <button className={styles.navItem} onClick={handleLogout}>
                <LogOut size={18} />
                Logout
              </button>
            </nav>
          </div>

          <div className={styles.content}>
            {activeTab === "profile" && (
              <div className={styles.profileTab}>
                <div className={styles.sectionHeader}>
                  <h2>My Profile</h2>
                  {!isEditing ? (
                    <button className={styles.editButton} onClick={handleEditProfile}>
                      <Edit size={16} /> Edit Profile
                    </button>
                  ) : (
                    <div className={styles.editActions}>
                      <button className={styles.saveButton} onClick={handleSaveProfile}>
                        <Save size={16} /> Save
                      </button>
                      <button className={styles.cancelButton} onClick={handleCancelEdit}>
                        <X size={16} /> Cancel
                      </button>
                    </div>
                  )}
                </div>

                <div className={styles.profileForm}>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="firstName">First Name</label>
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
                            className={errors.firstName ? styles.errorInput : ""}
                          />
                          {errors.firstName && <span className={styles.errorMessage}>{errors.firstName}</span>}
                        </>
                      ) : (
                        <div className={styles.fieldValue}>{user.firstName}</div>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="lastName">Last Name</label>
                      {isEditing ? (
                        <>
                          <input
                            type="text"
                            id="lastName"
                            name="lastName"
                            value={formData.lastName}
                            onChange={handleInputChange}
                            className={errors.lastName ? styles.errorInput : ""}
                          />
                          {errors.lastName && <span className={styles.errorMessage}>{errors.lastName}</span>}
                        </>
                      ) : (
                        <div className={styles.fieldValue}>{user.lastName}</div>
                      )}
                    </div>
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="email">Email</label>
                      {isEditing ? (
                        <>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className={errors.email ? styles.errorInput : ""}
                          />
                          {errors.email && <span className={styles.errorMessage}>{errors.email}</span>}
                        </>
                      ) : (
                        <div className={styles.fieldValue}>{user.email}</div>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="phone">Phone Number</label>
                      {isEditing ? (
                        <>
                          <input
                            type="tel"
                            id="phone"
                            name="phone"
                            value={formData.phone}
                            onChange={handleInputChange}
                            className={errors.phone ? styles.errorInput : ""}
                          />
                          {errors.phone && <span className={styles.errorMessage}>{errors.phone}</span>}
                        </>
                      ) : (
                        <div className={styles.fieldValue}>{user.phone}</div>
                      )}
                    </div>
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="address">Address</label>
                    {isEditing ? (
                      <input
                        type="text"
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleInputChange}
                      />
                    ) : (
                      <div className={styles.fieldValue}>{user.address || "Not provided"}</div>
                    )}
                  </div>

                  <div className={styles.formRow}>
                    <div className={styles.formGroup}>
                      <label htmlFor="city">City</label>
                      {isEditing ? (
                        <select id="city" name="city" value={formData.city} onChange={handleInputChange}>
                          <option value="Kathmandu">Kathmandu</option>
                          <option value="Lalitpur">Lalitpur</option>
                          <option value="Bhaktapur">Bhaktapur</option>
                          <option value="Pokhara">Pokhara</option>
                          <option value="Biratnagar">Biratnagar</option>
                          <option value="Birgunj">Birgunj</option>
                        </select>
                      ) : (
                        <div className={styles.fieldValue}>{user.city || "Not provided"}</div>
                      )}
                    </div>

                    <div className={styles.formGroup}>
                      <label htmlFor="zipCode">Zip Code</label>
                      {isEditing ? (
                        <input
                          type="text"
                          id="zipCode"
                          name="zipCode"
                          value={formData.zipCode}
                          onChange={handleInputChange}
                        />
                      ) : (
                        <div className={styles.fieldValue}>{user.zipCode || "Not provided"}</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "addresses" && (
              <div className={styles.addressesTab}>
                <div className={styles.sectionHeader}>
                  <h2>My Addresses</h2>
                  <button className={styles.addButton}>
                    <span>Add New Address</span>
                  </button>
                </div>

                <div className={styles.addressesList}>
                  <div className={styles.addressCard}>
                    <div className={styles.addressHeader}>
                      <h3>Home</h3>
                      <span className={styles.defaultBadge}>Default</span>
                    </div>
                    <div className={styles.addressContent}>
                      <p>
                        {user.firstName} {user.lastName}
                      </p>
                      <p>{user.address || "Thamel, Kathmandu"}</p>
                      <p>Kathmandu, Nepal</p>
                      <p>Phone: {user.phone}</p>
                    </div>
                    <div className={styles.addressActions}>
                      <button className={styles.editAddressBtn}>
                        <Edit size={16} /> Edit
                      </button>
                      <button className={styles.deleteAddressBtn}>
                        <X size={16} /> Delete
                      </button>
                    </div>
                  </div>

                  {user.address && (
                    <div className={styles.addressCard}>
                      <div className={styles.addressHeader}>
                        <h3>Office</h3>
                      </div>
                      <div className={styles.addressContent}>
                        <p>
                          {user.firstName} {user.lastName}
                        </p>
                        <p>Durbar Marg, Kathmandu</p>
                        <p>Kathmandu, Nepal</p>
                        <p>Phone: {user.phone}</p>
                      </div>
                      <div className={styles.addressActions}>
                        <button className={styles.editAddressBtn}>
                          <Edit size={16} /> Edit
                        </button>
                        <button className={styles.deleteAddressBtn}>
                          <X size={16} /> Delete
                        </button>
                        <button className={styles.setDefaultBtn}>Set as Default</button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === "password" && (
              <div className={styles.passwordTab}>
                <div className={styles.sectionHeader}>
                  <h2>Change Password</h2>
                </div>

                <form className={styles.passwordForm}>
                  <div className={styles.formGroup}>
                    <label htmlFor="currentPassword">Current Password</label>
                    <input type="password" id="currentPassword" name="currentPassword" />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="newPassword">New Password</label>
                    <input type="password" id="newPassword" name="newPassword" />
                  </div>

                  <div className={styles.formGroup}>
                    <label htmlFor="confirmNewPassword">Confirm New Password</label>
                    <input type="password" id="confirmNewPassword" name="confirmNewPassword" />
                  </div>

                  <button type="submit" className={styles.changePasswordBtn}>
                    Update Password
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProfilePage
