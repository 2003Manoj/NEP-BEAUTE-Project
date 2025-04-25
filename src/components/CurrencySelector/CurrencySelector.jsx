"use client"

import { useState, useRef, useEffect } from "react"
import { useCurrency } from "../../contexts/CurrencyContext"
import { ChevronDown } from "lucide-react"
import styles from "./CurrencySelector.module.css"

const CurrencySelector = () => {
  const { currencies, selectedCurrency, changeCurrency } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleCurrencyChange = (currencyCode) => {
    changeCurrency(currencyCode)
    setIsOpen(false)
  }

  return (
    <div className={styles.currencySelector} ref={dropdownRef}>
      <button className={styles.selectorButton} onClick={toggleDropdown}>
        <span>{selectedCurrency}</span>
        <ChevronDown size={14} className={`${styles.icon} ${isOpen ? styles.rotated : ""}`} />
      </button>

      {isOpen && (
        <div className={styles.dropdown}>
          {Object.keys(currencies).map((currencyCode) => (
            <button
              key={currencyCode}
              className={`${styles.currencyOption} ${selectedCurrency === currencyCode ? styles.selected : ""}`}
              onClick={() => handleCurrencyChange(currencyCode)}
            >
              <span className={styles.currencyCode}>{currencyCode}</span>
              <span className={styles.currencyName}>{currencies[currencyCode].name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CurrencySelector
