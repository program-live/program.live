import Link from "next/link";
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { StarFilledIcon } from "@radix-ui/react-icons";

export default async function OpenSourceRepos({ className }: { className?: string; }) {
  const repos = await fetchQuery(api.repos.getRepos, {});

  return (
    <ul className={className}>
      {repos.length === 0 ? (
        <li className="opacity-50">No repos available</li>
      ) : (
        repos.map((repo: { title: string; stars: string; url: string }, i: number) => (
          <li key={i} className="group">
            <Link 
              href={repo.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="opacity-90 hover:opacity-100 flex items-baseline hover:bg-primary hover:text-primary-foreground h-15"
            >
              <span className="truncate min-w-0 mr-2">{repo.title}</span>
              <span className="border-t border-dotted flex-1 mr-1" />
              <span className="inline-flex gap-4 items-center whitespace-nowrap flex-shrink-0">
                <StarFilledIcon className="size-8 opacity-80 group-hover:text-primary-foreground" /> 
                {repo.stars}
              </span>
            </Link>
          </li>
        ))
      )}
    </ul>
  );
} 