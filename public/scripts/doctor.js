app.controller('doctorCtrl', function($scope, $location, doctorService){

	doctorService.getDoctors().success(function(data){
		$scope.doctorsList = data
	})

	$scope.register = function(data){
		doctorService.save(data)
		$location.path('/patientlist')
	}
})

app.service("doctorService", ['$http', function($http){
	this.save = function(data){
		return $http.post('/doctor', data)
	}

	this.getDoctors = function(data){
		return $http.get('/getdoctors')
	}
}])