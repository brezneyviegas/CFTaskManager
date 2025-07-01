"use client";

import { useState } from 'react';
import { Todo } from '@/lib/types';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Edit, Save, Trash2, X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TodoItemProps {
  todo: Todo;
  onUpdate: (id: string, newTitle: string, newDescription: string) => void;
  onDelete: (id: string) => void;
  onToggleComplete: (id: string) => void;
}

export default function TodoItem({ todo, onUpdate, onDelete, onToggleComplete }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(todo.title);
  const [editedDescription, setEditedDescription] = useState(todo.description);

  const handleSave = () => {
    if (!editedTitle.trim()) return;
    onUpdate(todo.id, editedTitle, editedDescription);
    setIsEditing(false);
  };
  
  const handleCancel = () => {
    setEditedTitle(todo.title);
    setEditedDescription(todo.description);
    setIsEditing(false);
  };

  return (
    <Card className={cn(
      "transition-all duration-300 ease-in-out transform hover:shadow-lg hover:-translate-y-1",
      todo.completed ? "bg-card/60 border-primary/20" : "bg-card",
      isEditing && "ring-2 ring-accent"
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            {isEditing ? (
              <div className="space-y-2">
                <Input 
                  value={editedTitle} 
                  onChange={(e) => setEditedTitle(e.target.value)} 
                  className="text-lg font-bold font-headline"
                  aria-label="Edit Task Title"
                />
                <Textarea 
                  value={editedDescription} 
                  onChange={(e) => setEditedDescription(e.target.value)}
                  placeholder="Task Description"
                  aria-label="Edit Task Description"
                />
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <Checkbox 
                  id={`complete-${todo.id}`}
                  checked={todo.completed} 
                  onCheckedChange={() => onToggleComplete(todo.id)} 
                  className="mt-1 h-5 w-5"
                  aria-labelledby={`title-${todo.id}`}
                />
                <div className="space-y-1">
                  <label 
                    id={`title-${todo.id}`}
                    htmlFor={`complete-${todo.id}`}
                    className={cn("font-bold font-headline text-lg cursor-pointer", todo.completed && "line-through text-muted-foreground")}
                  >
                    {todo.title}
                  </label>
                  <p className={cn("text-muted-foreground text-sm", todo.completed && "line-through")}>
                    {todo.description || "No description provided."}
                  </p>
                </div>
              </div>
            )}
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            {isEditing ? (
              <>
                <Button variant="ghost" size="icon" onClick={handleSave} aria-label="Save changes">
                  <Save className="h-5 w-5 text-green-400" />
                </Button>
                <Button variant="ghost" size="icon" onClick={handleCancel} aria-label="Cancel editing">
                  <X className="h-5 w-5" />
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" size="icon" onClick={() => setIsEditing(true)} aria-label="Edit task">
                  <Edit className="h-5 w-5 text-accent" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => onDelete(todo.id)} aria-label="Delete task">
                  <Trash2 className="h-5 w-5 text-destructive" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
