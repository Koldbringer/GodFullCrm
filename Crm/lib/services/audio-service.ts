import { createClient } from '@/lib/supabase';

/**
 * Serwis do zarządzania plikami audio i transkrypcjami
 */
export class AudioService {
  /**
   * Pobiera pliki audio powiązane z klientem na podstawie numeru telefonu
   * @param phoneNumber Numer telefonu klienta
   * @returns Lista plików audio
   */
  static async getAudioFilesByPhoneNumber(phoneNumber: string) {
    try {
      const supabase = createClient();
      
      // Najpierw znajdź klienta po numerze telefonu
      const { data: customer, error: customerError } = await supabase
        .from('customers')
        .select('id')
        .eq('phone', phoneNumber)
        .single();
      
      if (customerError || !customer) {
        console.error('Nie znaleziono klienta z podanym numerem telefonu:', customerError);
        return [];
      }
      
      // Pobierz pliki audio powiązane z klientem
      const { data: audioFiles, error: filesError } = await supabase
        .from('audio_files')
        .select('*')
        .eq('customer_id', customer.id);
      
      if (filesError) {
        console.error('Błąd podczas pobierania plików audio:', filesError);
        return [];
      }
      
      return audioFiles || [];
    } catch (error) {
      console.error('Błąd podczas pobierania plików audio:', error);
      return [];
    }
  }
  
  /**
   * Zapisuje plik audio dla klienta
   * @param customerId ID klienta
   * @param fileName Nazwa pliku
   * @param fileData Dane pliku (jako Blob lub File)
   * @param source Źródło pliku (np. 'email', 'upload')
   * @returns Informacje o zapisanym pliku lub null w przypadku błędu
   */
  static async saveAudioFile(customerId: string, fileName: string, fileData: Blob | File, source: string = 'email') {
    try {
      const supabase = createClient();
      
      // Generuj unikalną nazwę pliku
      const fileExt = fileName.split('.').pop();
      const uniqueFileName = `${customerId}_${Date.now()}.${fileExt}`;
      const filePath = `audio/${uniqueFileName}`;
      
      // Prześlij plik do Supabase Storage
      const { data: uploadData, error: uploadError } = await supabase
        .storage
        .from('customer-files')
        .upload(filePath, fileData, {
          contentType: 'audio/mpeg',
          upsert: false
        });
      
      if (uploadError) {
        console.error('Błąd podczas przesyłania pliku audio:', uploadError);
        return null;
      }
      
      // Pobierz publiczny URL do pliku
      const { data: { publicUrl } } = supabase
        .storage
        .from('customer-files')
        .getPublicUrl(filePath);
      
      // Zapisz informacje o pliku w bazie danych
      const { data: fileRecord, error: recordError } = await supabase
        .from('audio_files')
        .insert({
          customer_id: customerId,
          file_name: fileName,
          file_path: filePath,
          file_url: publicUrl,
          source: source,
          file_size: fileData.size,
          created_at: new Date().toISOString()
        })
        .select()
        .single();
      
      if (recordError) {
        console.error('Błąd podczas zapisywania informacji o pliku audio:', recordError);
        return null;
      }
      
      return fileRecord;
    } catch (error) {
      console.error('Błąd podczas zapisywania pliku audio:', error);
      return null;
    }
  }
  
  /**
   * Pobiera pliki audio dla klienta
   * @param customerId ID klienta
   * @returns Lista plików audio
   */
  static async getAudioFilesByCustomerId(customerId: string) {
    try {
      const supabase = createClient();
      
      const { data: audioFiles, error } = await supabase
        .from('audio_files')
        .select('*')
        .eq('customer_id', customerId)
        .order('created_at', { ascending: false });
      
      if (error) {
        console.error('Błąd podczas pobierania plików audio:', error);
        return [];
      }
      
      return audioFiles || [];
    } catch (error) {
      console.error('Błąd podczas pobierania plików audio:', error);
      return [];
    }
  }
  
  /**
   * Usuwa plik audio
   * @param fileId ID pliku audio
   * @returns true jeśli usunięto pomyślnie, false w przypadku błędu
   */
  static async deleteAudioFile(fileId: string) {
    try {
      const supabase = createClient();
      
      // Najpierw pobierz informacje o pliku
      const { data: fileInfo, error: fileError } = await supabase
        .from('audio_files')
        .select('file_path')
        .eq('id', fileId)
        .single();
      
      if (fileError || !fileInfo) {
        console.error('Nie znaleziono pliku audio:', fileError);
        return false;
      }
      
      // Usuń plik z Storage
      const { error: storageError } = await supabase
        .storage
        .from('customer-files')
        .remove([fileInfo.file_path]);
      
      if (storageError) {
        console.error('Błąd podczas usuwania pliku z magazynu:', storageError);
        // Kontynuuj mimo błędu, aby usunąć rekord z bazy danych
      }
      
      // Usuń rekord z bazy danych
      const { error: dbError } = await supabase
        .from('audio_files')
        .delete()
        .eq('id', fileId);
      
      if (dbError) {
        console.error('Błąd podczas usuwania rekordu pliku audio:', dbError);
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Błąd podczas usuwania pliku audio:', error);
      return false;
    }
  }
}
