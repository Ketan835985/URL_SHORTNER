const express = require("express");
const { getUrl, createUrlShorten, redirectLink } = require("../controllers/controller");
const router = express.Router();

router.post("/url/shorten", createUrlShorten);

router.get("/:urlCode", getUrl);

router.post('/url/shorten/path', redirectLink)

module.exports = router;
