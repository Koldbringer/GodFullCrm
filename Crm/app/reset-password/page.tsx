"use client";
import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const supabase = createClient();

  // Sprawdzenie, czy użytkownik ma dostęp do tej strony
  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      // Jeśli nie ma sesji, przekieruj do strony logowania
      if (!session) {
        router.push("/login");
      }
    };
    
    checkSession();
  }, [router, supabase.auth]);

  // Funkcja walidacji hasła
  const validatePassword = (password: string): boolean => {
    const isValid = password.length >= 6;
    setPasswordError(isValid ? "" : "Hasło musi mieć co najmniej 6 znaków");
    return isValid;
  };

  // Funkcja walidacji potwierdzenia hasła
  const validateConfirmPassword = (confirmPassword: string): boolean => {
    const isValid = confirmPassword === password;
    setConfirmPasswordError(isValid ? "" : "Hasła nie są identyczne");
    return isValid;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Resetowanie błędów i wiadomości
    setError("");
    setMessage("");
    setPasswordError("");
    setConfirmPasswordError("");
    
    // Walidacja pól
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    
    if (!isPasswordValid || !isConfirmPasswordValid) {
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: password,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage("Hasło zostało pomyślnie zmienione. Za chwilę zostaniesz przekierowany do strony logowania.");
        
        // Przekierowanie do strony logowania po 3 sekundach
        setTimeout(() => {
          router.push("/login");
        }, 3000);
      }
    } catch (err: any) {
      setError(err.message || "Wystąpił błąd podczas resetowania hasła");
      console.error("Reset password error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">GodLike HVAC CRM ERP</h1>
          <p className="text-gray-600 mt-2">Resetowanie hasła</p>
        </div>
        
        <form onSubmit={handleResetPassword} className="bg-white p-8 rounded-lg shadow-lg w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Ustaw nowe hasło</h2>
          <p className="text-gray-600 mb-6 text-center">
            Wprowadź nowe hasło dla swojego konta.
          </p>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Nowe hasło
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className={`w-full border ${passwordError ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (passwordError) validatePassword(e.target.value);
                  if (confirmPassword && confirmPasswordError) validateConfirmPassword(confirmPassword);
                }}
                onBlur={() => validatePassword(password)}
                autoComplete="new-password"
                placeholder="Minimum 6 znaków"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {passwordError && <p className="mt-1 text-sm text-red-600">{passwordError}</p>}
          </div>
          
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Potwierdź nowe hasło
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                className={`w-full border ${confirmPasswordError ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (confirmPasswordError) validateConfirmPassword(e.target.value);
                }}
                onBlur={() => validateConfirmPassword(confirmPassword)}
                autoComplete="new-password"
                placeholder="Powtórz hasło"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
            {confirmPasswordError && <p className="mt-1 text-sm text-red-600">{confirmPasswordError}</p>}
          </div>
          
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}
          
          {message && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
              <p className="text-sm text-green-600">{message}</p>
            </div>
          )}
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Zapisywanie...
              </>
            ) : (
              "Zmień hasło"
            )}
          </button>
          
          <div className="mt-6 text-center">
            <Link href="/login" className="text-sm text-blue-600 hover:text-blue-800 transition">
              Powrót do logowania
            </Link>
          </div>
        </form>
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>© 2024 GodLike HVAC CRM ERP. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </div>
  );
}
