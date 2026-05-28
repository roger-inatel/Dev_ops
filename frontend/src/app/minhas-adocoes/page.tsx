'use client';

// src/app/minhas-adocoes/page.tsx

import PrivateHeader from '@/components/layout/PrivateHeader';
import BackButton from '@/components/ui/BackButton';

// TODO (Lucas): substituir por GET /adoptions/my-requests
const MOCK_ADOPTIONS = [
  {
    id: 1,
    petName: 'Thor',
    petImage: '/pets/thor.jpg',
    petBreed: 'Vira-lata (SRD)',
    ong: 'Abrigo Feliz',
    status: 'pending' as const,
    date: '10/05/2025',
  },
  {
    id: 2,
    petName: 'Luna',
    petImage: '/pets/luna.jpg',
    petBreed: 'Vira-lata Rajada',
    ong: 'Patinhas do Bem',
    status: 'approved' as const,
    date: '02/05/2025',
  },
  {
    id: 3,
    petName: 'Bob',
    petImage: '/pets/bob.png',
    petBreed: 'Vira-lata',
    ong: 'Adote um Amigo',
    status: 'rejected' as const,
    date: '28/04/2025',
  },
];

const statusConfig = {
  pending:  { label: 'Pendente',  color: 'bg-yellow-100 text-yellow-700',  icon: '⏳' },
  approved: { label: 'Aprovada',  color: 'bg-[#E8F0E6] text-[#3A5B4F]',   icon: '✅' },
  rejected: { label: 'Recusada', color: 'bg-red-50 text-red-500',          icon: '❌' },
};

export default function MinhasAdocoesPage() {
  return (
    <main className="bg-[#F9F7F2] min-h-screen font-sans">
      <PrivateHeader />
      <div className="h-20" />

      <div className="max-w-4xl mx-auto px-8 py-12">
        <div className="max-w-4xl mx-auto px-8 py-12">
          <div className="mb-4 -ml-2 -mt-2">
            <BackButton href="/dashboard" label="Voltar" />
          </div>
        </div>

        
        <div className="mb-10">
          
          <h1 className="text-4xl font-black text-[#2C4A3E] mb-2">Minhas Adoções</h1>
          <p className="text-gray-500">Acompanhe o status dos seus pedidos de adoção.</p>
        </div>

        {MOCK_ADOPTIONS.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-[32px] border border-gray-100">
            <p className="text-4xl mb-4">🐾</p>
            <p className="font-bold text-[#2C4A3E] text-lg mb-2">Nenhuma adoção ainda</p>
            <p className="text-gray-400 mb-8">Explore os pets disponíveis e faça seu primeiro pedido!</p>
            <a
              href="/dashboard"
              className="bg-[#3A5B4F] text-white px-8 py-3 rounded-2xl font-bold hover:bg-[#2C4A3E] transition-all inline-block"
            >
              Ver pets disponíveis
            </a>
          </div>
        ) : (
          <div className="space-y-4">
            {MOCK_ADOPTIONS.map((adoption) => {
              const status = statusConfig[adoption.status];
              return (
                <div
                  key={adoption.id}
                  className="bg-white rounded-[24px] border border-gray-100 p-6 flex items-center gap-6"
                >
                  {/* Foto do pet */}
                  <div className="w-20 h-20 rounded-2xl overflow-hidden bg-gray-100 flex-shrink-0">
                    <img
                      src={adoption.petImage}
                      alt={adoption.petName}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Infos */}
                  <div className="flex-grow">
                    <h3 className="font-black text-[#2C4A3E] text-lg">{adoption.petName}</h3>
                    <p className="text-sm text-gray-400">{adoption.petBreed} · {adoption.ong}</p>
                    <p className="text-xs text-gray-300 mt-1">Solicitado em {adoption.date}</p>
                  </div>

                  {/* Status */}
                  <div className={`${status.color} px-4 py-2 rounded-full font-bold text-sm flex items-center gap-2 flex-shrink-0`}>
                    <span>{status.icon}</span>
                    {status.label}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Aviso termo (aparece quando há adoção aprovada) */}
        {MOCK_ADOPTIONS.some((a) => a.status === 'approved') && (
          <div className="mt-8 bg-[#F4C542]/20 border border-[#F4C542] rounded-[24px] p-6 flex items-start gap-4">
            <span className="text-2xl">📄</span>
            <div>
              <p className="font-bold text-[#2C4A3E] mb-1">Adoção aprovada! Assine o termo de responsabilidade</p>
              <p className="text-sm text-gray-500 mb-4">
                Sua adoção foi aprovada. Para concluir o processo, assine digitalmente o termo de responsabilidade.
              </p>
              {/* TODO (Lucas): conectar com POST /responsibility-terms/:id/sign */}
              <button className="bg-[#3A5B4F] text-white px-6 py-3 rounded-2xl font-bold hover:bg-[#2C4A3E] transition-all text-sm">
                Assinar termo ✍️
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}