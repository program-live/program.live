import Link from "next/link";
import { getOpenSourceProjects, OpenSourceProject } from "@/lib/open-source";
import { StarFilledIcon } from "@radix-ui/react-icons";
import { headers } from "next/headers";

export default async function OpenSource({ className }: { className?: string }) {
  const ua = (await headers()).get('user-agent') ?? '';
  const isMobile = /Android|iPhone|iPad|iPod/i.test(ua);
  const projects = await getOpenSourceProjects(40, isMobile);

  return (
    <ul className={className}>
      {projects.length === 0 ? (
        <li className="text-neutral-400">No projects available</li>
      ) : (
        projects.map((project: OpenSourceProject, i: number) => (
          <li key={i} className="text-neutral-200 group">
            <Link 
              href={project.url} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cursor-pointer flex items-baseline hover:bg-white hover:text-black h-[15px]"
            >
              <span className="truncate min-w-0 mr-0.5">{project.title}</span>
              <span className="border-t border-dotted flex-1 mr-px" />
              <span className="inline-flex gap-[4px] items-center whitespace-nowrap flex-shrink-0"><StarFilledIcon className="size-2 opacity-80 group-hover:text-black" /> {project.stars}</span>
            </Link>
          </li>
        ))
      )}
    </ul>
  );
} 