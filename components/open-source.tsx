import Link from "next/link";
import { fetchQuery } from 'convex/nextjs';
import { api } from '@/convex/_generated/api';
import { StarFilledIcon } from "@radix-ui/react-icons";
import { headers } from "next/headers";

export default async function OpenSource({ className }: { className?: string }) {
  const ua = (await headers()).get('user-agent') ?? '';
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
  const projects = await fetchQuery(api.openSource.getProjects, { limit: 40, isMobile });

  return (
    <ul className={className}>
      {projects.length === 0 ? (
        <li className="opacity-50">No projects available</li>
      ) : (
        projects.map((project, i: number) => (
          <li key={i} className="group">
            <Link 
              href={project.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cursor-pointer opacity-90 hover:opacity-100 flex items-baseline hover:bg-primary hover:text-primary-foreground h-15"
            >
              <span className="truncate min-w-0 mr-2">{project.title}</span>
              <span className="border-t border-dotted flex-1 mr-1" />
              <span className="inline-flex gap-4 items-center whitespace-nowrap flex-shrink-0">
                <StarFilledIcon className="size-8 opacity-80 group-hover:text-black" /> 
                {project.stars}
              </span>
            </Link>
          </li>
        ))
      )}
    </ul>
  );
} 