const isUrl = require("is-url");
const shortId = require("shortid");
const urlModel = require("../model/urlModel");
const { GET_ASYNC, SET_ASYNC } = require("../redis/redis");
const axios = require("axios");

const isValidUrl = (urlString) => {
  var urlPattern = new RegExp("(?:https?)://.");
  return urlPattern.test(urlString);
};






const createUrlShorten = async (req, res) => {
  try {
    let data = req.body;
    data.longUrl = data.longUrl.trim()
    // console.log(req.rawHeaders[11])
    if (!data.longUrl) {
      return res.status(400).send({ status: false, message: "Please provide a valid URL" })
    }
    // const fetchFromRedis = await GET_ASYNC(`${data.longUrl}`);
    // if (fetchFromRedis) {
    //   res.status(201).send(fetchFromRedis);
    // }
    // else {
    

   


      const dbData = await urlModel
        .findOne({ longUrl: data.longUrl })
        .select({ _id: 0, longUrl: 1, shortUrl: 1, urlCode: 1 });
      if (dbData) {
        res.status(201).send({ status: true, data: dbData });
      }
      else {

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
    axios.get(data.longUrl)
        .then(res => {
          // Handle successful response

          data.shortUrl = `${req.rawHeaders[11]}/${data.urlCode}`;
           urlModel.create(data);
          const saveData =  urlModel
          .findOne(data)
          .select({ _id: 0, longUrl: 1, shortUrl: 1, urlCode: 1 });
          // await SET_ASYNC(`${req.body.longUrl}`,({status: true, data: saveData}))
           SET_ASYNC(
            urlCode,
            JSON.stringify({ longUrl: url.longUrl }),
            'EX',
            24 * 60 * 60
          );
          res.status(201).send({ status: true, data: saveData });


        })
        .catch(error => {
          // Handle error
    return     res.status(404).json({ status: false, message:"Please, Provide Valid URL"})
        });
    }
  } catch (error) {
    console.log("controller", error);
  return   res.status(500).send({ status: false, message: error.message });
  }
};

const getUrl = async (req, res) => {
  try {
    const url = await urlModel.findOne({ urlCode: req.params.urlCode });
    const fetchFromRedis = await GET_ASYNC(`${req.params.urlCode}`);
    if (fetchFromRedis) {
      res.status(302).redirect(JSON.parse(fetchFromRedis));
    }
    else {
      if (url) {
        await SET_ASYNC(`${req.params.urlCode}`, JSON.stringify(url.longUrl))
        res.status(302).redirect(url.longUrl);
      }
      else {
        res.status(404).send({ status: false, message: "Not found URL" });
      }
    }
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
}

module.exports = { createUrlShorten, getUrl };
