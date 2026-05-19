// src/components/home/CtaSection.tsx

export default function CtaSection() {
  return (
    <section className="w-full bg-[#3A5B4F] py-20 md:py-24 text-center text-white relative overflow-hidden">
      <div className="max-w-4xl mx-auto px-8 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">Pronto para mudar uma vida?</h2>
        <p className="text-[#E8F0E6] mb-10 max-w-xl mx-auto text-lg">
          Milhares de pets estão esperando por você. Adote agora e ganhe um amigo para a vida toda!
        </p>
        <a
          href="#pets"
          className="bg-[#F4C542] text-[#2C4A3E] px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl shadow-black/10 inline-block"
        >
          Ver pets disponíveis →
        </a>
      </div>
      <div className="absolute top-0 right-0 p-20 opacity-10 text-9xl select-none">🐾</div>
    </section>
  );
}