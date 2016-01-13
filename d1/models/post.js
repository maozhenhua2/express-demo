var db = require('./db');
var mongoose = require('mongoose');

var posterSchema = new mongoose.Schema({
  name: String,
  title: String,
  post: String,
  time: Object
}, {
  collection: 'posts'
});

var postModel = db.model('posts', posterSchema);

function Post(name, title, post, time) {
  this.name = name;
  this.title = title;
  this.post = post;
  this.time = time;
}

module.exports = Post;

Post.prototype.save = function (callback) {
  var date = new Date();
  //存储各种时间格式，方便以后扩展
  var time = {
    date: date,
    year: date.getFullYear(),
    month: date.getFullYear() + "-" + (date.getMonth() + 1),
    day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
    minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " +
    date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())
  };
  //要存入数据库的文档
  var post = {
    name: this.name,
    time: time,
    title: this.title,
    post: this.post
  };

  var newPoster = new postModel(post);

  newPoster.save(function (err, user) {
    if (err) {
      return callback(err);
    }
    callback(null, user);
    //db.close();
  });
};

Post.get = function (name, callback) {
  postModel.find({}).exec(function(err, post){
    if (err) {
      return callback(err);
    }
    callback(null, post);
    //db.close();
  });
};

