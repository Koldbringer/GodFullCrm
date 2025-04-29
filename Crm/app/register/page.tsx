"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");
  const [fullNameError, setFullNameError] = useState("");

  const supabase = createClient();

  // Funkcja walidacji email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailError(isValid ? "" : "Wprowadź poprawny adres email");
    return isValid;
  };

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

  // Funkcja walidacji imienia i nazwiska
  const validateFullName = (fullName: string): boolean => {
    const isValid = fullName.trim().length > 0;
    setFullNameError(isValid ? "" : "Wprowadź imię i nazwisko");
    return isValid;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Resetowanie błędów
    setError("");
    setEmailError("");
    setPasswordError("");
    setConfirmPasswordError("");
    setFullNameError("");
    
    // Walidacja pól
    const isEmailValid = validateEmail(email);
    const isPasswordValid = validatePassword(password);
    const isConfirmPasswordValid = validateConfirmPassword(confirmPassword);
    const isFullNameValid = validateFullName(fullName);
    
    if (!isEmailValid || !isPasswordValid || !isConfirmPasswordValid || !isFullNameValid) {
      return;
    }
    
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            company_name: companyName,
          },
        },
      });

      if (error) {
        setError(error.message);
      } else {
        // Przekierowanie do strony potwierdzenia rejestracji
        router.push("/register/confirmation");
      }
    } catch (err: any) {
      setError(err.message || "Wystąpił błąd podczas rejestracji");
      console.error("Registration error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 py-12">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">GodLike HVAC CRM ERP</h1>
          <p className="text-gray-600 mt-2">Utwórz nowe konto</p>
        </div>
        
        <form onSubmit={handleRegister} className="bg-white p-8 rounded-lg shadow-lg w-full">
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Rejestracja</h2>
          
          <div className="mb-4">
            <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1">
              Imię i nazwisko
            </label>
            <input
              id="fullName"
              type="text"
              className={`w-full border ${fullNameError ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value);
                if (fullNameError) validateFullName(e.target.value);
              }}
              onBlur={() => validateFullName(fullName)}
              placeholder="Jan Kowalski"
              required
            />
            {fullNameError && <p className="mt-1 text-sm text-red-600">{fullNameError}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="companyName" className="block text-sm font-medium text-gray-700 mb-1">
              Nazwa firmy (opcjonalnie)
            </label>
            <input
              id="companyName"
              type="text"
              className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              placeholder="Nazwa Twojej firmy"
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Adres email
            </label>
            <input
              id="email"
              type="email"
              className={`w-full border ${emailError ? 'border-red-500' : 'border-gray-300'} rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition`}
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                if (emailError) validateEmail(e.target.value);
              }}
              onBlur={() => validateEmail(email)}
              autoComplete="email"
              placeholder="nazwa@firma.pl"
              required
            />
            {emailError && <p className="mt-1 text-sm text-red-600">{emailError}</p>}
          </div>
          
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Hasło
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
              Potwierdź hasło
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
          
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition flex items-center justify-center"
            disabled={loading}
          >
            {loading ? (
              <>
                <Loader2 size={20} className="mr-2 animate-spin" />
                Rejestracja...
              </>
            ) : (
              "Zarejestruj się"
            )}
          </button>
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Masz już konto?{" "}
              <Link href="/login" className="text-blue-600 hover:text-blue-800 transition">
                Zaloguj się
              </Link>
            </p>
          </div>
        </form>
        
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>© 2024 GodLike HVAC CRM ERP. Wszelkie prawa zastrzeżone.</p>
        </div>
      </div>
    </div>
  );
}
