"use client"

import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Search } from "lucide-react"
import styles from "./SearchBar.module.css"

const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [suggestions, setSuggestions] = useState([])
  const navigate = useNavigate()

  // Mock suggestions - in a real app, this would come from an API
  const mockSuggestions = [
    { id: 1, name: "Himalayan Face Wash" },
    { id: 2, name: "Kumkumadi Face Oil" },
    { id: 3, name: "Aloe Vera Gel" },
    { id: 4, name: "Rose Water Toner" },
    { id: 5, name: "Sandalwood Face Pack" },
    { id: 6, name: "Lip Balm" },
    { id: 7, name: "Kajal" },
    { id: 8, name: "Hair Oil" },
  ]

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchTerm)}`)
      setSearchTerm("")
      setSuggestions([])
    }
  }

  const handleInputChange = (e) => {
    const value = e.target.value
    setSearchTerm(value)

    if (value.length > 1) {
      const filtered = mockSuggestions.filter((item) => item.name.toLowerCase().includes(value.toLowerCase()))
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }

  const handleSuggestionClick = (suggestion) => {
    navigate(`/product/${suggestion.id}`)
    setSearchTerm("")
    setSuggestions([])
  }

  return (
    <div className={styles.searchBar}>
      <form onSubmit={handleSearch}>
        <div className={styles.inputContainer}>
          <input type="text" placeholder="Search for products..." value={searchTerm} onChange={handleInputChange} />
          <button type="submit" className={styles.searchButton}>
            <Search size={18} />
          </button>
        </div>
      </form>

      {suggestions.length > 0 && (
        <div className={styles.suggestions}>
          {suggestions.map((suggestion) => (
            <div
              key={suggestion.id}
              className={styles.suggestionItem}
              onClick={() => handleSuggestionClick(suggestion)}
            >
              {suggestion.name}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default SearchBar
