import { Client, Databases } from 'node-appwrite';
const client = new Client();

dotenv.config();

const endpoint = process.env.APPWRITE_ENDPOINT;
const projectId = process.env.APPWRITE_PROJECT_ID;
const apiKey = process.env.APPWRITE_API_KEY;

if (!endpoint || !projectId || !apiKey) {
  console.error("❌ Variabel Appwrite Environment belum terisi di Vercel/Local!");
}

client
  .setEndpoint(endpoint || 'https://cloud.appwrite.io/v1') // fallback default cloud endpoint
  .setProject(projectId || '')
  .setKey(apiKey || '');

const databases = new Databases(client);

export { databases };