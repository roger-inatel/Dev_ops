"use client";

import Link from "next/link";
import { Heart, Mail, Lock, User, Phone, MapPin, PawPrint, CheckCircle2 } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Select } from "@/components/ui/Select";
import { Checkbox } from "@/components/ui/Checkbox";
import { api } from "@/services/api";
import { useRouter } from "next/navigation";
import { useState } from "react";


// 1. O CONTRATO (ZOD)
const registerSchema = z.object({
    name: z.string().min(3, "O nome deve ter no mínimo 3 caracteres"),
    email: z.string().email("Digite um e-mail válido"),
    password: z.string()
        .min(8, "A senha deve ter no mínimo 8 caracteres")
        .regex(/(?=.*[a-z])/, "A senha deve conter pelo menos uma letra minúscula")
        .regex(/(?=.*[A-Z])/, "A senha deve conter pelo menos uma letra maiúscula")
        .regex(/(?=.*\d)/, "A senha deve conter pelo menos um número")
        .regex(/(?=.*[^A-Za-z0-9])/, "A senha deve conter pelo menos um caractere especial"),
    confirmPassword: z.string(),
    phone: z.string().min(10, "Telefone inválido"),
    city: z.string().min(2, "A cidade é obrigatória"),
    state: z.string().length(2, "Selecione um estado"),
    agreedToTerms: z.boolean().refine((val) => val === true, {
        message: "Você precisa aceitar os termos de responsabilidade",
    }),
}).refine((data) => data.password === data.confirmPassword, {
    // Essa é a mágica para comparar campos!
    message: "As senhas não coincidem",
    path: ["confirmPassword"], // Aponta o erro para o campo de confirmar senha
});

type RegisterForm = z.infer<typeof registerSchema>;

