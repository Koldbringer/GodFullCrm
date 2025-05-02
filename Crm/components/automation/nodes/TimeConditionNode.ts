import { ClassicPreset, GetSchemes } from "rete";
import { DataflowEngine } from "rete-engine";

// Definicja gniazd (sockets) dla połączeń
const execSocket = new ClassicPreset.Socket("exec"); // Socket for control flow
const dateSocket = new ClassicPreset.Socket("date"); // Socket for date data
const numberSocket = new ClassicPreset.Socket("number"); // Socket for number data
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

// Klasa węzła "Warunek Czasowy"
export class TimeConditionNode extends ClassicPreset.Node<
  // Inputs
  { exec: typeof execSocket, referenceDate: typeof dateSocket, days: typeof numberSocket },
  // Outputs
  { exec: typeof execSocket, result: typeof booleanSocket },
  // Controls (UI)
  { }
> {
  width = 180;
  height = 200;

  private _result: boolean = false; // Wewnętrzny stan wyniku

  constructor() {
    super("Warunek Czasowy"); // Nazwa węzła

    // Dodanie wejść (instancje Input)
    this.addInput("exec", new ClassicPreset.Input(execSocket, "Wykonaj"));
    this.addInput("referenceDate", new ClassicPreset.Input(dateSocket, "Data Referencyjna"));
    this.addInput("days", new ClassicPreset.Input(numberSocket, "Liczba Dni"));

    // Dodanie wyjść (instancje Output)
    this.addOutput("exec", new ClassicPreset.Output(execSocket, "Zakończono"));
    this.addOutput("result", new ClassicPreset.Output(booleanSocket, "Wynik"));
  }

  // data() method is used by DataflowEngine to get output values
  data(): { result: boolean } {
    return {
      result: this._result // Zwraca wewnętrzny wynik
    };
  }

  // execute() method will be used by ControlFlowEngine to perform actions
  // We assume that context contains an instance of DataflowEngine
  async execute(input: 'exec', forward: (output: 'exec') => void, context: { dataflow: DataflowEngine<Schemes> }) {
    console.log("Wykonuję węzeł 'Warunek Czasowy'");

    try {
      // Get input values from DataflowEngine
      const inputs = await context.dataflow.fetchInputs(this.id);
      const referenceDate = inputs['referenceDate']?.[0]; // Oczekujemy obiektu Date
      const days = inputs['days']?.[0]; // Oczekujemy liczby

      if (!(referenceDate instanceof Date) || typeof days !== 'number') {
        console.error("Invalid inputs for TimeConditionNode");
        this._result = false; // Ustaw wynik na false w przypadku błędu wejścia
        // Możemy nie forwardować 'exec' w przypadku błędu wejścia
        // return;
      } else {
        const currentDate = new Date();
        const targetDate = new Date(referenceDate);
        targetDate.setDate(targetDate.getDate() + days); // Dodaj/odejmij dni od daty referencyjnej

        // Porównaj daty
        this._result = currentDate >= targetDate; // Przykład: czy dzisiejsza data jest >= data referencyjna + dni

        console.log(`TimeConditionNode: Current Date: ${currentDate.toISOString()}, Target Date: ${targetDate.toISOString()}, Result: ${this._result}`);

        // Po zakończeniu akcji, przekazujemy sterowanie dalej
        forward('exec');
      }

    } catch (error: any) {
      console.error('Error during TimeConditionNode execution:', error);
      this._result = false; // Ustaw wynik na false w przypadku wyjątku
      // Nie forwardujemy 'exec' w przypadku wyjątku
    }
  }
}