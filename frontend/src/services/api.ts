// src/services/api.ts

import { Pet } from '@/types/pets';

const API_BASE_URL = '/api-backend';

/**
 * Utilitário para chamadas fetch com suporte a autenticação
 */
async function fetchClient(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adotapet_token') : null;

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || `Erro na requisição: ${response.status}`);
  }

  return response.json();
}

// Nosso serviço de API real (Adeus Mocks! 👋)
export const api = {
  // Busca todos os pets (Público ou Privado)
  getPets: async (): Promise<Pet[]> => {
    return fetchClient('/pets');
  },

  // Busca um pet específico pelo ID
  getPetById: async (id: number | string): Promise<Pet> => {
    return fetchClient(`/pets/${id}`);
  },

  // Realiza o login (Público)
  login: async (credentials: any) => {
    return fetchClient('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Realiza o registro (Público)
  register: async (userData: any) => {
    return fetchClient('/users', {
      method: 'POST',
      body: JSON.stringify({
        fullName: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        role: 'ADOPTER', // Valor padrão conforme tarefa
      }),
    });
  },

  // Criar nova adoção (Privado - Exemplo de nova integração)
  createAdoption: async (petId: number) => {
    return fetchClient('/adoptions', {
      method: 'POST',
      body: JSON.stringify({ petId }),
    });
  },

  // Upload de foto do pet (Exemplo de Multipart)
  uploadPetPhoto: async (petId: number, file: File) => {
    const token = localStorage.getItem('adotapet_token');
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/pets/${petId}/photo`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: formData,
    });

    if (!response.ok) throw new Error('Erro ao fazer upload da foto');
    return response.json();
  }
};