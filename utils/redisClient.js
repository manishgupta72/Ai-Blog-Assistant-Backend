const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL); // use Upstash or local
module.exports = redis;
