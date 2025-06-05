export default function LandingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-custom-dark-gray">
      <video
        className="max-w-[90vw] max-h-[90vh]"
        autoPlay
        loop
        muted
        playsInline // Important for iOS to play inline
      >
        {/* You can replace this with your actual video source */}
        <source src="/videos/program.mp4" type="video/mp4" />
        {/* Add more <source> tags for different video formats if needed */}
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
