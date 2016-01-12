var mongoose = require('mongoose');
var db = require('./db');
//mongoose.connect('mongodb://localhost/blog');

var userSchema = new mongoose.Schema({
  name: String,
  password: String
}, {
  collection: 'users'
});

var userModel = db.model('User', userSchema);

function User(user) {
  this.name = user.name;
  this.password = user.password;
}

User.prototype.save = function(callback) {

  var user = {
    name: this.name,
    password: this.password
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
