import { config } from "dotenv"
config()

import "reflect-metadata"
import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT ?? '5432'),
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    logging: false,
    synchronize: false,
    migrations: ["src/database/migrations/*.ts"],
    subscribers: [],
    migrationsTableName: "migrations",
})
