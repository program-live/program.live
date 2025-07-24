import Link from "next/link";
import ScrollingText from "./scrolling-text";

// Different language translations of concatenated offline messages
const translations = [
  { lang: "EN", text: "SEE YOU SPACE COWBOY • EASY COME, EASY GO • DO YOU HAVE A COMRADE? • LIFE IS BUT A DREAM • ARE YOU LIVING IN THE REAL WORLD? • YOU'RE GONNA CARRY THAT WEIGHT • " },
  { lang: "ES", text: "NOS VEMOS VAQUERO ESPACIAL • FÁCIL VIENE, FÁCIL SE VA • ¿TIENES UN CAMARADA? • LA VIDA NO ES MÁS QUE UN SUEÑO • ¿ESTÁS VIVIENDO EN EL MUNDO REAL? • VAS A CARGAR ESE PESO • " },
  { lang: "FR", text: "À BIENTÔT COWBOY DE L'ESPACE • FACILE À VENIR, FACILE À PARTIR • AS-TU UN CAMARADE? • LA VIE N'EST QU'UN RÊVE • VIS-TU DANS LE MONDE RÉEL? • TU VAS PORTER CE POIDS • " },
  { lang: "DE", text: "BIS DANN WELTRAUM-COWBOY • LEICHT GEKOMMEN, LEICHT GEGANGEN • HAST DU EINEN KAMERADEN? • DAS LEBEN IST NUR EIN TRAUM • LEBST DU IN DER REALEN WELT? • DU WIRST DIESES GEWICHT TRAGEN • " },
  { lang: "IT", text: "CI VEDIAMO COWBOY SPAZIALE • FACILE VENIRE, FACILE ANDARE • HAI UN COMPAGNO? • LA VITA NON È CHE UN SOGNO • STAI VIVENDO NEL MONDO REALE? • PORTERAI QUEL PESO • " },
  { lang: "PT", text: "NOS VEMOS COWBOY ESPACIAL • FÁCIL VEM, FÁCIL VAI • VOCÊ TEM UM CAMARADA? • A VIDA NÃO PASSA DE UM SONHO • VOCÊ ESTÁ VIVENDO NO MUNDO REAL? • VOCÊ VAI CARREGAR ESSE PESO • " },
  { lang: "JA", text: "また会おうスペースカウボーイ • 楽に来て、楽に行く • 仲間はいるか？ • 人生は夢に過ぎない • 君は現実の世界に生きているのか？ • 君はその重荷を背負うことになる • " },
  { lang: "ZH", text: "再见太空牛仔 • 来得容易，去得容易 • 你有同志吗？ • 人生不过是一场梦 • 你生活在现实世界中吗？ • 你将承受那个重量 • " },
  { lang: "RU", text: "УВИДИМСЯ КОСМИЧЕСКИЙ КОВБОЙ • ЛЕГКО ПРИШЛО, ЛЕГКО УШЛО • У ТЕБЯ ЕСТЬ ТОВАРИЩ? • ЖИЗНЬ ВСЕГО ЛИШЬ СОН • ТЫ ЖИВЕШЬ В РЕАЛЬНОМ МИРЕ? • ТЫ БУДЕШЬ НЕСТИ ЭТОТ ГРУЗ • " },
  { lang: "AR", text: "أراك أيها الرعاة الفضائي • سهل المجيء، سهل الذهاب • هل لديك رفيق؟ • الحياة ليست سوى حلم • هل تعيش في العالم الحقيقي؟ • ستحمل ذلك الثقل • " },
  { lang: "NL", text: "TOT ZIENS RUIMTE COWBOY • MAKKELIJK KOMEN, MAKKELIJK GAAN • HEB JE EEN KAMERAAD? • HET LEVEN IS SLECHTS EEN DROOM • LEEF JE IN DE ECHTE WERELD? • JE GAAT DAT GEWICHT DRAGEN • " },
  { lang: "KO", text: "또 보자 우주 카우보이 • 쉽게 와서, 쉽게 가고 • 동지가 있나? • 인생은 꿈일 뿐 • 너는 현실 세계에 살고 있나? • 너는 그 무게를 짊어질 것이다 • " }
];

export default function Footer() {
  return (
    <>
      {/* Spacer */}
      <div className="h-45"></div>

      {/* Footer */}
      <div className="fixed bottom-0 inset-x-0 grid grid-cols-12 h-45 bg-background z-50">
        {/* Scrolling Sponsor */}
        <Link 
          href="https://market.dev" 
          target="_blank" 
          className="relative h-15 shrink-0 col-span-full font-extrabold hover:bg-primary hover:text-primary-foreground"
        >
          <ScrollingText 
            direction="right" 
            speed={1000} 
            className="h-full items-center" 
            aria-hidden
          >
            {[...Array(50)].map((_, i) => (
              <span key={i}>
                MARKET.DEV: THE EASIEST WAY TO SELL DEVEL0PER SERVICES <span className="align-[1px]">•</span>{'\u00A0'}
              </span>
            ))}
          </ScrollingText>
          <span className="sr-only">Market.dev: the easiest way to sell developer services</span>
        </Link>

        {/* Scrolling Languages */}
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
                  <span key={i} className="text-10">{translation.text}{'\u00A0'}</span>
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