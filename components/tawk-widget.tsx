"use client";

import Script from "next/script";

/* tawk.to live chat — property "SecureChainMarkets".
   Loaded lazily (after the page is interactive) so it never affects
   page-load performance. Rendered on public pages and the user
   dashboard; intentionally NOT on the admin panel. */
const TAWK_EMBED_SRC = "https://embed.tawk.to/6a2ae1eda8c3ca1c2fbfd0d3/1jqro52fq";

export function TawkWidget() {
  return (
    <Script id="tawk-widget" strategy="lazyOnload">
      {`
        var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
        (function () {
          var s1 = document.createElement("script"),
              s0 = document.getElementsByTagName("script")[0];
          s1.async = true;
          s1.src = "${TAWK_EMBED_SRC}";
          s1.charset = "UTF-8";
          s1.setAttribute("crossorigin", "*");
          s0.parentNode.insertBefore(s1, s0);
        })();
      `}
    </Script>
  );
}
