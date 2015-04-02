app.controller('patientDetailsCtrl', function($scope, $location, $rootScope, patientService, doctorService){
	$scope.patient = {}

    $scope.patient._id = patientService.getPatientDetails()._id
    $scope.patient.firstname = patientService.getPatientDetails().firstname
    $scope.patient.lastname = patientService.getPatientDetails().lastname
    $scope.patient.age = patientService.getPatientDetails().age
    $scope.patient.familyDoctor = patientService.getPatientDetails().familyDoctor
    $scope.patient.createdAt = patientService.getPatientDetails().createdAt
    $scope.patient.lastModified = patientService.getPatientDetails().lastModified

    $scope.patientVisits = {}

    $scope.patientVisits.complaint = patientService.getVisits().complaint
    $scope.patientVisits.billingAmount = patientService.getVisits().billingAmount


    doctorService.getDoctors().success(function(data){
		$scope.doctorModel = data
	})

    $scope.register = function(data, visits){
        var object ={
            data: data,
            visits : visits
        }
		patientService.save(object).error(function(data, error){
		})
		$scope.clearForm()
		$location.path('/patientlist')
	}

	$scope.clearForm = function(){
		$scope.patient = {}
	}

    $scope.visit = function(data){
        $location.path('/visit')
    }

    patientService.getVisits($scope.patient._id).success(function(data){
        $scope.patientVisits = data[0].visits
    })

})

app.controller('patientVisitCtrl', function($scope, $location, patientService){
    

    $scope.registerVisit = function(data){
        patientService.visit(data, patientService.getPatientDetails()._id).error(function(data, error){
        })
        //console.log(data)
        $location.path('/patientlist')
    }

    

})

app.controller('patientListCtrl', function($scope, $route,$rootScope, $location, patientService){
	$scope.sortType     = 'name';
	$scope.sortReverse  = false;  // set the default sort order
  	$scope.searchValue   = '';
	$scope.currentPage = 0;
    $scope.pageSize = 5;
    $scope.patientList = [];
    $scope.search = []

    $rootScope.edit = false

    $scope.enable = function(){
        $rootScope.edit = true
    }

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

    this.visit = function(data, patient){
        console.log('patient id' +  patient)

        var object = {
            complaint : data.complaint,
            billingAmount: data.billingAmount,
            patientID : patient
        }
        return $http.post('/visit', object)
    }

    this.getVisits = function(patient){
        return $http.get('/visits/'+patient)
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
        if(input){
            start += start; //parse to int
            return input.slice(start);
        }
    }
});