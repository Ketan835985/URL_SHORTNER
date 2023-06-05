const redis = require('redis')
const { promisify } = require("util");
const dotenv = require('dotenv').config()
//1. Connect to the redis server
const redisClient = redis.createClient(
    12997,
    process.env.REDIS_END_POINT,
    { no_ready_check: true }
  );
  redisClient.auth(process.env.REDIS_PASS, err => {
    if (err) throw err;
  })
  redisClient.on("connect", async function () {
    console.log("Connected to Redis");
  });
  const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

module.exports= { SET_ASYNC, GET_ASYNC}