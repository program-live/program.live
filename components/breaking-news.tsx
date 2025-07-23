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
        <li className="text-neutral-400">No stories available</li>
      ) : (
        hackerNewsStories.map((story, i) => (
          <li key={i} className="text-neutral-200">
            <Link 
              href={story.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cursor-pointer flex justify-between items-center gap-1.5 hover:bg-white hover:text-black"
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