const express = require("express");
const { createUrlshorten } = require("../controllers/Controller");
const urlModel = require("../model/urlModel");
const router = express.Router();

router.post("/url/shorten", createUrlshorten);

router.get("/:urlCode", async (req, res) => {
  try {
    const url = await urlModel.findOne({ code: req.params.urlCode });
    if (url) {
      res.status(302).redirect(url.longUrl);
    } else {
      res.status(404).send("Not found");
    }
  } catch (error) {
    res.status(500).send({ status: false, error: error.message });
  }
});

module.exports = router;
