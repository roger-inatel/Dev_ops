// src/components/home/HeroSection.tsx

import Image from 'next/image';

export default function HeroSection() {
  return (
    <section className="max-w-7xl mx-auto px-8 py-16 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
      {/* Texto */}
      <div>
        <span className="text-[#3A5B4F] font-bold bg-[#E8F0E6] px-4 py-1.5 rounded-full text-xs flex items-center w-fit gap-2 mb-6">
          🐾 Adoção responsável
        </span>

        <h1 className="text-5xl md:text-6xl font-extrabold text-[#2C4A3E] leading-[1.1] mb-6">
          Encontre seu novo <br />
          <span className="relative inline-block mt-2">
            melhor amigo
            <svg
              className="absolute -bottom-2 left-0 w-full h-3"
              viewBox="0 0 300 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path d="M3 9C40 3.5 120 1 297 8.5" stroke="#F4C542" strokeWidth="6" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        <p className="text-gray-500 text-lg mb-10 max-w-lg leading-relaxed">
          Milhares de pets esperando por um lar cheio de amor. Adote e transforme vidas!
        </p>

        <div className="flex flex-wrap gap-4">
          <a
            href="#pets"
            className="bg-[#3A5B4F] text-white px-10 py-4 rounded-2xl font-bold flex items-center gap-2 hover:shadow-xl transition-all shadow-[#3A5B4F]/20"
          >
            Adotar agora <span className="text-sm">♡</span>
          </a>
          <a
            href="#como-funciona"
            className="bg-[#F4C542] text-[#3A5B4F] px-10 py-4 rounded-2xl font-bold hover:shadow-xl transition-all flex items-center justify-center"
          >
            Como funciona
          </a>
        </div>

        {/* Stats */}
        <div className="flex gap-16 mt-16">
          <div>
            <p className="text-4xl font-black text-[#2C4A3E]">500+</p>
            <p className="text-gray-400 font-medium">Pets adotados</p>
          </div>
          <div>
            <p className="text-4xl font-black text-[#2C4A3E]">50+</p>
            <p className="text-gray-400 font-medium">ONGs parceiras</p>
          </div>
        </div>
      </div>

      {/* Imagem */}
      <div className="relative h-[550px] w-full">
        <div className="relative h-full w-full rounded-[60px] overflow-hidden shadow-2xl">
          <Image
            src="/capa1.png"
            alt="Pets felizes esperando adoção"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        </div>
        <div className="absolute -bottom-6 -right-6 bg-[#F4C542] p-6 rounded-[24px] shadow-2xl z-10">
          <span className="text-3xl text-[#2C4A3E]">🐾</span>
        </div>
      </div>
    </section>
  );
}