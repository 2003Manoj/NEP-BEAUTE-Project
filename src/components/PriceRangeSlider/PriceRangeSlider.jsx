"use client"

import { useState, useEffect } from "react"
import styles from "./PriceRangeSlider.module.css"

const PriceRangeSlider = ({ minPrice, maxPrice, onChange }) => {
  const [minValue, setMinValue] = useState(minPrice)
  const [maxValue, setMaxValue] = useState(maxPrice)
  const [isDragging, setIsDragging] = useState(false)

  // Update local state when props change
  useEffect(() => {
    setMinValue(minPrice)
    setMaxValue(maxPrice)
  }, [minPrice, maxPrice])

  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxValue - 100)
    setMinValue(value)
    onChange([value, maxValue])
  }

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minValue + 100)
    setMaxValue(value)
    onChange([minValue, value])
  }

  const handleInputChange = (e, type) => {
    const value = Number(e.target.value.replace(/\D/g, ""))

    if (type === "min") {
      const newMin = Math.max(minPrice, Math.min(value, maxValue - 100))
      setMinValue(newMin)
      onChange([newMin, maxValue])
    } else {
      const newMax = Math.min(maxPrice, Math.max(value, minValue + 100))
      setMaxValue(newMax)
      onChange([minValue, newMax])
    }
  }

  // Calculate percentages for slider positioning
  const minPercent = ((minValue - minPrice) / (maxPrice - minPrice)) * 100
  const maxPercent = ((maxValue - minPrice) / (maxPrice - minPrice)) * 100

  return (
    <div className={styles.priceRangeSlider}>
      <div className={styles.sliderValues}>
        <span>Rs. {minPrice.toLocaleString()}</span>
        <span>Rs. {maxPrice.toLocaleString()}</span>
      </div>

      <div className={styles.sliderContainer}>
        <div className={styles.sliderTrack}></div>
        <div
          className={styles.sliderRange}
          style={{
            left: `${minPercent}%`,
            width: `${maxPercent - minPercent}%`,
          }}
        ></div>

        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={minValue}
          onChange={handleMinChange}
          className={`${styles.thumb} ${styles.thumbLeft}`}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
        />

        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={maxValue}
          onChange={handleMaxChange}
          className={styles.thumb}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
        />
      </div>

      <div className={styles.priceInputs}>
        <div className={styles.inputGroup}>
          <label>Min Price</label>
          <input
            type="text"
            value={minValue.toLocaleString()}
            onChange={(e) => handleInputChange(e, "min")}
            onBlur={() => onChange(minValue, maxValue)}
          />
        </div>

        <span className={styles.inputDivider}>-</span>

        <div className={styles.inputGroup}>
          <label>Max Price</label>
          <input
            type="text"
            value={maxValue.toLocaleString()}
            onChange={(e) => handleInputChange(e, "max")}
            onBlur={() => onChange(minValue, maxValue)}
          />
        </div>
      </div>
    </div>
  )
}

export default PriceRangeSlider
