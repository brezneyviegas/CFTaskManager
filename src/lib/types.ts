export type Todo = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
  timeSpent: number; // in seconds
  timerRunning: boolean;
  lastStarted: number | null;
};
