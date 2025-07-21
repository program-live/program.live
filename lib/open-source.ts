export interface OpenSourceProject {
  title: string;
  stars: string;
  url: string;
  createdAt?: string;
}

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

function formatStarCount(stars: number): string {
  if (stars >= 1000) {
    return `${(stars / 1000).toFixed(1)}k`;
  }
  return stars.toString();
}

function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'today';
  if (diffInDays === 1) return 'yesterday';
  if (diffInDays < 7) return `${diffInDays} days ago`;
  if (diffInDays < 30) return `${Math.floor(diffInDays / 7)} weeks ago`;
  return `${Math.floor(diffInDays / 30)} months ago`;
}

export async function getOpenSourceProjects(limit: number = 10, isMobile: boolean = false): Promise<OpenSourceProject[]> {
  // Adjust limit for mobile devices (reduce by 1/3 if mobile)
  const adjustedLimit = isMobile ? Math.floor(limit * 0.67) : limit;
  try {
    // Calculate date for repos created in the last 45 days
    const date = new Date();
    date.setDate(date.getDate() - 45);
    const dateString = date.toISOString().split('T')[0];

    // Build search query for hidden gems:
    // - Created in last 45 days
    // - 500-5000 stars (popular but not mainstream)
    // - Not archived
    // - Public repos only
    const query = `created:>${dateString} stars:500..5000 archived:false is:public`;
    
    const params = new URLSearchParams({
      q: query,
      sort: 'stars',
      order: 'desc',
      per_page: Math.min(adjustedLimit, 100).toString() // GitHub API max is 100 per page
    });

    const response = await fetch(`https://api.github.com/search/repositories?${params}`, {
      headers: {
        'Accept': 'application/vnd.github.v3+json',
        // Add User-Agent header as required by GitHub API
        'User-Agent': 'program-live-app'
      },
      // Revalidate every day (24 hours = 86400 seconds)
      next: { revalidate: 86400 }
    });

    if (!response.ok) {
      console.error('GitHub API error:', response.status, response.statusText);
      return [];
    }

    const data: GitHubSearchResponse = await response.json();

    // Transform GitHub API response to our format
    return data.items.slice(0, adjustedLimit).map((repo): OpenSourceProject => ({
      title: repo.name,
      stars: formatStarCount(repo.stargazers_count),
      url: repo.html_url,
      createdAt: formatRelativeTime(repo.created_at)
    }));

  } catch (error) {
    console.error('Error fetching open source projects:', error);
    return [];
  }
} 