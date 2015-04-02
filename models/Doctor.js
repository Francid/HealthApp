var mongoose = require('mongoose')

var doctorSchema = new mongoose.Schema({
	id : mongoose.Schema.ObjectId,
	fullname : String,
	username : String,
	email : String,
	password: String
})

doctorSchema.set('autoindex', false)
doctorSchema.index({fullname:1}, {unique: true})

module.exports = mongoose.model('Doctor', doctorSchema)