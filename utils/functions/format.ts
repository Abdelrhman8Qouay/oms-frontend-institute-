export function fixedFraction(value: any, digits: number = 2): string {
    const num = Number(value) // Convert to a number safely

    if (isNaN(num)) {
        console.warn('fixedFraction: Invalid number:', value)
        return '0.00' // Return a default value
    }

    return num.toFixed(digits)
}

export function formatReadableText(text: string): string {
    return text
        .replace(/[_\-]+/g, ' ') // Replace underscores and hyphens with space
        .replace(/\s+/g, ' ') // Remove extra spaces
        .trim() // Trim spaces at start/end
        .replace(/\b\w/g, (char) => char.toUpperCase()) // Capitalize each word
}
