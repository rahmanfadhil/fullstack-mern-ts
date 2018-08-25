import { ConnectionOptions } from "typeorm";
import * as store from "connect-redis";
import { join } from "path";

const development: ConnectionOptions = {
  type: "sqlite",
  database: "database.sqlite",
  synchronize: true,
  logging: true,
  entities: [join(__dirname, "./entity/*.ts")]
};

const production: ConnectionOptions = {
  type: "postgres",
  host: "postgres-node",
  port: 5432,
  username: "postgres",
  password: "12345",
  database: "database",
  synchronize: true,
  logging: false,
  entities: [join(__dirname, "./entity/*.ts")]
};

export const dbConfig =
  process.env.NODE_ENV === "production" ? production : development;

export function getRedisStore(session) {
  const RedisStore = store(session);
  return process.env.NODE_ENV === "production"
    ? new RedisStore({ host: "redis-node", port: 6379 })
    : null;
}
