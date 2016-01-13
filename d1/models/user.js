var crypto = require('crypto');
var mongoose = require('mongoose');
var db = require('./db');
//mongoose.connect('mongodb://localhost/blog');

var userSchema = new mongoose.Schema({
  name: String,
  password: String,
  email: String,
  head: String
}, {
  collection: 'users'
});

var userModel = db.model('User', userSchema);

function User(user) {
  this.name = user.name;
  this.password = user.password;
  this.email = user.email;
}

User.prototype.save = function(callback) {
  var md5 = crypto.createHash('md5'),
    email_MD5 = md5.update(this.email.toLowerCase()).digest('hex'),
    head = "http://www.gravatar.com/avatar/" + email_MD5 + "?s=48";
  var user = {
    name: this.name,
    password: this.password,
    email: this.email,
    head: head
  };

  var newUser = new userModel(user);

  newUser.save(function(err, user) {
    if (err) {
      return callback(err);
    }
    callback(null, user);
    //db.close();
  });
};

User.get = function(name, callback) {
  userModel.findOne({
    name: name
  }, function(err, user) {
    if (err) {
      return callback(err);
    }
    callback(null, user);
    //db.close();
  });
};

module.exports = User;
