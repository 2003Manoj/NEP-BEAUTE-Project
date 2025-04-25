"use client"

import { useState } from "react"
import { useCurrency } from "../../contexts/CurrencyContext"
import { ChevronDown } from "lucide-react"
import styles from "./CurrencyDropdown.module.css"

const CurrencyDropdown = () => {
  const { currencies, selectedCurrency, changeCurrency } = useCurrency()
  const [isOpen, setIsOpen] = useState(false)

  const handleCurrencyChange = (currencyCode) => {
    changeCurrency(currencyCode)
    setIsOpen(false)
  }

  return (
    <div className={styles.currencyDropdown}>
      <button
        className={styles.dropdownToggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="true"
      >
        <span className={styles.currentCurrency}>
          {currencies[selectedCurrency].symbol} {selectedCurrency}
        </span>
        <ChevronDown size={16} className={isOpen ? styles.rotated : ""} />
      </button>

      {isOpen && (
        <div className={styles.dropdownMenu}>
          {Object.keys(currencies).map((code) => (
            <button
              key={code}
              className={`${styles.currencyOption} ${selectedCurrency === code ? styles.active : ""}`}
              onClick={() => handleCurrencyChange(code)}
            >
              <span className={styles.currencySymbol}>{currencies[code].symbol}</span>
              <span className={styles.currencyCode}>{code}</span>
              <span className={styles.currencyName}>{currencies[code].name}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default CurrencyDropdown
