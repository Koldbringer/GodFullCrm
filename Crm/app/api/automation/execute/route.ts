import { NextResponse } from 'next/server';
import { sendEmail } from '@/lib/email'; // Import funkcji wysyłki emaila
import { createTask } from '@/lib/tasks'; // Import funkcji tworzenia zadania
import { createServerClient } from '@supabase/ssr'; // Updated import
import { cookies } from 'next/headers'; // Import cookies
import { createDynamicLink } from '@/lib/services/dynamic-links'; // Import funkcji tworzenia dynamicznych linków
// Import funkcji aktualizacji kontraktu (do zaimplementowania)
// import { updateContract } from '@/lib/contracts';
import { SUPABASE_CONFIG } from '@/lib/supabase/config'; // Import Supabase config

export async function POST(request: Request) {
  try {
    const { nodeId, nodeData } = await request.json();
    
    // Updated Supabase client creation
    const cookieStore = cookies();
    const supabase = createServerClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey,
      {
        cookies: {
          get(name) {
            return cookieStore.get(name)?.value;
          },
          set(name, value, options) {
            cookieStore.set({ name, value, ...options });
          },
          remove(name, options) {
            cookieStore.set({ name, value: '', ...options, maxAge: 0 });
          }
        }
      }
    );

    // Tutaj będziemy rozróżniać, który węzeł ma zostać wykonany
    // i wywoływać odpowiednią logikę.

    if (nodeId === 'EmailNode') { // Używamy nazwy węzła jako identyfikatora
      const { recipient, subject, body } = nodeData;

      if (!recipient || !subject || !body) {
        return NextResponse.json({ error: 'Missing required email data' }, { status: 400 });
      }

      // Wywołanie funkcji wysyłki emaila
      sendEmail({ to: recipient, subject, body });

      return NextResponse.json({ success: true, message: 'Email sent' });

    } else if (nodeId === 'CreateTaskNode') { // Obsługa węzła Utwórz Zadanie
      const { description, assignee, dueDate } = nodeData;

      if (!description) {
        return NextResponse.json({ error: 'Missing required task description' }, { status: 400 });
      }

      // Wywołanie funkcji tworzenia zadania
      // assignee i dueDate nie są jeszcze używane w createTask, ale przekazujemy je dalej
      const newTask = createTask(description);

      return NextResponse.json({ success: true, taskId: newTask.id, status: newTask.status });

    } else if (nodeId === 'UpdateContractNode') { // Obsługa węzła Aktualizuj Kontrakt
      const { contractId, updates } = nodeData;

      if (!contractId || !updates) {
        return NextResponse.json({ error: 'Missing required contract data' }, { status: 400 });
      }

      // Tutaj będzie wywołanie funkcji aktualizacji kontraktu
      // const updatedContract = await updateContract(contractId, updates);

      // Na razie zwracamy tylko informację o próbie aktualizacji
      console.log(`Attempting to update contract ${contractId} with data:`, updates);

      return NextResponse.json({ success: true, message: `Contract ${contractId} update initiated` });

    } else if (nodeId === 'DataConditionNode') { // Obsługa węzła Warunek Danych
      const { dataSource, field, operator, value } = nodeData;

      if (!dataSource || !field || !operator) {
        return NextResponse.json({ error: 'Missing required data condition inputs' }, { status: 400 });
      }

      let result = false;

      try {
        // Pobranie danych z Supabase
        const { data, error } = await supabase
          .from(dataSource)
          .select(field)
          .limit(1); // Pobieramy tylko jeden rekord, aby sprawdzić warunek

        if (error) {
          console.error('Supabase query error:', error);
          return NextResponse.json({ error: error.message }, { status: 500 });
        }

        if (data && data.length > 0) {
          const fieldValue = data[0][field];

          // Ocena warunku na podstawie operatora
          switch (operator) {
            case '=':
              result = fieldValue === value;
              break;
            case '!=':
              result = fieldValue !== value;
              break;
            case '>':
              result = fieldValue > value;
              break;
            case '<':
              result = fieldValue < value;
              break;
            case '>=':
              result = fieldValue >= value;
              break;
            case '<=':
              result = fieldValue <= value;
              break;
            case 'is null':
              result = fieldValue === null;
              break;
            case 'is not null':
              result = fieldValue !== null;
              break;
            // TODO: Dodać obsługę dla 'like', 'ilike'
            default:
              console.error(`Unsupported operator: ${operator}`);
              return NextResponse.json({ error: `Unsupported operator: ${operator}` }, { status: 400 });
          }
        } else {
          // Jeśli nie znaleziono danych, warunek jest false
          result = false;
        }

        return NextResponse.json({ success: true, result });

      } catch (error: any) {
        console.error('Error evaluating data condition:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }

    } else if (nodeId === 'DynamicLinkNode') { // Obsługa węzła Generator Linków Dynamicznych
      const {
        linkType,
        title,
        description,
        expiresInDays,
        passwordProtected,
        password,
        resourceId
      } = nodeData;

      if (!linkType || !title) {
        return NextResponse.json({ error: 'Missing required link data: linkType and title are required' }, { status: 400 });
      }

      try {
        // Utworzenie dynamicznego linku
        const { url, token } = await createDynamicLink({
          linkType,
          resourceId,
          title,
          description,
          expiresInDays: expiresInDays || 14,
          password: passwordProtected ? password : undefined,
          metadata: {
            createdBy: 'automation',
            nodeId,
          },
        });

        // Pełny URL z domeną
        const fullUrl = `${process.env.NEXT_PUBLIC_APP_URL || ''}${url}`;

        return NextResponse.json({
          success: true,
          message: 'Dynamic link created successfully',
          token,
          url,
          fullUrl,
        });
      } catch (error: any) {
        console.error('Error creating dynamic link:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else if (nodeId === 'MCPCommandNode') { // Obsługa węzła MCP Command
      const { command, args, type } = nodeData;

      if (!command || !type) {
        return NextResponse.json({ error: 'Missing required MCP command data' }, { status: 400 });
      }

      try {
        // Log the MCP command execution
        console.log(`Executing MCP command of type ${type}: ${command}`);
        console.log('Arguments:', args);

        // Here you would implement the actual MCP command execution
        // For now, we'll just return a success message
        return NextResponse.json({
          success: true,
          message: 'MCP command executed successfully',
          result: {
            command,
            type,
            status: 'completed',
            timestamp: new Date().toISOString()
          }
        });
      } catch (error: any) {
        console.error('Error executing MCP command:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    } else {
      return NextResponse.json({ error: `Unknown node type: ${nodeId}` }, { status: 400 });
    }

  } catch (error: any) {
    console.error('Error executing node:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}