'use client';

// src/app/pet/[id]/page.tsx
// CORRIGIDO: cores do design system, <Image> do Next, sem bg-green-100

import { useParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import Image from 'next/image';
import { api } from '@/services/api';
import { Pet } from '@/types/pets';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

const sizeLabel: Record<Pet['size'], string> = {
  small: 'Pequeno',
  medium: 'Médio',
  large: 'Grande',
};

export default function PetDetails() {
  const { id } = useParams();
  const router = useRouter();

  const [pet, setPet] = useState<Pet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    const fetchPet = async () => {
      try {
        setLoading(true);
        const data = await api.getPetById(Number(id));
        setPet(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar pet');
      } finally {
        setLoading(false);
      }
    };
    fetchPet();
  }, [id]);

  if (loading) {
    return (
      <main className="bg-[#F9F7F2] min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-[#F4C542] border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-[#2C4A3E] font-medium">Carregando detalhes...</p>
        </div>
      </main>
    );
  }

  if (error || !pet) {
    return (
      <main className="bg-[#F9F7F2] min-h-screen flex items-center justify-center p-6">
        <div className="text-center bg-white p-8 rounded-3xl shadow-sm max-w-md">
          <p className="text-red-500 mb-4">{error || 'Pet não encontrado'}</p>
          <button
            onClick={() => router.back()}
            className="bg-[#3A5B4F] text-white px-6 py-2 rounded-xl font-semibold hover:bg-[#2C4A3E] transition-all"
          >
            ← Voltar
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="bg-[#F9F7F2] min-h-screen font-sans">
      <Navbar />
      <div className="h-20" />

      <div className="max-w-4xl mx-auto px-8 py-12">
        {/* Botão voltar */}
        <button
          onClick={() => router.back()}
          className="mb-8 text-[#3A5B4F] hover:text-[#2C4A3E] flex items-center gap-2 font-semibold transition-colors"
        >
          ← Voltar
        </button>

        {/* Card principal */}
        <div className="bg-white rounded-[40px] shadow-sm border border-gray-100 overflow-hidden">
          {/* Imagem */}
          <div className="relative w-full h-96">
            <Image
              src={pet.image}
              alt={pet.name}
              fill
              sizes="(max-width: 896px) 100vw, 896px"
              className="object-cover"
              priority
            />
            {/* Badge tipo */}
            <div className="absolute top-6 right-6 bg-[#F4C542] px-4 py-2 rounded-full shadow-md">
              <span className="text-[12px] font-black text-[#2C4A3E] uppercase tracking-widest">
                {pet.type === 'dog' ? '🐶 Cachorro' : '🐱 Gato'}
              </span>
            </div>
          </div>

          {/* Conteúdo */}
          <div className="p-8 md:p-10">
            {/* Nome e gênero */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-4xl font-black text-[#2C4A3E]">{pet.name}</h1>
                <p className="text-gray-400 font-bold mt-1">{pet.age} — {pet.breed}</p>
              </div>
              <span
                className="text-3xl"
                title={pet.gender === 'male' ? 'Macho' : 'Fêmea'}
              >
                {pet.gender === 'male' ? '♂️' : '♀️'}
              </span>
            </div>

            {/* Info em cards */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#F9F7F2] p-4 rounded-2xl">
                <p className="text-xs font-black text-[#3A5B4F] uppercase tracking-widest mb-1">Porte</p>
                <p className="font-bold text-[#2C4A3E]">{sizeLabel[pet.size]}</p>
              </div>
              <div className="bg-[#F9F7F2] p-4 rounded-2xl">
                <p className="text-xs font-black text-[#3A5B4F] uppercase tracking-widest mb-1">Idade</p>
                <p className="font-bold text-[#2C4A3E]">{pet.age}</p>
              </div>
              <div className="bg-[#F9F7F2] p-4 rounded-2xl col-span-2 md:col-span-1">
                <p className="text-xs font-black text-[#3A5B4F] uppercase tracking-widest mb-1">Localização</p>
                <p className="font-bold text-[#2C4A3E]">📍 {pet.location}</p>
              </div>
            </div>

            {/* Tags */}
            {pet.tags && pet.tags.length > 0 && (
              <div className="flex flex-wrap gap-3 mb-8">
                {pet.tags.map((tag) => (
                  <span
                    key={tag}
                    className="bg-[#E8F0E6] text-[#3A5B4F] text-xs font-black px-5 py-2 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}

            {/* Descrição */}
            {pet.description && (
              <div className="mb-8">
                <h2 className="text-xl font-bold text-[#2C4A3E] mb-3">Sobre {pet.name}</h2>
                <p className="text-gray-500 leading-relaxed">{pet.description}</p>
              </div>
            )}

            {/* Botão adoção */}
            <button className="w-full bg-[#3A5B4F] text-white font-bold py-4 rounded-2xl hover:bg-[#2C4A3E] transition-all shadow-lg hover:shadow-xl text-lg">
              Solicitar adoção ♡
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </main>
  );
}