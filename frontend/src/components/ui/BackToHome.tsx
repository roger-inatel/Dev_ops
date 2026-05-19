import Link from 'next/link';

type BackToHomeProps = {
  centered?: boolean;
};

export default function BackToHome({
  centered = false,
}: BackToHomeProps) {
  return (
    <div className={centered ? 'pb-16 flex justify-center' : 'max-w-6xl mx-auto px-8 pt-8'}>
      <Link
        href="/"
        className="flex items-center gap-2 text-[#5E736A] hover:text-[#2C4A3E] transition-colors text-lg font-light"
      >
        <span className="text-xl">←</span>
        <span>Voltar para o site</span>
      </Link>
    </div>
  );
}