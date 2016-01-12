var express = require('express');
var path = require('path');

var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser'); // cookie
var bodyParser = require('body-parser'); // 解析json
var flash = require('connect-flash'); // 实现页面通知
var session = require('express-session'); // session
var MongoStore = require('connect-mongo')(session);
// 模板引擎
var ejs = require('ejs');
// 路由
var routes = require('./routes/index');
var users = require('./routes/users');
// 连接数据库
var settings = require('./settings');
var mongoose = require('./models/db');

var app = express();

// app.set('views', path.join(__dirname, 'views’))：设置 views 文件夹为存放视图文件的目录, 即存放模板文件的地方,__dirname 为全局变量,存储当前正在执行的脚本所在的目录。
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
// app.set('view engine', 'ejs’)：设置视图模板引擎为 ejs。
app.engine('.html', ejs.__express);
app.set('view engine', 'html');

app.use(session({
  secret: settings.cookieSecret,
  key: settings.db, //cookie name
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60
  }, //30 days
  //store: new MongoStore({
  //	db: settings.db,
  //	host: settings.host,
  //	port: settings.port
  //})
  store: new MongoStore({mongooseConnection: mongoose})
}));

// 实现页面通知（即成功与错误信息的显示）
app.use(flash());
// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
// 加载日志中间件
app.use(logger('dev'));
// 加载解析json的中间件。
app.use(bodyParser.json());
// 加载解析urlencoded请求体的中间件。
app.use(bodyParser.urlencoded({ extended: true }));
// 加载解析cookie的中间件
app.use(cookieParser());
// 设置public文件夹为存放静态文件的目录
app.use(express.static(path.join(__dirname, 'public')));
// 路由控制器
app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  err.title = '出错';
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      title: '出错',
      user: getUser(req),
      message: err.message,
      success: false,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res) {
  //console.log(err);
  res.status(err.status || 500);
  res.render('error', {
    title: '出错',
    user: getUser(req),
    message: err.message,
    success: false,
    error: {
      status: err.status
    }
  });
});

function getUser(req) {
  return req.session.user ? req.session.user : '';
}

module.exports = app;
