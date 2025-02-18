# Task Management

![Hello](./assets/rem.gif)



## L'application

### C'est quoi ?

C'est un projet workshop Graphql/Apollo, un mini-projet de A à Z, suffisamment concret pour repartir en ayant explorer les potentialités de Graphql.
Un projet fait dans le cadre de la troisième année de But Informatique.

### Les pages de l'application

#### Layout :

Le layout est la top bar qui permet de ce déconnecter (retour sur page /login et suppression token du navigateur), elle est visible quand on est connécté, on peut aussi voir son
email et role, on peut retouner sur la page d'accueil en cliquant sur ProjectHub ou Projets.

#### Page connexion `/login` :

Une simple page de connexion interagissant avec le backend pour la connexion, d'un user, elle utilise la mutation login(email, password) pour s'identifier.
Si la connexion est réussi alors le backend renvoie le token de l'utilisateur (token qui contient son email, role et id)
Et l'utilisateur est rediriger vers la page d'accueil des projets.

#### Page enregistrement `/register` :

Une page d'authentification à l'application, elle utilise la mutation register(email, password), qui est permet à un utilisateur de s'enregister dans la base de données.
Si l'authentification est réussi alors le backend renvoie le token de l'utilisateur créer.
Et l'utilisateur est rediriger vers la page d'accueil des projets.

#### Page d'accuel avec les projets `/` :

La page centrale du projet, sur cette page on peut accéder aux différents projets.
On peut en créer d'autre avec le bouton Nouveau Projet qui ouvre un modal.
On peut les filtrés en séléctionnant un Offset et une limite de projet qui s'affiche
Mais aussi on peut rechercher des mots clés dans le nom et description du projet.

Il y a plusieurs connexions avec le backend :

##### Query :
- `projects` : pour récupérer tout les projets.
- `projectsFilter` : pour séléctionner des projets avec un offset et une limite.
- `searchProjects` : pour rechercher un projet avec un keyword spécéfique.

##### Mutation :
- `createProject` : pour créer un projet.

##### Subscriptions :
- `projectAdded` : Lorsqu'un projet est ajouté il se rajoute dans la liste des projets actuelle.
- `projectUpdated` : Lorsqu'un projet est mis à jour il se met à jour dans la liste des projets actuelle.
- `projectDeleted` : Lorsqu'un projet est supprimé il s'enlève de la liste des projets actuelle.


#### Page des détails des projets `/projects` :

Il y a plusieurs connexions avec le backend :

##### Query :
- `projects` : pour récupérer tout les projets.
- `projectsFilter` : pour séléctionner des projets avec un offset et une limite.
- `searchProjects` : pour rechercher un projet avec un keyword spécéfique.

##### Mutation :
- `deleteProject` : pour supprimer un projet.
- `updateProject` : pour mettre à jour le projet.
- `createComment` : pour créer un nouveau commentaire.
- `deleteComment` : pour supprimer un commentaire.
- `createTask` : pour créer une nouvelle tâche.
- `updateTaskState` : pour mettre à jour l'état (en cours, terminé, à faire) d'une tâche.
- `deleteTask` : pour supprimer une tâche.

##### Subscriptions :
- `projectUpdated` : Lorsque le projet séléctionné est mis à jour, ces informations le sont aussi.
- `projectDeleted` : Lorsque le projet séléctionné est supprimé l'utilisateur est redirigé vers la page d'accueil.
- `taskAdded` : Lorsqu'une nouvelle tâche est ajouté la liste des tâches est mis à jour.
- `taskUpdated` : Lorsqu'une tâche mis à jour, cette tâche est mis à jour dans la liste.
- `taskDeleted` : Lorsqu'une tâche est supprimé, cette tâche est supprimé de la liste.
- `commentAdded` : Lorsqu'un commentaire  est ajouté la liste des tâches est mis à jour.
- `commentUpdated` : Lorsqu'un commentaire est mis à jour, ce commentaire est mis à jour dans la liste.
- `commentDeleted` : Lorsqu'un commentaire est supprimé, ce commentaire est supprimé de la liste.



### Docker

#### Services

L'application est entièrement dockerisée, on trouve 3 services dans le docker-compose.yml :
- task-management-app (Frontend de l'application React)
- task-management-api (Backend de l'application GraphQL)
- task-management-database (Base de donnée PostgresSQL)

#### Volumes

Un volume :
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

<img src="./assets/backend.gif" alt="Backend" width="300"/>

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

### Les types et enums :

```graphql
directive @auth(requires: UserRole! = ADMIN) on FIELD_DEFINITION

enum UserRole {
USER
ADMIN
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
```

### Les queries

```
projects: [Project!]! @auth(requires: USER)
projectsFilter(offset: Int!, limit: Int!): [Project!]! @auth(requires: USER)
searchProjects(keyword: String!): [Project!]! @auth(requires: USER)
tasks: [Task!]! @auth(requires: USER)
users: [User!]! @auth(requires: ADMIN)
comments: [Comment!]! @auth(requires: USER)
project(id: ID!): Project! @auth(requires: USER)
tasksByStatus(project: Int!, status: String!): [Task!]!
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
updateProject(id: ID!, name: String!, description: String!): Project! @auth(requires: USER)
deleteTask(id: ID!): ID! @auth(requires: USER)
deleteComment(id: ID!): ID! @auth(requires: USER)
```

### Les subscriptions

```
projectAdded: Project! @auth(requires: USER)
projectUpdated: Project! @auth(requires: USER)
projectDeleted: ID! @auth(requires: USER)
taskAdded(project: ID!): Task! @auth(requires: USER)
taskUpdated(project: ID!): Task! @auth(requires: USER)
taskDeleted(project: ID!): ID! @auth(requires: ADMIN)
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

La base de donnée est créer grâce au docker-compose.yml, et les tables sont créent automatiquement à son démarrage grâce au `init-database.sql` dans `docker/database`.



## Javascript VS Python

![Versus](./assets/fight.gif)

JavaScript est bien meilleur dans le web que cette fraude de Python.

Il a un écosystème bien meilleur avec nodejs comparé à zoh immonde pip.

Il permet d'avoir un frontend en React et un backend en Js donc le même language au frontend et backend, ce qui permet une meilleur maintenabilité.

Python est connu pour sa lenteur ce qui est un défaut, une api est censée pouvoir supporté beaucoup de requêtes en même temps.

L'asynchrone sur Javascript est bien mieux géré que sur python.

Node.js peut utiliser TypeScript, ce qui permet un typage statique et qui aide à éviter les erreurs.



## Conclusion

Le projet workshop Graphql/Apollo est un très bon projet pour l'apprentissage des bases de GraphQL.

C'est un projet assez conséquent et il mériterait d'y consacrer plus de temps que 2 jours.

## Merci

<img src="./assets/thanks.gif" alt="drawing" width="300"/>


