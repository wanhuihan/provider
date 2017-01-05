
app.controller("login", function($scope, $http, $cookies, $location, cookie) {

	if (cookie.chkCookie()) {
		window.location.href="http://www.baidu.com";
	}

	$scope.login = {
		user: '',
		pwd: ''
	}

	$scope.reg = {
		user: '',
		pwd: '',
	}

	$scope.doLogin = function() {

		// console.log($scope.login);
		cookie.setCookie('123456', 500000);

		$
	}

	// alert(456)
})