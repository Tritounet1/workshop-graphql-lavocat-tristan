import { Client } from "pg";

export const DB_CONFIG = {
    host: "task-management-database",
    database: "app",
    port: 5432,
    user: "example",
    password: "example",
};

export const client = new Client(DB_CONFIG);

const connectToDatabase = async (retries = 5, delay = 5000) => {
    while (retries > 0) {
        try {
            await client.connect();
            console.log("Connexion à la base de données réussie");
            break;
        } catch (err) {
            console.error("Erreur de connexion à la base de données :", err);
            retries -= 1;
            console.log(`Nouvelle tentative dans ${delay / 1000} secondes...`);
            if (retries === 0) {
                console.error("Impossible de se connecter à la base de données après plusieurs tentatives");
            }
            await new Promise((res) => setTimeout(res, delay));
        }
    }
};

connectToDatabase();

// Gestion du signal SIGINT pour fermer proprement la connexion
process.on("SIGINT", async () => {
    try {
        await client.end();
        console.log("Connexion à la base de données fermée");
        process.exit(0);
    } catch (err) {
        console.error("Erreur lors de la fermeture de la base de données :", err);
        process.exit(1);
    }
});
