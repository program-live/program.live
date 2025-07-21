"use client";

import Link from "next/link";
import ScrollingText from "./scrolling-text";

// Different language translations
const translations = [
  { lang: "EN", text: "broadcasting live global to all for your entertainment" },
  { lang: "ES", text: "transmitiendo en vivo global a todos para tu entretenimiento" },
  { lang: "FR", text: "diffusion en direct mondiale à tous pour votre divertissement" },
  { lang: "DE", text: "weltweit live für alle zu ihrer unterhaltung" },
  { lang: "IT", text: "trasmissione in diretta globale a tutti per il vostro intrattenimento" },
  { lang: "PT", text: "transmitindo ao vivo global para todos para seu entretenimento" },
  { lang: "JA", text: "あなたのエンターテイメントのために世界中にライブ配信" },
  { lang: "ZH", text: "为您的娱乐向全球直播" },
  { lang: "RU", text: "вещание в прямом эфире по всему миру для вашего развлечения" },
  { lang: "AR", text: "البث المباشر العالمي للجميع من أجل ترفيهك" },
  { lang: "NL", text: "wereldwijd live uitzenden voor iedereen voor uw entertainment" },
  { lang: "KO", text: "당신의 엔터테인먼트를 위해 전 세계에 라이브 방송" }
];

export default function Footer() {
  return (
    <>
      {/* Footer Spacer */}
      <div className="h-[45px]"></div>

      {/* Footer */}
      <div className="fixed bottom-0 inset-x-0 grid grid-cols-12 h-[45px] bg-black z-50">
        {/* Scrolling Sponsor Banner */}
        <Link href="https://market.dev" target="_blank" className="relative h-[15px] shrink-0 col-span-full font-extrabold hover:bg-white hover:text-black">
          <ScrollingText direction="right" speed={1000} className="h-full items-center">
            {[...Array(50)].map((_, i) => (
              <span key={i}>
                MARKET.DEV: THE EASIEST WAY TO SELL DEVEL0PER SERVICES <span className="align-[1px]">◉</span>{'\u00A0'}
              </span>
            ))}
          </ScrollingText>
          <span className="sr-only">Market.dev: the easiest way to sell developer services</span>
        </Link>
        {translations.map((translation, i) => {
          // First row (0-5): odd indexes scroll left, even scroll right
          // Second row (6-11): even indexes scroll left, odd scroll right
          const isFirstRow = i < 6;
          const shouldScrollLeft = isFirstRow ? i % 2 === 0 : i % 2 === 1;
          
          return (
            <div key={i} className="col-span-2 h-[15px] relative opacity-60">
              <ScrollingText 
                direction={shouldScrollLeft ? 'left' : 'right'} 
                speed={80 + i * 5} 
                className="h-full items-center"
              >
                {[...Array(10)].map((_, i) => (
                  <span key={i} className="text-[10px]">{translation.text}{'\u00A0'}</span>
                ))}
              </ScrollingText>
              <span className="sr-only">{translation.text}</span>
            </div>
          );
        })}
      </div>
    </>
  );
} 