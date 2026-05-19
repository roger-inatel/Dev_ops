'use client';

// src/components/home/PetsSection.tsx

import { Pet } from '@/types/pets';
import PetCard from '@/components/pets/PetCard';

interface Filters {
  search: string;
  animalType: 'all' | 'dog' | 'cat';
  size: 'all' | 'small' | 'medium' | 'large';
}

interface PetsSectionProps {
  filters: Filters;
  filteredPets: Pet[];
  updateFilter: (key: keyof Filters, value: string) => void;
}

export default function PetsSection({ filters, filteredPets, updateFilter }: PetsSectionProps) {
  return (
    <section id="pets" className="py-24 px-8 max-w-7xl mx-auto scroll-mt-20">
      <div className="text-center mb-12">
        <h2 className="text-4xl font-bold text-[#2C4A3E] mb-3">Pets disponíveis para adoção</h2>
        <p className="text-gray-400 font-medium">Encontre o companheiro perfeito para você</p>
      </div>

      {/* Filtros */}
      <div className="max-w-4xl mx-auto bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 mb-12">
        {/* Busca */}
        <div className="relative mb-8">
          <span className="absolute left-5 top-1/2 -translate-y-1/2 text-xl">🔍</span>
          <input
            type="text"
            placeholder="Buscar por nome..."
            className="w-full pl-14 pr-6 py-4 rounded-2xl bg-[#F9F7F2] border-none outline-none focus:ring-2 focus:ring-[#F4C542] font-medium"
            value={filters.search}
            onChange={(e) => updateFilter('search', e.target.value)}
          />
        </div>

        <div className="flex flex-col md:flex-row gap-10 justify-center">
          {/* Tipo de animal */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-black text-[#2C4A3E] uppercase tracking-widest ml-1">Tipo de Animal</span>
            <div className="flex bg-[#F9F7F2] p-1.5 rounded-2xl">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'dog', label: 'Cães', icon: '🐶' },
                { id: 'cat', label: 'Gatos', icon: '🐱' },
              ].map((type) => (
                <button
                  key={type.id}
                  onClick={() => updateFilter('animalType', type.id)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                    filters.animalType === type.id
                      ? 'bg-[#3A5B4F] text-white shadow-lg shadow-[#3A5B4F]/20'
                      : 'text-[#2C4A3E] hover:bg-gray-200/50'
                  }`}
                >
                  {type.icon && <span>{type.icon}</span>}
                  {type.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tamanho */}
          <div className="flex flex-col gap-3">
            <span className="text-xs font-black text-[#2C4A3E] uppercase tracking-widest ml-1">Tamanho</span>
            <div className="flex bg-[#F9F7F2] p-1.5 rounded-2xl">
              {[
                { id: 'all', label: 'Todos' },
                { id: 'small', label: 'Pequeno' },
                { id: 'medium', label: 'Médio' },
                { id: 'large', label: 'Grande' },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => updateFilter('size', option.id)}
                  className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                    filters.size === option.id
                      ? 'bg-[#3A5B4F] text-white shadow-lg shadow-[#3A5B4F]/20'
                      : 'text-[#2C4A3E] hover:bg-gray-200/50'
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <p className="text-center font-bold text-[#2C4A3E] mb-10">{filteredPets.length} pets encontrados</p>

      {/* Grid de pets */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPets.map((pet) => (
          <PetCard key={pet.id} pet={pet} />
        ))}
      </div>
    </section>
  );
}