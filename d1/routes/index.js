var express = require('express');
var crypto = require('crypto');
var User = require('../models/user.js');
var router = express.Router();

// 首页
router.get('/', function (req, res, next) {
  res.render('index', {
    title: '首页',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

// 注册
router.get('/register', function (req, res, next) {
  if(req.session.user){
    res.redirect('/');
  }
  res.render('register', {
    title: '注册',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

router.post('/register', function (req, res, next) {
  var name = req.body.username,
    password = req.body.password,
    repassword = req.body.repassword,
    email = req.body.email;

  //检验用户两次输入的密码是否一致
  if (repassword != password) {
    req.flash('error', '两次输入的密码不一致!');
    console.log('error 两次输入的密码不一致!');
    return res.redirect('/register');//返回注册页
  }

  //生成密码的 md5 值
  var md5 = crypto.createHash('md5');
  password = md5.update(req.body.password).digest('hex');

  var newUser = new User({
    name: name,
    password: password,
    email: email
  });

  User.get(newUser.name, function (err, user) {
    if (err) {
      console.log('error');
      return res.redirect('/');
    }
    if (user) {
      req.flash('error', '用户已存在!');
      console.log('error 用户已存在!');
      return res.redirect('/register');//返回注册页
    }
    //如果不存在则新增用户
    newUser.save(function (err, user) {
      if (err) {
        req.flash('error', err);
        console.log('注册失败');
        return res.redirect('/register');//注册失败返回主册页
      }
      req.session.user = user;//用户信息存入 session
      req.flash('success', '注册成功!');
      console.log('success 注册成功!');
      res.redirect('/');//注册成功后返回主页
    });
  });
});

// 登陆
// router.get('/login', checkNotLogin);

router.get('/login', function (req, res, next) {
  if(req.session.user){
    res.redirect('/');
  }
  res.render('login', {
    title: '登录',
    user: req.session.user,
    success: req.flash('success').toString(),
    error: req.flash('error').toString()
  });
});

router.post('/login', function (req, res, next) {
  //生成密码的 md5 值
  var md5 = crypto.createHash('md5');
  var username = req.body.username;
  var password = md5.update(req.body.password).digest('hex');
  //检查用户是否存在
  User.get(username, function (err, user, next) {
    if (!user) {
      req.flash('error', '用户不存在!');
      console.log('error 用户不存在!');
      return res.redirect('/login');//用户不存在则跳转到登录页
    }
    //检查密码是否一致
    if (user.password != password) {
      req.flash('error', '密码错误!');
      console.log('error 密码错误!');
      return res.redirect('/login');//密码错误则跳转到登录页
    }
    //用户名密码都匹配后，将用户信息存入 session
    req.session.user = user;
    req.flash('success', '登陆成功!');
    console.log('success 登陆成功!');
    res.redirect('/');//登陆成功后跳转到主页
  });
});

// 登出
// router.get('/logout', checkLogin);

router.get('/logout', function (req, res, next) {
  req.session.user = null;
  req.flash('success', '登出成功!');
  console.log('success', '登出成功!');
  res.redirect('/');//登出成功后跳转到主页
});

module.exports = router;