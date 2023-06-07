const isUrl = require("is-url");
const shortId = require("shortid");
const urlModel = require("../model/urlModel");
const { GET_ASYNC, SET_ASYNC } = require("../utils/redis/redis");
const axios = require("axios");
const { response } = require("express");

const isValidUrl = (urlString) => {
  var urlPattern = new RegExp("(?:https?)://."); // regx to check https method valid---------------------
  return urlPattern.test(urlString);
};

// create a new user in the database;-------------------------------------------------------------------
const createUrlShorten = async (req, res) => {
  try {
    const data = req.body;
    if(!data.longUrl){
      return res
        .status(400)
        .json({ status: false, message: "Please provide a valid URL" });
    }
    data.longUrl = data.longUrl.trim();
    const longUrl = data.longUrl
    if (!data.longUrl) {
      return res
        .status(400)
        .json({ status: false, message: "Please provide a valid URL" });
    }
    if (!isValidUrl(data.longUrl))
      // validation ------------------------------------------
      return res
        .status(400)
        .json({ status: false, message: "Please, Provide valid URL" });
    if (!isUrl(data.longUrl))
      // validation ------------------------------------------
      return res
        .status(400)
        .json({ status: false, message: "Please, Provide valid URL" });
    // finding the data in the cache storage----------------------------------------------------------
    const caseUrl = await GET_ASYNC(longUrl);
    //console.log(caseUrl)
    if (caseUrl) {
      return res.status(201).json({ status: true, data: JSON.parse(caseUrl) });
    }


    //finding the data into database----------------------------------------------------------------
    const dbData = await urlModel
      .findOne({ longUrl: data.longUrl })
      .select({ _id: 0, longUrl: 1, shortUrl: 1, urlCode: 1 });
    if (dbData) {

      //set the data into the cache memory----------------------------------------------------------
      await SET_ASYNC(longUrl, JSON.stringify(dbData), "EX", 24 * 60 * 60);

      return res.status(201).json({ status: true, data: dbData });
    } else {
      // axios for validations--------------------------------------------------------------------
      await axios
        .get(longUrl)
        .then(async (response) => {
          //  short id convert into the lower case string-----------------------------------------------
          const shortCode = shortId.generate().toLowerCase();
          const code = await urlModel.findOne({ urlCode: shortCode });
          if (code) {
            shortCode = shortId.generate().toLowerCase();
          }
          data.urlCode = shortCode;
          data.shortUrl = `http://${req.headers.host}/${data.urlCode}`;

          await urlModel.create(data);
          const saveData = await urlModel
            .findOne({ longUrl: data.longUrl })
            .select({ _id: 0, longUrl: 1, shortUrl: 1, urlCode: 1 });
          //set the data into the cache memory----------------------------------------------------------  
          await SET_ASYNC(longUrl, JSON.stringify(saveData), "EX", 24 * 60 * 60);

          return res.status(201).json({ status: true, data: saveData });
        })
        .catch((err) => {
          console.log(err);
          return res
            .status(400)
            .json({ status: false, data: "url link in invalid" });
        });
    }
  } catch (error) {
    console.log("controller", error);
    return res.status(500).json({ status: false, message: error.message });
  }
};

const getUrl = async (req, res) => {
  try {
    const fetchFromRedis = await GET_ASYNC(`${req.params.urlCode}`);

    if (fetchFromRedis) {
      res.status(302).redirect(JSON.parse(fetchFromRedis));
    } else {
      const url = await urlModel.findOne({ urlCode: req.params.urlCode });
      if (url) {
        await SET_ASYNC(
          `${req.params.urlCode}`,
          JSON.stringify(url.longUrl),
          "EX",
          24 * 60 * 60
        );
        res.status(302).redirect(url.longUrl);
      } else {
        res.status(404).json({ status: false, message: "URL NOT FOUND" });
      }
    }
  } catch (error) {
    res.status(500).json({ status: false, error: error.message });
  }
  
};

module.exports = { createUrlShorten, getUrl };
