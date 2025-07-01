"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircle } from 'lucide-react';

interface CreateTodoProps {
  onAdd: (title: string, description: string) => void;
}

export default function CreateTodo({ onAdd }: CreateTodoProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, description);
    setTitle('');
    setDescription('');
  };

  return (
    <Card className="shadow-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 font-headline text-xl">
          <PlusCircle className="text-accent h-6 w-6" />
          Create a New Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
             <Input 
                placeholder="Task Title" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                className="text-lg"
                aria-label="Task Title"
                required
            />
          </div>
         <div className="space-y-1">
            <Textarea 
                placeholder="Task Description (optional)" 
                value={description} 
                onChange={(e) => setDescription(e.target.value)}
                aria-label="Task Description"
            />
         </div>
          <Button type="submit" className="w-full sm:w-auto">Add Task</Button>
        </form>
      </CardContent>
    </Card>
  );
}
