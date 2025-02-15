import { buildSchema } from 'graphql';

export const schema = buildSchema(`#graphql
  type Query {
    projects: [Project!]!
    tasks: [Task!]!
    users: [User!]!
    comments: [Comment!]!
    project(id: ID!): Project!
    
    task(id: ID!): Task!
  }

  type Mutation {
    login(email: String!, password: String!): Boolean!
    register(email: String!, password: String!): Boolean!
    createProject(name: String!, description: String!): Boolean!
    
    updateProject(id: ID!, lastUpdate: String!): Boolean!
    deleteProject(id: ID!): Boolean
    createTask(title: String!): Boolean!
    updateTask(id: ID!, state: String!): Boolean!
    deleteTask(id: ID!): Boolean!
  }

  type Project {
    id: ID!
    name: String!
    description: String!
    lastUpdate: String!
    createdAt: String!
  }

  type Task {
    id: ID!
    title: String!
    state: String!
    project: Int!
  }

  type User {
    id: ID!
    email: String!
    password: String!
    role: String!
  }

  type Comment {
    id: ID!
    author: Int!
    text: String!
    project: Int!
  }
`);