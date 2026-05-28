import { api } from '@/services/api';

describe('Integração com API', () => {
    const mockToken = 'fake-jwt-token';
    const mockUser = { name: 'Lucas Teste', email: 'lucas@test.com', role: 'adopter' };

    beforeEach(() => {
        // Limpa mocks e armazenamento
        jest.clearAllMocks();
        localStorage.clear();
        
        // Mock do fetch global
        global.fetch = jest.fn();
    });

    it('deve buscar pets com sucesso', async () => {
        const mockPets = [{ id: 1, name: 'Thor' }];
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockPets,
        });

        const pets = await api.getPets();
        
        expect(pets).toEqual(mockPets);
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/pets'),
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Content-Type': 'application/json'
                })
            })
        );
    });

    it('deve incluir o token de autorização se estiver logado', async () => {
        localStorage.setItem('adotapet_token', mockToken);
        
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => ({ success: true }),
        });

        await api.getPets();

        expect(global.fetch).toHaveBeenCalledWith(
            expect.any(String),
            expect.objectContaining({
                headers: expect.objectContaining({
                    'Authorization': `Bearer ${mockToken}`
                })
            })
        );
    });

    it('deve realizar login e retornar o token', async () => {
        const loginData = { email: 'test@test.com', password: 'password' };
        const mockResponse = { access_token: mockToken, user: mockUser };
        
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: true,
            json: async () => mockResponse,
        });

        const result = await api.login(loginData);

        expect(result).toEqual(mockResponse);
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/auth/login'),
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify(loginData)
            })
        );
    });

    it('deve lançar erro amigável se a API falhar', async () => {
        (global.fetch as jest.Mock).mockResolvedValueOnce({
            ok: false,
            status: 401,
            json: async () => ({ message: 'Credenciais inválidas' }),
        });

        await expect(api.login({ email: 'a@a.com', password: '123' }))
            .rejects.toThrow('Credenciais inválidas');
    });
});
