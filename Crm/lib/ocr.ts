/**
 * Calls the Unstract LLMWhisperer API to extract text from a document.
 * 
 * @param file The file object to process.
 * @param customerId The ID of the customer for tagging purposes.
 * @returns The extracted text as a string, or null if an error occurred.
 */
export const extractTextFromDocument = async (file: File, customerId: string): Promise<string | null> => {
  // Load API Key securely from environment variables
  const apiKey = process.env.NEXT_PUBLIC_UNSTRACT_API_KEY;

  if (!apiKey) {
    console.error("Unstract API Key (NEXT_PUBLIC_UNSTRACT_API_KEY) is missing from environment variables.");
    // Optionally, throw an error or return a specific error indicator
    return null; 
  }
  
  const endpoint = 'https://llmwhisperer-api.us-central.unstract.com/api/v2/whisper';
  // Configure parameters (adjust mode based on expected document types if needed)
  const params = new URLSearchParams({
    mode: 'form', 
    output_mode: 'layout_preserving',
    tag: `crm_customer_${customerId}`, // Use customerId in the tag
    add_line_nos: 'true' // Enable highlighting support
  });

  console.log(`Calling Unstract API for file: ${file.name}, customer: ${customerId}`);

  try {
    const response = await fetch(`${endpoint}?${params.toString()}`, {
      method: 'POST',
      headers: {
        'unstract-key': apiKey,
        'Content-Type': 'application/octet-stream'
      },
      body: file
    });

    if (response.status !== 202) {
      console.error(`LLMWhisperer API request failed: ${response.status} ${response.statusText}`);
      // TODO: Handle API errors more gracefully (e.g., show user message)
      return null;
    }

    const { whisper_hash } = await response.json();
    console.log("Unstract Job Hash:", whisper_hash);

    // --- Polling for status ---
    // TODO: Implement a more robust polling mechanism (e.g., exponential backoff) or use Webhooks for production
    const statusEndpoint = 'https://llmwhisperer-api.us-central.unstract.com/api/v2/whisper-status';
    let statusData;
    let attempts = 0;
    const maxAttempts = 12; // Poll for max 1 minute (12 * 5 seconds)
    const pollInterval = 5000; // 5 seconds

    do {
      await new Promise(resolve => setTimeout(resolve, pollInterval)); 
      attempts++;
      const statusResponse = await fetch(`${statusEndpoint}?whisper_hash=${whisper_hash}`, {
        headers: { 'unstract-key': apiKey }
      });
      
      if (!statusResponse.ok) {
         console.error(`LLMWhisperer Status check failed: ${statusResponse.status} ${statusResponse.statusText}`);
         // TODO: Handle status check errors
         return null;
      }
      
      statusData = await statusResponse.json();
      console.log(`Polling attempt ${attempts}/${maxAttempts}, Status: ${statusData.status}`);

    } while (statusData.status === 'processing' && attempts < maxAttempts);

    if (statusData.status !== 'processed') {
       console.error(`Unstract processing failed or timed out after ${attempts} attempts. Status: ${statusData.status}`);
       // TODO: Handle processing failure/timeout
       return null;
    }
    // --- End Polling ---

    // --- Retrieve Result ---
    const retrieveEndpoint = 'https://llmwhisperer-api.us-central.unstract.com/api/v2/whisper-retrieve';
    const retrieveResponse = await fetch(`${retrieveEndpoint}?whisper_hash=${whisper_hash}`, {
       headers: { 'unstract-key': apiKey }
    });

    if (!retrieveResponse.ok) {
       console.error(`Failed to retrieve Unstract result: ${retrieveResponse.statusText}`);
       // TODO: Handle retrieval errors
       return null;
    }

    const extractedText = await retrieveResponse.text();
    console.log(`Successfully extracted text (${extractedText.length} chars) for hash: ${whisper_hash}`);
    // console.log("Extracted Text (first 500 chars):", extractedText.substring(0, 500)); // Log snippet for verification
    return extractedText;

  } catch (error) {
    console.error("Error calling Unstract API:", error);
    // TODO: Handle network or other errors
    return null;
  }
}
