var mongoose = require('mongoose');
var Doctor = require('./Doctor')

var patientSchema = new mongoose.Schema({
	firstname: String,
	lastname: String,
	visits:[{
		complaint: String,
		billingAmount: Number
	}],
	age: Number,
	familyDoctor: String,
	createdAt: {type: Date, default: Date.now},
	lastModified: Date
})
patientSchema.set('autoindex', false)
patientSchema.index({firstname:1, lastname:1}, {unique: true})

module.exports = mongoose.model('Patient', patientSchema)