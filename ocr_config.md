# Unstract LLMWhisperer OCR Configuration

This file outlines the configuration options for the Unstract LLMWhisperer Extraction API, based on the documentation available at [https://docs.unstract.com/llmwhisperer/llm_whisperer/apis/llm_whisperer_text_extraction_api/](https://docs.unstract.com/llmwhisperer/llm_whisperer/apis/llm_whisperer_text_extraction_api/).

**API Endpoint:** `https://llmwhisperer-api.us-central.unstract.com/api/v2/whisper`
**Method:** `POST`
**Headers:** `unstract-key: <YOUR_API_KEY>` (Replace `<YOUR_API_KEY>` with the actual key)
**Body:** `application/octet-stream` (for file upload) or `text/plain` (if `url_in_post` is true)

## Parameters

| Parameter                 | Type    | Default             | Required | Description                                                                                                                                                              | Notes                                                                                                                               |
| :------------------------ | :------ | :------------------ | :------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------- |
| `mode`                    | string  | `form`              | No       | Processing mode. Options: `form`, `native_text`, `ocr`, `low_cost`. See [Modes documentation](https://docs.unstract.com/llmwhisperer/llm_whisperer/llm_whisperer_modes/). | `form` is generally good for structured documents like invoices. `native_text` is faster for software-generated PDFs with text layers. |
| `output_mode`             | string  | `layout_preserving` | No       | Output format. Options: `layout_preserving`, `text`.                                                                                                                     | `layout_preserving` is recommended for LLM consumption as it maintains structure. `text` provides raw text.                       |
| `page_seperator`          | string  | `<<<`               | No       | String used to separate pages in the output text.                                                                                                                        |                                                                                                                                     |
| `pages_to_extract`        | string  |                     | No       | Specify pages or ranges (e.g., `1-5,7,21-`). Extracts all pages by default.                                                                                              |                                                                                                                                     |
| `median_filter_size`      | integer | `0`                 | No       | Size of the median filter for noise removal (only works in `low_cost` mode).                                                                                             | Set to 0 to disable.                                                                                                                |
| `gaussian_blur_radius`    | integer | `0`                 | No       | Radius of Gaussian blur for noise removal (only works in `low_cost` mode).                                                                                               | Set to 0 to disable.                                                                                                                |
| `line_splitter_tolerance` | float   | `0.4`               | No       | Factor (based on avg char height) to decide line breaks.                                                                                                                 |                                                                                                                                     |
| `line_splitter_strategy`  | string  | `left-priority`     | No       | Advanced option for line splitting logic.                                                                                                                                |                                                                                                                                     |
| `horizontal_stretch_factor`| float   | `1.0`               | No       | Factor to stretch horizontally (e.g., `1.1` for 10%). Useful for fixing merged columns.                                                                                  |                                                                                                                                     |
| `url_in_post`             | boolean | `false`             | No       | If `true`, send the document URL in the request body (`text/plain`) instead of uploading the file.                                                                       |                                                                                                                                     |
| `mark_vertical_lines`     | boolean | `false`             | No       | Reproduce vertical lines in the output (not applicable for `native_text` mode).                                                                                          |                                                                                                                                     |
| `mark_horizontal_lines`   | boolean | `false`             | No       | Reproduce horizontal lines (not applicable for `native_text` mode, requires `mark_vertical_lines=true`).                                                                 |                                                                                                                                     |
| `lang`                    | string  | `eng`               | No       | Language hint for OCR (currently ignored by the API, auto-detected).                                                                                                     |                                                                                                                                     |
| `tag`                     | string  | `default`           | No       | Custom tag for auditing/tracking API calls in usage reports.                                                                                                             | Useful for associating calls with specific features or customers.                                                                   |
| `file_name`               | string  |                     | No       | Custom file name for auditing/tracking in usage reports.                                                                                                                 |                                                                                                                                     |
| `use_webhook`             | string  |                     | No       | Name of a pre-registered webhook to call upon completion (for async processing).                                                                                         | Requires setting up webhooks via the Webhook Management API.                                                                        |
| `webhook_metadata`        | string  |                     | No       | Custom metadata string to be sent verbatim to the webhook callback.                                                                                                      |                                                                                                                                     |
| `add_line_nos`            | boolean | `false`             | No       | If `true`, adds line numbers to the output and enables querying line metadata via the Highlight API.                                                                     | Necessary for implementing source document highlighting features.                                                                   |

## Processing Workflow

1.  **Send Request:** Make a `POST` request to the `/whisper` endpoint with the document (or URL) and desired parameters.
2.  **Receive Hash:** A successful request returns `202 Accepted` with a `whisper_hash`.
3.  **Check Status (Async/Webhook):**
    *   **Polling:** Periodically call the `/whisper-status` endpoint with the `whisper_hash` until the status is `processed`.
    *   **Webhook:** If `use_webhook` was set, wait for the callback notification.
4.  **Retrieve Result:** Once processed, call the `/whisper-retrieve` endpoint with the `whisper_hash` to get the extracted text.

## Example Usage (Conceptual)

```typescript
// Example function to call the LLMWhisperer API
async function extractTextFromDocument(file: File, apiKey: string): Promise<string> {
  const endpoint = 'https://llmwhisperer-api.us-central.unstract.com/api/v2/whisper';

  // Configure parameters (adjust as needed)
  const params = new URLSearchParams({
    mode: 'form', // Good starting point for invoices/forms
    output_mode: 'layout_preserving',
    tag: 'crm_invoice_processing',
    add_line_nos: 'true' // Enable highlighting
  });

  const response = await fetch(`${endpoint}?${params.toString()}`, {
    method: 'POST',
    headers: {
      'unstract-key': apiKey,
      'Content-Type': 'application/octet-stream'
    },
    body: file
  });

  if (response.status !== 202) {
    throw new Error(`API request failed: ${response.statusText}`);
  }

  const { whisper_hash } = await response.json();

  // --- Polling for status ---
  const statusEndpoint = 'https://llmwhisperer-api.us-central.unstract.com/api/v2/whisper-status';
  let statusData;
  do {
    await new Promise(resolve => setTimeout(resolve, 5000)); // Wait 5 seconds
    const statusResponse = await fetch(`${statusEndpoint}?whisper_hash=${whisper_hash}`, {
      headers: { 'unstract-key': apiKey }
    });
    statusData = await statusResponse.json();
  } while (statusData.status === 'processing');

  if (statusData.status !== 'processed') {
     throw new Error(`Processing failed: ${statusData.status}`);
  }
  // --- End Polling ---

  // --- Retrieve Result ---
  const retrieveEndpoint = 'https://llmwhisperer-api.us-central.unstract.com/api/v2/whisper-retrieve';
  const retrieveResponse = await fetch(`${retrieveEndpoint}?whisper_hash=${whisper_hash}`, {
     headers: { 'unstract-key': apiKey }
  });

  if (!retrieveResponse.ok) {
     throw new Error(`Failed to retrieve result: ${retrieveResponse.statusText}`);
  }

  const extractedText = await retrieveResponse.text();
  return extractedText;
}
```

This configuration provides a starting point for integrating Unstract LLMWhisperer into the CRM. Remember to replace `<YOUR_API_KEY>` with your actual Unstract API key.
