"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Todo } from '@/lib/types';
import CreateTodo from '@/components/create-todo';
import TodoItem from '@/components/todo-item';
import { Button } from '@/components/ui/button';
import { Rocket, LogOut } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';

const initialTodos: Todo[] = [
  { id: '1', title: 'Set up project structure', description: 'Initialize Next.js app and install dependencies.', completed: true },
  { id: '2', title: 'Create UI components', description: 'Build reusable components for Todo items and forms.', completed: true },
  { id: '3', title: 'Implement state management', description: 'Use React hooks for local state management.', completed: false },
  { id: '4', title: 'Add dummy authentication', description: 'Create a login page that redirects on success.', completed: false },
];

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    setTodos(savedTodos ? JSON.parse(savedTodos) : initialTodos);
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, isMounted]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('todos');
    router.push('/login');
  };

  const addTodo = (title: string, description: string) => {
    const newTodo: Todo = { id: Date.now().toString(), title, description, completed: false };
    setTodos(prevTodos => [newTodo, ...prevTodos]);
  };

  const updateTodo = (id: string, newTitle: string, newDescription: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, title: newTitle, description: newDescription } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const toggleComplete = (id: string) => {
    setTodos(todos.map(todo => 
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };
  
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="max-w-4xl mx-auto p-4 sm:p-8">
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <Rocket className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline">TaskMaster</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </Button>
          </div>
        </header>

        <main>
          <CreateTodo onAdd={addTodo} />
          
          <div className="mt-8">
            <h2 className="text-2xl font-semibold font-headline mb-4">Your Tasks</h2>
            <div className="grid gap-4">
                {todos.map(todo => (
                  <TodoItem 
                    key={todo.id} 
                    todo={todo}
                    onUpdate={updateTodo}
                    onDelete={deleteTodo}
                    onToggleComplete={toggleComplete}
                  />
                ))}
            </div>
            {isMounted && todos.length === 0 && (
              <div className="text-center py-12 px-6 bg-card rounded-lg mt-4 border-2 border-dashed border-border">
                <p className="text-muted-foreground">You have no tasks yet. Add one to get started!</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
