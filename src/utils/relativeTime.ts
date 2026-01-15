/**
 * Converts an ISO date string to a relative time string
 * Examples: "Updated 2 days ago", "Updated 3 weeks ago", "Updated 1 month ago"
 */
export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMs = now.getTime() - date.getTime()
  const diffInSeconds = Math.floor(diffInMs / 1000)
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)
  const diffInWeeks = Math.floor(diffInDays / 7)
  const diffInMonths = Math.floor(diffInDays / 30)
  const diffInYears = Math.floor(diffInDays / 365)

  // Handle future dates (shouldn't happen, but just in case)
  if (diffInMs < 0) {
    return "Updated just now"
  }

  // Less than a minute
  if (diffInSeconds < 60) {
    return "Updated just now"
  }

  // Less than an hour
  if (diffInMinutes < 60) {
    return `Updated ${diffInMinutes} ${diffInMinutes === 1 ? "minute" : "minutes"} ago`
  }

  // Less than a day
  if (diffInHours < 24) {
    return `Updated ${diffInHours} ${diffInHours === 1 ? "hour" : "hours"} ago`
  }

  // Less than a week
  if (diffInDays < 7) {
    return `Updated ${diffInDays} ${diffInDays === 1 ? "day" : "days"} ago`
  }

  // Less than a month
  if (diffInWeeks < 4) {
    return `Updated ${diffInWeeks} ${diffInWeeks === 1 ? "week" : "weeks"} ago`
  }

  // Less than a year
  if (diffInMonths < 12) {
    return `Updated ${diffInMonths} ${diffInMonths === 1 ? "month" : "months"} ago`
  }

  // A year or more
  return `Updated ${diffInYears} ${diffInYears === 1 ? "year" : "years"} ago`
}
