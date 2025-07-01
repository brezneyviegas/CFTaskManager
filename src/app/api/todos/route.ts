import { NextResponse } from 'next/server';
import * as store from '@/lib/todo-store';
import { CreateTodoSchema } from '@/lib/types';

/**
 * @openapi
 * /api/todos:
 *   get:
 *     summary: Retrieve a list of todos
 *     description: Returns a list of all todo items.
 *     tags:
 *       - Todos
 *     responses:
 *       200:
 *         description: A list of todos.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Todo'
 */
export async function GET() {
  const todos = store.getTodos();
  return NextResponse.json(todos);
}

/**
 * @openapi
 * /api/todos:
 *   post:
 *     summary: Create a new todo
 *     description: Creates a new todo item.
 *     tags:
 *       - Todos
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NewTodo'
 *     responses:
 *       201:
 *         description: The created todo item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Invalid input.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { title, description } = CreateTodoSchema.parse(body);
    const newTodo = store.addTodo(title, description || '');
    return NextResponse.json(newTodo, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }
}
