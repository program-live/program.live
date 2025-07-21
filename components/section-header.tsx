import React from 'react'

export default function SectionHeader({ title, srLabel }: { title: string, srLabel?: string }) {
  return (
    <div className="sticky top-0 bg-black z-[1]">
      <div className='flex  gap-0.5'>
        <h2 className="font-extrabold whitespace-nowrap uppercase" aria-hidden={!!srLabel}>{title}</h2>
        <hr className='w-full mt-1' />
      </div>
      <span className="sr-only">{srLabel}</span>
    </div>
  )
}