const brazilianStates = [
    "", "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG",
    "PA", "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];

export default function Register() {
    const router = useRouter();
    const [error, setError] = useState<string | null>(null);

    // 2. O GERENTE (React Hook Form)
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterForm>({
        resolver: zodResolver(registerSchema),
    });

    const onSubmit = async (data: RegisterForm) => {
        try {
            setError(null);
            await api.register(data);
            alert("Conta criada com sucesso! Você já pode fazer login.");
            router.push('/login');
        } catch (err: any) {
            setError(err.message || 'Erro ao criar conta. Tente novamente.');
            console.error("Erro no registro:", err);
        }
    };

    const stateOptions = brazilianStates.map(state => ({ value: state, label: state }));

    return (
        <div className="min-h-screen flex items-center justify-center p-4 py-12 relative overflow-hidden bg-background">
            {/* Elementos Decorativos */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -right-40 w-80 h-80 bg-accent/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary/30 rounded-full blur-3xl" />
                <div className="absolute top-1/3 left-1/3 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
            </div>

            <div className="absolute top-10 left-10 opacity-20">
                <PawPrint className="size-12 text-primary" />
            </div>
            <div className="absolute bottom-20 right-20 opacity-20">
                <PawPrint className="size-16 text-accent" />
            </div>
            <div className="absolute top-1/4 right-1/3 opacity-10">
                <PawPrint className="size-10 text-secondary" />
            </div>
            <div className="absolute bottom-1/4 left-1/4 opacity-15">
                <Heart className="size-8 text-accent" />
            </div>

            <div className="w-full max-w-6xl grid md:grid-cols-2 gap-8 items-center relative z-10">

                {/* Lado Esquerdo - Formulário */}
                <div className="flex items-center justify-center order-2 md:order-1">
                    <div className="w-full max-w-md">
                        <div className="bg-card rounded-3xl shadow-xl border border-border/50 p-8 md:p-10">

                            {/* Logo */}
                            <div className="flex items-center justify-center gap-2 mb-6">
                                <div className="bg-accent p-3 rounded-full">
                                    <Heart className="size-7 text-accent-foreground fill-accent-foreground" />
                                </div>
                                <span className="text-2xl font-bold text-foreground">AdotaPET</span>
                            </div>

                            <div className="text-center mb-8">
                                <h1 className="text-3xl font-bold text-foreground mb-2">Criar conta para adoção</h1>
                                <p className="text-muted-foreground">
                                    Comece sua jornada para encontrar um novo amigo
                                </p>
                            </div>

                            {/* Mensagem de Erro */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-sm text-center">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

                                {/* Nome */}
                                <div className="relative">
                                    <User className="absolute left-4 top-[38px] size-5 text-muted-foreground z-10" />
                                    <Input
                                        label="Nome completo"
                                        type="text"
                                        placeholder="Seu nome completo"
                                        className="pl-12 h-12 rounded-2xl bg-input-background border-border/50 focus:border-primary"
                                        error={errors.name?.message}
                                        {...register("name")}
                                    />
                                </div>

                                {/* E-mail */}
                                <div className="relative">
                                    <Mail className="absolute left-4 top-[38px] size-5 text-muted-foreground z-10" />
                                    <Input
                                        label="E-mail"
                                        type="email"
                                        placeholder="seu@email.com"
                                        className="pl-12 h-12 rounded-2xl bg-input-background border-border/50 focus:border-primary"
                                        error={errors.email?.message}
                                        {...register("email")}
                                    />
                                </div>

                                {/* Senha */}
                                <div className="relative">
                                    <Lock className="absolute left-4 top-[38px] size-5 text-muted-foreground z-10" />
                                    <Input
                                        label="Senha"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-12 h-12 rounded-2xl bg-input-background border-border/50 focus:border-primary"
                                        error={errors.password?.message}
                                        {...register("password")}
                                    />
                                </div>

                                {/* Confirmar Senha */}
                                <div className="relative">
                                    <Lock className="absolute left-4 top-[38px] size-5 text-muted-foreground z-10" />
                                    <Input
                                        label="Confirmar senha"
                                        type="password"
                                        placeholder="••••••••"
                                        className="pl-12 h-12 rounded-2xl bg-input-background border-border/50 focus:border-primary"
                                        error={errors.confirmPassword?.message}
                                        {...register("confirmPassword")}
                                    />
                                </div>

                                {/* Telefone */}
                                <div className="relative">
                                    <Phone className="absolute left-4 top-[38px] size-5 text-muted-foreground z-10" />
                                    <Input
                                        label="Telefone"
                                        type="tel"
                                        placeholder="(00) 00000-0000"
                                        className="pl-12 h-12 rounded-2xl bg-input-background border-border/50 focus:border-primary"
                                        error={errors.phone?.message}
                                        {...register("phone")}
                                    />
                                </div>

                                {/* Cidade e Estado */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="relative">
                                        <MapPin className="absolute left-4 top-[38px] size-5 text-muted-foreground z-10" />
                                        <Input
                                            label="Cidade"
                                            type="text"
                                            placeholder="Sua cidade"
                                            className="pl-12 h-12 rounded-2xl bg-input-background border-border/50 focus:border-primary"
                                            error={errors.city?.message}
                                            {...register("city")}
                                        />
                                    </div>

                                    <Select
                                        label="Estado"
                                        placeholder="UF"
                                        options={stateOptions}
                                        className="h-12 rounded-2xl bg-input-background border-border/50 focus:border-primary"
                                        error={errors.state?.message}
                                        {...register("state")}
                                    />
                                </div>

                                {/* Checkbox de Termos */}
                                <Checkbox
                                    label={
                                        <>
                                            Concordo com os{" "}
                                            <Link href="#" className="text-primary hover:text-primary/80 font-medium">
                                                termos de responsabilidade de adoção
                                            </Link>{" "}
                                            e me comprometo a cuidar do animal com amor e respeito
                                        </>
                                    }
                                    error={errors.agreedToTerms?.message}
                                    {...register("agreedToTerms")}
                                />

                                {/* Botão de Submit */}
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg text-base font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex justify-center items-center mt-6"
                                >
                                    {isSubmitting ? (
                                        "Criando conta..."
                                    ) : (
                                        <>
                                            <CheckCircle2 className="size-5 mr-2" />
                                            Criar conta
                                        </>
                                    )}
                                </button>

                                <div className="relative my-6">
                                    <div className="absolute inset-0 flex items-center">
                                        <div className="w-full border-t border-border/50" />
                                    </div>
                                    <div className="relative flex justify-center text-sm">
                                        <span className="bg-card px-4 text-muted-foreground">ou</span>
                                    </div>
                                </div>

                                <Link href="/login" className="block">
                                    <button
                                        type="button"
                                        className="w-full h-12 rounded-2xl border-2 border-border/50 hover:border-primary hover:bg-primary/5 text-foreground text-base font-medium transition-colors"
                                    >
                                        Já tenho conta
                                    </button>
                                </Link>
                            </form>

                            <div className="mt-6 text-center">
                                <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                                    ← Voltar para o site
                                </Link>
                            </div>
                        </div>

                        {/* Patinhas decorativas */}
                        <div className="mt-6 flex justify-center gap-2">
                            <PawPrint className="size-6 text-accent/60" />
                            <PawPrint className="size-5 text-secondary/60" />
                            <PawPrint className="size-4 text-primary/60" />
                        </div>
                    </div>
                </div>

                {/* Lado Direito - Ilustração */}
                <div className="hidden md:flex flex-col items-center justify-center order-1 md:order-2">
                    <div className="relative">
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-accent rounded-full opacity-50 blur-xl" />
                        <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-secondary rounded-full opacity-40 blur-xl" />
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-card">
                            <img
                                src="https://images.unsplash.com/photo-1735989967755-706e5edcb44b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxmcmllbmRseSUyMGRvZyUyMHdlbGNvbWluZyUyMGhhcHB5fGVufDF8fHx8MTc3MzcwNTExN3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
                                alt="Friendly dog"
                                className="w-full h-[600px] object-cover"
                            />
                        </div>
                    </div>
                    <div className="mt-8 text-center max-w-md">
                        <h2 className="text-2xl font-bold text-foreground mb-2">Junte-se a nós!</h2>
                        <p className="text-muted-foreground">
                            Milhares de pessoas já encontraram seus melhores amigos através da nossa plataforma
                        </p>
                        <div className="flex items-center justify-center gap-6 mt-6">
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary">500+</div>
                                <div className="text-sm text-muted-foreground">Adoções</div>
                            </div>
                            <div className="h-12 w-px bg-border" />
                            <div className="text-center">
                                <div className="text-3xl font-bold text-primary">50+</div>
                                <div className="text-sm text-muted-foreground">ONGs</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}