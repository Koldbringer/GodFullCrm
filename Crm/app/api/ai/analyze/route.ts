import { NextResponse } from 'next/server';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
  try {
    const { message } = await request.json();
    
    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }
    
    // In a production environment, you would call an actual AI service like OpenAI here
    // For now, we'll simulate an AI response
    
    // Extract some keywords from the message to make the response seem more relevant
    const keywords = extractKeywords(message);
    
    // Generate a simulated AI response
    const aiResponse = generateSimulatedResponse(message, keywords);
    
    // Log the analysis request to the database
    await logAnalysisRequest(message, aiResponse);
    
    return NextResponse.json({
      result: aiResponse,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error in AI analysis:', error);
    return NextResponse.json(
      { error: 'Failed to analyze data', details: String(error) },
      { status: 500 }
    );
  }
}

/**
 * Extract keywords from a message
 */
function extractKeywords(message: string): string[] {
  // Simple keyword extraction - in a real implementation, you would use NLP
  const commonWords = new Set([
    'the', 'and', 'a', 'an', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'about',
    'as', 'of', 'that', 'this', 'these', 'those', 'is', 'are', 'was', 'were', 'be',
    'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'shall', 'should', 'may', 'might', 'must', 'can', 'could', 'data', 'analyze',
    'following', 'instructions', 'according'
  ]);
  
  return message
    .toLowerCase()
    .replace(/[^\w\s]/g, '')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word))
    .slice(0, 10);
}

/**
 * Generate a simulated AI response
 */
function generateSimulatedResponse(message: string, keywords: string[]): any {
  // Check if the message contains data analysis keywords
  const containsDataAnalysis = /data|analy[sz]e|trend|pattern|statistic|insight/i.test(message);
  
  // Check if the message contains customer-related keywords
  const containsCustomer = /customer|client|user|buyer|consumer/i.test(message);
  
  // Check if the message contains service order keywords
  const containsServiceOrders = /service|order|ticket|maintenance|repair|installation/i.test(message);
  
  // Check if the message contains time-related keywords
  const containsTimeAnalysis = /time|period|duration|month|week|day|year|quarter/i.test(message);
  
  // Generate a response based on the detected topics
  if (containsDataAnalysis && containsCustomer) {
    return {
      insights: [
        "Wykryto wzrost liczby nowych klientów o 23% w ostatnim kwartale",
        "Średni czas utrzymania klienta wzrósł z 1.8 do 2.3 lat",
        "Klienci z sektora komercyjnego generują 3.5x więcej przychodów niż klienci indywidualni"
      ],
      recommendations: [
        "Zwiększ nakłady na marketing w sektorze komercyjnym",
        "Wprowadź program lojalnościowy dla klientów indywidualnych",
        "Skontaktuj się z klientami nieaktywnymi od ponad 6 miesięcy"
      ],
      metrics: {
        customerGrowth: 0.23,
        averageLifetime: 2.3,
        commercialToIndividualRatio: 3.5
      }
    };
  } else if (containsDataAnalysis && containsServiceOrders) {
    return {
      insights: [
        "Średni czas realizacji zlecenia wynosi 3.2 dnia",
        "Zlecenia serwisowe klimatyzacji stanowią 68% wszystkich zleceń w okresie letnim",
        "Wykryto 15% wzrost awaryjnych zleceń serwisowych w ostatnim miesiącu"
      ],
      recommendations: [
        "Zwiększ liczbę techników dostępnych w okresie letnim",
        "Wprowadź priorytetyzację zleceń awaryjnych",
        "Zaproponuj klientom z częstymi awariami umowy serwisowe"
      ],
      metrics: {
        averageCompletionTime: 3.2,
        acServicePercentage: 0.68,
        emergencyOrdersIncrease: 0.15
      }
    };
  } else if (containsTimeAnalysis) {
    return {
      timeTrends: [
        { period: "Styczeń", value: 42 },
        { period: "Luty", value: 47 },
        { period: "Marzec", value: 53 },
        { period: "Kwiecień", value: 58 },
        { period: "Maj", value: 69 },
        { period: "Czerwiec", value: 84 }
      ],
      seasonalPatterns: {
        summer: "Wysoki popyt na serwis klimatyzacji",
        winter: "Wysoki popyt na serwis ogrzewania",
        spring: "Umiarkowany popyt na instalacje nowych systemów",
        fall: "Niski popyt ogólny, dobry czas na kampanie marketingowe"
      },
      forecast: {
        nextMonth: "Przewidywany wzrost o 12%",
        nextQuarter: "Przewidywany wzrost o 8%",
        nextYear: "Przewidywany wzrost o 15%"
      }
    };
  } else {
    // Generic response using the extracted keywords
    return {
      summary: `Analiza danych wykazała istotne wzorce związane z następującymi aspektami: ${keywords.join(', ')}`,
      keyInsights: [
        `Wykryto znaczący trend wzrostowy w obszarze ${keywords[0] || 'biznesowym'}`,
        `Analiza wskazuje na potencjalne możliwości optymalizacji w zakresie ${keywords[1] || 'operacyjnym'}`,
        `Zidentyfikowano obszary wymagające uwagi: ${keywords[2] || 'obsługa klienta'}, ${keywords[3] || 'efektywność'}`
      ],
      recommendations: [
        "Monitoruj kluczowe wskaźniki wydajności w czasie rzeczywistym",
        "Rozważ automatyzację powtarzalnych procesów",
        "Zbieraj więcej danych w celu dokładniejszej analizy"
      ]
    };
  }
}

/**
 * Log the analysis request to the database
 */
async function logAnalysisRequest(message: string, response: any): Promise<void> {
  try {
    const supabase = createRouteHandlerClient({ cookies });
    
    await supabase.from('ai_analysis_logs').insert({
      prompt: message,
      response: JSON.stringify(response),
      created_at: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error logging AI analysis request:', error);
    // Don't throw - this is a non-critical operation
  }
}
