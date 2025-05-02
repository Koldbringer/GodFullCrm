import { createClient } from '@/lib/supabase';

/**
 * Serwis do zarządzania transkrypcjami audio
 */
export class TranscriptionService {
  private static ELEVEN_LABS_API_KEY = process.env.NEXT_PUBLIC_ELEVEN_LABS_API_KEY;
  private static ELEVEN_LABS_API_URL = 'https://api.elevenlabs.io/v1/speech-to-text';
  private static OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY;
  private static OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
  
  /**
   * Wykonuje transkrypcję pliku audio przy użyciu Eleven Labs API
   * @param audioUrl URL do pliku audio
   * @returns Tekst transkrypcji lub null w przypadku błędu
   */
  static async transcribeAudio(audioUrl: string): Promise<string | null> {
    try {
      if (!this.ELEVEN_LABS_API_KEY) {
        console.error('Brak klucza API Eleven Labs');
        return null;
      }
      
      // Pobierz plik audio
      const audioResponse = await fetch(audioUrl);
      if (!audioResponse.ok) {
        console.error('Nie udało się pobrać pliku audio:', audioResponse.statusText);
        return null;
      }
      
      const audioBlob = await audioResponse.blob();
      
      // Przygotuj dane do wysłania
      const formData = new FormData();
      formData.append('audio', audioBlob);
      formData.append('model_id', 'eleven_multilingual_v2'); // Model wielojęzyczny
      
      // Wyślij żądanie do Eleven Labs API
      const response = await fetch(this.ELEVEN_LABS_API_URL, {
        method: 'POST',
        headers: {
          'xi-api-key': this.ELEVEN_LABS_API_KEY,
        },
        body: formData,
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Błąd podczas transkrypcji:', errorText);
        return null;
      }
      
      const data = await response.json();
      return data.text || null;
    } catch (error) {
      console.error('Błąd podczas transkrypcji audio:', error);
      return null;
    }
  }
  
  /**
   * Analizuje transkrypcję przy użyciu OpenRouter API
   * @param transcriptionText Tekst transkrypcji
   * @returns Wynik analizy lub null w przypadku błędu
   */
  static async analyzeTranscription(transcriptionText: string): Promise<any | null> {
    try {
      if (!this.OPENROUTER_API_KEY) {
        console.error('Brak klucza API OpenRouter');
        return null;
      }
      
      const prompt = `
        Przeanalizuj poniższą transkrypcję rozmowy z klientem i wyodrębnij następujące informacje:
        1. Kluczowe punkty rozmowy (maksymalnie 5)
        2. Ogólny sentyment rozmowy (pozytywny, neutralny, negatywny)
        3. Potencjalne działania do podjęcia
        4. Ważne daty lub terminy wspomniane w rozmowie
        
        Zwróć wynik w formacie JSON z następującymi polami:
        - key_points: tablica kluczowych punktów
        - sentiment: "positive", "neutral" lub "negative"
        - action_items: tablica potencjalnych działań
        - dates: tablica ważnych dat lub terminów
        
        Transkrypcja:
        ${transcriptionText}
      `;
      
      const response = await fetch(this.OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.OPENROUTER_API_KEY}`,
          'HTTP-Referer': 'https://godlikecrm.com', // Zastąp swoją domeną
          'X-Title': 'GodLike CRM'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-opus:beta', // Możesz wybrać inny model
          messages: [
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' }
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Błąd podczas analizy transkrypcji:', errorText);
        return null;
      }
      
      const data = await response.json();
      // Parsuj wynik z pola content
      try {
        const content = data.choices[0].message.content;
        return typeof content === 'string' ? JSON.parse(content) : content;
      } catch (parseError) {
        console.error('Błąd podczas parsowania wyniku analizy:', parseError);
        return null;
      }
    } catch (error) {
      console.error('Błąd podczas analizy transkrypcji:', error);
      return null;
    }
  }
  
  /**
   * Zapisuje transkrypcję w bazie danych
   * @param customerId ID klienta
   * @param audioFileId ID pliku audio
   * @param transcriptionText Tekst transkrypcji
   * @param analysis Wynik analizy (opcjonalny)
   * @returns Informacje o zapisanej transkrypcji lub null w przypadku błędu
   */
  static async saveTranscription(
    customerId: string, 
    audioFileId: string, 
    transcriptionText: string, 
    analysis: any = null
  ) {
    try {
      const supabase = createClient();
      
      // Przygotuj dane do zapisania
      const transcriptionData = {
        customer_id: customerId,
        audio_file_id: audioFileId,
        content: transcriptionText,
        created_at: new Date().toISOString(),
        created_by: 'System', // Możesz zastąpić nazwą użytkownika
        status: 'completed',
        source: 'phone', // Domyślnie zakładamy, że to rozmowa telefoniczna
        title: `Transkrypcja z ${new Date().toLocaleDateString('pl-PL')}`,
      };
      
      // Dodaj dane z analizy, jeśli są dostępne
      if (analysis) {
        Object.assign(transcriptionData, {
          key_points: analysis.key_points || [],
          sentiment: analysis.sentiment || 'neutral',
          action_items: analysis.action_items || [],
          important_dates: analysis.dates || [],
        });
      }
      
      // Zapisz transkrypcję w bazie danych
      const { data: transcription, error } = await supabase
        .from('transcriptions')
        .insert(transcriptionData)
        .select()
        .single();
      
      if (error) {
        console.error('Błąd podczas zapisywania transkrypcji:', error);
        return null;
      }
      
      return transcription;
    } catch (error) {
      console.error('Błąd podczas zapisywania transkrypcji:', error);
      return null;
    }
  }
  
  /**
   * Pobiera transkrypcje dla klienta
   * @param customerId ID klienta
   * @returns Lista transkrypcji
   */
  static async getTranscriptionsByCustomerId(customerId: string) {
    try {
      const supabase = createClient();
      
      const { data: transcriptions, error } = await supabase
        .from('transcriptions')
        .select('*, audio_files(*)')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Błąd podczas pobierania transkrypcji:', error);
        return [];
      }
      
      return transcriptions || [];
    } catch (error) {
      console.error('Błąd podczas pobierania transkrypcji:', error);
      return [];
    }
  }
  
  /**
   * Pobiera pojedynczą transkrypcję
   * @param transcriptionId ID transkrypcji
   * @returns Informacje o transkrypcji lub null w przypadku błędu
   */
  static async getTranscriptionById(transcriptionId: string) {
    try {
      const supabase = createClient();
      
      const { data: transcription, error } = await supabase
        .from('transcriptions')
        .select('*, audio_files(*)')
        .eq('id', transcriptionId)
        .single();
      
      if (error) {
        console.error('Błąd podczas pobierania transkrypcji:', error);
        return null;
      }
      
      return transcription;
    } catch (error) {
      console.error('Błąd podczas pobierania transkrypcji:', error);
      return null;
    }
  }
  
  /**
   * Usuwa transkrypcję
   * @param transcriptionId ID transkrypcji
   * @returns true jeśli usunięto pomyślnie, false w przypadku błędu
   */
  static async deleteTranscription(transcriptionId: string) {
    try {
      const supabase = createClient();
      
      const { error } = await supabase
        .from('transcriptions')
        .delete()
        .eq('id', transcriptionId);
      
      if (error) {
        console.error('Błąd podczas usuwania transkrypcji:', error);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Błąd podczas usuwania transkrypcji:', error);
      return false;
    }
  }
}
