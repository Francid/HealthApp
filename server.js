var express = require('express')
var mongoose = require('mongoose')
var config = require('./config.js')
var logger = require('morgan')
var passport = require('passport')
var bodyParser = require('body-parser')
var Doctor = require('./models/Doctor')
var Patient = require('./models/Patient')

var app = express()
mongoose.connect('mongodb://localhost:27017/test')

//app.use(logger('combined'))

app.use(express.static(__dirname + '/public/stylesheets/'))
app.use(express.static(__dirname + '/public/scripts/'))
app.use(express.static(__dirname + '/views'))
app.use(express.static(__dirname + '/views/partials/'))
app.use(bodyParser.json())

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.on('open', function () {
  console.log("connection made to database");
});

app.get('/', function(req,res){
	res.sendFile(__dirname + 'views/index.html')
})

app.post('/doctor', function(req, res){
	console.log("post doctor")
	var doctor = new Doctor({
		"fullname" : req.body.fullname,
		"username" : req.body.username,
		"email" : req.body.email,
		"password" : req.body.password
	})
	console.log(req.body.fullname)
	doctor.save(function(err){
		if(err)
			console.log(err)
		else
			console.log("record created")
	})
})

app.post('/patient', function(req, res){
	console.log("post patient")
	var patient = new Patient({
		"firstname" : req.body.firstname,
		"lastname" : req.body.lastname,
		"email" : req.body.email,
		"age" : req.body.age
	})
	console.log(req.body.fullname)
	patient.save(function(err){
		if(err)
			console.log(err)
		else
			console.log("record created")
	})
})

app.get('/getpatients', function(req, res){
	console.log("get patients")
	Patient.find(function(err,patients){
		if(err)
			console.log(err)
		else
			return res.json(patients)
	})
})


app.listen(3000)