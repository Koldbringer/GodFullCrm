import { ClassicPreset, GetSchemes } from "rete";
import { DataflowEngine } from "rete-engine"; // Import DataflowEngine type

// Definicja gniazd (sockets) dla połączeń
const execSocket = new ClassicPreset.Socket("exec"); // Socket for control flow
const stringSocket = new ClassicPreset.Socket("string"); // Socket for string data

// Definicja Schemes (powinna być w osobnym pliku typów w realnym projekcie)
// Na potrzeby tej modyfikacji, definiujemy ją tutaj.
type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>>
>;


// Klasa węzła "Wyślij Email"
export class EmailNode extends ClassicPreset.Node<
  // Inputs: keys are port names, values are Input instances
  { exec: ClassicPreset.Input<typeof execSocket>, recipient: ClassicPreset.Input<typeof stringSocket>, subject: ClassicPreset.Input<typeof stringSocket>, body: ClassicPreset.Input<typeof stringSocket> },
  // Outputs: keys are port names, values are Output instances
  { exec: ClassicPreset.Output<typeof execSocket>, status: ClassicPreset.Output<typeof stringSocket> },
  // Controls: keys are control names, values are Control instances
  { }
> {
  width = 180;
  height = 250; // Zwiększona wysokość, aby pomieścić więcej wejść/wyjść

  private _status: string = 'Idle'; // Wewnętrzny stan statusu

  constructor() {
    super("Wyślij Email"); // Nazwa węzła

    // Dodanie wejść
    this.addInput("exec", new ClassicPreset.Input(execSocket, "Wykonaj"));
    this.addInput("recipient", new ClassicPreset.Input(stringSocket, "Odbiorca"));
    this.addInput("subject", new ClassicPreset.Input(stringSocket, "Temat"));
    this.addInput("body", new ClassicPreset.Input(stringSocket, "Treść"));

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
    console.log("Wykonuję węzeł 'Wyślij Email'");
    this._status = 'Executing...'; // Ustaw status na "Wykonuję..."

    try {
      // Get input values from DataflowEngine
      // Note: fetchInputs returns a map where keys are input names and values are arrays of connected output values
      const inputs = await context.dataflow.fetchInputs(this.id);
      const recipient = inputs['recipient']?.[0]; // Get the first value from the connection
      const subject = inputs['subject']?.[0];
      const body = inputs['body']?.[0];

      if (!recipient || !subject || !body) {
        console.error("Missing required inputs for EmailNode");
        this._status = 'Failed: Missing inputs';
        // We might not want to forward 'exec' in case of input error
        // return; // Do not forward if data is missing
      } else {
         // Call API Route to send email
        const response = await fetch('/api/automation/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nodeId: 'EmailNode', // Node identifier for the backend
            nodeData: { recipient, subject, body },
          }),
        });

        const result = await response.json();

        if (response.ok) {
          console.log('Email API response:', result);
          this._status = 'Success';
          // After action is completed, forward control
          forward('exec');
        } else {
          console.error('Email API error:', result.error);
          this._status = `Failed: ${result.error}`;
          // Do not forward 'exec' in case of API error
        }
      }

    } catch (error: any) {
      console.error('Error during EmailNode execution:', error);
      this._status = `Failed: ${error.message}`;
      // Do not forward 'exec' in case of exception
    }
     // In case of error or missing inputs, we don't forward 'exec',
     // but we might want to update the UI with the status.
     // In Rete.js v2, changes in node data (e.g. this._status)
     // should be automatically propagated to the UI if the render plugin supports it.
  }
}