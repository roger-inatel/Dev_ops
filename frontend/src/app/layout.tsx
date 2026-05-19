import type { Metadata } from "next";
import { DM_Sans } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";

// 1. Configurando a nova fonte DM Sans
const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "700"], // Pesos mais comuns para textos e títulos
});

// 2. Ajustando o SEO e título da aba do navegador
export const metadata: Metadata = {
  title: "AdotaPet | Encontre seu novo melhor amigo",
  description: "Plataforma web para adoção responsável de pets.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // 3. Mudando o idioma para pt-BR e injetando a variável da DM Sans
    <html
      lang="pt-BR"
      className={`${dmSans.variable} h-full antialiased`}
    >
      {/* Mantendo a sua estrutura flexível original */}
      <body className="min-h-full flex flex-col font-sans">
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}