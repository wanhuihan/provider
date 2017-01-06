
app.service("cookie", function($cookies, $cookieStore) {

	var service = {};

	service.setCookie = function(value, expires) {

		var exp = new Date(new Date().getTime() + expires);
		
		document.cookie = g.cookieName + "=" + value + ";expires=" + exp.toGMTString();

	}

	//  c is cookie value
	service.getCookie = function(c) {

		// console.log($cookieStore)
		if ($cookieStore.get(g.cookieName) == undefined) {
			return false;
		}

		else {
			return true;
		}
	}

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