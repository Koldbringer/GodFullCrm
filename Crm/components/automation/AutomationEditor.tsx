:start_line:1
-------
import { createRoot } from "react-dom/client";
import { NodeEditor, GetSchemes, ClassicPreset } from "rete";
import { AreaPlugin, AreaExtensions } from "rete-area-plugin";
import {
  ReactPlugin,
  ReactArea2D,
  Presets as ReactPresets
} from "rete-react-plugin";
import { DataflowEngine, ControlFlowEngine } from "rete-engine"; // Import silników
import React, { useEffect, useRef, useState } from "react"; // Dodano useState
:start_line:13
-------
import { EmailNode } from "./nodes/EmailNode"; // Import EmailNode
import { CreateTaskNode } from "./nodes/CreateTaskNode"; // Import CreateTaskNode
import { UpdateContractNode } from "./nodes/UpdateContractNode"; // Import UpdateContractNode
import { TimeConditionNode } from "./nodes/TimeConditionNode"; // Import TimeConditionNode
import { DataConditionNode } from "./nodes/DataConditionNode"; // Import DataConditionNode


type Schemes = GetSchemes<
  ClassicPreset.Node,
  ClassicPreset.Connection<ClassicPreset.Node, ClassicPreset.Node>
>;
type AreaExtra = ReactArea2D<Schemes>;

const socket = new ClassicPreset.Socket("socket");

class Node extends ClassicPreset.Node {
  width = 180;
  height = 120;
}

class Connection<
  A extends Node,
  B extends Node
> extends ClassicPreset.Connection<A, B> {}

async function createEditor(container: HTMLElement) {
  const editor = new NodeEditor<Schemes>();
  const area = new AreaPlugin<Schemes, AreaExtra>(container);
  const reactRender = new ReactPlugin<Schemes, AreaExtra>({ createRoot });

  // Inicjalizacja silników
  const dataflow = new DataflowEngine<Schemes>(({ inputs, outputs }) => {
    return {
      inputs: () => Object.keys(inputs).filter((name) => name !== "exec"),
      outputs: () => Object.keys(outputs).filter((name) => name !== "exec")
    };
  });
  const controlflow = new ControlFlowEngine<Schemes>(() => {
    return {
      inputs: () => ["exec"],
      outputs: () => ["exec"]
    };
  });

  AreaExtensions.selectableNodes(area, AreaExtensions.selector(), {
    accumulating: AreaExtensions.accumulateOnCtrl()
  });

  reactRender.addPreset(ReactPresets.classic.setup());

  editor.use(area);
  area.use(reactRender);
  editor.use(dataflow); // Podłączenie silnika przepływu danych
  editor.use(controlflow); // Podłączenie silnika przepływu sterowania

  // Rejestracja niestandardowych węzłów
:start_line:66
-------
  editor.addFactory(EmailNode);
  editor.addFactory(CreateTaskNode); // Rejestracja CreateTaskNode
  editor.addFactory(UpdateContractNode); // Rejestracja UpdateContractNode
  editor.addFactory(TimeConditionNode); // Rejestracja TimeConditionNode
  editor.addFactory(DataConditionNode); // Rejestracja DataConditionNode


  // Przykładowe węzły - zostaną zastąpione niestandardowymi węzłami automatyzacji
  // const a = new Node("A");
  // a.addControl(
  //   "a",
  //   new ClassicPreset.InputControl("text", { initial: "A" })
  // );
  // a.addOutput("a", new ClassicPreset.Output(socket));
  // await editor.addNode(a);

  // const b = new Node("B");
  // b.addControl(
  //   "b",
  //   new ClassicPreset.InputControl("text", { initial: "B" })
  // );
  // b.addInput("b", new ClassicPreset.Input(socket));
  // await editor.addNode(b);

  // await editor.addConnection(new Connection(a, "a", b, "b"));

  // await area.translate(a.id, { x: 0, y: 0 });
  // await area.translate(b.id, { x: 270, y: 0 });

  AreaExtensions.zoomAt(area, editor.getNodes());

  return {
    editor, // Zwracamy instancję edytora
    destroy: () => area.destroy()
  };
}

const AutomationEditor: React.FC = () => {
  const editorRef = useRef<HTMLDivElement>(null);
  const [editor, setEditor] = useState<NodeEditor<Schemes> | null>(null); // Stan na instancję edytora

  useEffect(() => {
    let currentEditor: NodeEditor<Schemes> | null = null;
    if (editorRef.current) {
      createEditor(editorRef.current).then((result) => {
        currentEditor = result.editor;
        setEditor(currentEditor); // Ustawiamy instancję edytora w stanie
      });
    }
    return () => {
      if (currentEditor) {
        currentEditor.destroy();
      }
    };
  }, []);

  const saveWorkflow = async () => {
    if (!editor) return;
    const graph = editor.toJSON();
    // Tutaj można dodać logikę pobierania nazwy i opisu workflow
    const name = "My Workflow"; // Przykładowa nazwa
    const description = "Workflow description"; // Przykładowy opis

    try {
      const response = await fetch('/api/automation/workflows', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, description, graph_json: graph }),
      });
      const result = await response.json();
      console.log('Workflow saved:', result);
      alert('Workflow saved successfully!');
    } catch (error) {
      console.error('Error saving workflow:', error);
      alert('Failed to save workflow.');
    }
  };

  const loadWorkflow = async () => {
    if (!editor) return;
    // Tutaj można dodać logikę wyboru workflow do załadowania
    // Na razie ładujemy pierwszy znaleziony
    try {
      const response = await fetch('/api/automation/workflows');
      const workflows = await response.json();

      if (workflows && workflows.length > 0) {
        const latestWorkflow = workflows[workflows.length - 1]; // Ładujemy ostatni
        await editor.fromJSON(latestWorkflow.graph_json);
        console.log('Workflow loaded:', latestWorkflow);
        alert('Workflow loaded successfully!');
      } else {
        alert('No workflows found to load.');
      }
    } catch (error) {
      console.error('Error loading workflow:', error);
      alert('Failed to load workflow.');
    }
  };


  return (
    <div>
      <div style={{ marginBottom: '10px' }}>
        <button onClick={saveWorkflow} disabled={!editor}>Save Workflow</button>
        <button onClick={loadWorkflow} disabled={!editor} style={{ marginLeft: '10px' }}>Load Workflow</button>
      </div>
      <div ref={editorRef} style={{ width: '100%', height: '500px', border: '1px solid #ccc' }}></div> {/* Dodano obramowanie dla lepszej widoczności */}
    </div>
  );
};

export default AutomationEditor;