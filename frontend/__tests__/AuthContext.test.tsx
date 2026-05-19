import { render, screen, act } from "@testing-library/react";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import { ReactNode } from "react";

// Helper component to test useAuth
const TestComponent = () => {
    const { isAuthenticated, login, logout } = useAuth();
    return (
        <div>
            <span data-testid="auth-status">{isAuthenticated ? "authenticated" : "not authenticated"}</span>
            <button onClick={() => login("test-token")}>Login</button>
            <button onClick={() => logout()}>Logout</button>
        </div>
    );
};

describe("AuthContext", () => {
    beforeEach(() => {
        localStorage.clear();
        jest.clearAllMocks();
    });

    it("deve iniciar como não autenticado se não houver token no localStorage", async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId("auth-status")).toHaveTextContent("not authenticated");
    });

    it("deve iniciar como autenticado se houver token no localStorage", async () => {
        localStorage.setItem("adotapet_token", "existing-token");
        
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        expect(screen.getByTestId("auth-status")).toHaveTextContent("authenticated");
    });

    it("deve atualizar estado para autenticado ao chamar login", async () => {
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        const loginButton = screen.getByText("Login");
        await act(async () => {
            loginButton.click();
        });

        expect(screen.getByTestId("auth-status")).toHaveTextContent("authenticated");
        expect(localStorage.getItem("adotapet_token")).toBe("test-token");
    });

    it("deve atualizar estado para não autenticado ao chamar logout", async () => {
        localStorage.setItem("adotapet_token", "existing-token");
        
        render(
            <AuthProvider>
                <TestComponent />
            </AuthProvider>
        );

        const logoutButton = screen.getByText("Logout");
        await act(async () => {
            logoutButton.click();
        });

        expect(screen.getByTestId("auth-status")).toHaveTextContent("not authenticated");
        expect(localStorage.getItem("adotapet_token")).toBeNull();
    });

    it("deve lançar erro se useAuth for usado fora do AuthProvider", () => {
        const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
        
        expect(() => render(<TestComponent />)).toThrow("useAuth must be used within an AuthProvider");
        
        consoleSpy.mockRestore();
    });
});
