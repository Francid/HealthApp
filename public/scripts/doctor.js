app.controller('doctorCtrl', function($scope, doctorService){
	$scope.register = function(data){
		doctorService.save(data)
	}
})

app.service("doctorService", ['$http', function($http){
	this.save = function(data){
		return $http.post('/doctor', data)
	}
}])