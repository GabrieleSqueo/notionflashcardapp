import Marquee from 'react-fast-marquee';
import Script from 'next/script';

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="text-center py-4">
        made with love ❤️ by 
        <a href="https://www.instagram.com/landriluca_/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700"> Luca Landriscina </a> 
          and 
        <a href="https://www.instagram.com/squeogabriele/" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700"> Gabriele Squeo </a>
      </div>
      <Marquee
        gradient={false}
        speed={50}
        className="py-10 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500"
      >
        {[...Array(10)].map((_, index) => (
          <span key={index} className="text-3xl md:text-4xl font-black mx-6">
            📚 LEARNING MADE SIMPLE 🧠 •
          </span>
        ))}
      </Marquee>
      <div className="text-center py-4 flex justify-center items-center gap-3 space-x-4">
        <a 
          href="https://www.iubenda.com/privacy-policy/79016686" 
          className="iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe text-blue-500 hover:text-blue-700" 
          title="Privacy Policy"
        >
          Privacy Policy
        </a>
        <a 
          href="https://www.iubenda.com/privacy-policy/79016686/cookie-policy" 
          className="iubenda-white iubenda-noiframe iubenda-embed iubenda-noiframe text-blue-500 hover:text-blue-700" 
          title="Cookie Policy"
        >
          Cookie Policy
        </a>
      </div>
      <Script 
        id="iubenda-script"
        strategy="afterInteractive"
      >
        {`
          (function (w,d) {
            var loader = function () {
              var s = d.createElement("script"), 
                  tag = d.getElementsByTagName("script")[0];
              s.src="https://cdn.iubenda.com/iubenda.js";
              tag.parentNode.insertBefore(s,tag);
            };
            if(w.addEventListener){w.addEventListener("load", loader, false);}
            else if(w.attachEvent){w.attachEvent("onload", loader);}
            else{w.onload = loader;}
          })(window, document);
        `}
      </Script>
    </footer>
  )
}

export default Footer