import { NextResponse } from 'next/server';
import * as store from '@/lib/todo-store';
import { UpdateTodoSchema } from '@/lib/types';

interface Params {
  params: { id: string };
}

/**
 * @openapi
 * /api/todos/{id}:
 *   get:
 *     summary: Get a single todo by ID
 *     description: Returns a single todo item by its unique ID.
 *     tags:
 *       - Todos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the todo item.
 *     responses:
 *       200:
 *         description: The requested todo item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       404:
 *         description: Todo not found.
 */
export async function GET(request: Request, { params }: Params) {
  const todo = store.getTodoById(params.id);
  if (!todo) {
    return NextResponse.json({ message: 'Not Found' }, { status: 404 });
  }
  return NextResponse.json(todo);
}

/**
 * @openapi
 * /api/todos/{id}:
 *   delete:
 *     summary: Delete a todo by ID
 *     description: Deletes a single todo item by its unique ID.
 *     tags:
 *       - Todos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the todo item.
 *     responses:
 *       204:
 *         description: The todo item was deleted successfully.
 *       404:
 *         description: Todo not found.
 */
export async function DELETE(request: Request, { params }: Params) {
  const success = store.deleteTodo(params.id);
  if (!success) {
    return NextResponse.json({ message: 'Not Found' }, { status: 404 });
  }
  return new Response(null, { status: 204 });
}

/**
 * @openapi
 * /api/todos/{id}:
 *   put:
 *     summary: Update a todo by ID
 *     description: Updates a todo item's title and description.
 *     tags:
 *       - Todos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the todo item.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateTodo'
 *     responses:
 *       200:
 *         description: The updated todo item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Invalid input.
 *       404:
 *         description: Todo not found.
 */
export async function PUT(request: Request, { params }: Params) {
  try {
    const body = await request.json();
    const { title, description } = UpdateTodoSchema.parse(body);
    const updatedTodo = store.updateTodo(params.id, title, description);
    if (!updatedTodo) {
      return NextResponse.json({ message: 'Not Found' }, { status: 404 });
    }
    return NextResponse.json(updatedTodo);
  } catch (error) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }
}

/**
 * @openapi
 * /api/todos/{id}:
 *   patch:
 *     summary: Partially update a todo's state
 *     description: Toggles the 'completed' status or the timer of a todo item.
 *     tags:
 *       - Todos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the todo item.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [toggleComplete, toggleTimer]
 *                 description: The action to perform on the todo.
 *     responses:
 *       200:
 *         description: The updated todo item.
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Todo'
 *       400:
 *         description: Invalid action or input.
 *       404:
 *         description: Todo not found.
 */
export async function PATCH(request: Request, { params }: Params) {
  const todo = store.getTodoById(params.id);
  if (!todo) {
    return NextResponse.json({ message: 'Not Found' }, { status: 404 });
  }

  try {
    const body = await request.json();
    let updatedTodo;

    if (body.action === 'toggleComplete') {
      updatedTodo = store.toggleComplete(params.id);
    } else if (body.action === 'toggleTimer') {
      updatedTodo = store.toggleTimer(params.id);
    } else {
      return NextResponse.json({ message: 'Invalid action' }, { status: 400 });
    }

    if (!updatedTodo) {
      return NextResponse.json({ message: 'Invalid operation' }, { status: 400 });
    }

    return NextResponse.json(updatedTodo);
  } catch (error) {
    return NextResponse.json({ message: 'Invalid input' }, { status: 400 });
  }
}
