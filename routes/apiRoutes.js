//make mock api routes  express

const express = require("express");
const router = express.Router();

router.get("/hello", (req, res) => {
  res.json({ message: "API route" });
});

module.exports = router;
