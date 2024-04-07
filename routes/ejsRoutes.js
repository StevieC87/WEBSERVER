//make mock routes exprress

const express = require("express");
const router = express.Router();

router.get("/ejs", (req, res) => {
  res.render("index", { title: "EJS" });
});

module.exports = router;
