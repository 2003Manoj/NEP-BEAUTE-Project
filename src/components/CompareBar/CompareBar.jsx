"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { useCompare } from "../../contexts/CompareContext"
import { X, ChevronUp, ChevronDown, ArrowRight } from "lucide-react"
import styles from "./CompareBar.module.css"

const CompareBar = () => {
  const { compareItems, removeFromCompare, clearCompare, showCompareBar, toggleCompareBar } = useCompare()
  const [isExpanded, setIsExpanded] = useState(true)
  const navigate = useNavigate()

  const handleCompare = () => {
    if (compareItems.length < 2) {
      alert("Please add at least 2 products to compare")
      return
    }

    // Create a URL with product IDs as query parameters
    const productIds = compareItems.map((item) => item.id).join(",")
    navigate(`/compare?products=${productIds}`)
  }

  const toggleExpand = () => {
    setIsExpanded(!isExpanded)
  }

  if (!showCompareBar || compareItems.length === 0) {
    return null
  }

  return (
    <div className={`${styles.compareBar} ${isExpanded ? styles.expanded : styles.collapsed}`}>
      <div className={styles.compareBarHeader}>
        <div className={styles.compareTitle}>
          <button className={styles.expandButton} onClick={toggleExpand}>
            {isExpanded ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
          </button>
          <h3>Compare Products ({compareItems.length})</h3>
        </div>
        <div className={styles.compareActions}>
          <button className={styles.clearButton} onClick={clearCompare}>
            Clear All
          </button>
          <button className={styles.closeButton} onClick={toggleCompareBar}>
            <X size={18} />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className={styles.compareBarContent}>
          <div className={styles.compareItems}>
            {compareItems.map((item) => (
              <div key={item.id} className={styles.compareItem}>
                <button className={styles.removeButton} onClick={() => removeFromCompare(item.id)}>
                  <X size={14} />
                </button>
                <div className={styles.compareItemImage}>
                  <img src={item.image || "/placeholder.svg"} alt={item.name} />
                </div>
                <div className={styles.compareItemInfo}>
                  <div className={styles.compareItemBrand}>{item.brand}</div>
                  <div className={styles.compareItemName}>{item.name}</div>
                </div>
              </div>
            ))}

            {/* Empty slots */}
            {Array.from({ length: 4 - compareItems.length }).map((_, index) => (
              <div key={`empty-${index}`} className={styles.emptyCompareItem}>
                <div className={styles.emptyCompareItemContent}>
                  <span>Add Product</span>
                </div>
              </div>
            ))}
          </div>

          <button className={styles.compareButton} onClick={handleCompare} disabled={compareItems.length < 2}>
            Compare Now <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}

export default CompareBar
