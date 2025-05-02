import { ClassicPreset, GetSchemes } from "rete";
import { DataflowEngine } from "rete-engine";

// Definicja gniazd (sockets) dla połączeń
const execSocket = new ClassicPreset.Socket("exec"); // Socket for control flow
const stringSocket = new ClassicPreset.Socket("string"); // Socket for string data
const anySocket = new ClassicPreset.Socket("any"); // Socket for any data type (for updates object)

// Definicja Schemes
type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;

// Klasa węzła "Aktualizuj Kontrakt"
export class UpdateContractNode extends ClassicPreset.Node<
  // Inputs
  { exec: typeof execSocket, contractId: typeof stringSocket, updates: typeof anySocket },
  // Outputs
  { exec: typeof execSocket, status: typeof stringSocket },
  // Controls (UI)
  { }
> {
  width = 180;
  height = 200;

  private _status: string = 'Idle'; // Wewnętrzny stan statusu

  constructor() {
    super("Aktualizuj Kontrakt"); // Nazwa węzła

    // Dodanie wejść
    this.addInput("exec", new ClassicPreset.Input(execSocket, "Wykonaj"));
    this.addInput("contractId", new ClassicPreset.Input(stringSocket, "ID Kontraktu"));
    this.addInput("updates", new ClassicPreset.Input(anySocket, "Aktualizacje (JSON)")); // Wejście na obiekt z aktualizacjami

    // Dodanie wyjść
    this.addOutput("exec", new ClassicPreset.Output(execSocket, "Zakończono"));
    this.addOutput("status", new ClassicPreset.Output(stringSocket, "Status"));
  }

  // data() method is used by DataflowEngine to get output values
  data(): { status: string } {
    return {
      status: this._status // Zwraca wewnętrzny status
    };
  }

  // execute() method will be used by ControlFlowEngine to perform actions
  // We assume that context contains an instance of DataflowEngine
  async execute(input: 'exec', forward: (output: 'exec') => void, context: { dataflow: DataflowEngine<Schemes> }) {
    console.log("Wykonuję węzeł 'Aktualizuj Kontrakt'");
    this._status = 'Executing...'; // Ustaw status na "Wykonuję..."

    try {
      // Get input values from DataflowEngine
      const inputs = await context.dataflow.fetchInputs(this.id);
      const contractId = inputs['contractId']?.[0];
      const updates = inputs['updates']?.[0]; // Pobierz obiekt z aktualizacjami

      if (!contractId || !updates) {
        console.error("Missing required inputs for UpdateContractNode");
        this._status = 'Failed: Missing inputs';
        // Nie forwardujemy 'exec' w przypadku błędu wejścia
        // return;
      } else {
         // Call API Route to update contract
        const response = await fetch('/api/automation/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nodeId: 'UpdateContractNode', // Node identifier for the backend
            nodeData: { contractId, updates },
          }),
        });

        const result = await response.json();

        if (response.ok) {
          console.log('Update Contract API response:', result);
          this._status = 'Success';
          // After action is completed, forward control
          forward('exec');
        } else {
          console.error('Update Contract API error:', result.error);
          this._status = `Failed: ${result.error}`;
          // Nie forwardujemy 'exec' w przypadku błędu API
        }
      }

    } catch (error: any) {
      console.error('Error during UpdateContractNode execution:', error);
      this._status = `Failed: ${error.message}`;
      // Nie forwardujemy 'exec' w przypadku wyjątku
    }
  }
}