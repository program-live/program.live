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

export async function getHackerNewsStories(limit: number = 20, isMobile: boolean = false): Promise<HNStoryItem[]> {
  // Adjust limit for mobile devices (reduce by 1/3 if mobile)
  const adjustedLimit = isMobile ? Math.floor(limit * 0.67) : limit;
  try {
    // Fetch top story IDs
    const topStoriesResponse = await fetch(
      "https://hacker-news.firebaseio.com/v0/topstories.json",
      { next: { revalidate: 300 } } // Revalidate every 5 minutes
    );
    const storyIds: number[] = await topStoriesResponse.json();
    
    // Fetch details for the first N stories
    const storyPromises = storyIds.slice(0, adjustedLimit).map(async (id) => {
      const storyResponse = await fetch(
        `https://hacker-news.firebaseio.com/v0/item/${id}.json`,
        { next: { revalidate: 900 } } // Revalidate every 15 minutes
      );
      return storyResponse.json() as Promise<HNStory>;
    });
    
    const fetchedStories = await Promise.all(storyPromises);
    
    // Format stories
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
  } catch (error) {
    console.error("Error fetching Hacker News stories:", error);
    return [];
  }
} 