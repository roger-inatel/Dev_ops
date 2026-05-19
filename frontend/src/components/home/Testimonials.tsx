// src/components/home/Testimonials.tsx

import Image from 'next/image';

const testimonials = [
  {
    name: 'Maria Silva',
    pet: 'Luna',
    text: 'Adotar a Luna foi a melhor decisão da minha vida! Ela trouxe tanta alegria para casa.',
    image: '/users/user2.jpg',
  },
  {
    name: 'João Santos',
    pet: 'Thor',
    text: 'O processo foi super fácil e a equipe muito atenciosa. Thor é parte da família agora.',
    image: '/users/user3.jpg',
  },
  {
    name: 'Ana Paula',
    pet: 'Bob',
    text: 'Nossa família está completa com o Bob! As crianças adoram brincar com ele.',
    image: '/users/user1.jpg',
  },
];

export default function Testimonials() {
  return (
    <section className="py-24 px-8 max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-3xl font-bold text-[#2C4A3E] mb-2">Histórias de amor</h2>
        <p className="text-gray-500">Veja o que nossos adotantes têm a dizer</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((dep, i) => (
          <div key={i} className="bg-white p-8 rounded-[32px] shadow-sm border border-gray-50">
            <div className="text-[#F4C542] flex gap-1 mb-4">★★★★★</div>
            <p className="text-gray-600 italic mb-6">&quot;{dep.text}&quot;</p>
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0 relative">
                <Image
                  src={dep.image}
                  alt={dep.name}
                  fill
                  sizes="48px"
                  className="object-cover"
                />
              </div>
              <div>
                <p className="font-bold text-[#2C4A3E]">{dep.name}</p>
                <p className="text-xs text-gray-400">Adotou {dep.pet}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}