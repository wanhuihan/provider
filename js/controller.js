
app.controller("login", function($scope, $http, $cookies, $location, cookie) {

	$scope.login = {
		user: '',
		pwd: ''
	}

	$scope.reg = {
		user: '',
		pwd: '',
	}

	$http.post('http://192.168.0.6/decoration_app_api/inspectionLotImg/startCheck?token=7436bf89-b026-43d4-9298-af45c4c0a58a&decorationTaskCode=516122800000093&serialNumber=3&ordersId=515febffd0b944908a997d0b164135e6').success(function(data) {

	})

	$scope.doLogin = function() {

		// console.log($scope.login);
		cookie.setCookie('123456', 500000);

		$location.path("/info");

		// console.log($cookies);
	}

	if (cookie.chkCookie()) {

		$location.path("/info");

	} 
	// else {
		
	// 	$location.path("/login");
	// }
})

app.controller("info", function($scope, ngDialog, cookie, $location, $cookies) {


	if (!cookie.chkCookie()) {

		$location.path("/login");

	} 

	$scope.resetPwd = function() {

		ngDialog.open({

			scope: $scope,
			closeByEscape: false,
			closeByDocument: false,
			templateUrl: 'templates/resetPwd.html',
			className: 'ngdialog ngdialog-theme-default resetPwd',
			controller: '',
			
		})
	}
})