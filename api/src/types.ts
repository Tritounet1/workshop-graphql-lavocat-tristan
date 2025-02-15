export enum UserRole {
    'USER',
    'ADMIN',
}

export enum TaskState {
    'IN_PROGRESS',
    'TO_DO',
}

export type Project = {
    id: number,
    name: string,
    description: string,
    last_update: Date,
    created_at: Date,
}

export type User = {
    id: number,
    email: string,
    password: string,
    role: UserRole,
}

export type Comment = {
    id: number,
    author: User,
    text: string,
    project: number,
}

export type Task = {
    id: number,
    title: string,
    state: TaskState,
    project: number,
}