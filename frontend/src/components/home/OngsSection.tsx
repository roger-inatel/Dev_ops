// src/components/home/OngsSection.tsx

const ongs = [
  { name: 'Abrigo Feliz', city: 'São Paulo', pets: 45 },
  { name: 'Patinhas do Bem', city: 'Rio de Janeiro', pets: 32 },
  { name: 'Adote um Amigo', city: 'Belo Horizonte', pets: 38 },
];

export default function OngsSection() {
  return (
    <section id="ongs" className="bg-[#E8E8E8]/50 py-24 px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-[#2C4A3E] mb-2">Nossas ONGs parceiras</h2>
        <p className="text-gray-500 mb-12">Trabalhamos com organizações comprometidas com o bem-estar animal</p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {ongs.map((ong, i) => (
            <div key={i} className="bg-white p-8 rounded-[32px] shadow-sm flex flex-col items-center">
              <div className="bg-[#F9F7F2] w-16 h-16 rounded-2xl flex items-center justify-center mb-4 text-2xl">🐾</div>
              <h3 className="font-bold text-[#2C4A3E] text-xl">{ong.name}</h3>
              <p className="text-gray-400 mb-4">{ong.city}</p>
              <span className="text-[#3A5B4F] text-sm font-semibold">🐾 {ong.pets} animais disponíveis</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}