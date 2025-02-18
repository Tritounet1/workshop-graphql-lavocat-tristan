import { buildSchema } from 'graphql';

export const typeDefs = buildSchema(`#graphql
  scalar DateTime
  directive @auth(requires: UserRole! = ADMIN) on FIELD_DEFINITION

  enum UserRole {
    USER
    ADMIN
  }

  type Query {
    projects: [Project!]! @auth(requires: USER)
    projectsFilter(offset: Int!, limit: Int!): [Project!]! @auth(requires: USER)
    searchProjects(keyword: String!): [Project!]! @auth(requires: USER)
    tasks: [Task!]! @auth(requires: USER)
    users: [User!]! @auth(requires: ADMIN)
    comments: [Comment!]! @auth(requires: USER)
    project(id: ID!): Project! @auth(requires: USER)
    tasksByStatus(project: Int!, status: String!): [Task!]!
  }

  type Mutation {
    login(email: String!, password: String!): String!
    register(email: String!, password: String!): String!
    createProject(name: String!, description: String!): Project! @auth(requires: USER)
    createTask(title: String!, project: Int!): Task! @auth(requires: USER)
    createComment(text: String!, project: Int!): Comment! @auth(requires: USER)
    updateProjectDate(id: ID!): Project! 
    updateTaskState(id: ID!, state: String!): Task! @auth(requires: USER)
    deleteProject(id: ID!): ID! @auth(requires: USER)
  }
  
  type Subscription {
    projectAdded: Project! @auth(requires: USER)
    projectUpdated: Project! @auth(requires: USER)
    projectDeleted: ID! @auth(requires: USER)
    
    taskAdded(project: ID!): Task! @auth(requires: USER)
    taskUpdated(project: ID!): Task! @auth(requires: USER)
    taskDeleted(project: ID!): ID! @auth(requires: USER)
    
    commentAdded(project: ID!): Comment! @auth(requires: USER)
    commentUpdated(project: ID!): Comment! @auth(requires: USER)
    commentDeleted(project: ID!): ID! @auth(requires: USER)
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
  
  enum TaskState {
    TO_DO
    IN_PROGRESS
    DONE
  }

  type Task {
    id: ID!
    title: String!
    state: TaskState!
  }

  type User {
    id: ID!
    email: String!
    password: String!
    role: UserRole!
  }

  type Comment {
    id: ID!
    author: User!
    text: String!
  }
`);