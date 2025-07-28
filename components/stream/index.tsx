import Link from 'next/link'
import Sponsors from '@/components/stream/sponsors'
import Video from '@/components/stream/video'
import { fetchQuery } from "convex/nextjs"
import { api } from "@/convex/_generated/api"
import { Button } from '../ui/button'

export default async function StreamSection() {
  const currentStreamInfo = await fetchQuery(api.streamInfo.getCurrentInfo)
  const sponsors = await fetchQuery(api.sponsors.getActiveSponsors)

  return (
    <div className="flex-1 h-full flex flex-col pb-15 xl:pb-0 xl:overflow-y-auto xl:h-[calc(var(--main-content-height)-45px)]">
      <Video />
      
      <div className="flex flex-col justify-between gap-15 h-full">
        <div className="flex flex-col gap-10">
          <div>
            <h2 className="text-15 leading-20">{
              currentStreamInfo?.title || (
                <>
                  <span className='sr-only'>Next Program Coming Soon...</span>
                  <span aria-hidden>NEXT PR0GRAM: C0MING S00N...</span>
                </>
              )}</h2>
            <p className="text-pretty">
              {currentStreamInfo?.description || (
                <>
                  <span aria-hidden>PR0GRAM: A w0rksh0p series expl0ring new s0ftware by building. Subscribe t0 the channel t0 know when we're streaming. Follow the Luma page t0 join in-pers0n.</span>
                  <span className='sr-only'>PROGRAM: A workshop series exploring new software by building. Subscribe to the channel to know when we're streaming and follow the Luma page to join the event in-person.</span>
                </>
              )}
            </p>
          </div>

          <div className='flex flex-col xs:flex-row gap-y-5 gap-x-1'>
            <Button className='w-full' asChild>
              <Link href="https://www.youtube.com/@PROGRAMISLIVE">
                <span className="sr-only">Subscribe to live feed</span>
                <span className='text-[12px] leading-10 mb-1 mr-5'>⏵</span>
                {"\u0020"}
                <span aria-hidden>SUBSCRIBE T0 LIVE FEED</span>
              </Link>
            </Button>
            <Button className='w-full' asChild>
              <Link href="https://lu.ma/program?k=c&period=past">
                <span className="sr-only">Join in-person</span>
                <span className='text-15 leading-10 mb-3 mr-4'>✦</span>
                {"\u0020"}
                <span aria-hidden>J0IN IN-PERS0N</span>
              </Link>
            </Button>
          </div>
        </div>

        <Sponsors sponsors={sponsors} />
      </div>
    </div>
  )
}
