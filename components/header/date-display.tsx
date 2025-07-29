export default function DateDisplay({ className }: { className?: string }) {
  const currentDate = new Date()

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      timeZone: 'America/Toronto',
      weekday: 'short',
      month: 'short',
      day: '2-digit',
      year: 'numeric'
    }).toUpperCase().replace(/,/g, '')
  }

  return (
    <div className={className}>
      <time dateTime={currentDate.toISOString()}>
        {formatDate(currentDate)}
      </time>
    </div>
  )
} 