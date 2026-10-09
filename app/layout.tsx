import type { Metadata } from "next";
import { SiteAnalytics } from "@/components/SiteAnalytics";
import { Inter, Playfair_Display } from "next/font/google";
import Script from "next/script";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin", "latin-ext"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500"],
});

export const metadata: Metadata = {
  title: "BYTEX Nitra – Správa a servis bytových domov",
  description:
    "Správcovská spoločnosť zameraná na správu bytových domov v Nitre. Individuálny prístup a komplexný komfort pre každého užívateľa.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html
      lang="sk"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className={`${inter.className} min-h-full flex flex-col font-sans text-charcoal-deep bg-cream`}>
        {/* beforeInteractive: set splash flag before first paint to avoid homepage flash */}
        <Script
          id="bytex-splash-boot"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var p=location.pathname;if(p!=="/"&&p!==""){document.documentElement.dataset.bytexSplash="done";return;}if(sessionStorage.getItem("bytex-splash-seen")==="1"){document.documentElement.dataset.bytexSplash="done";}else if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){document.documentElement.dataset.bytexSplash="done";}else{document.documentElement.dataset.bytexSplash="pending";}}catch(e){document.documentElement.dataset.bytexSplash="pending";}})();`,
          }}
        />
        {children}
        <SiteAnalytics />
      </body>
    </html>
  );
}
