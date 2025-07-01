
"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Todo } from '@/lib/types';
import CreateTodo from '@/components/create-todo';
import TodoItem from '@/components/todo-item';
import { Button } from '@/components/ui/button';
import { Rocket, LogOut } from 'lucide-react';
import { ThemeToggle } from './theme-toggle';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import PomodoroTimer from './pomodoro-timer';
import { useToast } from '@/hooks/use-toast';

export default function TodoList() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [isMounted, setIsMounted] = useState(false);
  const [sortBy, setSortBy] = useState('newest');
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchTodos = async () => {
      try {
        const response = await fetch('/api/todos');
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTodos(data);
      } catch (error) {
        toast({
          variant: 'destructive',
          title: 'Error',
          description: 'Could not fetch your tasks. Please try again later.',
        });
        console.error(error);
      } finally {
        setIsMounted(true);
      }
    };
    fetchTodos();
  }, [toast]);

  const sortedTodos = useMemo(() => {
    const sorted = [...todos];
    // Create a stable sort by using the ID as a secondary sort key
    const idNum = (id: string) => parseInt(id, 10) || 0;

    switch (sortBy) {
      case 'oldest':
        sorted.sort((a, b) => idNum(a.id) - idNum(b.id));
        break;
      case 'title-asc':
        sorted.sort((a, b) => a.title.localeCompare(b.title) || idNum(b.id) - idNum(a.id));
        break;
      case 'title-desc':
        sorted.sort((a, b) => b.title.localeCompare(a.title) || idNum(b.id) - idNum(a.id));
        break;
      case 'status-completed':
        sorted.sort((a, b) => (a.completed === b.completed) ? (idNum(b.id) - idNum(a.id)) : a.completed ? -1 : 1);
        break;
      case 'status-incomplete':
         sorted.sort((a, b) => (a.completed === b.completed) ? (idNum(b.id) - idNum(a.id)) : a.completed ? 1 : -1);
        break;
      case 'newest':
      default:
        sorted.sort((a, b) => idNum(b.id) - idNum(a.id));
        break;
    }
    return sorted;
  }, [todos, sortBy]);

  const handleLogout = () => {
    localStorage.removeItem('isLoggedIn');
    router.push('/login');
  };

  const addTodo = async (title: string, description: string) => {
    try {
      const response = await fetch('/api/todos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description }),
      });
      if (!response.ok) throw new Error('Failed to add task');
      const newTodo = await response.json();
      setTodos(prevTodos => [newTodo, ...prevTodos]);
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not add task." });
    }
  };

  const updateTodo = async (id: string, newTitle: string, newDescription: string) => {
    try {
        const response = await fetch(`/api/todos/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: newTitle, description: newDescription }),
        });
        if (!response.ok) throw new Error('Failed to update task');
        const updatedTodo = await response.json();
        setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (error) {
        toast({ variant: "destructive", title: "Error", description: "Could not update task." });
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      const response = await fetch(`/api/todos/${id}`, { method: 'DELETE' });
      if (response.status !== 204) throw new Error('Failed to delete task');
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
       toast({ variant: "destructive", title: "Error", description: "Could not delete task." });
    }
  };

  const handleApiPatch = async (id: string, action: 'toggleComplete' | 'toggleTimer') => {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      if (!response.ok) throw new Error(`Failed to ${action}`);
      const updatedTodo = await response.json();
      setTodos(todos.map(todo => todo.id === id ? updatedTodo : todo));
    } catch (error) {
      toast({ variant: "destructive", title: "Error", description: `Could not update task status.` });
    }
  };

  const toggleComplete = (id: string) => {
    handleApiPatch(id, 'toggleComplete');
  };
  
  const toggleTimer = (id: string) => {
    handleApiPatch(id, 'toggleTimer');
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
            <PomodoroTimer />
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
            <div className="flex justify-between items-center mb-4 flex-wrap gap-4">
              <h2 className="text-2xl font-semibold font-headline">Your Tasks</h2>
              <div className="flex items-center gap-2">
                  <Label htmlFor="sort-by" className="text-sm font-medium text-muted-foreground shrink-0">Sort by</Label>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger id="sort-by" className="w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="oldest">Oldest</SelectItem>
                      <SelectItem value="title-asc">Title (A-Z)</SelectItem>
                      <SelectItem value="title-desc">Title (Z-A)</SelectItem>
                      <SelectItem value="status-completed">Completed First</SelectItem>
                      <SelectItem value="status-incomplete">Incomplete First</SelectItem>
                    </SelectContent>
                  </Select>
              </div>
            </div>
            <div className="grid gap-4">
                {sortedTodos.map(todo => (
                  <TodoItem 
                    key={todo.id} 
                    todo={todo}
                    onUpdate={updateTodo}
                    onDelete={deleteTodo}
                    onToggleComplete={toggleComplete}
                    onToggleTimer={toggleTimer}
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
