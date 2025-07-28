// API for Fear & Greed Index data

import { fetchWithBackoff } from '../utils';

// Fear & Greed Index API types
interface FearGreedIndexData {
  value: string
  value_classification: string
  timestamp: string
  time_until_update?: string
}

interface FearGreedIndexApiResponse {
  name: string
  data: FearGreedIndexData[]
  metadata: {
    error: string | null
  }
}

// Fallback fear and greed data
export const fallbackFearGreedData = {
  value: "50",
  value_classification: "Neutral",
  timestamp: new Date().toISOString(),
  time_until_update: "1 hour"
};

export async function getFearGreedIndex() {
  return await fetchWithBackoff(async () => {
    const response = await fetch('https://api.alternative.me/fng/', {
      headers: {
        'Content-Type': 'application/json',
      },
      next: {
        revalidate: 3600, // 1 hour
      },
    });

    if (!response.ok) {
      // Special handling for quota exceeded
      if (response.status === 429) {
        console.error('API quota exceeded - using fallback data');
        return fallbackFearGreedData;
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: FearGreedIndexApiResponse = await response.json();

    if (data.metadata.error) {
      throw new Error(`API error: ${data.metadata.error}`);
    }

    if (data.data && data.data.length > 0) {
      return data.data[0];
    }

    return fallbackFearGreedData;
  });
}

export interface FearGreedIndexLevel {
  range: number[]
  label: string
  color: string
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