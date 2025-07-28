// API for News data

import { fetchWithBackoff } from "./utils";

export interface HNStoryItem {
  title: string;
  url: string;
  date: string;
}

interface HNStory {
  id: number;
  title: string;
  url?: string;
  time: number;
  type: string;
}

const HN_API_URL = "https://hacker-news.firebaseio.com/v0";

export async function getHackerNewsStories(limit: number = 20): Promise<HNStoryItem[]> {
  try {
    return await fetchWithBackoff(async () => {
      const topStoriesResponse = await fetch(
        `${HN_API_URL}/topstories.json`,
        { next: { revalidate: 900 } } // 15 minutes
      );
      if (!topStoriesResponse.ok) throw new Error(`Failed to fetch top stories: ${topStoriesResponse.statusText}`);
      const storyIds: number[] = await topStoriesResponse.json();

      const storyPromises = storyIds.slice(0, limit).map(async (id) => {
        const storyResponse = await fetch(
          `${HN_API_URL}/item/${id}.json`,
          { next: { revalidate: 900 } } // 15 minutes
        );
        if (!storyResponse.ok) throw new Error(`Failed to fetch story item ${id}: ${storyResponse.statusText}`);
        return storyResponse.json() as Promise<HNStory>;
      });

      const fetchedStories = await Promise.all(storyPromises);

      const formattedStories: HNStoryItem[] = fetchedStories
        .filter(story => story && story.title && story.url && story.type === 'story')
        .map(story => ({
          title: story.title,
          url: story.url!,
          date: new Date(story.time * 1000).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
          })
        }));

      return formattedStories;
    });
  } catch (error) {
    console.error("Error fetching Hacker News stories:", error);
    return [];
  }
} 