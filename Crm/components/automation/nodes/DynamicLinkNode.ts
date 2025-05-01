import { ClassicPreset, GetSchemes } from "rete";
import { DataflowEngine } from "rete-engine";

// Definicja gniazd (sockets) dla połączeń
const execSocket = new ClassicPreset.Socket("exec"); // Socket for control flow
const stringSocket = new ClassicPreset.Socket("string"); // Socket for string data
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

// Klasa węzła "Generator Linków Dynamicznych"
export class DynamicLinkNode extends ClassicPreset.Node<
  // Inputs
  { exec: typeof execSocket, resourceId: typeof stringSocket },
  // Outputs
  { exec: typeof execSocket, url: typeof stringSocket, success: typeof booleanSocket },
  // Controls (UI)
  { }
> {
  width = 200;
  height = 280;

  private _url: string | null = null; // Wewnętrzny stan URL
  private _success: boolean = false; // Wewnętrzny stan sukcesu
  private _status: string = 'Waiting'; // Status wykonania

  constructor() {
    super("Generator Linków Dynamicznych");

    // Dodanie wejść (instancje Input)
    this.addInput("exec", new ClassicPreset.Input(execSocket, "Wykonaj"));
    this.addInput("resourceId", new ClassicPreset.Input(stringSocket, "ID Zasobu"));

    // Dodanie wyjść (instancje Output)
    this.addOutput("exec", new ClassicPreset.Output(execSocket, "Zakończono"));
    this.addOutput("url", new ClassicPreset.Output(stringSocket, "URL"));
    this.addOutput("success", new ClassicPreset.Output(booleanSocket, "Sukces"));
  }

  // Domyślne wartości dla węzła
  data = {
    linkType: "custom",
    title: "Dynamiczny link",
    description: "",
    expiresInDays: 14,
    passwordProtected: false,
    password: "",
    resourceIdVariable: "",
    outputLinkVariable: "dynamicLink"
  };

  // data() method is used by DataflowEngine to get output values
  data(): { url: string | null, success: boolean } {
    return {
      url: this._url,
      success: this._success
    };
  }

  // execute() method will be used by ControlFlowEngine to perform actions
  async execute(input: 'exec', forward: (output: 'exec') => void, context: { dataflow: DataflowEngine<Schemes> }) {
    console.log("Executing DynamicLinkNode");
    this._status = 'Executing...';
    this._url = null;
    this._success = false;

    try {
      // Get input values using dataflow engine
      const resourceId = await context.dataflow.fetchValue(this.inputs.resourceId);

      // Call API Route to generate dynamic link
      const response = await fetch('/api/automation/execute', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          nodeId: 'DynamicLinkNode',
          nodeData: {
            ...this.data,
            resourceId
          },
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate dynamic link');
      }

      const result = await response.json();

      // Update internal state
      this._url = result.fullUrl;
      this._success = true;
      this._status = 'Completed';

      console.log("DynamicLinkNode executed successfully:", result);
    } catch (error) {
      console.error("Error executing DynamicLinkNode:", error);
      this._status = `Failed: ${error instanceof Error ? error.message : String(error)}`;
      this._success = false;
    }

    // Continue execution flow
    forward('exec');
  }
}
