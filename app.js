require("dotenv").config();
require("./db");
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const session = require('express-session');
const livereload = require("livereload");
const connectLivereload = require("connect-livereload");
const uglifyJs = require("./uglify");
const indexRouter = require('./routes/index');
const oauthRouter = require("./routes/oauth")
const app = express();

uglifyJs({ originPrefix: "./assets", distPrefix: "./public/assets", ignoreFile: { css:["shared"] } });
const liveServer = livereload.createServer({
  exts: ["js", "css"],
});

liveServer.watch(path.resolve("public/assets"));
liveServer.server.once("connection", () => {
  setTimeout(() => {
    liveServer.refresh("/");
  }, 100);
});

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

app.use('/', indexRouter);
app.use('/oauth', oauthRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};
  // render the error page
  res.status(err.status || 500);
  res.send('error');
});

module.exports = app;
