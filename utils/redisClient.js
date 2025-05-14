// redisClient.js
const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL); // from .env

module.exports = redis;
