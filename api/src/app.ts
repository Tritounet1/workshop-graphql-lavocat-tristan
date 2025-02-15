import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './schemas/schema';
import { ProjectMutation, ProjectQueries} from './resolvers/projectResolver';
import {createTaskMutation, taskResolver} from './resolvers/taskResolver';
import { userMutation, userResolver } from './resolvers/userResolver';
import {CommentMutation, commentResolver} from './resolvers/commentResolver';
import cors from "cors";
import { Client } from "pg";
import {DB_CONFIG} from "./DB_CONFIG";
import {createUser} from "./resolvers/userResolver";
import {createTask} from "./resolvers/taskResolver";
import {createProject} from "./resolvers/projectResolver";
import {createComment} from "./resolvers/commentResolver";

export const client = new Client(DB_CONFIG);

client
  .connect()
  .then(() => {
    console.log("Connexion à la base de données réussie");
  })
  .catch((err) => {
    console.error("Erreur de connexion à la base de données :", err);
  });

const app = express();
app.use(cors());

const rootValue = {
  ...ProjectMutation,
  ...CommentMutation,
  ...userResolver,
  ...userMutation,
  ...taskResolver,
  ...ProjectQueries,
  ...commentResolver,
  ...createTaskMutation,
};

app.use('/api', graphqlHTTP({
  schema,
  rootValue,
  graphiql: true,
}));

app.use(async (req, res, next) => {
  try {
    next();
  } catch (err) {
    console.error("Erreur de connexion à la base de données :", err);
    res.status(500).send("Erreur de connexion à la base de données");
  }
});

const PORT = 5050;

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
  /* CREATING DEFAULT USER */
  createUser("test@gmail.com", "1234").then(r => {
    if(r) {
      console.log("Default user create, email: test@gmail.com, password: 1234");
    }
    else {
      console.log("Can't create default user.")
    }
  });
  /* CREATING PROJECT EXAMPLE */
  createProject('Task Management', 'Create App for manage tasks').then(r => {
    if(r) {
      console.log("Example project create.");
    }
    else {
      console.log("Can't create example project.")
    }
  })
  /* CREATING TASK EXAMPLE */
  createTask('Verif the readme', 1).then(r => {
    if(r) {
      console.log("Example task create.");
    }
    else {
      console.log("Can't create example task.")
    }
  });
  /* CREATING COMMENT EXAMPLE */
  createComment(1, 'Hello :)', 1).then(r => {
    if(r) {
      console.log("Example comment create.");
    }
    else {
      console.log("Can't create example comment.")
    }
  })
});

process.on('SIGINT', async () => {
  try {
    await client.end();
    console.log('Connexion à la base de données fermée');
    process.exit(0);
  } catch (err) {
    console.error('Erreur lors de la fermeture de la base de données :', err);
    process.exit(1);
  }
});