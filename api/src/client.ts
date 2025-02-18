import { Client } from "pg";

export const DB_CONFIG = {
    host: "task-management-database",
    database: "app",
    port: 5432,
    user: "example",
    password: "example",
};


export let client: Client;

/*
    TODO RECONNECT AUTO TO DB WHEN THE DB IS NOT STARTED
 */
const connectToDatabase = async () => {
    try {
        client = new Client(DB_CONFIG);
        await client.connect();
        console.log("✅ Connexion à la base de données réussie");
    } catch (err: any) {
        console.error("❌ Erreur de connexion à la base de données :", err.message);
        console.log("🔄 Nouvelle tentative dans 5 secondes...");
        setTimeout(connectToDatabase, 5000);
    }
};

process.on("SIGINT", async () => {
    try {
        await client.end();
        console.log("❌ Connexion à la base de données fermée");
        process.exit(0);
    } catch (err) {
        console.error("❌ Erreur lors de la fermeture de la base de données :", err);
        process.exit(1);
    }
});

connectToDatabase();
