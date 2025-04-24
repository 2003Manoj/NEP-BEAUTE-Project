"use client"

import { useState } from "react"
import { Star, ThumbsUp, Check } from "lucide-react"
import styles from "./ReviewList.module.css"

const ReviewList = ({ reviews, productRating }) => {
  const [sortBy, setSortBy] = useState("recent")
  const [filterRating, setFilterRating] = useState(0)

  // Filter reviews by rating
  const filteredReviews = reviews.filter((review) => {
    if (filterRating === 0) return true
    return review.rating === filterRating
  })

  // Sort reviews
  const sortedReviews = [...filteredReviews].sort((a, b) => {
    if (sortBy === "recent") {
      return new Date(b.date) - new Date(a.date)
    } else if (sortBy === "helpful") {
      return b.helpfulCount - a.helpfulCount
    } else if (sortBy === "highest") {
      return b.rating - a.rating
    } else if (sortBy === "lowest") {
      return a.rating - b.rating
    }
    return 0
  })

  // Calculate rating distribution
  const ratingCounts = [0, 0, 0, 0, 0]
  reviews.forEach((review) => {
    if (review.rating >= 1 && review.rating <= 5) {
      ratingCounts[review.rating - 1]++
    }
  })

  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <div className={styles.reviewList}>
      <div className={styles.reviewSummary}>
        <div className={styles.averageRating}>
          <div className={styles.ratingNumber}>{productRating.toFixed(1)}</div>
          <div className={styles.ratingStars}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={18}
                className={star <= productRating ? styles.starFilled : styles.starEmpty}
                fill={star <= productRating ? "currentColor" : "none"}
              />
            ))}
          </div>
          <div className={styles.ratingCount}>Based on {reviews.length} reviews</div>
        </div>

        <div className={styles.ratingDistribution}>
          {[5, 4, 3, 2, 1].map((rating) => (
            <div key={rating} className={styles.ratingBar}>
              <button
                className={`${styles.ratingButton} ${filterRating === rating ? styles.active : ""}`}
                onClick={() => setFilterRating(filterRating === rating ? 0 : rating)}
              >
                {rating} star{rating !== 1 ? "s" : ""}
              </button>
              <div className={styles.barContainer}>
                <div
                  className={styles.bar}
                  style={{
                    width: `${reviews.length ? (ratingCounts[rating - 1] / reviews.length) * 100 : 0}%`,
                  }}
                ></div>
              </div>
              <div className={styles.ratingBarCount}>{ratingCounts[rating - 1]}</div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.reviewControls}>
        <div className={styles.reviewCount}>
          {filteredReviews.length} {filteredReviews.length === 1 ? "review" : "reviews"}
          {filterRating > 0 && ` with ${filterRating} star${filterRating !== 1 ? "s" : ""}`}
        </div>
        <div className={styles.sortOptions}>
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="recent">Most Recent</option>
            <option value="helpful">Most Helpful</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
          </select>
        </div>
      </div>

      {sortedReviews.length === 0 ? (
        <div className={styles.noReviews}>
          <p>No reviews match your current filter.</p>
          {filterRating > 0 && (
            <button className={styles.clearFilterBtn} onClick={() => setFilterRating(0)}>
              Clear Filter
            </button>
          )}
        </div>
      ) : (
        <div className={styles.reviewItems}>
          {sortedReviews.map((review) => (
            <div key={review.id} className={styles.reviewItem}>
              <div className={styles.reviewHeader}>
                <div className={styles.reviewerInfo}>
                  <img src={review.userImage || "/placeholder.svg"} alt={review.userName} />
                  <div>
                    <h4>{review.userName}</h4>
                    {review.verified && (
                      <div className={styles.verifiedBadge}>
                        <Check size={12} />
                        <span>Verified Purchase</span>
                      </div>
                    )}
                  </div>
                </div>
                <div className={styles.reviewDate}>{formatDate(review.date)}</div>
              </div>

              <div className={styles.reviewRating}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={16}
                    className={star <= review.rating ? styles.starFilled : styles.starEmpty}
                    fill={star <= review.rating ? "currentColor" : "none"}
                  />
                ))}
              </div>

              <h3 className={styles.reviewTitle}>{review.title}</h3>
              <p className={styles.reviewText}>{review.text}</p>

              <div className={styles.reviewFooter}>
                <button className={styles.helpfulButton}>
                  <ThumbsUp size={14} />
                  <span>Helpful ({review.helpfulCount})</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ReviewList
