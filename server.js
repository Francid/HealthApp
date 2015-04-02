var express = require('express')
var mongoose = require('mongoose')
var config = require('./config.js')
var logger = require('morgan')
var passport = require('passport')
var bodyParser = require('body-parser')
var Doctor = require('./models/Doctor')
var Patient = require('./models/Patient')
var url = require('url')

var app = express()
mongoose.connect('mongodb://localhost:27017/test')

//app.use(logger('combined'))

app.use(express.static(__dirname + '/public/stylesheets/'))
app.use(express.static(__dirname + '/public/scripts/'))
app.use(express.static(__dirname + '/views'))
app.use(express.static(__dirname + '/views/partials/'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.locals.pretty = true;

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
			console.log("doctor: "+req.body.fullname+" record created")
	})
})


app.get('/getdoctors', function(req, res){
	console.log("doctors list queried")
	Doctor.find(function(err,doctors){
		if(err)
			console.log(err)
		else
			return res.json(doctors)
	})
})

app.post('/patient', function(req, res){
	console.log("new patient posted")
	var patient = new Patient({
		"firstname" : req.body.firstname,
		"lastname" : req.body.lastname,
		"familyDoctor" : req.body.familyDoctor,
		"age" : req.body.age
	})

	Patient.find({firstname: req.body.firstname, lastname: req.body.lastname}, function(err,patients){
		if(patients.length <= 0){
			patient.save(function(err){
				if(err){
					res.status(409).send('Duplicate record')
					console.log(err)
				}
				else
					console.log("Patient: "+req.body.firstname+" "+req.body.lastname+"record created")
			})
		}else{
			Patient.update({firstname: req.body.firstname, lastname: req.body.lastname},{firstname: req.body.firstname, lastname: req.body.lastname, age: req.body.age, familyDoctor: req.body.familyDoctor},function(err,affected) {
  				res.status(200).send("record updated")
			});
			console.log('update')
		}
	})
})

app.get('/patients', function(req, res){
	console.log("get patients")
	Patient.find(function(err,patients){
		if(err)
			console.log(err)
		else
			return res.json(patients)
	})
})

app.get('/patient/:lastname', function (req, res) {
    var query = new RegExp(req.params.lastname, 'i');
    if(req.params.lastname){
    Patient.find({ lastname: query },function (err, patients) {
            res.send(patients)
    })
}
})

app.post('/delpatient', function (req, res) {
    Patient.find({ _id: req.body._id }).remove().exec();
    console.log("Patient Removed");
});


app.listen(3000)