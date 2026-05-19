// src/components/home/HowItWorks.tsx

const steps = [
  {
    step: 1,
    title: 'Encontre seu pet',
    text: 'Navegue pelos perfis e encontre o pet ideal para sua família.',
    icon: '🐾',
  },
  {
    step: 2,
    title: 'Preencha o formulário',
    text: 'Manifeste seu interesse e conte um pouco sobre você.',
    icon: '📋',
  },
  {
    step: 3,
    title: 'Leve para casa',
    text: 'Após aprovação, você pode buscar seu novo melhor amigo!',
    icon: '🏠',
  },
];

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="bg-white py-24 px-8 scroll-mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-[#2C4A3E] mb-3">Como funciona a adoção?</h2>
          <p className="text-gray-400 font-medium">Processo simples e rápido em apenas 3 passos</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((item) => (
            <div
              key={item.step}
              className="bg-[#F9F7F2] p-12 rounded-[40px] relative text-center group hover:bg-[#F4C542]/10 transition-colors"
            >
              <div className="absolute -top-3 -right-3 bg-[#3A5B4F] text-white w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-lg">
                {item.step}
              </div>
              <div className="bg-[#F4C542] w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-8 text-3xl shadow-sm">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-[#2C4A3E] mb-4">{item.title}</h3>
              <p className="text-gray-500 leading-relaxed font-medium">{item.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}