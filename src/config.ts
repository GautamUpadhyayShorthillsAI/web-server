import dotenv from "dotenv";
import type { MigrationConfig } from "drizzle-orm/migrator";
dotenv.config();

type APIConfig = {
    fileserverHits: number;
    platform:string;
    JWT:string
}
type DBConfigType = {
    url:string,
    migrationConfig:MigrationConfig
}


const DB_URL = process.env.DB_URL;
const PLATFORM = process.env.PLATFORM;
const JWT = process.env.JWT;
if(!DB_URL){
    throw new Error("Environment variable DB_URL is not defined");
}
if(!JWT){
    throw new Error("Environment variable JWT is not defined");
}

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};


export const config: APIConfig = {
    fileserverHits: 0,
    platform:PLATFORM!,
    JWT:JWT
};
export const DBConfig:DBConfigType = {
    url:DB_URL,
    migrationConfig:migrationConfig
}