import type { Todo } from './types';

// In-memory store for demonstration purposes
let todos: Todo[] = [
  { id: '1', title: 'Set up project structure', description: 'Initialize Next.js app and install dependencies.', completed: true, timeSpent: 305, timerRunning: false, lastStarted: null },
  { id: '2', title: 'Create UI components', description: 'Build reusable components for Todo items and forms.', completed: true, timeSpent: 1245, timerRunning: false, lastStarted: null },
  { id: '3', title: 'Implement state management', description: 'Use React hooks for local state management.', completed: false, timeSpent: 623, timerRunning: false, lastStarted: null },
  { id: '4', title: 'Add dummy authentication', description: 'Create a login page that redirects on success.', completed: false, timeSpent: 0, timerRunning: false, lastStarted: null },
];

export const getTodos = () => todos;

export const getTodoById = (id: string) => todos.find(t => t.id === id);

export const addTodo = (title: string, description: string): Todo => {
    const newTodo: Todo = { 
        id: Date.now().toString(), 
        title, 
        description, 
        completed: false, 
        timeSpent: 0, 
        timerRunning: false, 
        lastStarted: null 
    };
    todos = [newTodo, ...todos];
    return newTodo;
};

export const updateTodo = (id: string, newTitle: string, newDescription: string): Todo | undefined => {
    const todoToUpdate = todos.find(t => t.id === id);
    if (!todoToUpdate) return undefined;
    
    const updatedTodo = { ...todoToUpdate, title: newTitle, description: newDescription };
    todos = todos.map(t => t.id === id ? updatedTodo : t);
    return updatedTodo;
};

export const deleteTodo = (id: string): boolean => {
    const initialLength = todos.length;
    todos = todos.filter(todo => todo.id !== id);
    return todos.length < initialLength;
};

export const toggleComplete = (id: string): Todo | undefined => {
    const todo = getTodoById(id);
    if (!todo) return undefined;

    const isCompleting = !todo.completed;
    const clonedTodo = { ...todo };

    if (isCompleting) {
        if (clonedTodo.timerRunning && clonedTodo.lastStarted) {
            const now = Date.now();
            const timeToAdd = (now - clonedTodo.lastStarted) / 1000;
            clonedTodo.timeSpent = (clonedTodo.timeSpent || 0) + timeToAdd;
            clonedTodo.timerRunning = false;
            clonedTodo.lastStarted = null;
        }
    } 
    clonedTodo.completed = isCompleting;
    
    todos = todos.map(t => t.id === id ? clonedTodo : t);
    return clonedTodo;
};

export const toggleTimer = (id: string): Todo | undefined => {
    const todo = getTodoById(id);
    if (!todo || todo.completed) return undefined;

    const now = Date.now();
    const clonedTodo = { ...todo };

    if (clonedTodo.timerRunning) {
        const timeToAdd = (now - (clonedTodo.lastStarted || now)) / 1000;
        clonedTodo.timerRunning = false;
        clonedTodo.lastStarted = null;
        clonedTodo.timeSpent = (clonedTodo.timeSpent || 0) + timeToAdd;
    } else {
        clonedTodo.timerRunning = true;
        clonedTodo.lastStarted = now;
    }

    todos = todos.map(t => t.id === id ? clonedTodo : t);
    return clonedTodo;
};
