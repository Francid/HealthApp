//patient controller
app.controller('patientDetailsCtrl', function($scope, $location, $rootScope, patientService, doctorService){
	//define scope for patient
    $scope.patient = {}
    //set scope
    $scope.patient._id = patientService.getPatientDetails()._id
    $scope.patient.firstname = patientService.getPatientDetails().firstname
    $scope.patient.lastname = patientService.getPatientDetails().lastname
    $scope.patient.age = patientService.getPatientDetails().age
    $scope.patient.familyDoctor = patientService.getPatientDetails().familyDoctor
    $scope.patient.createdAt = patientService.getPatientDetails().createdAt
    $scope.patient.lastModified = patientService.getPatientDetails().lastModified
    //patient visits scope
    $scope.patientVisits = {}

    $scope.patientVisits.complaint = patientService.getVisits().complaint
    $scope.patientVisits.billingAmount = patientService.getVisits().billingAmount

    //get all doctors
    doctorService.getDoctors().success(function(data){
		$scope.doctorModel = data
	})
    //save patient to db
    $scope.register = function(data, visits){
        //both patient and visits object
        var object ={
            data: data,
            visits : visits
        }
        //http request
		patientService.save(object).error(function(data, error){
		})
		$scope.clearForm()
		$location.path('/patientlist')
	}
    //clear form
	$scope.clearForm = function(){
		$scope.patient = {}
	}
    //redirect to visits page
    $scope.visit = function(data){
        $location.path('/visit')
    }
    //get all visits
    patientService.getVisits($scope.patient._id).success(function(data){
        $scope.patientVisits = data[0].visits
    })

})

app.controller('patientVisitCtrl', function($scope, $location, patientService){
    $scope.patientVisit = []

    $scope.registerVisit = function(data){
        patientService.visit(data, patientService.getPatientDetails()._id).error(function(data, error){
        })
        //console.log(data)
        $location.path('/patientlist')
    }

    

})
//patient list controller
app.controller('patientListCtrl', function($scope, $route,$rootScope, $location, patientService){
    //pagination variables
	$scope.sortType     = 'name';
	$scope.sortReverse  = false;  // set the default sort order
  	$scope.searchValue   = '';
	$scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.patientList = [];
    $scope.search = []

    $rootScope.edit = false
    //show patients or not to show patients
    $scope.enable = function(){
        $rootScope.edit = true
    }
    //get all patients
    patientService.getPatients().success(function(data){
		$scope.patientList = data
	})
    //determine number of pages
    $scope.numberOfPages=function(){
        return Math.ceil($scope.patientList.length/$scope.pageSize);                
    }
    //select patient button
	 $scope.selectedPatient = function (patient) {
        patientService.setPatientDetails(patient)
        $location.path('/patientdetails')
    };
    //delete patient button
    $scope.deletePatient = function(patient){
    	$route.reload()
    	patientService.delPatient(patient).success(function(data){
    	})
    }
    //search functionality
    $scope.searchLastName = function(patient){
    	patientService.getPatientsByLastName(patient).success(function(patient){
			$scope.search = patient
    	}).error(function(data, status){
    	})
    }
})
//patient service
app.service("patientService", ['$http', function($http){
	var patientDetails = '';
    //save patient
	this.save = function(data){
		return $http.post('/patient', data)
	}
    //save visit
    this.visit = function(data, patient){
        console.log('patient id' +  patient)
        //json object for visits
        var object = {
            complaint : data.complaint,
            billingAmount: data.billingAmount,
            patientID : patient
        }
        return $http.post('/visit', object)
    }
    //get all visits
    this.getVisits = function(patient){
        return $http.get('/visits/'+patient)
    }
    //get all patients
	this.getPatients = function(){
		return $http.get('/patients')
	}
    //search functionality
	this.getPatientsByLastName = function (patient) { 
            return $http.get('/patient/'+patient)
    }
    //delete patient post
	this.delPatient = function(data){
		return $http.post('/delpatient', data)
	}
    //load patient details
	this.setPatientDetails = function (value) {
        patientDetails = value
    };
    //get patient details
    this.getPatientDetails = function () {
        return patientDetails
    };
}]);
//pagination: get number of pages
app.filter('startFrom', function() {
    return function(input, start) {
        if(input){
            start += start; //parse to int
            return input.slice(start);
        }
    }
});