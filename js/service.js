
app.service("cookie", function($cookies, $location) {

	var service = {};

	service.set = function(value, expires) {

		var exp = new Date(new Date().getTime() + expires);
		
		document.cookie = g.cookieName + "=" + value + ";expires=" + exp.toGMTString();

	}

	service.check =function() {
		// console.log(document.cookie);
		var cookieVal = document.cookie;
		if (cookieVal.indexOf(g.cookieName) >= 0) {
			return true;
		} else {
			return false;
		}
	}

	service.remove = function() {

		$cookies.remove(g.cookieName);

		window.localStorage.clear();

		$location.path("/login");

	}

	return service;

})