"use client"

import { useState, useEffect } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useCompare } from "../../contexts/CompareContext"
import { useCart } from "../../contexts/CartContext"
import { getProductById } from "../../services/productService"
import { ChevronLeft, ShoppingBag, X, Star } from "lucide-react"
import styles from "./ComparePage.module.css"

const ComparePage = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { compareItems } = useCompare()
  const { addToCart } = useCart()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const searchParams = new URLSearchParams(location.search)
        const productIds = searchParams.get("products")?.split(",") || []

        if (productIds.length === 0 && compareItems.length >= 2) {
          // If no products in URL but we have compare items, use those
          setProducts(compareItems)
          setLoading(false)
          return
        }

        if (productIds.length < 2) {
          setError("Please select at least 2 products to compare")
          setLoading(false)
          return
        }

        const fetchedProducts = await Promise.all(
          productIds.map(async (id) => {
            try {
              return await getProductById(id)
            } catch (err) {
              console.error(`Error fetching product ${id}:`, err)
              return null
            }
          }),
        )

        // Filter out any null products (failed fetches)
        const validProducts = fetchedProducts.filter(Boolean)

        if (validProducts.length < 2) {
          setError("Could not find enough valid products to compare")
          setLoading(false)
          return
        }

        setProducts(validProducts)
        setLoading(false)
      } catch (err) {
        console.error("Error in compare page:", err)
        setError("An error occurred while loading the comparison")
        setLoading(false)
      }
    }

    fetchProducts()
  }, [location.search, compareItems])

  const handleAddToCart = (product) => {
    addToCart(product, 1)
  }

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p>Loading comparison...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.errorContainer}>
        <div className={styles.errorIcon}>
          <X size={40} />
        </div>
        <h2>Oops! Something went wrong</h2>
        <p>{error}</p>
        <Link to="/products" className={styles.backButton}>
          <ChevronLeft size={16} />
          Back to Products
        </Link>
      </div>
    )
  }

  // Define comparison attributes
  const attributes = [
    { name: "Brand", key: "brand" },
    { name: "Category", key: "category" },
    { name: "Rating", key: "rating", type: "rating" },
    { name: "Price", key: "price", type: "price" },
    { name: "Original Price", key: "originalPrice", type: "price" },
    { name: "Discount", key: "discount", type: "discount" },
    { name: "Description", key: "description" },
  ]

  return (
    <div className={styles.comparePage}>
      <div className={styles.container}>
        <div className={styles.compareHeader}>
          <Link to="/products" className={styles.backLink}>
            <ChevronLeft size={18} />
            <span>Back to Products</span>
          </Link>
          <h1 className={styles.pageTitle}>Product Comparison</h1>
        </div>

        <div className={styles.compareTable}>
          <div className={styles.compareRow}>
            <div className={styles.compareAttribute}></div>
            {products.map((product) => (
              <div key={product.id} className={styles.compareProduct}>
                <div className={styles.productImage}>
                  <img src={product.image || "/placeholder.svg"} alt={product.name} />
                </div>
                <h3 className={styles.productName}>{product.name}</h3>
                <button className={styles.addToCartBtn} onClick={() => handleAddToCart(product)}>
                  <ShoppingBag size={16} />
                  <span>Add to Cart</span>
                </button>
              </div>
            ))}
          </div>

          {attributes.map((attribute) => (
            <div key={attribute.name} className={styles.compareRow}>
              <div className={styles.compareAttribute}>{attribute.name}</div>
              {products.map((product) => (
                <div key={product.id} className={styles.compareValue}>
                  {attribute.type === "rating" ? (
                    <div className={styles.ratingDisplay}>
                      <div className={styles.ratingStars}>
                        <Star size={14} fill="currentColor" strokeWidth={0} />
                        <span>{product[attribute.key]}</span>
                      </div>
                      <span className={styles.reviewCount}>({product.reviewCount} reviews)</span>
                    </div>
                  ) : attribute.type === "price" ? (
                    product[attribute.key] ? (
                      <span>Rs. {product[attribute.key].toLocaleString()}</span>
                    ) : (
                      <span className={styles.notAvailable}>N/A</span>
                    )
                  ) : attribute.type === "discount" ? (
                    product.originalPrice ? (
                      <span className={styles.discountValue}>
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </span>
                    ) : (
                      <span className={styles.notAvailable}>No discount</span>
                    )
                  ) : (
                    <span>{product[attribute.key] || <span className={styles.notAvailable}>N/A</span>}</span>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default ComparePage
