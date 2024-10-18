import Marquee from 'react-fast-marquee';
import Link from 'next/link';
import Script from 'next/script';

const Footer = () => {
  return (
    <footer className="bg-black text-white">
      <div className="text-center py-4 flex flex-col justify-center items-center gap-3">
        <div className="flex justify-center items-center gap-3 space-x-4">
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
          <Link href="/terms-and-conditions" className="text-blue-500 hover:text-blue-700">
            Terms and Conditions
          </Link>
        </div>
        <p className="text-sm text-gray-400 mt-2">
          Made with ❤️ by {' '}
          <a 
            href="https://www.instagram.com/sololandri/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="text-blue-500 hover:text-blue-700 transition-colors duration-300"
          >
            Luca
          </a>
        </p>
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
