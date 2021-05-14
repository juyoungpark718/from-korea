const express = require("express");
const Layout = require("../views/layout");
const Main = require("../views/main");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  const { user } = req.session;
  if (user) {
    res.send(
      Layout.render({
        title: "From. Korea",
        user,
        body: Main.render(),
        styles: [styleSheet`main/style.css`],
        scripts: [scripts`main/index.js`],
      })
    );
    return;
  }
  res.send(
    Layout.render({
      title: "From. Korea",
      body: Main.render(),
      styles: [styleSheet`main/style.css`],
      scripts: [scripts`main/index.js`],
    })
  );
});

module.exports = router;
