import Header from "@/components/header";
import Weather from "@/components/weather";
import Timezones from "@/components/timezones";
import Markets from "@/components/markets";
import Diagnostics from "@/components/diagnostics";
import VideoSection from "@/components/video-section";
import HackerNewsStories from "@/components/hacker-news-stories";
import OpenSource from "@/components/open-source";
import Footer from "@/components/footer";
import SectionHeader from "@/components/section-header";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen">
      <Header className="xl:hidden" />

      <main className="relative grid grid-cols-12 gap-y-[10px] gap-x-[15px] xs:h-[calc(100vh-45px)] overflow-y-auto xl:overflow-hidden pb-[15px]">        
        {/* Video */}
        <div className="relative col-span-full xl:col-span-8 xl:order-2">
          <Header className="hidden xl:block col-span-full" />
          <VideoSection className="xl:overflow-y-auto xl:h-[calc(100vh-45px-45px)]" />
        </div>

        {/* Weather, Timezones, Markets, Open Source */}
        <div className="col-span-full xs:col-span-6 md:col-span-3 xl:col-span-2 flex flex-col gap-[10px] xs:order-3 xl:order-1 xs:h-[495px] xl:h-[calc(100vh-45px)] scrollable-section" data-scrollable="true">
          <div>
            <SectionHeader title="Weather" />
            <Weather />
          </div>
          <div>
            <SectionHeader title="Timez0nes" srLabel="Timezones" />
            <Timezones />
          </div>
          <div>
            <SectionHeader title="Markets" />
            <Markets />
          </div>
          <div className="h-[166px] xs:h-auto overflow-y-auto xl:mb-[20px] scrollable-section" data-scrollable="true">
            <SectionHeader title="Open Source" />
            <OpenSource />
          </div>
          <Diagnostics className="hidden xl:flex" />
        </div>
        
        {/* Breaking News */}
        <div className="col-span-full xs:col-span-6 md:col-span-9 xl:col-span-2 flex flex-col justify-between xl:overflow-y-auto xs:h-[495px] xl:h-[calc(100vh-45px)] xs:order-2 xl:order-3 scrollable-section" data-scrollable="true">
          <div className="h-[166px] xs:h-auto overflow-y-auto mb-[15px] scrollable-section" data-scrollable="true">
            <SectionHeader title="Breaking News" />
            <HackerNewsStories />
          </div>
          <Diagnostics className="xl:hidden" />
        </div>

      </main>
      <Footer />
    </div>
  );
}
