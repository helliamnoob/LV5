const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("default url");
});

module.exports = router;
