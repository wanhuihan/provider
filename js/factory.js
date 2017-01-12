
// 

// app.factory('fs', function() {

// 	var factory = {};

// 	factory.setCookie = function($rootScope) {

// 		console.log($rootScope);
// 	}

// 	return factory;

// })

app.service('fs', function($cookies) {
	return {
		setCookie: function() {
			return $cookies;
		}
	}
})


// app.directive('a', function($scope) {

// 	return {
// 		a: function() {
// 			console.log(123)
// 		}
// 	}

// })