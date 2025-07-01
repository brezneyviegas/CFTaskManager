import { z } from 'zod';

/**
 * @openapi
 * components:
 *   schemas:
 *     Todo:
 *       type: object
 *       required:
 *         - id
 *         - title
 *         - completed
 *         - timeSpent
 *         - timerRunning
 *       properties:
 *         id:
 *           type: string
 *           description: The unique identifier for the todo item.
 *           example: '1720542849925'
 *         title:
 *           type: string
 *           description: The title of the todo item.
 *           example: 'Implement state management'
 *         description:
 *           type: string
 *           description: A detailed description of the todo item.
 *           example: 'Use React hooks for local state management.'
 *         completed:
 *           type: boolean
 *           description: Whether the todo item is completed.
 *           example: false
 *         timeSpent:
 *           type: number
 *           description: Total time spent on the task in seconds.
 *           example: 623
 *         timerRunning:
 *           type: boolean
 *           description: Whether the timer for the task is currently running.
 *           example: false
 *         lastStarted:
 *           type: number
 *           nullable: true
 *           description: The timestamp (in ms) when the timer was last started.
 *           example: null
 *     NewTodo:
 *       type: object
 *       required:
 *         - title
 *       properties:
 *         title:
 *           type: string
 *           description: The title of the new todo item.
 *           example: 'My new task'
 *         description:
 *           type: string
 *           description: The description of the new todo item.
 *           example: 'Details about my new task.'
 *     UpdateTodo:
 *        type: object
 *        required:
 *          - title
 *          - description
 *        properties:
 *          title:
 *            type: string
 *            description: The updated title of the todo item.
 *          description:
 *            type: string
 *            description: The updated description of the todo item.
 */
export const TodoSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  completed: z.boolean(),
  timeSpent: z.number(), // in seconds
  timerRunning: z.boolean(),
  lastStarted: z.number().nullable(),
});

export type Todo = z.infer<typeof TodoSchema>;

export const CreateTodoSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
});

export const UpdateTodoSchema = z.object({
  title: z.string(),
  description: z.string(),
});
