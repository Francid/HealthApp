app.controller('patientDetailsCtrl', function($scope, $location, patientService, doctorService){
	$scope.patient = {}

    $scope.patient.firstname = patientService.getPatientDetails().firstname
    $scope.patient.lastname = patientService.getPatientDetails().lastname
    $scope.patient.age = patientService.getPatientDetails().age
    $scope.patient.doctor = patientService.getPatientDetails().familyDoctor
    console.log(patientService.getPatientDetails().familyDoctor)

    doctorService.getDoctors().success(function(data){
		$scope.doctorModel = data
	})

    $scope.register = function(data){
		patientService.save(data)
		$location.path('/patientlist')
	}

	$scope.clearForm = function(){
		$scope.patient = {}
	}
})

app.controller('patientListCtrl', function($scope, $location, patientService){

	patientService.getPatients().success(function(data){
		$scope.patientList = data
	})

	 $scope.selectedPatient = function (patient) {
        $location.path('/patientdetails')
        patientService.setPatientDetails(patient)
    };	
})

app.service("patientService", ['$http', function($http){
	var patientDetails = '';

	this.save = function(data){
		return $http.post('/patient', data)
	}

	this.getPatients = function(){
		return $http.get('/getpatients')
	}

	this.setPatientDetails = function (value) {
        patientDetails = value
    };

    this.getPatientDetails = function () {
        return patientDetails
    };
}])