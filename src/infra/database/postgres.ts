import { Client } from 'pg'; 

let clientInstance: Client;

export function getPostgresClient(): Client {
  if (!clientInstance) {
    clientInstance = new Client({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
      database: process.env.DB_NAME,
    });
  }
  return clientInstance;
}