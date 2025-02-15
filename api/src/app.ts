import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './schemas/schema';
import { ProjectMutation, ProjectQueries} from './resolvers/projectResolver';
import {createTaskMutation, taskResolver} from './resolvers/taskResolver';
import { loginMutation, userMutation, userResolver } from './resolvers/userResolver';
import {CommentMutation, commentResolver} from './resolvers/commentResolver';
import cors from "cors";
import { Client } from "pg";
import {DB_CONFIG} from "./DB_CONFIG";

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
  ...loginMutation,
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