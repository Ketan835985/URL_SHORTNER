const isUrl = require("is-url");
const shortId = require("shortid");
const urlModel = require("../model/urlModel");
const { GET_ASYNC, SET_ASYNC } = require("../redis/redis");
const axios = require("axios");
const { response } = require("express");

const isValidUrl = (urlString) => {
  var urlPattern = new RegExp("(?:https?)://.");
  return urlPattern.test(urlString);
};

const createUrlShorten = async (req, res) => {
  try {
    let data = req.body;
    data.longUrl = data.longUrl.trim();
    let longUrl = data.longUrl;
    // console.log(req.headers.host) // localhost:3000

    if (!data.longUrl) {
      return res
        .status(400)
        .send({ status: false, message: "Please provide a valid URL" });
    }

    let cacheData = await GET_ASYNC(data.longUrl);
    //console.log(cachedata);
    if (cacheData) {
      // if present then send it to user
      const caseData = JSON.parse(cacheData);
      return res.status(200).send({
        status: true,
        message: "Already available",
        caseData,
      });
    }

    const dbData = await urlModel
      .findOne({ longUrl: data.longUrl })
      .select({ _id: 0, longUrl: 1, shortUrl: 1, urlCode: 1 });
    if (dbData) {
      return res.status(201).send({ status: true, data: dbData });
    } else {
      let shortCode = shortId.generate();
      const code = await urlModel.findOne({ urlCode: shortCode });
      if (code) {
        shortCode = shortId.generate();
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
      //console.log("jdkhsdk");
      const response = await axios
        .get(longUrl)
        .then(async (response) => {
          //     // console.log(res);
          data.shortUrl = `http://${req.headers.host}/${data.urlCode}`;
          let urlCode = data.urlCode;

          await urlModel.create(data);
          const saveData = await urlModel
            .findOne(data)
            .select({ _id: 0, longUrl: 1, shortUrl: 1, urlCode: 1 });

          return res.status(201).send({ status: true, data: saveData });
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(400)
            .json({ status: false, data: "url link in invalid" });
        });
    }
  } catch (error) {
    //console.log("controller", error);
    return res.status(500).send({ status: false, message: error.message });
  }
};

const getUrl = async (req, res) => {
  try {
    const fetchFromRedis = await GET_ASYNC(`${req.params.urlCode}`);
    console.log("hello", fetchFromRedis);
    if (fetchFromRedis) {
      res.status(302).redirect(JSON.parse(fetchFromRedis));
    } else {
      const url = await urlModel.findOne({ urlCode: req.params.urlCode });
      if (url) {
        await SET_ASYNC(
          `${req.params.urlCode}`,
          JSON.stringify(url.longUrl),
          "EX",
          60 * 60
        );
        res.status(302).redirect(url.longUrl);
      } else {
        res.status(404).send({ status: false, message: "Not found URL" });
      }
    }
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
};

module.exports = { createUrlShorten, getUrl };
