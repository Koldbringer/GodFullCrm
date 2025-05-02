import { ClassicPreset, GetSchemes } from "rete";
import { DataflowEngine } from "rete-engine";

// Definicja gniazd (sockets) dla połączeń
const execSocket = new ClassicPreset.Socket("exec"); // Socket for control flow
const stringSocket = new ClassicPreset.Socket("string"); // Socket for string data
const dateSocket = new ClassicPreset.Socket("date"); // Socket for date data

// Definicja Schemes
type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;

// Klasa węzła "Utwórz Zadanie"
export class CreateTaskNode extends ClassicPreset.Node<
  // Inputs: keys are port names, values are the type of the socket
  { exec: typeof execSocket, description: typeof stringSocket, assignee: typeof stringSocket, dueDate: typeof dateSocket },
  // Outputs: keys are port names, values are the type of the socket
  { exec: typeof execSocket, taskId: typeof stringSocket, status: typeof stringSocket },
  // Controls (UI): keys are control names, values are Control instances
  { }
> {
  width = 180;
  height = 280;

  private _status: string = 'Idle'; // Wewnętrzny stan statusu
  private _taskId: string | null = null; // Wewnętrzny stan ID zadania

  constructor() {
    super("Utwórz Zadanie"); // Nazwa węzła

    // Dodanie wejść (instancje Input)
    this.addInput("exec", new ClassicPreset.Input(execSocket, "Wykonaj"));
    this.addInput("description", new ClassicPreset.Input(stringSocket, "Opis"));
    this.addInput("assignee", new ClassicPreset.Input(stringSocket, "Przypisany"));
    this.addInput("dueDate", new ClassicPreset.Input(dateSocket, "Termin"));

    // Dodanie wyjść (instancje Output)
    this.addOutput("exec", new ClassicPreset.Output(execSocket, "Zakończono"));
    this.addOutput("taskId", new ClassicPreset.Output(stringSocket, "ID Zadania"));
    this.addOutput("status", new ClassicPreset.Output(stringSocket, "Status"));
  }

  // data() method is used by DataflowEngine to get output values
  data(): { taskId: string | null, status: string } {
    return {
      taskId: this._taskId, // Zwraca ID zadania
      status: this._status // Zwraca wewnętrzny status
    };
  }

  // execute() method will be used by ControlFlowEngine to perform actions
  // We assume that context contains an instance of DataflowEngine
  async execute(input: 'exec', forward: (output: 'exec') => void, context: { dataflow: DataflowEngine<Schemes> }) {
    console.log("Wykonuję węzeł 'Utwórz Zadanie'");
    this._status = 'Executing...'; // Ustaw status na "Wykonuję..."
    this._taskId = null; // Resetuj ID zadania

    try {
      // Get input values from DataflowEngine
      // Note: fetchInputs returns a map where keys are input names and values are arrays of connected output values
      const inputs = await context.dataflow.fetchInputs(this.id);
      const description = inputs['description']?.[0];
      const assignee = inputs['assignee']?.[0];
      const dueDate = inputs['dueDate']?.[0]; // Może być Date object lub string

      if (!description) {
        console.error("Missing required input: description for CreateTaskNode");
        this._status = 'Failed: Missing description';
        // We might not want to forward 'exec' in case of input error
        // return;
      } else {
         // Call API Route to create task
        const response = await fetch('/api/automation/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nodeId: 'CreateTaskNode', // Node identifier for the backend
            nodeData: { description, assignee, dueDate },
          }),
        });

        const result = await response.json();

        if (response.ok) {
          console.log('Create Task API response:', result);
          this._status = 'Success';
          this._taskId = result.taskId || null; // Zakładamy, że API zwraca taskId
          // After action is completed, forward control
          forward('exec');
        } else {
          console.error('Create Task API error:', result.error);
          this._status = `Failed: ${result.error}`;
          // Do not forward 'exec' in case of API error
        }
      }

    } catch (error: any) {
      console.error('Error during CreateTaskNode execution:', error);
      this._status = `Failed: ${error.message}`;
      // Do not forward 'exec' in case of exception
    }
  }
}