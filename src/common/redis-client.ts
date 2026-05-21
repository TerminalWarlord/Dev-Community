import Redis from "ioredis"
import { REDIS_CONNECTION_URL } from "./constants";

export const redisClient = new Redis(REDIS_CONNECTION_URL!);