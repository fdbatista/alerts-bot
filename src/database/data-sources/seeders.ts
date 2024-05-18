import { config } from "dotenv"
config()

import "reflect-metadata"
import { MyDataSource } from "./abstraction"

export const AppDataSource = new MyDataSource("src/database/seeders/*.ts")
