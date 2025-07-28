import React from 'react'

export default function SectionHeader({ title, srLabel }: { title: string, srLabel?: string }) {
  return (
    <div className="sticky top-0 bg-background z-[1]">
      <div className='flex gap-2'>
        <h2 className="font-extrabold whitespace-nowrap uppercase" aria-hidden={!!srLabel}>{title}</h2>
        <hr className='w-full mt-4' />
      </div>
      <span className="sr-only">{srLabel}</span>
    </div>
  )
}
