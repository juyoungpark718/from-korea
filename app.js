const path = require('path');
require("dotenv").config({
  path: path.join(__dirname, ".env")
});
require("./db");
require("./util");
require("./middleware");
const createError = require('http-errors');
const express = require('express');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const csrf = require("csurf");
const livereload = require("livereload");
const uglifyJs = require("./uglify");

global.csrfProtection = csrf();

//routers
const indexRouter = require('./routes/index');
const oauthRouter = require("./routes/oauth");
const loginRouter = require("./routes/login");
const detailRouter = require("./routes/detail");
const cartRouter = require("./routes/cart");
// const orderRouter = require("./routes/order");
// const paymentRouter = require("./routes/payment");
const app = express();
global.app = app;

uglifyJs({ originPrefix: "./assets", distPrefix: "./public/assets", ignoreFile: { css:["shared"] } });
const liveServer = livereload.createServer({
  exts: ["js", "css"],
});

if(process.env.NODE_ENV === "dev"){
  liveServer.watch(path.resolve("public/assets"));
  liveServer.server.once("connection", () => {
    setTimeout(() => {
      liveServer.refresh("/");
    }, 100);
  });
}

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({
  secret: process.env.SESSION_SECRET,
  cookie:{
    secure: false,
    maxAge: 3600000,
  },
  resave:false,
  saveUninitialized:false,
}));

app.use((req,res,next) => {
  req.session.user = {
    id:2,
    name:"테스트 계정"
  }
  next();
})

app.use('/', indexRouter);
app.use('/oauth', oauthRouter);
app.use("/user", loginRouter);
app.use("/detail", detailRouter);
app.use ("/cart", cartRouter);
// app.use("/order", orderRouter);
// app.use("/payment", paymentRouter);
require("./api/index");

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = process.env.NODE_ENV === 'dev' ? err : {};
  console.log(res.locals.error);
  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
