//doctor controller
app.controller('doctorCtrl', function($scope, $location, doctorService){
    //get all doctors
	doctorService.getDoctors().success(function(data){
		$scope.doctorsList = data
	})
    //register event
	$scope.register = function(data){
		doctorService.save(data)
        //page redirect
		$location.path('/patientlist')
	}
})
//patient service
app.service("doctorService", ['$http', function($http){
    //save doctor
	this.save = function(data){
		return $http.post('/doctor', data)
	}
    //get all doctors
	this.getDoctors = function(data){
		return $http.get('/getdoctors')
	}
}])