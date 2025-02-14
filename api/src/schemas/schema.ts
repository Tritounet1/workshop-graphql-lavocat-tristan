import { buildSchema } from 'graphql';

export const schema = buildSchema(`
  type Query {
    hello: String
    projects: [Project]
    tasks: [Task]
    users: [User]
    comments: [Comment]
  }

  type Project {
    id: ID
    name: String
    description: String
    lastUpdate: Int
  }

  type Task {
    id: ID
    name: String
    taskState: String
  }

  type User {
    id: ID
    email: String
    password: String
  }

  type Comment {
    id: ID
    user: User
    text: String
  }
`);