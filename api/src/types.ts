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
    last_update: string,
    created_at: string,
    comments: Comment[],
    tasks: Task[],
    owner: User,
}

export type User = {
    id: number,
    email: string,
    password: string,
    role: UserRole,
}

export type Comment = {
    id: number,
    author_id: User,
    text: string,
}

export type Task = {
    id: number,
    title: string,
    state: TaskState,
}