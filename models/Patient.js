var mongoose = require('mongoose');
var Doctor = require('./Doctor')

var patientSchema = new mongoose.Schema({
	ID : Number,
	firstname: String,
	lastname: String,
	visits:{
		complaint: String,
		billingAmount: Number
	},
	age: Number,
	familyDoctor: String,
	createdAt: Date,
	lastModified: Date
})
patientSchema.set('autoindex', false)
patientSchema.index({firstname:1, lastname:1}, {unique: true})

module.exports = mongoose.model('Patient', patientSchema)