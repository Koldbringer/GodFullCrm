"use client";
import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import { Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const supabase = createClient();

  // Funkcja walidacji email
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValid = emailRegex.test(email);
    setEmailError(isValid ? "" : "Wprowadź poprawny adres email");
    return isValid;
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Resetowanie błędów i wiadomości
    setError("");
    setMessage("");
    setEmailError("");
    
    // Walidacja pola email
    const isEmailValid = validateEmail(email);
    
    if (!isEmailValid) {
      return;
    }
    
    setLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        setError(error.message);
      } else {
        setMessage("Link do resetowania hasła został wysłany na podany adres email.");
      }
    } catch (err: any) {
      setError(err.message || "Wystąpił błąd podczas wysyłania linku resetującego hasło");
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
          <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">Zapomniałeś hasła?</h2>
          <p className="text-gray-600 mb-6 text-center">
            Podaj swój adres email, a wyślemy Ci link do resetowania hasła.
          </p>
          
          <div className="mb-6">
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
                Wysyłanie...
              </>
            ) : (
              "Wyślij link resetujący"
            )}
          </button>
          
          <div className="mt-6 text-center">
            <Link 
              href="/login" 
              className="text-sm text-blue-600 hover:text-blue-800 transition flex items-center justify-center"
            >
              <ArrowLeft size={16} className="mr-1" />
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
