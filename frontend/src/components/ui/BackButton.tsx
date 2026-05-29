// src/components/ui/BackButton.tsx
import Link from "next/link";

type Props = {
  href: string;
  label?: string;
};

export default function BackButton({ href, label = "Voltar" }: Props) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 text-[#5E736A] hover:text-[#2C4A3E] transition-colors text-sm font-light"
    >
      <span>←</span> {label}
    </Link>
  );
}