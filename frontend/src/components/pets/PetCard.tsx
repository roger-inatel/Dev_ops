'use client';

// src/components/pets/PetCard.tsx
// CORRIGIDO: importa Pet de types/pets (sem duplicar o tipo)
// CORRIGIDO: usa <Image> do Next.js para otimização automática

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Pet } from '@/types/pets';

export default function PetCard({ pet }: { pet: Pet }) {
  const router = useRouter();

  return (
    <div
      onClick={() => router.push(`/pet/${pet.id}`)}
      className="bg-white rounded-[40px] overflow-hidden shadow-sm hover:shadow-xl transition-all cursor-pointer group border border-gray-100 flex flex-col h-full"
    >
      {/* Imagem com badge flutuante */}
      <div className="relative h-80 w-full overflow-hidden">
        <Image
          src={pet.image}
          alt={pet.name}
          fill
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className="object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute top-6 right-6 bg-[#F4C542] px-4 py-2 rounded-full shadow-md">
          <span className="text-[12px] font-black text-[#2C4A3E] uppercase tracking-widest flex items-center gap-2">
            {pet.type === 'dog' ? '🐶 Cachorro' : '🐱 Gato'}
          </span>
        </div>
      </div>

      {/* Conteúdo */}
      <div className="p-8 flex flex-col flex-grow">
        <div className="mb-4">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-black text-[#2C4A3E] leading-tight">
              {pet.name}
            </h3>
            <span
              className="text-xl"
              title={pet.gender === 'male' ? 'Macho' : 'Fêmea'}
            >
              {pet.gender === 'male' ? '♂️' : '♀️'}
            </span>
          </div>
          <p className="text-sm font-bold text-gray-400 mt-2">
            {pet.age} — {pet.breed}
          </p>
        </div>

        {/* Localização */}
        <div className="flex items-center gap-2 text-gray-400 mb-6">
          <span className="text-lg">📍</span>
          <span className="text-xs font-bold uppercase tracking-tight">{pet.location}</span>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-3 mt-auto">
          {(pet.tags || ['Amigável', 'Brincalhão']).map((tag) => (
            <span
              key={tag}
              className="bg-[#E8F0E6] text-[#3A5B4F] text-xs font-black px-5 py-2 rounded-full border border-[#3A5B4F]/5"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}