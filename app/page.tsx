export default function LandingPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <video
        className="max-w-full max-h-screen"
        autoPlay
        loop
        muted
        playsInline // Important for iOS to play inline
      >
        {/* You can replace this with your actual video source */}
        <source src="https://www.w3schools.com/html/mov_bbb.mp4" type="video/mp4" />
        {/* Add more <source> tags for different video formats if needed */}
        Your browser does not support the video tag.
      </video>
    </div>
  )
}
