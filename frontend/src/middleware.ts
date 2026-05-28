import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Lista de rotas que exigem login
const protectedRoutes = ['/dashboard', '/perfil', '/minhas-adocoes', '/resgate'];

// Lista de rotas que só podem ser acessadas por quem NÃO está logado (ex: login, registro)
const authRoutes = ['/login', '/registro'];

export function middleware(request: NextRequest) {
  // Pegamos o token dos cookies (Middleware do Next.js roda no lado servidor, não acessa localStorage)
  // Nota: Para isso funcionar, seu login precisa salvar o token também nos Cookies ou você pode usar uma lógica de verificação de sessão.
  // Como você está usando localStorage no cliente, uma alternativa comum é verificar a rota no layout.tsx ou 
  // configurar o login para salvar o token nos cookies também.
  
  const token = request.cookies.get('adotapet_token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Se tentar acessar rota protegida SEM token -> vai para /login
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. Se tentar acessar login/registro JÁ estando logado -> vai para /dashboard
  if (authRoutes.some(route => pathname.startsWith(route)) && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Configura quais caminhos o middleware deve observar
export const config = {
  matcher: ['/dashboard/:path*', '/perfil/:path*', '/minhas-adocoes/:path*', '/resgate/:path*', '/login', '/registro'],
};
