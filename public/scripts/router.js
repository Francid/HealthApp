app.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
        when('/login', {
            templateUrl: 'login.html',
            controller: 'loginCtrl'
        }).
        when('/home', {
            templateUrl: 'home.html'
        }).
        when('/register', {
            templateUrl: 'register.html',
            controller: 'doctorCtrl'
        }).
        when('/patientdetails', {
            templateUrl: 'patientdetails.html',
            controller: 'patientDetailsCtrl'
        }).
        when('/patientlist', {
            templateUrl: 'patientlist.html',
            controller: 'patientListCtrl'
        }).
        when('/search', {
            templateUrl: 'search.html',
            controller: 'patientListCtrl'
        }).
        otherwise({
            redirectTo: '/home'
        });
    }]);