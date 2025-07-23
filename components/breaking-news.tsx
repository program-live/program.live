import { getHackerNewsStories } from "@/lib/hacker-news";
import Link from "next/link";
import { headers } from "next/headers";

export default async function BreakingNews() {
  const ua = (await headers()).get('user-agent') ?? '';
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
  const hackerNewsStories = await getHackerNewsStories(70, isMobile);

  return (
    <ul>
      {hackerNewsStories.length === 0 ? (
        <li className="opacity-50">No stories available</li>
      ) : (
        hackerNewsStories.map((story, i) => (
          <li key={i} className="">
            <Link 
              href={story.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cursor-pointer opacity-90 flex justify-between items-center gap-1.5 hover:bg-primary hover:opacity-100 hover:text-primary-foreground"
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