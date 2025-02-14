import { Task, TaskState } from "../types";

const Tasks: Task[] = [
    { id: 1, name: 'Task 1', taskState: TaskState.TO_DO, },
    { id: 1, name: 'Task 2', taskState: TaskState.IN_PROGRESS, },
];

export const taskResolver = {
    tasks: () => Tasks,
};
