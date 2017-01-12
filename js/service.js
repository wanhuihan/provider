
app.service("cookie", function($cookies) {

	var service = {};

	service.setCookie = function(value, expires) {

		var exp = new Date(new Date().getTime() + expires);
		
		document.cookie = g.cookieName + "=" + value + ";expires=" + exp.toGMTString();

	}

	//  c is cookie value
	// service.getCookie = function() {

	// 	return $cookies[g.cookieName];
	// }

	// 
	service.chkCookie =function() {

		// console.log(document.cookie);
		var cookieVal = document.cookie;
		if (cookieVal.indexOf(g.cookieName) >= 0) {
			return true;
		} else {
			return false;
		}
	}

	return service;

})