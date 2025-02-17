import { buildSchema } from 'graphql';

export const typeDefs = buildSchema(`#graphql
  type Query {
    projects: [Project!]!
    tasks: [Task!]!
    users: [User!]!
    comments: [Comment!]!
    project(id: ID!): Project!
  }

  type Mutation {
    login(email: String!, password: String!): String!
    register(email: String!, password: String!): String!
    
    createProject(name: String!, description: String!): Project!
    createTask(title: String!, project: Int!): Task!
    createComment(author: Int!, text: String!, project: Int!): Comment!
    
    updateProjectDate(id: ID!): Project!
    updateTaskState(id: ID!, state: String!): Task!
    deleteTask(id: ID!): Task!
    deleteComment(id: ID!): Comment!
    deleteProject(id: ID!): Project!
  }
  
  type Subscription {
    newProject: Project!
    newTask: Task!
    newComment: Comment!
    newProjectDate: Project!
    newTaskState: Task!
    removeTask: Task!
    removeComment: Comment!
    removeProject: Project!
  }

  type Project {
    id: ID!
    name: String!
    description: String!
    lastUpdate: String!
    createdAt: String!
    comments: [Comment!]!
    tasks: [Task!]!
    owner: User!
  }

  type Task {
    id: ID!
    title: String!
    state: String!
  }

  type User {
    id: ID!
    email: String!
    password: String!
    role: String!
  }

  type Comment {
    id: ID!
    author: User!
    text: String!
  }
  
  directive @hasRole(role: String!) on FIELD_DEFINITION
`);