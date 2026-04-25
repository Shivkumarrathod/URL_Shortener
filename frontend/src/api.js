const API_BASE_URL = 'http://localhost:3000'

/**
 * Shorten a URL
 * @param {string} url - The long URL to shorten
 * @returns {Promise<{code: string, shortUrl: string}>}
 */
export async function shortenUrl(url) {
  const response = await fetch(`${API_BASE_URL}/shorten`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ url }),
  })

  if (!response.ok) {
    const data = await response.json()
    throw new Error(data.error || 'Failed to shorten URL')
  }

  return response.json()
}

/**
 * Get stats for a short code
 * @param {string} code - The short code
 * @returns {Promise<{code: string, url: string, clicks: number, createdAt: string}>}
 */
export async function getStats(code) {
  const response = await fetch(`${API_BASE_URL}/stats/${code}`)

  if (!response.ok) {
    if (response.status === 404) {
      throw new Error('Short code not found')
    }
    const data = await response.json()
    throw new Error(data.error || 'Failed to fetch stats')
  }

  return response.json()
}
