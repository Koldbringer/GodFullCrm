import { ClassicPreset, GetSchemes } from "rete";
import { DataflowEngine } from "rete-engine";

// Definicja gniazd (sockets) dla połączeń
const execSocket = new ClassicPreset.Socket("exec"); // Socket for control flow
const stringSocket = new ClassicPreset.Socket("string"); // Socket for string data
const anySocket = new ClassicPreset.Socket("any"); // Socket for any data type
const booleanSocket = new ClassicPreset.Socket("boolean"); // Socket for boolean data

:start_line:13
-------
// Definicja Schemes zgodna z DataflowEngine
type Schemes = GetSchemes<
  ClassicPreset.Node & { data: (...args: any[]) => any }, // Węzeł musi mieć metodę data() dla DataflowEngine
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;

// Definicja niestandardowego typu węzła dla DataflowEngine (do użytku wewnętrznego/kontekstu)
// Ta definicja nie jest już bezpośrednio używana w Schemes, ale może być pomocna
// type DataflowClassicNode = ClassicPreset.Node<any, any, any> & {
//   data: (...args: any[]) => any;
// };

// Klasa węzła "Warunek Danych"
export class DataConditionNode extends ClassicPreset.Node<
  // Inputs
  { exec: typeof execSocket, dataSource: typeof stringSocket, field: typeof stringSocket, operator: typeof stringSocket, value: typeof anySocket },
  // Outputs
  { exec: typeof execSocket, result: typeof booleanSocket, status: typeof stringSocket }, // Dodano port status
  // Controls (UI)
  { } // Możemy dodać kontrolki do wyboru źródła danych, pola, operatora
> {
  width = 220;
  height = 250;

  private _result: boolean = false; // Wewnętrzny stan wyniku
  private _status: string = 'Idle'; // Wewnętrzny stan statusu

  constructor() {
    super("Warunek Danych"); // Nazwa węzła

    // Dodanie wejść (instancje Input)
    this.addInput("exec", new ClassicPreset.Input(execSocket, "Wykonaj"));
    this.addInput("dataSource", new ClassicPreset.Input(stringSocket, "Źródło Danych (np. tabela Supabase)"));
    this.addInput("field", new ClassicPreset.Input(stringSocket, "Pole"));
    this.addInput("operator", new ClassicPreset.Input(stringSocket, "Operator (=, !=, >, <, >=, <=, like, ilike, is null, is not null)"));
    this.addInput("value", new ClassicPreset.Input(anySocket, "Wartość")); // Wartość do porównania

    // Dodanie wyjść (instancje Output)
    this.addOutput("exec", new ClassicPreset.Output(execSocket, "Zakończono"));
    this.addOutput("result", new ClassicPreset.Output(booleanSocket, "Wynik"));
    this.addOutput("status", new ClassicPreset.Output(stringSocket, "Status")); // Dodano wyjście statusu
  }

  // data() method is used by DataflowEngine to get output values
  data(): { result: boolean, status: string } {
    return {
      result: this._result, // Zwraca wewnętrzny wynik
      status: this._status // Zwraca wewnętrzny status
    };
  }

  // execute() method will be used by ControlFlowEngine to perform actions
  // We assume that context contains an instance of DataflowEngine
  async execute(input: 'exec', forward: (output: 'exec') => void, context: { dataflow: DataflowEngine<Schemes> }) {
    console.log("Wykonuję węzeł 'Warunek Danych'");
    this._status = 'Executing...'; // Ustaw status na "Wykonuję..."
    this._result = false; // Resetuj wynik

    try {
      // Get input values from DataflowEngine
      const inputs = await context.dataflow.fetchInputs(this.id);
      const dataSource = inputs['dataSource']?.[0];
      const field = inputs['field']?.[0];
      const operator = inputs['operator']?.[0];
      const value = inputs['value']?.[0];

      if (!dataSource || !field || !operator) {
        console.error("Missing required inputs for DataConditionNode");
        this._status = 'Failed: Missing inputs';
        // Nie forwardujemy 'exec' w przypadku błędu wejścia
        // return;
      } else {
         // Call API Route to evaluate data condition
        const response = await fetch('/api/automation/execute', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nodeId: 'DataConditionNode', // Node identifier for the backend
            nodeData: { dataSource, field, operator, value },
          }),
        });

        const result = await response.json();

        if (response.ok) {
          console.log('Data Condition API response:', result);
          this._status = 'Success';
          this._result = result.result; // Zakładamy, że API zwraca boolean result
          // Po zakończeniu akcji, przekazujemy sterowanie dalej
          forward('exec');
        } else {
          console.error('Data Condition API error:', result.error);
          this._status = `Failed: ${result.error}`;
          this._result = false; // Ustaw wynik na false w przypadku błędu API
          // Nie forwardujemy 'exec' w przypadku błędu API
        }
      }

    } catch (error: any) {
      console.error('Error during DataConditionNode execution:', error);
      this._status = `Failed: ${error.message}`;
      this._result = false; // Ustaw wynik na false w przypadku wyjątku
      // Nie forwardujemy 'exec' w przypadku wyjątku
    }
  }
}