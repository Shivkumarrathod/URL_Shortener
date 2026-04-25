import { useState } from 'react'
import { shortenUrl, getStats } from './api'

export default function App() {
  // Shorten URL state
  const [urlInput, setUrlInput] = useState('')
  const [shortenResult, setShortenResult] = useState(null)
  const [shortenError, setShortenError] = useState('')
  const [shortenLoading, setShortenLoading] = useState(false)
  const [copyFeedback, setCopyFeedback] = useState('')

  // Stats state
  const [statsCode, setStatsCode] = useState('')
  const [statsResult, setStatsResult] = useState(null)
  const [statsError, setStatsError] = useState('')
  const [statsLoading, setStatsLoading] = useState(false)

  /**
   * Handle URL shortening form submission
   */
  const handleShortenSubmit = async (e) => {
    e.preventDefault()
    
    if (!urlInput.trim()) {
      setShortenError('Please enter a valid URL')
      return
    }

    setShortenLoading(true)
    setShortenError('')
    setShortenResult(null)

    try {
      const result = await shortenUrl(urlInput)
      setShortenResult(result)
      setUrlInput('')
      setCopyFeedback('')
    } catch (error) {
      setShortenError(error.message)
    } finally {
      setShortenLoading(false)
    }
  }

  /**
   * Handle copying short URL to clipboard
   */
  const handleCopyToClipboard = async () => {
    if (!shortenResult?.shortUrl) return

    try {
      await navigator.clipboard.writeText(shortenResult.shortUrl)
      setCopyFeedback('Copied!')
      setTimeout(() => setCopyFeedback(''), 2000)
    } catch (error) {
      setShortenError('Failed to copy to clipboard')
    }
  }

  /**
   * Handle stats form submission
   */
  const handleStatsSubmit = async (e) => {
    e.preventDefault()

    if (!statsCode.trim()) {
      setStatsError('Please enter a short code')
      return
    }

    setStatsLoading(true)
    setStatsError('')
    setStatsResult(null)

    try {
      const result = await getStats(statsCode)
      setStatsResult(result)
      setStatsCode('')
    } catch (error) {
      setStatsError(error.message)
    } finally {
      setStatsLoading(false)
    }
  }

  /**
   * Format date to readable format
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A'
    try {
      return new Date(dateString).toLocaleString()
    } catch {
      return dateString
    }
  }

  return (
    <div className="app">
      <header className="header">
        <h1>🔗 URL Shortener</h1>
        <p>Shorten long URLs instantly</p>
      </header>

      <main className="container">
        {/* Shorten URL Section */}
        <section className="card">
          <h2>Shorten URL</h2>
          <form onSubmit={handleShortenSubmit}>
            <div className="form-group">
              <label htmlFor="urlInput">Enter your long URL:</label>
              <input
                id="urlInput"
                type="url"
                placeholder="https://example.com/very/long/url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                disabled={shortenLoading}
              />
            </div>
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={shortenLoading}
            >
              {shortenLoading ? 'Processing...' : 'Shorten'}
            </button>
          </form>

          {shortenLoading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Processing...</p>
            </div>
          )}

          {shortenError && (
            <div className="error">
              {shortenError}
            </div>
          )}

          {shortenResult && (
            <div className="result">
              <div className="success-message">✓ URL shortened successfully!</div>
              <div className="result-box">
                <div className="result-item">
                  <label>Short URL:</label>
                  <div className="result-content">
                    <input
                      type="text"
                      value={shortenResult.shortUrl}
                      readOnly
                    />
                    <button
                      type="button"
                      className="btn btn-small btn-copy"
                      onClick={handleCopyToClipboard}
                    >
                      {copyFeedback || 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="result-item">
                  <label>Short Code:</label>
                  <input
                    type="text"
                    value={shortenResult.code}
                    readOnly
                  />
                </div>
              </div>
            </div>
          )}
        </section>

        {/* Stats Section */}
        <section className="card">
          <h2>View Stats</h2>
          <form onSubmit={handleStatsSubmit}>
            <div className="form-group">
              <label htmlFor="codeInput">Enter short code:</label>
              <input
                id="codeInput"
                type="text"
                placeholder="e.g., abc123"
                value={statsCode}
                onChange={(e) => setStatsCode(e.target.value)}
                disabled={statsLoading}
              />
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={statsLoading}
            >
              {statsLoading ? 'Fetching...' : 'Get Stats'}
            </button>
          </form>

          {statsLoading && (
            <div className="loading">
              <div className="spinner"></div>
              <p>Fetching stats...</p>
            </div>
          )}

          {statsError && (
            <div className="error">
              {statsError}
            </div>
          )}

          {statsResult && (
            <div className="result">
              <div className="stats-box">
                <div className="stat-item">
                  <label>Short Code:</label>
                  <span>{statsResult.code}</span>
                </div>
                <div className="stat-item">
                  <label>Original URL:</label>
                  <span className="url-text">{statsResult.url}</span>
                </div>
                <div className="stat-item">
                  <label>Click Count:</label>
                  <span className="click-count">{statsResult.clicks || 0}</span>
                </div>
                <div className="stat-item">
                  <label>Created At:</label>
                  <span>{formatDate(statsResult.createdAt)}</span>
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}
