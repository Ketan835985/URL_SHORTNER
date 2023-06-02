const isUrl = require("is-url");
const shortId = require("shortid");
const urlModel = require("../model/urlModel");
const redis = require('redis')
const { promisify } = require("util");
const dotenv = require('dotenv').config()

const isValidUrl = (urlString) => {
  var urlPattern = new RegExp("(?:https?)://.");
  return urlPattern.test(urlString);
};


//1. Connect to the redis server
const redisClient = redis.createClient(
  12997,
    process.env.REDIS_END_POINT,
    { no_ready_check: true }
);
redisClient.auth(process.env.REDIS_PASS, err =>{
  if (err) throw err;
})
redisClient.on("connect", async function () {
  console.log("Connected to Redis");
});

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);

const createUrlShorten = async (req, res) => {
  try {
    let data = req.body;
    data.longUrl = data.longUrl.trim()

    const dbData = await urlModel
      .findOne({ longUrl: data.longUrl })
      .select({ _id: 0, longUrl: 1, shortUrl: 1, urlCode: 1 });

    if (dbData) {
      res.status(201).send({ status: true, data: dbData });
    }
    else {
      let shortCode = shortId.generate().toLocaleLowerCase();
      const code = await urlModel.findOne({ urlCode: shortCode });
      if (code) {
        shortCode = shortId.generate().toLocaleLowerCase();
      }
      data.urlCode = shortCode;

      if (!data.longUrl)
        return res
          .status(400)
          .send({ status: false, message: "Please, Provide URL" });
      if (!isValidUrl(data.longUrl))
        return res
          .status(400)
          .send({ status: false, message: "Please, Provide valid URL" });
      if (!isUrl(data.longUrl))
        return res
          .status(400)
          .send({ status: false, message: "Please, Provide valid URL" });

      data.shortUrl = `http://localhost:${process.env.PORT}/${data.urlCode}`;

      await urlModel.create(data);
      const saveData = await urlModel
        .findOne(data)
        .select({ _id: 0, longUrl: 1, shortUrl: 1, urlCode: 1 });
      res.status(201).send({ status: true, data: saveData });
    }
  } catch (error) {
    console.log("controller", error);
    res.status(500).send({ status: false, message: error.message });
  }
};

const getUrl = async (req, res) => {
  try {
    const url = await urlModel.findOne({ urlCode: req.params.urlCode });
    const fetchFromRedis = await GET_ASYNC(`${req.params.urlCode}`);
    if (fetchFromRedis) {
      res.redirect(url.longUrl);
    } else {
      if (url) {
        await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(url))
        res.redirect(url.longUrl);
      }
      else {
        res.status(404).send({ status: false, message: "Not found" });
      }
    }
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
}

module.exports = { createUrlShorten, getUrl };
