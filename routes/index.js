const express = require("express");
const Layout = require("../views/layout");
const Main = require("../views/main");
const router = express.Router();
const { getCategoryPage } = require("../crawler/coupang");

/* GET home page. */
router.get("/", async function (req, res) {
  const { user } = req.session;
  // const data = await getCategoryPage("https://www.coupang.com/np/categories/186764", 1);
  const data = [];
  if (user) {
    res.send(
      Layout.render({
        title: "From. Korea",
        user,
        body: Main.render(data),
        styles: [styleSheet`main/style.css`],
        scripts: [script`main/index.js`],
      })
    );
    return;
  }
  res.send(
    Layout.render({
      title: "From. Korea",
      body: Main.render(data),
      styles: [styleSheet`main/style.css`],
      scripts: [script`main/index.js`],
    })
  );
});

module.exports = router;
