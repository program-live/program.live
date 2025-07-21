export interface FearGreedIndexData {
  value: string
  value_classification: string
  timestamp: string
  time_until_update?: string
}

export interface FearGreedIndexApiResponse {
  name: string
  data: FearGreedIndexData[]
  metadata: {
    error: string | null
  }
}

export interface FearGreedIndexLevel {
  range: number[]
  label: string
  color: string
}

export async function fetchFearGreedIndexData(): Promise<FearGreedIndexData | null> {
  try {
    const response = await fetch('https://api.alternative.me/fng/', {
      next: { revalidate: 86400 } // Cache for 24 hours since it updates daily
    })
    
    if (!response.ok) {
      console.error(`HTTP error! status: ${response.status}`)
      return null
    }
    
    // Get the raw text first to handle potential JSON parsing issues
    const rawText = await response.text()
    
    try {
      // Try to parse as JSON first
      const data: FearGreedIndexApiResponse = JSON.parse(rawText)
      
      if (data.metadata.error) {
        console.error('API error:', data.metadata.error)
        return null
      }
      
      if (data.data && data.data.length > 0) {
        return data.data[0]
      }
    } catch (parseError) {
      // If JSON parsing fails, check if it's the malformed error response
      if (rawText.includes('Quota exceeded')) {
        console.error('API quota exceeded - using fallback data')
        // Return fallback data when rate limited
        return {
          value: "50",
          value_classification: "Neutral",
          timestamp: new Date().toISOString(),
          time_until_update: "1 hour"
        }
      }
      console.error('Failed to parse API response:', parseError)
    }
    
    return null
  } catch (err) {
    console.error('Failed to fetch fear and greed data:', err)
    return null
  }
}

export function getFearGreedIndexLevel(data: FearGreedIndexData | null): FearGreedIndexLevel {
  if (!data) {
    return {
      range: [0, 100],
      label: "----",
      color: "white"
    }
  }

  const classification = data.value_classification.toLowerCase()
  
  if (classification.includes("extreme fear")) {
    return {
      range: [0, 25],
      label: "EXTREME FEAR",
      color: "red"
    }
  } else if (classification.includes("fear")) {
    return {
      range: [25, 45],
      label: "FEAR",
      color: "red"
    }
  } else if (classification.includes("neutral")) {
    return {
      range: [45, 55],
      label: "NEUTRAL",
      color: "gray"
    }
  } else if (classification.includes("greed") && !classification.includes("extreme")) {
    return {
      range: [55, 75],
      label: "GREED",
      color: "green"
    }
  } else if (classification.includes("extreme greed")) {
    return {
      range: [75, 100],
      label: "EXTREME GREED",
      color: "green"
    }
  } else {
    return {
      range: [0, 100],
      label: data.value_classification.toUpperCase(),
      color: "white"
    }
  }
}

export function getFearGreedIndexNeedleRotation(data: FearGreedIndexData | null): number {
  if (!data) {
    return 0 // Middle position for fallback
  }

  const value = parseInt(data.value)
  // Convert 0-100 scale to -90 to 90 degrees (semicircle)
  return (value - 50) * 1.8
}

export function getFearGreedIndexDisplayValue(data: FearGreedIndexData | null): string {
  if (!data) {
    return "--"
  }
  return Math.round(parseInt(data.value)).toString()
} 