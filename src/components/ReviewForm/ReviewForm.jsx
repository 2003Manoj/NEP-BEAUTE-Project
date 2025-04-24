"use client"

import { useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { Star } from "lucide-react"
import styles from "./ReviewForm.module.css"

const ReviewForm = ({ productId, onReviewSubmit }) => {
  const { user } = useAuth()
  const [rating, setRating] = useState(0)
  const [hoverRating, setHoverRating] = useState(0)
  const [reviewText, setReviewText] = useState("")
  const [title, setTitle] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState("")

  const handleRatingClick = (selectedRating) => {
    setRating(selectedRating)
  }

  const handleRatingHover = (hoveredRating) => {
    setHoverRating(hoveredRating)
  }

  const handleRatingLeave = () => {
    setHoverRating(0)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!user) {
      setError("Please log in to submit a review")
      return
    }

    if (rating === 0) {
      setError("Please select a rating")
      return
    }

    if (!title.trim()) {
      setError("Please enter a review title")
      return
    }

    if (!reviewText.trim()) {
      setError("Please enter your review")
      return
    }

    setIsSubmitting(true)
    setError("")

    try {
      // In a real app, this would be an API call
      const newReview = {
        id: Date.now().toString(),
        productId,
        userId: user.id,
        userName: `${user.firstName} ${user.lastName}`,
        userImage: "https://randomuser.me/api/portraits/women/32.jpg", // Placeholder
        rating,
        title,
        text: reviewText,
        date: new Date().toISOString(),
        helpfulCount: 0,
        verified: true,
      }

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000))

      onReviewSubmit(newReview)

      // Reset form
      setRating(0)
      setReviewText("")
      setTitle("")
    } catch (err) {
      setError("Failed to submit review. Please try again.")
      console.error("Error submitting review:", err)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className={styles.reviewForm}>
      <h3>Write a Review</h3>

      {!user && (
        <div className={styles.loginPrompt}>
          <p>
            Please <a href="/login">log in</a> to write a review
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className={styles.formGroup}>
          <label>Your Rating *</label>
          <div className={styles.ratingSelector} onMouseLeave={handleRatingLeave}>
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className={`${styles.starButton} ${(hoverRating || rating) >= star ? styles.filled : ""}`}
                onClick={() => handleRatingClick(star)}
                onMouseEnter={() => handleRatingHover(star)}
              >
                <Star size={24} />
              </button>
            ))}
          </div>
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="reviewTitle">Review Title *</label>
          <input
            type="text"
            id="reviewTitle"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Summarize your experience"
            disabled={!user}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="reviewText">Your Review *</label>
          <textarea
            id="reviewText"
            rows="5"
            value={reviewText}
            onChange={(e) => setReviewText(e.target.value)}
            placeholder="What did you like or dislike about this product?"
            disabled={!user}
          ></textarea>
        </div>

        {error && <div className={styles.errorMessage}>{error}</div>}

        <button type="submit" className={styles.submitButton} disabled={isSubmitting || !user}>
          {isSubmitting ? "Submitting..." : "Submit Review"}
        </button>
      </form>
    </div>
  )
}

export default ReviewForm
