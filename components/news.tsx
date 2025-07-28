import { fetchQuery } from "convex/nextjs";
import { api } from "@/convex/_generated/api";
import Link from "next/link";

export default async function News() {
  const newsCache = await fetchQuery(api.news.getStories);
  const stories = newsCache?.stories || [];

  return (
    <ul>
      {stories.length === 0 ? (
        <li className="opacity-50">No stories available</li>
      ) : (
        stories.map((story: { title: string; url: string; date: string }, i: number) => (
          <li key={i} className="">
            <Link 
              href={story.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="opacity-90 flex justify-between items-center gap-6 hover:bg-primary hover:opacity-100 hover:text-primary-foreground"
            >
              <span className="truncate">{story.title}</span>
              <span className="whitespace-nowrap">{story.date}</span>
            </Link>
          </li>
        ))
      )}
    </ul>
  );
} 