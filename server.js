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
mongoose.connect('mongodb://luke:luke@ds033617.mongolab.com:33617/comp308-patientdatabase')


app.use(express.static(__dirname + '/public/stylesheets/'))
app.use(express.static(__dirname + '/public/scripts/'))
app.use(express.static(__dirname + '/public/views'))
app.use(express.static(__dirname + '/public/views/partials/'))
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
	console.log(req.body)
	var p = new Patient(req.body.data);
	p.visits = req.body.visits
	p.lastModified = Date.now()
	Patient.findOneAndUpdate({_id: p._id},p,{upsert:true}, function(err,patients){
	})
})

app.post('/visit', function(req, res){
	Patient.findOne({_id: req.body.patientID}, function(err, patients){
		
		patients.visits.push({complaint: req.body.complaint, billingAmount: req.body.billingAmount})
		console.log(patients)
		patients.save(function(err, item){})
	})
	//var p = new Patient()
	//p.visit.push({compliant:req.body.complaint, billingAmount: req.body.billingAmount })
})

app.get('/visits/:patientID', function(req, res){
	console.log(req.params.patientID)
	Patient.find({ _id: req.params.patientID},{'visits.complaint':1, 'visits.billingAmount':1, '_id':0},function (err, patients) {
            res.json(patients)
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