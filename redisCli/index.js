const redis = require('redis-node');

const host = process.env.REDIS_HOST || 'localhost';
const client = redis.createClient(6379, host);
const keyExpiry = 10;

client.on('connected', () => {
  console.log(`connected to Redis ${host}`);
});
client.on('connection error', () => {
  console.log(`Redis connection error ${host}`);
});

const redisGet = async (key) => new Promise((resolve, reject) => {
  console.log(`Getting ${key} from redis`);
  client.get(key, (err, val) => {
    if (err) {
      reject(err);
    } else {
      // Increase expire on each get
      client.expire(key, keyExpiry);
      resolve(JSON.parse(val));
    }
  });
});

const redisSet = async (key, value) => new Promise((resolve, reject) => {
  client.set(key, JSON.stringify(value), (err, resp) => {
    if (err) {
      reject(err);
    } else {
      client.expire(key, keyExpiry);
      resolve(resp);
    }
  });
});

module.exports = {
  redisGet,
  redisSet,
};
