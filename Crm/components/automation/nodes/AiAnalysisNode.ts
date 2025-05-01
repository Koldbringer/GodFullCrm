import { ClassicPreset, GetSchemes } from "rete";
import { DataflowEngine } from "rete-engine";

// Definicja gniazd (sockets) dla połączeń
const execSocket = new ClassicPreset.Socket("exec"); // Socket for control flow
const textSocket = new ClassicPreset.Socket("text"); // Socket for text data
const jsonSocket = new ClassicPreset.Socket("json"); // Socket for JSON data
const booleanSocket = new ClassicPreset.Socket("boolean"); // Socket for boolean data

// Definicja niestandardowego typu węzła dla DataflowEngine
// Musi zawierać metodę data()
type DataflowClassicNode = ClassicPreset.Node<any, any, any> & {
  data: (...args: any[]) => any;
};

// Definicja Schemes używająca niestandardowego typu węzła
type Schemes = GetSchemes<
  DataflowClassicNode, // Używamy niestandardowego typu węzła
  ClassicPreset.Connection<DataflowClassicNode, DataflowClassicNode>
>;

// Klasa węzła "Analiza AI"
export class AiAnalysisNode extends ClassicPreset.Node<
  // Inputs
  { exec: typeof execSocket, inputData: typeof jsonSocket, prompt: typeof textSocket },
  // Outputs
  { exec: typeof execSocket, result: typeof jsonSocket, success: typeof booleanSocket },
  // Controls (UI)
  { }
> {
  width = 200;
  height = 220;

  private _result: any = null; // Wewnętrzny stan wyniku
  private _success: boolean = false; // Wewnętrzny stan sukcesu
  private _status: string = 'Waiting'; // Status wykonania

  constructor() {
    super("Analiza AI"); // Nazwa węzła

    // Dodanie wejść (instancje Input)
    this.addInput("exec", new ClassicPreset.Input(execSocket, "Wykonaj"));
    this.addInput("inputData", new ClassicPreset.Input(jsonSocket, "Dane wejściowe"));
    this.addInput("prompt", new ClassicPreset.Input(textSocket, "Instrukcja dla AI"));

    // Dodanie wyjść (instancje Output)
    this.addOutput("exec", new ClassicPreset.Output(execSocket, "Zakończono"));
    this.addOutput("result", new ClassicPreset.Output(jsonSocket, "Wynik analizy"));
    this.addOutput("success", new ClassicPreset.Output(booleanSocket, "Sukces"));
  }

  // data() method is used by DataflowEngine to get output values
  data(): { result: any, success: boolean } {
    return {
      result: this._result,
      success: this._success
    };
  }

  // Metoda wykonująca analizę AI
  async execute(inputData: any, prompt: string): Promise<void> {
    try {
      this._status = 'Running';

      // Walidacja danych wejściowych
      if (!inputData) {
        throw new Error("Brak danych wejściowych do analizy");
      }

      if (!prompt) {
        throw new Error("Brak instrukcji dla AI");
      }

      // Wywołanie API do analizy AI
      const response = await fetch('/api/automation/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'AiAnalysisNode',
          nodeData: {
            inputData,
            prompt
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Błąd analizy AI: ${errorData.error || response.statusText}`);
      }

      const data = await response.json();

      // Zapisanie wyniku
      this._result = data.result;
      this._success = true;
      this._status = 'Completed';
    } catch (error) {
      console.error("Error in AI Analysis Node:", error);
      this._result = { error: error instanceof Error ? error.message : String(error) };
      this._success = false;
      this._status = `Failed: ${error instanceof Error ? error.message : String(error)}`;
    }
  }
}
