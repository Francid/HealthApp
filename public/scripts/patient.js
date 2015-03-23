app.controller('patientDetailsCtrl', function($scope, patientService){

	$scope.patient = {}

    $scope.patient.firstname = patientService.getPatientDetails().firstname
    $scope.patient.lastname = patientService.getPatientDetails().lastname
    $scope.patient.email = patientService.getPatientDetails().email
    $scope.patient.age = patientService.getPatientDetails().age

    $scope.register = function(data){
		patientService.save(data)
	}

	$scope.clearForm = function(){
		$scope.patient = {}
	}
})

app.controller('patientListCtrl', function($scope, $location, patientService){

	patientService.getPatients().success(function(data){
		$scope.patientModel = data
	})

	 $scope.selectedPatient = function (patient) {
        $location.path('/patientdetails')
        patientService.setPatientDetails(patient)
        console.log(patient.firstname)
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