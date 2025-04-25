"use client"

import { createContext, useContext, useState, useEffect } from "react"

// Define available currencies with their symbols and conversion rates (relative to NPR)
const CURRENCIES = {
  NPR: {
    name: "Nepalese Rupee",
    symbol: "Rs.",
    rate: 1, // Base currency
    format: (amount) => `Rs. ${amount.toLocaleString()}`,
  },
  USD: {
    name: "US Dollar",
    symbol: "$",
    rate: 0.0075, // 1 NPR = 0.0075 USD
    format: (amount) => `$${amount.toLocaleString()}`,
  },
  INR: {
    name: "Indian Rupee",
    symbol: "₹",
    rate: 0.63, // 1 NPR = 0.63 INR
    format: (amount) => `₹${amount.toLocaleString()}`,
  },
  EUR: {
    name: "Euro",
    symbol: "€",
    rate: 0.0069, // 1 NPR = 0.0069 EUR
    format: (amount) => `€${amount.toLocaleString()}`,
  },
  GBP: {
    name: "British Pound",
    symbol: "£",
    rate: 0.0059, // 1 NPR = 0.0059 GBP
    format: (amount) => `£${amount.toLocaleString()}`,
  },
}

const CurrencyContext = createContext()

export const useCurrency = () => useContext(CurrencyContext)

export const CurrencyProvider = ({ children }) => {
  const [selectedCurrency, setSelectedCurrency] = useState("NPR")
  const [exchangeRates, setExchangeRates] = useState(CURRENCIES)

  // Load saved currency preference from localStorage on initial render
  useEffect(() => {
    const savedCurrency = localStorage.getItem("nepbeaute-currency")
    if (savedCurrency && CURRENCIES[savedCurrency]) {
      setSelectedCurrency(savedCurrency)
    }
  }, [])

  // Save currency preference to localStorage when it changes
  useEffect(() => {
    localStorage.setItem("nepbeaute-currency", selectedCurrency)
  }, [selectedCurrency])

  // Function to change the selected currency
  const changeCurrency = (currencyCode) => {
    if (CURRENCIES[currencyCode]) {
      setSelectedCurrency(currencyCode)
    }
  }

  // Function to convert price from NPR to selected currency
  const convertPrice = (priceInNPR) => {
    if (!priceInNPR) return 0

    const rate = exchangeRates[selectedCurrency].rate
    const convertedAmount = priceInNPR * rate

    // Round to 2 decimal places for most currencies, but keep integers for NPR and INR
    return ["NPR", "INR"].includes(selectedCurrency)
      ? Math.round(convertedAmount)
      : Math.round(convertedAmount * 100) / 100
  }

  // Function to format price according to the selected currency
  const formatPrice = (priceInNPR) => {
    if (!priceInNPR) return exchangeRates[selectedCurrency].format(0)

    const convertedPrice = convertPrice(priceInNPR)
    return exchangeRates[selectedCurrency].format(convertedPrice)
  }

  // Get current currency symbol
  const getCurrencySymbol = () => exchangeRates[selectedCurrency].symbol

  const value = {
    currencies: CURRENCIES,
    selectedCurrency,
    changeCurrency,
    convertPrice,
    formatPrice,
    getCurrencySymbol,
  }

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>
}
