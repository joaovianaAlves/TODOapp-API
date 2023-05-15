var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
 username: {
 unique: true,
 type: String
 },
 password: {
 type: String
 },
 isAdmin: {
type: Boolean
},
},
 {
 versionKey: false
 }
);
module.exports = mongoose.model('User', userSchema)