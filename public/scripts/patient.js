app.controller('patientDetailsCtrl', function($scope, $location, patientService, doctorService){
	$scope.patient = {}

    $scope.patient._id = patientService.getPatientDetails()._id
    $scope.patient.firstname = patientService.getPatientDetails().firstname
    $scope.patient.lastname = patientService.getPatientDetails().lastname
    $scope.patient.age = patientService.getPatientDetails().age
    $scope.patient.familyDoctor = patientService.getPatientDetails().familyDoctor

    doctorService.getDoctors().success(function(data){
		$scope.doctorModel = data
	})

    $scope.register = function(data){
		patientService.save(data).error(function(data, error){
		})
		$scope.clearForm()
		$location.path('/patientlist')
	}

	$scope.clearForm = function(){
		$scope.patient = {}
	}
})

app.controller('patientListCtrl', function($scope, $route,$location, patientService){
	$scope.sortType     = 'name';
	$scope.sortReverse  = false;  // set the default sort order
  	$scope.searchValue   = '';
	$scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.patientList = [];
    $scope.search = []

    patientService.getPatients().success(function(data){
		$scope.patientList = data
	})

    $scope.numberOfPages=function(){
        return Math.ceil($scope.patientList.length/$scope.pageSize);                
    }

	 $scope.selectedPatient = function (patient) {
        patientService.setPatientDetails(patient)
        $location.path('/patientdetails')
    };

    $scope.deletePatient = function(patient){
    	$route.reload()
    	patientService.delPatient(patient).success(function(data){
    	})
    	
    }

    $scope.searchLastName = function(patient){
    	console.log("patient: "+patient)
    	patientService.getPatientsByLastName(patient).success(function(patient){
			$scope.search = patient
    	}).error(function(data, status){
    	})
    }	
})

app.service("patientService", ['$http', function($http){
	var patientDetails = '';

	this.save = function(data){
		return $http.post('/patient', data)
	}

	this.getPatients = function(){
		return $http.get('/patients')
	}

	this.getPatientsByLastName = function (patient) { 
            return $http.get('/patient/'+patient)
    }

	this.delPatient = function(data){
		return $http.post('/delpatient', data)
	}

	this.setPatientDetails = function (value) {
        patientDetails = value
    };

    this.getPatientDetails = function () {
        return patientDetails
    };
}]);

app.filter('startFrom', function() {
    return function(input, start) {
        start = +start; //parse to int
        return input.slice(start);
    }
});