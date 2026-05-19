// src/services/api.ts

// Importando o tipo Pet que criamos
import { Pet } from '@/types/pets';

// Por enquanto, vamos usar dados mockados
// Quando a API real estiver pronta, é só substituir
const MOCK_PETS: Pet[] = [
  {
    id: 1,
    name: 'Thor',
    image: "/pets/thor.jpg",
    type: 'dog',
    breed: 'Vira-lata (SRD)',
    gender: 'male',
    age: '2 anos',
    size: 'small',
    location: 'Santa Rita do Sapucaí - MG',
    description: 'Muito brincalhão e adora crianças',
    tags: ['Amigável', 'Brincalhão']
  },
  {
    id: 2,
    name: 'Luna',
    image: "/pets/luna.jpeg",
    type: 'cat',
    breed: 'Vira-lata (SRD) Rajada',
    gender: 'female',
    age: '5 anos',
    size: 'medium',
    location: 'Santa Rita do Sapucaí - MG',
    description: 'Muito tranquila e carinhosa',
    tags: ['Calma', 'Carinhosa']
  },
  {
    id: 3,
    name: 'Bob',
    image: "/pets/bob.png",
    type: 'dog',
    breed: 'Vira-lata',
    gender: 'male',
    age: '3 anos',
    size: 'medium',
    location: 'Santa Rita do Sapucaí - MG',
    description: 'Muito brincalhão e adora crianças',
    tags: ['Ativo', 'Protetor']
  },
  {
    id: 4,
    name: 'Mia',
    image: "/pets/mia.jpg",
    type: 'cat',
    breed: 'Vira-lata (SRD)',
    gender: 'female',
    age: '1 ano',
    size: 'medium',
    location: 'Santa Rita do Sapucaí - MG',
    description: 'Muito curiosa e adora brincar',
    tags: ['Curiosa', 'Brincalhona']
  },
  {
    id: 5,
    name: 'Zeus',
    image: "/pets/zeus.jpg",
    type: 'dog',
    breed: 'Vira-lata Preto',
    gender: 'male',
    age: '1 ano',
    size: 'large',
    location: 'Santa Rita do Sapucaí - MG',
    description: 'Energético e adora correr no parque',
    tags: ['Energético', 'Leal']
  },
  {
    id: 6,
    name: 'Mel',
    image: "/pets/mel.jpg",
    type: 'dog',
    breed: 'Vira-lata',
    gender: 'female',
    age: '2 anos',
    size: 'medium',
    location: 'Santa Rita do Sapucaí - MG',
    description: 'Extremamente dócil e companheira',
    tags: ['Dócil', 'Companheira']
  },
  {
    id: 7,
    name: 'Max',
    image: "/pets/max.webp",
    type: 'cat',
    breed: 'Vira-lata (SRD)',
    gender: 'male',
    age: '1 ano',
    size: 'medium',
    location: 'Santa Rita do Sapucaí - MG',
    description: 'Carinhoso e muito tranquilo',
    tags: ['Silencioso', 'Independente']
  },
  {
    id: 8,
    name: 'Nina',
    image: "/pets/nina.webp",
    type: 'cat',
    breed: 'Vira-lata (SRD)',
    gender: 'female',
    age: '3 anos',
    size: 'medium',
    location: 'Santa Rita do Sapucaí - MG',
    description: 'Adora um colo e dormir ao sol',
    tags: ['Carinhosa', 'Preguiçosa']
  }
];

// Nosso serviço de API
export const api = {
  // Busca todos os pets
  getPets: async (): Promise<Pet[]> => {
    // Simula um delay de rede (como se estivesse carregando)
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Retorna os dados mockados
    return MOCK_PETS;
    
    // 🔜 QUANDO A API ESTIVER PRONTA, SUBSTITUA POR:
    // const response = await fetch('http://localhost:3000/api/pets');
    // return response.json();
  },

  // Busca um pet específico pelo ID
  getPetById: async (id: number): Promise<Pet> => {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const pet = MOCK_PETS.find(p => p.id === id);
    if (!pet) throw new Error('Pet não encontrado');
    return pet;
    
    // 🔜 QUANDO A API ESTIVER PRONTA:
    // const response = await fetch(`http://localhost:3000/api/pets/${id}`);
    // return response.json();
  },

  // Realiza o login
  login: async (credentials: any) => {
    const response = await fetch('/api-backend/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(credentials),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao realizar login');
    }

    return response.json();
  },

  // Realiza o registro
  register: async (userData: any) => {
    const response = await fetch('/api-backend/users', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone,
        role: 'ADOPTER', // Default role
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Erro ao realizar registro');
    }

    return response.json();
  }
};