const express = require("express");
const { getUrl, createUrlShorten } = require("../controllers/controller");
const router = express.Router();

router.post("/url/shorten", createUrlShorten);

router.get("/:urlCode", getUrl);

module.exports = router;
