import { DataSource } from "typeorm";
import * as dotenv from 'dotenv';

dotenv.config({ path: `.env.${process.env.NODE_ENV}` });

export default new DataSource({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  port: Number(process.env.DATABASE_PORT || "5432"),
  type: "postgres",
  ssl: process.env.NODE_ENV === 'production',
  synchronize: process.env.NODE_ENV !== 'production',
  entities: [__dirname + '/entities/*.entity.{js,ts}'],
  migrations: [__dirname + "/migrations/**/*{.js,.ts}"],
  invalidWhereValuesBehavior: {
        undefined: "ignore",
        null: "ignore"
    }
})