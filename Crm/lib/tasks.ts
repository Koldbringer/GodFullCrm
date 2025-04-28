// Moduł zarządzania zadaniami
interface Task {
  id: string;
  description: string;
  status: 'open' | 'in-progress' | 'closed';
  createdAt: Date;
}

export function createTask(description: string): Task {
  // Przykładowa implementacja, w rzeczywistości powinna być zintegrowana z bazą danych
  const newTask: Task = {
    id: `TASK-${Date.now()}`,
    description,
    status: 'open',
    createdAt: new Date(),
  };
  console.log('Task created:', newTask);
  return newTask;
}

// Dodaj inne funkcje do zarządzania zadaniami (np. getTask, updateTask, deleteTask)