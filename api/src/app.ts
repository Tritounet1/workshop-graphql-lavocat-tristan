import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './schemas/schema';
import { projectResolver } from './resolvers/projectResolver';
import { taskResolver } from './resolvers/taskResolver';
import { loginMutation, userResolver } from './resolvers/userResolver';
import { commentResolver } from './resolvers/commentResolver';
import cors from "cors";
import { Client } from "pg";

const DB_CONFIG = {
  host: "task-management-database",
  database: "app",
  port: 5432,
  user: "example",
  password: "example",
};

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
  ...loginMutation,
  ...taskResolver,
  ...projectResolver,
  ...userResolver,
  ...commentResolver,
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


/*
app.get("/", (req, res) => {
  res.send("Hello, Express!");
});

app.get("/api", (req, res) => {
  res.send("GraphQL endpoint.");
});

app.listen(port, () => {
  console.log(`Serveur Express en écoute sur http://localhost:${port}`);
});
*/

/*
app.use(async (req, res, next) => {
  try {
    next();
  } catch (err) {
    console.error('Erreur de connexion à la base de données :', err);
    res.status(500).send('Erreur de connexion à la base de données');
  }
});

// Endpoint racine
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

app.get('/api/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  sseClients.push(res);

  res.write('event: ping\n\n');

  req.on('close', () => {
    sseClients = sseClients.filter(client => client !== res);
  });
});

const sendSSE = (data: any) => {
  sseClients.forEach(client => {
    client.write(`data: ${JSON.stringify(data)}\n\n`);
  });
};

// Route pour récupérer les données
app.get('/api/datas', async (req, res) => {
  try {
    const result = await client.query('SELECT * FROM datas');
    const formattedResult = result.rows.map((row: { id: number; title: string; text: string; }) => ({
      id: row.id,
      title: row.title,
      text: row.text,
    }));
    res.json(formattedResult);
  } catch (err) {
    console.error('Erreur lors de la requête :', err);
    res.status(500).send('Erreur lors de la récupération des données');
  }
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
app.post('/api/datas', async (req, res) => {
  const { title, text } = req.body;

  if (!title || !text) {
    return res.status(400).json({ error: 'Missing required fields: title, text' });
  }

  try {
    const result = await client.query(
        'INSERT INTO datas (title, text) VALUES ($1, $2) RETURNING id',
        [title, text]
    );
    const newId = result.rows[0].id;

    sendSSE({ type: 'reload', message: 'New data added, need to reload all data.' });

    res.status(201).json({ message: 'Data added successfully', id: newId });
  } catch (err) {
    console.error('Erreur lors de l\'insertion des données :', err);
    res.status(500).send('Erreur lors de l\'insertion des données');
  }
});

// Route pour supprimer des données
app.delete('/api/datas/:id', async (req, res) => {
  const { id } = req.params;

  try {
    await client.query('DELETE FROM datas WHERE id = $1', [id]);

    sendSSE({ type: 'reload', message: 'Data deleted, need to reload all data.' });

    res.json({ message: 'Data deleted successfully' });
  } catch (err) {
    console.error('Erreur lors de la suppression des données :', err);
    res.status(500).send('Erreur lors de la suppression des données');
  }
});

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
app.get('/api/connect/:login/:password', async (req, res) => {
  const { login, password } = req.params;

  try {
    const result = await client.query('SELECT password FROM users WHERE login = $1', [login]);

    if (result.rows.length === 0) {
      return res.status(400).json({ message: 'Connection failed' });
    }

    const storedPassword = result.rows[0].password;

    if (storedPassword === password) {
      res.json({ message: 'Connection success' });
    } else {
      res.status(400).json({ message: 'Connection failed' });
    }
  } catch (err) {
    console.error('Erreur lors de la connexion de l\'utilisateur :', err);
    res.status(500).send('Erreur lors de la connexion de l\'utilisateur');
  }
});




 */