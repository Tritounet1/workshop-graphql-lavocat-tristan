export type Project = {
    id: number,
    name: string,
    description: string,
    lastUpdate: number,
}

export type User = {
    id: number,
    email: string,
    password: string,
}

export type Comment = {
    id: number,
    user: User,
    text: string,
}

export enum TaskState {
    IN_PROGRESS = "En cours.",
    TO_DO = "A faire.",
}

export type Task = {
    id: number,
    name: string,
    taskState: TaskState,
}