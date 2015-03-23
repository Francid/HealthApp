var mongoose = require('mongoose');
var Doctor = require('./Doctor')

var patientSchema = new mongoose.Schema({
	ID : Number,
	"firstname": String,
	"lastname": String,
	visits:{
		complaint: String,
		billingAmount: Number
	},
	age: Number,
	familyDoctor: [Doctor],
	createdAt: Date,
	lastModified: Date
})

module.exports = mongoose.model('Patient', patientSchema)