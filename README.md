# Task Management

![Hello](./assets/rem.gif)



## L'application :

### Docker

#### Services

L'application est entièrement dockerisée, on trouve 3 services dans le docker-compose.yml :
- task-management-app (Frontend de l'application React)
- task-management-api (Backend de l'application GraphQL)
- task-management-database (Base de donnée PostgresSQL)

#### Volumes

Et un volume :
- task-management-data

Ce volume contient la base de données, il est utilisé pour persister les données quand le docker est supprimé et recréer.

### Lancer l'application

`docker compose up --build -d`

### CI

L'application à une CI lors des push et merge request sur main.
.github/workflows/ci.yml.
Un lint est lancé sur le frontend et sur le backend.



## frontend : 

![Frontend](./assets/frontend.gif)

### URL :

Pour accéder au frontend :

`http://localhost:5173`

### Identifiants :

Compte `USER` :
user@gmail.com
user

Compte `ADMIN` :
admin@gmail.com
admin


Le rôle et l'email sont affichés en haut à droite de la page, à coté du bouton déconnexion.

### Technologies utilisées

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

### Technologies utilisées

- **TypeScript** : est un langage de programmation qui a pour but d'améliorer et de sécuriser la production de code JavaScript. Il s'agit d'un sur-ensemble syntaxique strict de JavaScript.
- **NodeJs** : est un environnement d’exécution single-thread, open-source et multi-plateforme permettant de créer des applications rapides et évolutives côté serveur.
- **Express** : est un framework minimal pour Node.js qui facilite la création et la gestion d'un serveur HTTP.
- **Expres-GraphQL** : est une bibliothèque qui s'intègre à Express pour configurer un serveur GraphQL.
- **GraphQL** : est un langage de requêtes pour les APIs qui donne aux clients la possibilité de spécifier exactement les données dont ils ont besoin. Contrairement aux APIs REST traditionnelles, GraphQL utilise un schéma unique où toutes les données disponibles peuvent être interrogées ou modifiées via des requêtes (queries) ou mutations.
- **Cors** : "(Cross-Origin Resource Sharing) est un mécanisme de sécurité qui contrôle comment des ressources front-end exécutées dans un navigateur peuvent interagir avec des ressources sur un autre domaine.
- **Pg** : (ou node-postgres) est une bibliothèque permettant une interaction avec une base de données PostgreSQL depuis Node.js. Elle offre des méthodes pour exécuter des requêtes SQL, gérer des connexions, ...
- **jwt** : (JSON Web Token) est une bibliothèque qui permet de générer, signer et vérifier des jetons (tokens) pour l'authentification. Elle est couramment utilisée pour la gestion des sessions, afin de sécuriser les échanges entre le client et le serveur.
- **bcrypt** : est une bibliothèque qui permet de hacher et de verifier des mots de passe de manière sécurisée. Elle est conçue pour être lente et protéger efficacement les données contre les attaques de type force brute.


## GraphQL

### Les enums (en TypeScript) :

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

### Les entités (en TypeScript) :

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

### Les queries

```
 projects: [Project!]! @auth(requires: USER)
 tasks: [Task!]! @auth(requires: USER)
 users: [User!]! @auth(requires: ADMIN)
 comments: [Comment!]! @auth(requires: USER)
 project(id: ID!): Project! @auth(requires: USER)
```

### Les mutations 

```
 login(email: String!, password: String!): String!
 register(email: String!, password: String!): String!
 createProject(name: String!, description: String!): Project! @auth(requires: USER)
 createTask(title: String!, project: Int!): Task! @auth(requires: USER)
 createComment(text: String!, project: Int!): Comment! @auth(requires: USER)
 updateProjectDate(id: ID!): Project! 
 updateTaskState(id: ID!, state: String!): Task! @auth(requires: USER)
 deleteProject(id: ID!): ID! @auth(requires: USER)
```

### Les subscriptions

```
 projectAdded: Project! @auth(requires: USER)
 projectUpdated: Project! @auth(requires: USER)
 projectDeleted: ID! @auth(requires: USER)
 
 taskAdded(project: ID!): Task! @auth(requires: USER)
 taskUpdated(project: ID!): Task! @auth(requires: USER)
 taskDeleted(project: ID!): ID! @auth(requires: USER)
 
 commentAdded(project: ID!): Comment! @auth(requires: USER)
 commentUpdated(project: ID!): Comment! @auth(requires: USER)
 commentDeleted(project: ID!): ID! @auth(requires: USER)
```



## database : 

![Database](./assets/database.gif)

### URL :
`http://localhost:5432`

### Technologies utilisées

- **PostgresSQL** : c'est un système de gestion de base de données relationnelle et d'objets.

### Fonctionnement

La base de donnée est créer grâce au docker-compose, et les tables sont créent grâce au `init-database.sql` dans `docker/database`.


## Javascript VS Python

![Versus](./assets/fight.gif)

JavaScript est bien meilleur dans le web que cette fraude de Python.

Il a un écosystème bien meilleur avec nodejs comparé à cette immonde pip.

Il permet d'avoir un frontend en React et un backend en Js donc le même language au frontend et backend, ce qui permet une meilleur maintenabilité.

Python est connu pour sa lenteur ce qui est un défaut, une api est censée pouvoir supporté beaucoup de requêtes en même temps.

L'asynchrone sur Javascript est bien mieux géré que sur python.

Node.js peut utiliser TypeScript, ce qui permet un typage statique et qui aide à éviter les erreurs.