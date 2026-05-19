'use client';

// src/app/page.tsx
// Home limpa — cada seção é um componente separado

import { usePets } from '@/hooks/usePets';
import { useFilters } from '@/hooks/useFilters';

import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/home/HeroSection';
import HowItWorks from '@/components/home/HowItWorks';
import PetsSection from '@/components/home/PetsSection';
import OngsSection from '@/components/home/OngsSection';
import Testimonials from '@/components/home/Testimonials';
import CtaSection from '@/components/home/CtaSection';

export default function Home() {
  const { pets, loading, error } = usePets();
  const { filters, updateFilter, filteredPets } = useFilters(pets);

  if (loading) {
    return (
      <main className="bg-[#F9F7F2] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F4C542] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#2C4A3E] font-medium">Carregando amigos...</p>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="bg-[#F9F7F2] min-h-screen flex items-center justify-center p-6">
        <div className="text-center bg-white p-8 rounded-3xl shadow-sm max-w-md">
          <p className="text-red-500 mb-4">Erro ao carregar: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-[#3A5B4F] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#2C4A3E] transition-all"
          >
            Tentar novamente
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F9F7F2] min-h-screen font-sans scroll-smooth">
      <Navbar />
      <div className="h-20" /> {/* Espaço para a navbar fixed */}
      <HeroSection />
      <HowItWorks />
      <PetsSection
        filters={filters}
        filteredPets={filteredPets}
        updateFilter={updateFilter}
      />
      <OngsSection />
      <Testimonials />
      <CtaSection />
      <Footer />
    </main>
  );
}