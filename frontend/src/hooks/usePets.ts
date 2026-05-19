// src/hooks/usePets.ts
import { useState, useEffect } from 'react';
import { api } from '@/services/api';
import { Pet } from '@/types/pets';

// Este hook vai buscar e guardar os pets
export function usePets() {
  // Estados que vamos controlar
  const [pets, setPets] = useState<Pet[]>([]);     // lista de pets
  const [loading, setLoading] = useState(true);     // está carregando?
  const [error, setError] = useState<string | null>(null); // erro?

  // useEffect roda quando o componente monta
  useEffect(() => {
    async function fetchPets() {
      try {
        setLoading(true);      // começa a carregar
        setError(null);        // limpa erros anteriores
        
        const data = await api.getPets();  // busca os dados
        setPets(data);                     // guarda no estado
        
      } catch (err) {
        // Se deu erro, guarda a mensagem
        setError(err instanceof Error ? err.message : 'Erro ao carregar pets');
      } finally {
        setLoading(false);     // terminou de carregar
      }
    }

    fetchPets();
  }, []); // Array vazio = executa só uma vez

  return { pets, loading, error };
}