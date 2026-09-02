import Image from "next/image";

const missionText =
  "Sme správcovská spoločnosť zameraná na správu bytových domov v Nitre. Bezprostredným podnetom k vzniku spoločnosti boli impulzy a myšlienky individuálneho prístupu k bytovým domom, pričom hlavným cieľom našich činností je komplexný komfort pre každého koncového užívateľa.";

export default function Hero() {
  return (
    <section id="uvod" className="relative h-screen w-full overflow-hidden">
      <Image
        src="/hero-bytex.jpg"
        alt="Obytná štvrť v Nitre so správou bytových domov"
        fill
        priority
        className="object-cover object-center"
        sizes="100vw"
      />

      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/70" />

      <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center">
        <h1 className="hero-text-shadow max-w-5xl text-2xl font-light uppercase leading-snug tracking-[0.2em] text-white sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl">
          Individuálny prístup k bytovým domom
        </h1>
        <p className="hero-subtext-shadow mt-8 max-w-3xl text-sm font-light leading-relaxed tracking-wide text-white/85 sm:mt-10 sm:text-base md:text-lg">
          {missionText}
        </p>
      </div>
    </section>
  );
}
