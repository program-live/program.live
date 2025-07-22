import Link from 'next/link'
import Sponsors from '@/components/stream-section/sponsors'
import Video from '@/components/stream-section/video'
import { TriangleRightIcon } from '@radix-ui/react-icons'

export default function StreamSection() {
  return (
    <div className="flex-1 h-full flex flex-col pb-[15px] xl:pb-0 xl:overflow-y-auto xl:h-[calc(100vh-45px-45px)]">
      <Video />
      
      <div className="flex flex-col justify-between gap-[15px] h-full">
        <div className="flex flex-col gap-[10px]">
          <div>
            <h2 className="text-[15px]/[20px]">PROGRAM 09: MEDIAPIPE</h2>
            <p className="text-pretty">
              Creative technologist Ben Lapalan leads a hands-on MediaPipe workshop covering face detection, gesture recognition, image segmentation, and more. Build during open creator time, then project demos.
            </p>
          </div>

          <Link 
            href="https://www.youtube.com/@PROGRAMISLIVE" 
            className="inline-flex items-center justify-center gap-0.5 w-full bg-white hover:bg-black hover:text-white text-black hover:border font-extrabold h-[15px]"
          >
            <span className="sr-only">Subscribe to live feed</span>
            <span aria-hidden>SUBSCRIBE T0 LIVE FEED</span>
            <TriangleRightIcon className="size-3" />
          </Link>
        </div>

        <Sponsors />
      </div>
    </div>
  )
}
