import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './schemas/schema';
import {getProject, ProjectMutation, ProjectQueries} from './resolvers/projectResolver';
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
import {getTokenData} from "./utils";


declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: unknown;
    }
  }
}

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
/*
  ACTIVATE CORS SECURITY
 */
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

/*
  MIDDLEWARE POUR VERIFIER IDENTIFICATION D'UN USER ET LA VALIDE DU TOKEN
 */
app.use(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  console.log("test autorisation : ");
  console.log(authHeader);

  if (authHeader) {
    const token = authHeader.split(" ")[1];
    try {
      req.user = getTokenData(token);
      console.log(req.user);
    } catch (err) {
      console.error("Invalid token:", err);
    }
  }

  next();
});

app.use('/api', graphqlHTTP({
  schema,
  rootValue,
  graphiql: true,
}));

/*
  GESTION DES ERREURS APRES GRAPHQL
 */
app.use(async (req, res, next) => {
  try {
    next();
  } catch (err) {
    console.error("Erreur de connexion à la base de données :", err);
    res.status(500).send("Erreur de connexion à la base de données");
  }
});

const PORT = 5050;

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}/graphql`);
  /* VERIF IF PROJECT ALREADY EXIST (FOR FIX THE DUPLICATION WHEN HOT RELOAD) */
  const project = await getProject(1);
  if (project) {
    return;
  }
  /* CREATING DEFAULT USER */
  createUser("test@gmail.com", "1234").then(r => {
    if (r) {
      console.log("Default user create, email: test@gmail.com, password: 1234");
    } else {
      console.log("Can't create default user.")
    }
  });
  /* CREATING PROJECT EXAMPLE */
  createProject('Task Management', 'Create App for manage tasks').then(r => {
    if (r) {
      console.log("Example project create.");
    } else {
      console.log("Can't create example project.")
    }
  })
  /* CREATING TASK EXAMPLE */
  createTask('Verif the readme', 1).then(r => {
    if (r) {
      console.log("Example task create.");
    } else {
      console.log("Can't create example task.")
    }
  });
  /* CREATING COMMENT EXAMPLE */
  createComment(1, 'Hello :)', 1).then(r => {
    if (r) {
      console.log("Example comment create.");
    } else {
      console.log("Can't create example comment.")
    }
  })
});

/*
  CLEAN CLOSE CLIENT WHEN STOP THE PROGRAM
 */
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