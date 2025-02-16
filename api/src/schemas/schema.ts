import { buildSchema } from 'graphql';
import {ProjectMutation, ProjectQueries} from "../resolvers/projectResolver";

export const schema = buildSchema(`#graphql
  type Query {
    projects: [Project!]!
    tasks: [Task!]!
    users: [User!]!
    comments: [Comment!]!
    project(id: ID!): Project!
    task(id: ID!): [Task!]!
    comment(id: ID!): [Comment!]
    user(id: ID!): String!
  }

  type Mutation {
    login(email: String!, password: String!): String!
    register(email: String!, password: String!): String!
    
    createProject(name: String!, description: String!): Boolean!
    createTask(title: String!, project: Int!): Boolean!
    createComment(author: Int!, text: String!, project: Int!): Boolean!
    updateProjectDate(id: ID!): Boolean!
    updateTaskState(id: ID!, state: String!): Boolean!
    deleteTask(id: ID!): Boolean!
    deleteComment(id: ID!): Boolean!
    deleteProject(id: ID!): Boolean!
  }
  
  type Subscription {
    createProject(name: String!, description: String!): Project!
    createTask(title: String!, project: Int!): Task!
    createComment(author: Int!, text: String!, project: Int!): Comment!
    updateProjectDate(id: ID!): Project!
    updateTaskState(id: ID!, state: String!): Task!
    deleteTask(id: ID!): Task!
    deleteComment(id: ID!): Comment!
    deleteProject(id: ID!): Project!
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

export const queries = {
    ...ProjectQueries,
}

export const mutations = {
    ...ProjectMutation,
}

export const subscriptions = {

}