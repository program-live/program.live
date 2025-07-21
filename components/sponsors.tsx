import Image from "next/image";
import Link from "next/link";
import WarpEffect from "./warp-effect";

export default function Sponsors() {
  return (
    <div className="h-full flex items-end">
      <div className="relative grid grid-cols-2 md:grid-cols-4 h-full min-h-[120px] md:min-h-[90px] max-h-[120px] xl:max-h-none border-l border-t border-dotted w-full">
        <h2 aria-hidden className="absolute text-center -top-[5px] -left-[3px] bg-black z-[1px] px-0.5">SP0NSORS</h2>
        <span className="sr-only">Sponsors</span>
        
        <WarpEffect 
          maxWidth={300} 
          maxHeight={120} 
          particleCount={300} 
          particleBrightness={0.8}
          warpBrightness={1}
          className="border-r border-b border-dotted "
        >
          <Link href="https://www.market.dev" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center px-[15px] sm:px-[30px] w-full h-full">
            <Image 
              src="/market-dot-dev-logo-white.svg" 
              alt="market.dev" 
              width={120} 
              height={60} 
              className="max-h-[20px] md:max-h-[25px] w-auto h-full cursor-pointer group-hover:opacity-70" 
              priority
            />
            <span className="sr-only">market.dev</span>
          </Link>
        </WarpEffect>
        
        <WarpEffect 
          maxWidth={300} 
          maxHeight={120} 
          particleCount={300} 
          particleBrightness={0.8}
          warpBrightness={1}
          className="border-r border-b border-dotted "
        >
          <Link href="https://www.market.dev" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center px-[30px] w-full h-full">
            <span className="group-hover:opacity-70" aria-hidden>BUY SPOT</span>
            <span className="sr-only">Buy spot</span>
          </Link>
        </WarpEffect>
        
        <WarpEffect 
          maxWidth={300} 
          maxHeight={120} 
          particleCount={300} 
          particleBrightness={0.8}
          warpBrightness={1}
          className="border-r border-b border-dotted "
        >
          <Link href="https://www.market.dev" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center px-[30px] w-full h-full">
            <span className="group-hover:opacity-70" aria-hidden>BUY SPOT</span>
            <span className="sr-only">Buy spot</span>
          </Link>
        </WarpEffect>
        
        <WarpEffect 
          maxWidth={300} 
          maxHeight={120} 
          particleCount={300} 
          particleBrightness={0.8}
          warpBrightness={1}
          className="border-r border-b border-dotted "
        >
          <Link href="https://www.market.dev" target="_blank" rel="noopener noreferrer" className="group flex items-center justify-center px-[30px] w-full h-full">
            <span className="group-hover:opacity-70" aria-hidden>BUY SPOT</span>
            <span className="sr-only">Buy spot</span>
          </Link>
        </WarpEffect>
      </div>
    </div>
  );
} 