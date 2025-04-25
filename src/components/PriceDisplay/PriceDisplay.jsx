"use client"

import { useCurrency } from "../../contexts/CurrencyContext"
import styles from "./PriceDisplay.module.css"

const PriceDisplay = ({ price, originalPrice = null, showDiscount = true, size = "medium" }) => {
  const { formatPrice } = useCurrency()

  // Calculate discount percentage
  const discountPercentage = originalPrice ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0

  return (
    <div className={`${styles.priceDisplay} ${styles[size]}`}>
      <span className={styles.price}>{formatPrice(price)}</span>

      {originalPrice && <span className={styles.originalPrice}>{formatPrice(originalPrice)}</span>}

      {showDiscount && discountPercentage > 0 && <span className={styles.discount}>{discountPercentage}% OFF</span>}
    </div>
  )
}

export default PriceDisplay
