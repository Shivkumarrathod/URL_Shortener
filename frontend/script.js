// Configuration
const API_BASE_URL = 'http://localhost:3000';

// DOM Elements
const shortenForm = document.getElementById('shortenForm');
const longUrlInput = document.getElementById('longUrl');
const resultContainer = document.getElementById('resultContainer');
const errorContainer = document.getElementById('errorContainer');
const loadingContainer = document.getElementById('loadingContainer');
const shortUrlDisplay = document.getElementById('shortUrlDisplay');
const codeDisplay = document.getElementById('codeDisplay');
const copyBtn = document.getElementById('copyBtn');
const errorMessage = document.getElementById('errorMessage');

const statsForm = document.getElementById('statsForm');
const statsCodeInput = document.getElementById('statsCode');
const statsContainer = document.getElementById('statsContainer');
const statsErrorContainer = document.getElementById('statsErrorContainer');
const statsLoadingContainer = document.getElementById('statsLoadingContainer');
const statsErrorMessage = document.getElementById('statsErrorMessage');

// Event Listeners
shortenForm.addEventListener('submit', handleShortenURL);
copyBtn.addEventListener('click', handleCopyToClipboard);
statsForm.addEventListener('submit', handleGetStats);

/**
 * Handle URL shortening
 */
async function handleShortenURL(e) {
    e.preventDefault();
    
    const url = longUrlInput.value.trim();
    
    if (!url) {
        showError('Please enter a valid URL');
        return;
    }

    // Clear previous results
    resultContainer.style.display = 'none';
    errorContainer.style.display = 'none';
    loadingContainer.style.display = 'flex';

    try {
        const response = await fetch(`${API_BASE_URL}/shorten`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ url }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.error || 'Failed to shorten URL');
        }

        const data = await response.json();
        
        // Display results
        shortUrlDisplay.value = data.shortUrl;
        codeDisplay.value = data.code;
        
        loadingContainer.style.display = 'none';
        errorContainer.style.display = 'none';
        resultContainer.style.display = 'block';
        
        // Clear input
        longUrlInput.value = '';
    } catch (error) {
        loadingContainer.style.display = 'none';
        showError(error.message || 'An error occurred while shortening the URL');
    }
}

/**
 * Handle copying short URL to clipboard
 */
async function handleCopyToClipboard() {
    const text = shortUrlDisplay.value;
    
    try {
        await navigator.clipboard.writeText(text);
        
        // Show success feedback
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✓ Copied!';
        copyBtn.style.backgroundColor = '#28a745';
        
        setTimeout(() => {
            copyBtn.textContent = originalText;
            copyBtn.style.backgroundColor = '';
        }, 2000);
    } catch (error) {
        showError('Failed to copy to clipboard');
    }
}

/**
 * Handle getting stats for a short code
 */
async function handleGetStats(e) {
    e.preventDefault();
    
    const code = statsCodeInput.value.trim();
    
    if (!code) {
        showStatsError('Please enter a short code');
        return;
    }

    // Clear previous results
    statsContainer.style.display = 'none';
    statsErrorContainer.style.display = 'none';
    statsLoadingContainer.style.display = 'flex';

    try {
        const response = await fetch(`${API_BASE_URL}/stats/${code}`);

        if (!response.ok) {
            if (response.status === 404) {
                throw new Error('Short code not found');
            }
            const data = await response.json();
            throw new Error(data.error || 'Failed to fetch stats');
        }

        const data = await response.json();
        
        // Display stats
        document.getElementById('statCode').textContent = data.code;
        document.getElementById('statUrl').textContent = data.long_url;
        document.getElementById('statClicks').textContent = data.click_count || 0;
        document.getElementById('statCreatedAt').textContent = formatDate(data.created_at);
        
        statsLoadingContainer.style.display = 'none';
        statsErrorContainer.style.display = 'none';
        statsContainer.style.display = 'block';
        
        // Clear input
        statsCodeInput.value = '';
    } catch (error) {
        statsLoadingContainer.style.display = 'none';
        showStatsError(error.message || 'An error occurred while fetching stats');
    }
}

/**
 * Show error message in shorten section
 */
function showError(message) {
    loadingContainer.style.display = 'none';
    resultContainer.style.display = 'none';
    errorContainer.style.display = 'block';
    errorMessage.textContent = message;
}

/**
 * Show error message in stats section
 */
function showStatsError(message) {
    statsLoadingContainer.style.display = 'none';
    statsContainer.style.display = 'none';
    statsErrorContainer.style.display = 'block';
    statsErrorMessage.textContent = message;
}

/**
 * Format date to readable format
 */
function formatDate(dateString) {
    if (!dateString) return 'N/A';
    
    try {
        const date = new Date(dateString);
        return date.toLocaleString();
    } catch (error) {
        return dateString;
    }
}
