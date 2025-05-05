export function fixedFraction(value: any, digits: number = 2): string {
    const num = Number(value) // Convert to a number safely

    if (isNaN(num)) {
        console.warn('fixedFraction: Invalid number:', value)
        return '0.00' // Return a default value
    }

    return num.toFixed(digits)
}

export function orderIdFormat(orderId: string) {
    if (!orderId) return '# empty'
    return '#' + orderId.slice(0, 10) + '...'
}

export function formatReadableText(text: string): string {
    return text
        .replace(/[_\-]+/g, ' ') // Replace underscores and hyphens with space
        .replace(/\s+/g, ' ') // Remove extra spaces
        .trim() // Trim spaces at start/end
        .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize each word
}


export function formatDate(dateString: string) {
    return new Date(dateString).toLocaleDateString()
}

export function formatDateTime(dateString: string | Date) {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    })
}

// Calculate time since
export function timeSince(dateString: string | Date) {
    if (!dateString) return ''
    const date = new Date(dateString)
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)

    let interval = Math.floor(seconds / 31536000)
    if (interval >= 1) return `${interval} year${interval === 1 ? '' : 's'}`
    interval = Math.floor(seconds / 2592000)
    if (interval >= 1) return `${interval} month${interval === 1 ? '' : 's'}`
    interval = Math.floor(seconds / 86400)
    if (interval >= 1) return `${interval} day${interval === 1 ? '' : 's'}`
    interval = Math.floor(seconds / 3600)
    if (interval >= 1) return `${interval} hour${interval === 1 ? '' : 's'}`
    interval = Math.floor(seconds / 60)
    if (interval >= 1) return `${interval} minute${interval === 1 ? '' : 's'}`
    return `${Math.floor(seconds)} second${seconds === 1 ? '' : 's'}`
}