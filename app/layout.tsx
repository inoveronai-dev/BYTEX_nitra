import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
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
        {children}
      </body>
    </html>
  );
}
