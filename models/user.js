var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
 nome: {
    unique: true,
    type: String
 },
    hash: {
    type: String
    },
    salt: {
    type: String
    },
 admLogado: {
type: Boolean
},
},
 {
 versionKey: false
 }
);
module.exports = mongoose.model('User', userSchema)