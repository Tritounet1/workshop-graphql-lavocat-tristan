import { buildSchema } from 'graphql';

export const schema = buildSchema(`#graphql
  type Query {
    projects: [Project!]!
    tasks: [Task!]!
    users: [User!]!
    comments: [Comment!]!
  }

  type Mutation {
    login(email: String!, password: String!): Boolean!
  }

  type Project {
    id: ID!
    name: String!
    description: String!
    lastUpdate: Int!
  }

  type Task {
    id: ID!
    name: String!
    taskState: String!
  }

  type User {
    id: ID!
    email: String!
    password: String!
  }

  type Comment {
    id: ID!
    user: User!
    text: String!
  }
`);