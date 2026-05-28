'use client';

// src/app/dashboard/page.tsx

import { usePets } from '@/hooks/usePets';
import { useFilters } from '@/hooks/useFilters';
import { useAuth } from '@/contexts/AuthContext';

import PrivateHeader from '@/components/layout/PrivateHeader';
import HeroSection from '@/components/home/HeroSection';
import HowItWorks from '@/components/home/HowItWorks';
import OngsSection from '@/components/home/OngsSection';
import Testimonials from '@/components/home/Testimonials';
import CtaSection from '@/components/home/CtaSection';
import Footer from '@/components/layout/Footer';
import PetCard from '@/components/pets/PetCard';

function getGreeting(name: string): string {
  const hour = new Date().getHours();
  const firstName = name.split(' ')[0];
  if (hour >= 5 && hour < 12) return `Bom dia, ${firstName}! ☀️`;
  if (hour >= 12 && hour < 18) return `Boa tarde, ${firstName}! 🌤️`;
  return `Boa noite, ${firstName}! 🌙`;
}

export default function DashboardPage() {
  const { user } = useAuth();
  const { pets, loading } = usePets();
  const { filters, updateFilter, filteredPets } = useFilters(pets);

  return (
    <main className="bg-[#F9F7F2] min-h-screen font-sans scroll-smooth">
      <PrivateHeader />
      <div className="h-20" />

      {/* Saudação */}
      <section className="max-w-7xl mx-auto px-8 pt-10 pb-2">
        <div className="bg-white rounded-[32px] px-8 py-6 border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 rounded-full bg-[#3A5B4F] flex items-center justify-center text-white font-black text-2xl flex-shrink-0">
            {user?.name?.[0]?.toUpperCase() ?? '?'}
          </div>
          <div>
            <h2 className="text-2xl font-black text-[#2C4A3E]">
              {user?.name ? getGreeting(user.name) : 'Bem-vindo! 👋'}
            </h2>
            <p className="text-gray-400 text-sm">Que tal encontrar seu novo melhor amigo hoje?</p>
          </div>
        </div>
      </section>

      {/* Seções iguais à home */}
      <HeroSection />
      <HowItWorks />

      {/* Pets com filtros completos */}
      <section id="pets" className="py-24 px-8 max-w-7xl mx-auto scroll-mt-20">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-[#2C4A3E] mb-3">Pets disponíveis para adoção</h2>
          <p className="text-gray-400 font-medium">Encontre o companheiro perfeito para você</p>
        </div>

        <div className="max-w-4xl mx-auto bg-white p-8 rounded-[40px] shadow-sm border border-gray-100 mb-12">
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
                        ? 'bg-[#3A5B4F] text-white shadow-lg'
                        : 'text-[#2C4A3E] hover:bg-gray-200/50'
                    }`}
                  >
                    {type.icon && <span>{type.icon}</span>}
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

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
                        ? 'bg-[#3A5B4F] text-white shadow-lg'
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

        {loading ? (
          <div className="text-center py-20">
            <div className="w-12 h-12 border-4 border-[#F4C542] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
            <p className="text-[#2C4A3E] font-medium">Carregando pets...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPets.map((pet) => (
              <PetCard key={pet.id} pet={pet} />
            ))}
          </div>
        )}
      </section>

      <OngsSection />
      <Testimonials />
      <CtaSection />
      <Footer />
    </main>
  );
}