import ScrollingText from "../scrolling-text";
import SponsorBanner from "./sponsor-banner";

// Different language translations for scrolling text
const translations = [
  { lang: "EN", text: ["SEE YOU SPACE COWBOY", "EASY COME, EASY GO", "ARE YOU LIVING IN THE REAL WORLD?", "LIFE IS BUT A DREAM"] },
  { lang: "ES", text: ["NOS VEMOS VAQUERO ESPACIAL", "FÁCIL VIENE, FÁCIL SE VA", "¿ESTÁS VIVIENDO EN EL MUNDO REAL?", "LA VIDA NO ES MÁS QUE UN SUEÑO"] },
  { lang: "FR", text: ["À BIENTÔT COWBOY DE L'ESPACE", "FACILE À VENIR, FACILE À PARTIR", "VIS-TU DANS LE MONDE RÉEL?", "LA VIE N'EST QU'UN RÊVE"] },
  { lang: "DE", text: ["BIS DANN WELTRAUM-COWBOY", "LEICHT GEKOMMEN, LEICHT GEGANGEN", "LEBST DU IN DER REALEN WELT?", "DAS LEBEN IST NUR EIN TRAUM"] },
  { lang: "IT", text: ["CI VEDIAMO COWBOY SPAZIALE", "FACILE VENIRE, FACILE ANDARE", "STAI VIVENDO NEL MONDO REALE?", "LA VITA NON È CHE UN SOGNO"] },
  { lang: "PT", text: ["NOS VEMOS COWBOY ESPACIAL", "FÁCIL VEM, FÁCIL VAI", "VOCÊ ESTÁ VIVENDO NO MUNDO REAL?", "A VIDA NÃO PASSA DE UM SONHO"] },
  { lang: "JA", text: ["また会おうスペースカウボーイ", "楽に来て、楽に行く", "君は現実の世界に生きているのか？", "人生は夢に過ぎない"] },
  { lang: "ZH", text: ["再见太空牛仔", "来得容易，去得容易", "你生活在现实世界中吗？", "人生不过是一场梦"] },
  { lang: "RU", text: ["УВИДИМСЯ КОСМИЧЕСКИЙ КОВБОЙ", "ЛЕГКО ПРИШЛО, ЛЕГКО УШЛО", "ТЫ ЖИВЕШЬ В РЕАЛЬНОМ МИРЕ?", "ЖИЗНЬ ВСЕГО ЛИШЬ СОН"] },
  { lang: "AR", text: ["أراك أيها الرعاة الفضائي", "سهل المجيء، سهل الذهاب", "هل تعيش في العالم الحقيقي؟", "الحياة ليست سوى حلم"] },
  { lang: "NL", text: ["TOT ZIENS RUIMTE COWBOY", "MAKKELIJK KOMEN, MAKKELIJK GAAN", "LEEF JE IN DE ECHTE WERELD?", "HET LEVEN IS SLECHTS EEN DROOM"] },
  { lang: "KO", text: ["또 보자 우주 카우보이", "쉽게 와서,쉽게 가고", "너는 현실 세계에 살고 있나?", "인생은 꿈일 뿐"] }
];

export default function Footer() {
  return (
    <>
      <div className="h-45"></div> {/* Spacer */}

      <div className="fixed bottom-0 inset-x-0 grid grid-cols-12 h-45 bg-background z-50">
        <SponsorBanner />
        
        {translations.map((translation, i) => {
          // First row (0-5): odd indexes scroll left, even scroll right
          // Second row (6-11): even indexes scroll left, odd scroll right
          const isFirstRow = i < 6;
          const shouldScrollLeft = isFirstRow ? i % 2 === 0 : i % 2 === 1;
          
          return (
            <div key={i} className="col-span-2 h-15 relative text-muted-foreground">
              <ScrollingText 
                direction={shouldScrollLeft ? 'left' : 'right'} 
                speed={1200 + i * 80} 
                className="h-full items-center"
                aria-hidden
              >
                {[...Array(10)].map((_, i) => (
                  <span key={i} className="text-10">{translation.text.join(" ")}{'\u00A0'}</span>
                ))}
              </ScrollingText>
              <span className="sr-only">{translation.text.join(' ')}</span>
            </div>
          );
        })}
      </div>
    </>
  );
} 