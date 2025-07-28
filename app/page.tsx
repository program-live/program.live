import Header from "@/components/header/index";
import Weather from "@/components/weather";
import Timezones from "@/components/timezones/index";
import Markets from "@/components/markets";
import Diagnostics from "@/components/diagnostics";
import News from "@/components/news";
import OpenSourceProjects from "@/components/open-source-projects";
import Footer from "@/components/footer";
import SectionHeader from "@/components/section-header";
import Stream from "@/components/stream";

export default function Home() {
  return (
    <div className="relative w-full min-h-screen">
      <Header className="xl:hidden" />

      <main className="relative grid grid-cols-12 gap-y-10 gap-x-15 xs:h-[var(--main-content-height)] overflow-y-auto xl:overflow-hidden pb-15">        
        {/* Video */}
        <div className="relative col-span-full xl:col-span-8 xl:order-2">
          <Header className="hidden xl:block col-span-full" />
          <Stream />
        </div>

        {/* Weather, Timezones, Markets, Open Source */}
        <div className="col-span-full xs:col-span-6 md:col-span-3 xl:col-span-2 flex flex-col gap-10 xs:order-3 xl:order-1 xs:h-[495px] xl:h-[var(--main-content-height)]">
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
          <div className="h-[166px] xs:h-auto overflow-y-auto xl:mb-20">
            <SectionHeader title="Open Source" />
            <OpenSourceProjects />
          </div>
          <Diagnostics className="hidden xl:flex" />
        </div>
        
        {/* News */}
        <div className="col-span-full xs:col-span-6 md:col-span-9 xl:col-span-2 flex flex-col justify-between xl:overflow-y-auto xs:h-[495px] xl:h-[var(--main-content-height)] xs:order-2 xl:order-3" >
          <div className="h-[166px] xs:h-auto overflow-y-auto mb-15">
            <SectionHeader title="Breaking News" />
            <News />
          </div>
          <Diagnostics className="xl:hidden" />
        </div>
      </main>

      <Footer />
    </div>
  );
}
