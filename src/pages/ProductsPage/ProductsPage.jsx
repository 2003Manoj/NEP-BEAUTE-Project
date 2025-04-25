"use client"

import { useState, useEffect } from "react"
import { useParams, useLocation, useNavigate } from "react-router-dom"
import ProductCard from "../../components/ProductCard/ProductCard"
import PriceRangeSlider from "../../components/PriceRangeSlider/PriceRangeSlider"
import { getProducts } from "../../services/productService"
import { Filter, SlidersHorizontal, ChevronDown, X, Check, Grid, List, Star } from "lucide-react"
import styles from "./ProductsPage.module.css"

const ProductsPage = () => {
  const { category } = useParams()
  const location = useLocation()
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(location.search)
  const searchQuery = searchParams.get("search")
  const brandParam = searchParams.get("brand")

  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [filters, setFilters] = useState({
    category: category || "all",
    priceRange: [0, 10000],
    sortBy: "newest",
    brands: brandParam ? [brandParam] : [],
    rating: 0,
  })
  const [priceStats, setPriceStats] = useState({
    min: 0,
    max: 10000,
  })
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState("grid") // grid or list
  const [expandedFilters, setExpandedFilters] = useState({
    categories: true,
    price: true,
    brands: true,
    rating: true,
  })

  // Mock brands for filter
  const availableBrands = [
    "Himalaya",
    "Dabur",
    "Patanjali",
    "Lotus",
    "Lakme",
    "Maybelline",
    "Biotique",
    "Forest Essentials",
  ]

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const allProducts = await getProducts()
        setProducts(allProducts)

        // Calculate min and max prices from actual products
        if (allProducts.length > 0) {
          const prices = allProducts.map((product) => product.price)
          const minPrice = Math.floor(Math.min(...prices) / 100) * 100 // Round down to nearest 100
          const maxPrice = Math.ceil(Math.max(...prices) / 100) * 100 // Round up to nearest 100

          setPriceStats({
            min: minPrice,
            max: maxPrice,
          })

          setFilters((prev) => ({
            ...prev,
            priceRange: [minPrice, maxPrice],
          }))
        }

        setLoading(false)
      } catch (error) {
        console.error("Error fetching products:", error)
        setLoading(false)
      }
    }

    fetchProducts()
  }, [])

  // Add this new useEffect to handle category from query params
  useEffect(() => {
    // Get category from query params
    const categoryParam = searchParams.get("category")
    if (categoryParam) {
      setFilters((prev) => ({ ...prev, category: categoryParam }))
    }
  }, [location.search])

  useEffect(() => {
    // Update category filter when URL param changes
    if (category) {
      setFilters((prev) => ({ ...prev, category }))
    }
  }, [category])

  useEffect(() => {
    // Update brand filter when URL param changes
    if (brandParam) {
      setFilters((prev) => ({
        ...prev,
        brands: prev.brands.includes(brandParam) ? prev.brands : [brandParam],
      }))
    }
  }, [brandParam])

  useEffect(() => {
    // Apply filters and search
    let result = [...products]

    // Apply category filter
    if (filters.category !== "all") {
      result = result.filter((product) => product.category === filters.category)
    }

    // Apply price range filter
    result = result.filter(
      (product) => product.price >= filters.priceRange[0] && product.price <= filters.priceRange[1],
    )

    // Apply brand filter
    if (filters.brands.length > 0) {
      result = result.filter((product) => filters.brands.includes(product.brand))
    }

    // Apply rating filter
    if (filters.rating > 0) {
      result = result.filter((product) => product.rating >= filters.rating)
    }

    // Apply search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      result = result.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.brand.toLowerCase().includes(query),
      )
    }

    // Apply sorting
    switch (filters.sortBy) {
      case "price-low-high":
        result.sort((a, b) => a.price - b.price)
        break
      case "price-high-low":
        result.sort((a, b) => b.price - a.price)
        break
      case "popularity":
        result.sort((a, b) => b.reviewCount - a.reviewCount)
        break
      case "rating":
        result.sort((a, b) => b.rating - a.rating)
        break
      case "discount":
        result.sort((a, b) => {
          const discountA = a.originalPrice ? ((a.originalPrice - a.price) / a.originalPrice) * 100 : 0
          const discountB = b.originalPrice ? ((b.originalPrice - b.price) / b.originalPrice) * 100 : 0
          return discountB - discountA
        })
        break
      case "newest":
      default:
        // Assuming products have a createdAt date
        result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        break
    }

    setFilteredProducts(result)
  }, [products, filters, searchQuery, brandParam])

  const handleSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sortBy: e.target.value }))
  }

  const handlePriceRangeChange = (newRange) => {
    setFilters((prev) => ({ ...prev, priceRange: newRange }))
  }

  const handleBrandChange = (brand) => {
    setFilters((prev) => {
      const newBrands = prev.brands.includes(brand) ? prev.brands.filter((b) => b !== brand) : [...prev.brands, brand]

      // Update URL with brand parameter
      const params = new URLSearchParams(location.search)
      if (newBrands.length === 1) {
        params.set("brand", newBrands[0])
      } else if (newBrands.length === 0) {
        params.delete("brand")
      }
      navigate(`${location.pathname}?${params.toString()}`)

      return { ...prev, brands: newBrands }
    })
  }

  const handleRatingChange = (rating) => {
    setFilters((prev) => ({
      ...prev,
      rating: prev.rating === rating ? 0 : rating,
    }))
  }

  const toggleFilterSection = (section) => {
    setExpandedFilters((prev) => ({
      ...prev,
      [section]: !prev[section],
    }))
  }

  const clearFilters = () => {
    setFilters({
      category: "all",
      priceRange: [priceStats.min, priceStats.max],
      sortBy: "newest",
      brands: [],
      rating: 0,
    })

    // Clear URL parameters
    navigate(location.pathname)
  }

  const toggleFilters = () => {
    setShowFilters(!showFilters)
  }

  const toggleViewMode = () => {
    setViewMode(viewMode === "grid" ? "list" : "grid")
  }

  const getPageTitle = () => {
    if (searchQuery) {
      return `Search Results for "${searchQuery}"`
    }

    if (brandParam) {
      return `${brandParam} Products`
    }

    if (category) {
      return category.charAt(0).toUpperCase() + category.slice(1)
    }

    return "All Products"
  }

  return (
    <div className={styles.productsPage}>
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>{getPageTitle()}</h1>

          <div className={styles.breadcrumbs}>
            <span>Home</span>
            <span>/</span>
            <span>Products</span>
            {category && (
              <>
                <span>/</span>
                <span>{category.charAt(0).toUpperCase() + category.slice(1)}</span>
              </>
            )}
            {brandParam && (
              <>
                <span>/</span>
                <span>{brandParam}</span>
              </>
            )}
          </div>
        </div>

        <div className={styles.filterControls}>
          <button className={styles.mobileFilterToggle} onClick={toggleFilters}>
            <Filter size={18} />
            <span>{showFilters ? "Hide Filters" : "Show Filters"}</span>
          </button>

          <div className={styles.viewControls}>
            <div className={styles.resultsCount}>
              {filteredProducts.length} {filteredProducts.length === 1 ? "product" : "products"} found
            </div>

            <div className={styles.viewOptions}>
              <button
                className={`${styles.viewButton} ${viewMode === "grid" ? styles.active : ""}`}
                onClick={() => setViewMode("grid")}
                aria-label="Grid view"
              >
                <Grid size={18} />
              </button>
              <button
                className={`${styles.viewButton} ${viewMode === "list" ? styles.active : ""}`}
                onClick={() => setViewMode("list")}
                aria-label="List view"
              >
                <List size={18} />
              </button>
            </div>

            <div className={styles.sortOptions}>
              <label>Sort by:</label>
              <select value={filters.sortBy} onChange={handleSortChange}>
                <option value="newest">Newest</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="popularity">Popularity</option>
                <option value="rating">Rating</option>
                <option value="discount">Discount</option>
              </select>
            </div>
          </div>
        </div>

        <div className={styles.productsContainer}>
          {/* Filters Sidebar */}
          <aside className={`${styles.filtersSidebar} ${showFilters ? styles.showFilters : ""}`}>
            <div className={styles.filtersHeader}>
              <h2>
                <SlidersHorizontal size={18} />
                <span>Filters</span>
              </h2>
              <button className={styles.clearFiltersBtn} onClick={clearFilters}>
                Clear All
              </button>
            </div>

            <div className={styles.filtersList}>
              <div className={styles.filterSection}>
                <button className={styles.filterHeader} onClick={() => toggleFilterSection("categories")}>
                  <h3>Categories</h3>
                  <ChevronDown size={18} className={expandedFilters.categories ? styles.expanded : ""} />
                </button>

                {expandedFilters.categories && (
                  <ul className={styles.categoryList}>
                    <li>
                      <button
                        className={filters.category === "all" ? styles.active : ""}
                        onClick={() => setFilters((prev) => ({ ...prev, category: "all" }))}
                      >
                        All Products
                        {filters.category === "all" && <Check size={16} />}
                      </button>
                    </li>
                    <li>
                      <button
                        className={filters.category === "skincare" ? styles.active : ""}
                        onClick={() => setFilters((prev) => ({ ...prev, category: "skincare" }))}
                      >
                        Skincare
                        {filters.category === "skincare" && <Check size={16} />}
                      </button>
                    </li>
                    <li>
                      <button
                        className={filters.category === "makeup" ? styles.active : ""}
                        onClick={() => setFilters((prev) => ({ ...prev, category: "makeup" }))}
                      >
                        Makeup
                        {filters.category === "makeup" && <Check size={16} />}
                      </button>
                    </li>
                    <li>
                      <button
                        className={filters.category === "haircare" ? styles.active : ""}
                        onClick={() => setFilters((prev) => ({ ...prev, category: "haircare" }))}
                      >
                        Haircare
                        {filters.category === "haircare" && <Check size={16} />}
                      </button>
                    </li>
                    <li>
                      <button
                        className={filters.category === "fragrance" ? styles.active : ""}
                        onClick={() => setFilters((prev) => ({ ...prev, category: "fragrance" }))}
                      >
                        Fragrance
                        {filters.category === "fragrance" && <Check size={16} />}
                      </button>
                    </li>
                  </ul>
                )}
              </div>

              <div className={styles.filterSection}>
                <button className={styles.filterHeader} onClick={() => toggleFilterSection("price")}>
                  <h3>Price Range</h3>
                  <ChevronDown size={18} className={expandedFilters.price ? styles.expanded : ""} />
                </button>

                {expandedFilters.price && (
                  <div className={styles.priceFilter}>
                    <PriceRangeSlider
                      minPrice={priceStats.min}
                      maxPrice={priceStats.max}
                      initialMin={filters.priceRange[0]}
                      initialMax={filters.priceRange[1]}
                      onChange={handlePriceRangeChange}
                      step={100}
                    />
                  </div>
                )}
              </div>

              <div className={styles.filterSection}>
                <button className={styles.filterHeader} onClick={() => toggleFilterSection("brands")}>
                  <h3>Brands</h3>
                  <ChevronDown size={18} className={expandedFilters.brands ? styles.expanded : ""} />
                </button>

                {expandedFilters.brands && (
                  <ul className={styles.brandList}>
                    {availableBrands.map((brand) => (
                      <li key={brand}>
                        <label className={styles.checkboxLabel}>
                          <input
                            type="checkbox"
                            checked={filters.brands.includes(brand)}
                            onChange={() => handleBrandChange(brand)}
                          />
                          <span className={styles.customCheckbox}>
                            {filters.brands.includes(brand) && <Check size={12} />}
                          </span>
                          <span>{brand}</span>
                        </label>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className={styles.filterSection}>
                <button className={styles.filterHeader} onClick={() => toggleFilterSection("rating")}>
                  <h3>Rating</h3>
                  <ChevronDown size={18} className={expandedFilters.rating ? styles.expanded : ""} />
                </button>

                {expandedFilters.rating && (
                  <div className={styles.ratingFilter}>
                    {[4, 3, 2, 1].map((rating) => (
                      <button
                        key={rating}
                        className={`${styles.ratingButton} ${filters.rating === rating ? styles.active : ""}`}
                        onClick={() => handleRatingChange(rating)}
                      >
                        <div className={styles.stars}>
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              size={14}
                              fill={i < rating ? "currentColor" : "none"}
                              className={i < rating ? styles.starFilled : styles.starEmpty}
                            />
                          ))}
                        </div>
                        <span>& Up</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <button className={styles.closeFiltersBtn} onClick={toggleFilters}>
              <X size={18} />
              <span>Close Filters</span>
            </button>
          </aside>

          {/* Products Grid */}
          <div className={styles.productsGrid}>
            {loading ? (
              <div className={styles.loadingContainer}>
                <div className={styles.loadingSpinner}></div>
                <p>Loading products...</p>
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className={styles.noResults}>
                <div className={styles.noResultsIcon}>
                  <X size={40} />
                </div>
                <h3>No products found</h3>
                <p>No products match your current filter criteria.</p>
                <button className={styles.clearFiltersBtn} onClick={clearFilters}>
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className={`${styles.productsWrapper} ${styles[viewMode]}`}>
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} horizontal={viewMode === "list"} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductsPage
