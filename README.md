# Task Management

![Hello](./assets/rem.gif)



## L'application :

L'application est entièrement dockerisé, on trouve 3 services dans le docker-compose.yml :
- task-management-app (Frontend de l'application React)
- task-management-api (Backend de l'application GraphQL)
- task-management-database (Base de donnée PostgresSQL)

Pour lancer l'application

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
projects: [Project!]!
tasks: [Task!]!
users: [User!]!
comments: [Comment!]!
project(id: ID!): Project!
task(id: ID!): Task!
```

### Les mutations 

```
login(email: String!, password: String!): Boolean!
register(email: String!, password: String!): Boolean!
createProject(name: String!, description: String!): Boolean!
createTask(title: String!, project: Int!): Boolean!
createComment(author: Int!, text: String!, project: Int!): Boolean!
updateProjectDate(id: ID!): Boolean!
deleteProject(id: ID!): Boolean
updateTaskState(id: ID!, state: String!): Boolean!
deleteTask(id: ID!): Boolean!
```



## database : 

![Database](./assets/database.gif)

### URL :
`http://localhost:5432`

## Technologies utilisées

- **PostgresSQL** : c'est un système de gestion de base de données relationnelle et d'objets.

## Fonctionnement

La base de donnée est créer grâce au docker-compose, et les tables sont créent grâce au `init-database.sql` dans `docker/database`.


## Javascript VS Python

![Versus](./assets/fight.gif)

### 1. Écosystème JavaScript et Popularité
JavaScript est le langage principal du web, et donc Node.js bénéficie de l'énorme écosystème JavaScript. 
Travailler déjà en JavaScript pour le frontend (avec React), Node.js permet de garder une cohérence avec le code backend et frontend.
De nombreux outils et bibliothèques GraphQL comme Apollo Server et GraphQL.js sont optimisés pour Node.js.

### 2. Performances
   Node.js est extrêmement rapide et efficace pour les opérations I/O non-bloquantes. Cela fait de Node.js un excellent choix pour des API avec un nombre de requêtes simultanées.
   En comparaison, Python n’est pas aussi performant pour les opérations I/O non-bloquantes et peut être plus lent dans les scénarios de haute concurrence.

### 3. Asynchrone par défaut
   Node.js utilise un modèle asynchrone et non-bloquant pour gérer les I/O. Cela le rend particulièrement adapté pour les API GraphQL, où les requêtes peuvent inclure plusieurs appels à différentes sources de données.
   Python, bien qu'il supporte également l'asynchrone avec asyncio, a tendance à être plus utilisé de manière synchrone par défaut. Les frameworks comme Django et Flask ne sont pas optimisés pour les applications asynchrones de manière native et pour les applications en production.

### 4. Écosystème et Frameworks
   Node.js dispose de plusieurs frameworks populaires et spécialisés dans les API GraphQL, comme :
   Apollo Server : Un des serveurs GraphQL les plus populaires et puissants dans l'écosystème Node.js.
   Express-GraphQL : Intégration facile avec Express pour un serveur GraphQL léger.
   En Python, il existe aussi des solutions mais l'écosystème et la communauté autour de GraphQL ne sont pas aussi larges que sur Node.js.

### 5. Gestion des Packages (NPM vs Pip)
   Node.js utilise npm (Node Package Manager), qui est l'un des gestionnaires de paquets les plus utilisés et propose une vaste collection de bibliothèques. Les bibliothèques modernes et les mises à jour sont généralement mieux supportées dans l’écosystème JavaScript.
   Python utilise pip, mais Python a aussi un vaste écosystème, certains outils pour Node.js sont souvent plus rapides et plus faciles à intégrer pour GraphQL.

### 6. Scalabilité
   Node.js est conçu pour gérer des milliers de connexions simultanées sans ajouter de surcharge supplémentaire en utilisant un seul thread pour gérer tous les événements asynchrones. Cela le rend particulièrement adapté pour les applications qui nécessitent une scalabilité horizontale.
   Python utilise un modèle de threading ou de processus qui peut entraîner plus de complexité et de surcharge en termes de gestion des ressources pour des applications avec un grand nombre de requêtes simultanées.

### 7. TypeScript et Typage Statique
   Node.js peut utiliser TypeScript, un sur-ensemble de JavaScript avec typage statique, ce qui aide à éviter les erreurs en temps de développement et améliore la maintenabilité du code. TypeScript est largement adopté dans l’écosystème Node.js, notamment pour des API.
   Python n'a pas de système de typage statique aussi strict, même si le typage est désormais supporté, mais cela reste moins populaire et répandu que TypeScript dans l'écosystème Node.js.

### 8. Adoption dans l'Industrie
   Node.js est largement adopté pour le développement de backends modernes grâce à sa rapidité, son évolutivité, et sa compatibilité avec des stacks full JavaScript. Il est utilisé par des entreprises comme Netflix, Uber, LinkedIn.
   Python, bien qu'extrêmement populaire pour des tâches de data science, machine learning et automatisation, est moins utilisé pour des applications web à haute performance en temps réel comme celles que GraphQL peut nécessiter.

### 9. Apprentissage


### Conclusion
   Après tout ces points le meilleur choix est bien plus intérrésant d'utiliser l'environnement NodeJs que le language Python car JavaScript est le language du web par excellence et est bien plus utilser en entreprise en backend que python.