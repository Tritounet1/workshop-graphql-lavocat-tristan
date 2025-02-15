# Task Management

![Hello](./assets/rem.gif)



## Lancer application :

L'application est entièrement dockerisé, on trouve 3 services dans le docker-compose.yml :
- task-management-app (Frontend de l'application React)
- task-management-api (Backend de l'application GraphQL)
- task-management-database (Base de donnée PostgresSQL)

`docker compose up --build -d`



## frontend : 

![Frontend](./assets/frontend.gif)

### URL :
`http://localhost:5173`

## Technologies utilisées

- **React** : bibliothèque JavaScript pour construire des interfaces utilisateur.
- **Vite** : outil de build rapide pour les projets front-end.
- **Tailwind CSS** : framework CSS utilitaire.
- **React Router** : bibliothèque pour la gestion des routes dans une application React.
- **Lucide React** : icônes pour React.
- **ESLint** : outil d'analyse de code pour identifier et corriger les problèmes dans le code JavaScript.
- **Apollo Client** : bibliothèque pour gérer les requêtes GraphQL dans une application front-end.



## backend : 

![Backend](./assets/backend.gif)

### URL :
`http://localhost:5050`

## Technologies utilisées

- **TypeScript** : c'est un langage de programmation qui a pour but d'améliorer et de sécuriser la production de code JavaScript. Il s'agit d'un sur-ensemble syntaxique strict de JavaScript.
- **NodeJs** : c'est un environnement d’exécution single-thread, open-source et multi-plateforme permettant de créer des applications rapides et évolutives côté serveur.
- **Express** : Express est un framework minimal pour Node.js qui facilite la création et la gestion d'un serveur HTTP.
- **Expres-GraphQL** : express-graphql est une bibliothèque qui s'intègre à Express pour configurer un serveur GraphQL.
- **GraphQL** : GraphQL est un langage de requêtes pour les APIs qui donne aux clients la possibilité de spécifier exactement les données dont ils ont besoin. Contrairement aux APIs REST traditionnelles, GraphQL utilise un schéma unique où toutes les données disponibles peuvent être interrogées ou modifiées via des requêtes (queries) ou mutations.
- **Cors** : "CORS" (Cross-Origin Resource Sharing) est un mécanisme de sécurité qui contrôle comment des ressources front-end exécutées dans un navigateur peuvent interagir avec des ressources sur un autre domaine.
- **Pg** : Pg (ou node-postgres) est une bibliothèque permettant une interaction avec une base de données PostgreSQL depuis Node.js. Elle offre des méthodes pour exécuter des requêtes SQL, gérer des connexions, ...


## GraphQL

### Les queries

```
projects: [Project!]!
tasks: [Task!]!
users: [User!]!
comments: [Comment!]!
project(id: ID!): Project!
task(id: ID!): Task!
```

### Les mutations 

```
login(email: String!password: String!): Boolean!
register(email: String!password: String!): Boolean!
createProject(name: String!description: String!): Boolean!
updateProject(id: ID!lastUpdate: String!): Boolean!
deleteProject(id: ID!): Boolean
createTask(title: String!): Boolean!
updateTask(id: ID!state: String!): Boolean!
deleteTask(id: ID!): Boolean!
```



## database : 

![Database](./assets/database.gif)

### URL :
`http://localhost:5432`

## Technologies utilisées

- **PostgresSQL** : c'est un système de gestion de base de données relationnelle et d'objets.



## Graphql dans le backend

Les différents types d'enums :

```ts
export enum UserRole {
    'USER',
    'ADMIN',
}

export enum TaskState {
    'IN_PROGRESS',
    'TO_DO',
    'DONE',
}
```

Les différents types d'entités :

```ts
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
```



## Javascript VS Python

![Versus](./assets/fight.gif)


