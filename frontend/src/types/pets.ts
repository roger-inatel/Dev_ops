// src/types/pets.ts
// ÚNICO tipo Pet do projeto — importar daqui em todos os componentes

export type Pet = {
  id: number;
  name: string;
  image: string;
  type: 'dog' | 'cat';
  breed: string;
  gender: 'male' | 'female';
  age: string;
  size: 'small' | 'medium' | 'large';
  location: string;
  description: string;
  tags?: string[];
};

