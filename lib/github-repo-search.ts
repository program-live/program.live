// API for Open Source Projects data

import { fetchWithBackoff } from './utils';

interface GitHubRepo {
  name: string;
  full_name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  language: string | null;
  created_at: string;
}

interface GitHubSearchResponse {
  total_count: number;
  incomplete_results: boolean;
  items: GitHubRepo[];
}

// One project had this word in the name, so we're banning it
const BANNED_WORDS = ['SHIT'];

function containsBannedWords(text: string): boolean {
  const upperText = text.toUpperCase();
  return BANNED_WORDS.some(bannedWord => upperText.includes(bannedWord));
}

export function formatStarCount(stars: number): string {
  if (stars >= 1000) {
    return `${(stars / 1000).toFixed(1)}k`;
  }
  return stars.toString();
}

export async function getOpenSourceProjects(limit: number = 50) {
  return await fetchWithBackoff(async () => {
    const date = new Date();
    date.setDate(date.getDate() - 45);
    const dateString = date.toISOString().split('T')[0];

    const query = `created:>${dateString} stars:500..5000 archived:false is:public`;
    const params = new URLSearchParams({
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: '100',
    });

    const response = await fetch(`https://api.github.com/search/repositories?${params}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        'User-Agent': 'program-live-app',
      },
      next: {
        revalidate: 900, // 15 minutes
      },
    });

    if (!response.ok) {
      throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
    }

    const data: GitHubSearchResponse = await response.json();

    return data.items
      .filter(repo => !containsBannedWords(repo.name))
      .slice(0, limit)
      .map(repo => ({
        title: repo.name,
        stars: formatStarCount(repo.stargazers_count),
        starCount: repo.stargazers_count,
        url: repo.html_url,
        updated: Date.now(),
      }));
  });
} 