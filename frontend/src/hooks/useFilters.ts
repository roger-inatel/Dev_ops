import { useState, useMemo } from 'react';
import { Pet } from '@/types/pets';

// 1. Atualizamos a interface para incluir o 'size'
interface Filters {
  search: string;
  animalType: 'all' | 'dog' | 'cat';
  size: 'all' | 'small' | 'medium' | 'large'; // Adicionado aqui
}

export function useFilters(pets: Pet[]) {
  // 2. Adicionamos o valor inicial do filtro de tamanho
  const [filters, setFilters] = useState<Filters>({
    search: '',
    animalType: 'all',
    size: 'all', // Adicionado aqui
  });

  // Função para atualizar um filtro específico
  const updateFilter = (key: keyof Filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  // 3. Atualizamos o useMemo para filtrar pelo tamanho também
  const filteredPets = useMemo(() => {
    let result = [...pets];

    // Filtro por nome (busca)
    if (filters.search.trim() !== '') {
      result = result.filter(pet =>
        pet.name.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Filtro por tipo (cachorro/gato)
    if (filters.animalType !== 'all') {
      result = result.filter(pet => pet.type === filters.animalType);
    }

    // NOVO: Filtro por tamanho (pequeno/médio/grande)
    if (filters.size !== 'all') {
      result = result.filter(pet => pet.size === filters.size);
    }

    return result;
  }, [pets, filters.search, filters.animalType, filters.size]); // Adicionado filters.size na dependência

  return { filters, updateFilter, filteredPets };
}