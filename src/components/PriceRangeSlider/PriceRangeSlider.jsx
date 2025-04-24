"use client"

import { useState, useEffect, useRef } from "react"
import styles from "./PriceRangeSlider.module.css"

const PriceRangeSlider = ({ minPrice, maxPrice, initialMin, initialMax, onChange, step = 100 }) => {
  const [minValue, setMinValue] = useState(initialMin)
  const [maxValue, setMaxValue] = useState(initialMax)
  const [isDragging, setIsDragging] = useState(null)

  const rangeRef = useRef(null)
  const minThumbRef = useRef(null)
  const maxThumbRef = useRef(null)
  const rangeLineRef = useRef(null)

  // Calculate the percentage for positioning
  const getPercent = (value) => {
    return Math.round(((value - minPrice) / (maxPrice - minPrice)) * 100)
  }

  // Update range line position
  useEffect(() => {
    if (rangeLineRef.current) {
      const minPercent = getPercent(minValue)
      const maxPercent = getPercent(maxValue)

      rangeLineRef.current.style.left = `${minPercent}%`
      rangeLineRef.current.style.width = `${maxPercent - minPercent}%`
    }
  }, [minValue, maxValue, minPrice, maxPrice])

  // Handle min value change
  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxValue - step)
    setMinValue(value)
    onChange([value, maxValue])
  }

  // Handle max value change
  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minValue + step)
    setMaxValue(value)
    onChange([minValue, value])
  }

  // Format price for display
  const formatPrice = (price) => {
    return `Rs. ${price.toLocaleString()}`
  }

  return (
    <div className={styles.priceRangeSlider}>
      <div className={styles.sliderValues}>
        <div className={styles.minValue}>{formatPrice(minValue)}</div>
        <div className={styles.maxValue}>{formatPrice(maxValue)}</div>
      </div>

      <div className={styles.sliderContainer} ref={rangeRef}>
        <div className={styles.sliderTrack}></div>
        <div className={styles.sliderRange} ref={rangeLineRef}></div>

        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={minValue}
          step={step}
          onChange={handleMinChange}
          className={`${styles.thumb} ${styles.thumbLeft}`}
          ref={minThumbRef}
        />

        <input
          type="range"
          min={minPrice}
          max={maxPrice}
          value={maxValue}
          step={step}
          onChange={handleMaxChange}
          className={`${styles.thumb} ${styles.thumbRight}`}
          ref={maxThumbRef}
        />
      </div>

      <div className={styles.priceInputs}>
        <div className={styles.inputGroup}>
          <label>Min</label>
          <input
            type="number"
            value={minValue}
            min={minPrice}
            max={maxValue - step}
            step={step}
            onChange={handleMinChange}
          />
        </div>
        <div className={styles.inputDivider}>-</div>
        <div className={styles.inputGroup}>
          <label>Max</label>
          <input
            type="number"
            value={maxValue}
            min={minValue + step}
            max={maxPrice}
            step={step}
            onChange={handleMaxChange}
          />
        </div>
      </div>
    </div>
  )
}

export default PriceRangeSlider
