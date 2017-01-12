
app.controller("login", function($scope, $http, $cookies, $location, cookie, $cookieStore) {

	$scope.login = {

		user: '',

		pwd: ''
	}

	$scope.reg = {

		user: '',

		pwd: '',
	}

	$scope.doLogin = function() {

		$http({

			url: g.host+'/decoration_supplier/login/login',

			method: 'post',

			data: {
				userName: $scope.login.user,

				pwd: $scope.login.pwd,
			},

	        headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
	        // 处理接口的问题，传给后端的参数有问题，需要重新解析成json字符串
	        transformRequest: function(obj) {    
	            var str = [];    
	            for (var p in obj) {    
	                
	                if (typeof obj[p] == 'object' ) {
	                    // console.log(p, JSON.stringify(obj[p]));
	                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(JSON.stringify(obj[p])))
	                } else {
	                    str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
	                }                     
	            }    
	            // console.log(str)
	            return str.join("&");    

	        }			

		}).success(function(data) {

			// console.log(data);
			if (data.success) {

				var expireDate = new Date().getTime() + data.exp;

				$cookies.put(g.cookieName, data.token, {'expires': new Date(expireDate)});
				
				window.localStorage.loginName = data.loginName

				$location.path("/info");	

			} else {

				alert(data.msg);

				return false;
			}
			
		})

	}

	if (cookie.check()) {

		$location.path("/info");

	} 

})

app.controller("info", function($http, $scope, $window, ngDialog, cookie, $location, $cookies) {

	if (!cookie.check()) {

		$location.path("/login");

	} else {

		// console.log(window.localStorage)
		$scope.cookie = $cookies.get(g.cookieName);

		$scope.$watch('cookie', function(a) {

			// console.log($cookies.get(g.cookieName));			
			$scope.ajaxData();
		})

		// alert($scope.cookie);
		$scope.ajaxData = function() {

			$http({
				url: g.host+'/decoration_supplier/basic/selectSupplierByUserCode',
				
				method: 'post',
				
				data: {

					token: $scope.cookie,

					loginName: window.localStorage.loginName
				},

	            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
	            // 处理接口的问题，传给后端的参数有问题，需要重新解析成json字符串
	            transformRequest: function(obj) {   

	                var str = [];    

	                for (var p in obj) {    
	                    
	                    if (typeof obj[p] == 'object' ) {

	                        // console.log(p, JSON.stringify(obj[p]));
	                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(JSON.stringify(obj[p])))
	                    
	                    } else {

	                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
	                    
	                    }                     
	                }    
	                // console.log(str)
	                return str.join("&");    
	            }			

			}).success(function(data) {
				
				$scope.data = data.data.supplier;

				$scope.contact = {

					name: data.data.supplier.contactName,

					cell: data.data.supplier.contactPhone,

					title: data.data.supplier.contactTitle,

					email: data.data.supplier.contactEmail,

					phone: data.data.supplier.companyPhone,

				}
			})			
		}

	} 

	$scope.resetPwd = function() {

		ngDialog.open({
			id: 'resetPwd',
			scope: $scope,
			closeByEscape: false,
			closeByDocument: false,
			templateUrl: 'templates/resetPwd.html',
			className: 'ngdialog ngdialog-theme-default resetPwd',

			controller: 'resetPwd'
			
		})
	}

	$scope.editInfoSave = function() {

		// console.log($scope.contact);

		$http({

			url: g.host+'/decoration_supplier/basic/updateSupplierBySupplierId',
			
			method: 'post',

			data: {

				supplier : {

					contactName: $scope.contact.name,

					contactPhone: $scope.contact.cell,

					contactTitle: $scope.contact.title,

					contactEmail: $scope.contact.email,

					companyPhone: $scope.contact.phone,

					supplierId: $scope.data.supplierId

				},

				token: $scope.cookie,

			},

            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            // 处理接口的问题，传给后端的参数有问题，需要重新解析成json字符串
            transformRequest: function(obj) {   

                var str = [];    

                for (var p in obj) {    
                    
                    if (typeof obj[p] == 'object' ) {

                        // console.log(p, JSON.stringify(obj[p]));
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(JSON.stringify(obj[p])))
                    
                    } else {

                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
                    
                    }                     
                }    
                // console.log(str)
                return str.join("&");    
            }			
		}).success(function(data) {

			if (data.code == 0) {

				$window.location.reload();

			} else {

				alert(data.msg);

				return false;
			}
			// console.log(data);

		})
	}

})


/**
 * 修改密码窗口 controller
**/

app.controller("resetPwd", function($scope, $http, $location, $cookies) {

	// console.log($scope.data.loginPassword);				
	$scope.resetPwd = {

		oldPwd: '',
		newPwd: '',
		newPwdConf: '',
	}

	$scope.resetPwdSub = function() {

		if ($scope.resetPwd.newPwd !== $scope.resetPwd.newPwdConf && $scope.resetPwd.oldPwd != '') {
			
			alert('新密码输入不一致，请重新输入');
			
			return false;

		} else if ($scope.resetPwd.oldPwd == '') {

			alert('请输入原始密码');

			return false;

		} else if ( $scope.resetPwd.newPwd =='' || $scope.resetPwd.newPwdConf == '') {
			
			alert('请输入新密码');

			return false;

		}

		else {

			var loginName = $scope.data.loginName;

			var supplierId = $scope.data.supplierId;

			$http({

				url: g.host+'/decoration_supplier/basic/updateSupplierPwd',
				
				method: 'post',
				
				data: {
					loginName : loginName, 
					oldPwd : $scope.resetPwd.oldPwd,
					newPwd : $scope.resetPwd.newPwd,
					supplierId: supplierId,
					token: $cookies.get(g.cookieName)

				},
	            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
	            // 处理接口的问题，传给后端的参数有问题，需要重新解析成json字符串
	            transformRequest: function(obj) {    
	                var str = [];    
	                for (var p in obj) {    
	                    
	                    if (typeof obj[p] == 'object' ) {
	                        // console.log(p, JSON.stringify(obj[p]));
	                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(JSON.stringify(obj[p])))
	                    } else {
	                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
	                    }                     
	                }    
	                // console.log(str)
	                return str.join("&");    
	            }
			}).success(function(data) {
				
				if (data.code == 0) {

					alert('修改成功');

					cookie.remove();
					ngDialog.close('resetPwd');

				} else {

					alert(data.msg);

					return false;

				}
			})
		}
	}

})


/*
 * 供货信息
*/
app.controller("providerInfo", function($http, $scope, ngDialog, cookie, $location, $cookies) {

	if (!cookie.check()) {

		$location.path("/login");

	} else {

		$http({
			url: g.host+'/decoration_supplier/basic/selectMaterialBySupplierId',
			
			method: 'post',
			
			data: {
				token: $cookies[g.cookieName],
				decorationTaskCode: '516122800000093',
				serialNumber: '3',
				ordersId: '515febffd0b944908a997d0b164135e6',
				loginName: 'leiman'
			},

            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            // 处理接口的问题，传给后端的参数有问题，需要重新解析成json字符串
            transformRequest: function(obj) {    
                var str = [];    
                for (var p in obj) {    
                    
                    if (typeof obj[p] == 'object' ) {
                        // console.log(p, JSON.stringify(obj[p]));
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(JSON.stringify(obj[p])))
                    } else {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
                    }
                      
                }    
                // console.log(str)
                return str.join("&");    
            }			

		}).success(function(data) {
			// console.log(data);
			$scope.data = data.data.materialList;
		})
	} 

})

/*
 * 供货信息 - 详情
*/
app.controller("goodsDetails", function($http, $scope, ngDialog, cookie, $location, $cookies) {

	if (!cookie.check()) {

		$location.path("/login");

	} else {

		// console.log($location.$$search.id);

		var id = $location.$$search.id;

		$http({
			url: g.host+'/decoration_supplier/basic/selectMaterialDetailBySupplierId',
			
			method: 'post',
			
			data: {
				token: $cookies[g.cookieName],
				decorationTaskCode: '516122800000093',
				serialNumber: '3',
				ordersId: '515febffd0b944908a997d0b164135e6',
				loginName: 'leiman',
				materialConfigurationlId: id
			},

            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            // 处理接口的问题，传给后端的参数有问题，需要重新解析成json字符串
            transformRequest: function(obj) {    
                var str = [];    
                for (var p in obj) {    
                    
                    if (typeof obj[p] == 'object' ) {
                        // console.log(p, JSON.stringify(obj[p]));
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(JSON.stringify(obj[p])))
                    } else {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
                    }
                      
                }    
                // console.log(str)
                return str.join("&");    
            }			

		}).success(function(data) {
			// console.log(data);
			$scope.data = data.data.materialConfiguration;
		})
	} 

})

/*
 * 订单 - 列表
*/
app.controller("orders", function($http, $scope, ngDialog, cookie, $location, $cookies, $cookieStore) {

	if (!cookie.check()) {

		$location.path("/login");

	} else {

		$http({
			url: g.host+'/decoration_supplier/order/selectOrderListBySupplierId',
			
			method: 'post',
			
			data: {
				token: $cookies.get(g.cookieName),
				loginName: window.localStorage.loginName,
			},

            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            // 处理接口的问题，传给后端的参数有问题，需要重新解析成json字符串
            transformRequest: function(obj) {    
                var str = [];    
                for (var p in obj) {    
                    
                    if (typeof obj[p] == 'object' ) {
                        // console.log(p, JSON.stringify(obj[p]));
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(JSON.stringify(obj[p])))
                    } else {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
                    }
                      
                }    
                // console.log(str)
                return str.join("&");    
            }			

		}).success(function(data) {
			// console.log(data);
			$scope.data = data.data.supplierMaterialOrderList;
		})
	} 

})

/*
 * 订单详情
*/
app.controller("orderDetails", function($http, $scope, ngDialog, cookie, $location, $cookies) {

	if (!cookie.check()) {

		$location.path("/login");

	} else {

		var orderNum = $location.$$search.id;

		$http({
			url: g.host+'/decoration_supplier/order/selectOrderDetailBysupplierOrderNumber',
			
			method: 'post',
			
			data: {
				token: '7436bf89-b026-43d4-9298-af45c4c0a58a',
				decorationTaskCode: '516122800000093',
				serialNumber: '3',
				ordersId: '515febffd0b944908a997d0b164135e6',
				loginName: 'leiman',
				supplierOrderNumber: orderNum
			},

            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            // 处理接口的问题，传给后端的参数有问题，需要重新解析成json字符串
            transformRequest: function(obj) {    
                var str = [];    
                for (var p in obj) {    
                    
                    if (typeof obj[p] == 'object' ) {
                        // console.log(p, JSON.stringify(obj[p]));
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(JSON.stringify(obj[p])))
                    } else {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
                    }                     
                }    
                // console.log(str)
                return str.join("&");    
            }			

		}).success(function(data) {
			// console.log(data);
			$scope.billList = data.data.billMaterialList;
			$scope.orderInfo = data.data.supplierMaterialOrder;
		})
	} 

})

/*
 * 退换货列表
*/
app.controller("refund", function($http, $scope, ngDialog, cookie, $location, $cookies) {

	if (!cookie.check()) {

		$location.path("/login");

	} else {

		$http({
			url: g.host+'/decoration_supplier/order/selectExchangeOrdersListBySupplierId',
			
			method: 'post',
			
			data: {
				token: '7436bf89-b026-43d4-9298-af45c4c0a58a',
				// decorationTaskCode: '516122800000093',
				// serialNumber: '3',
				// ordersId: '515febffd0b944908a997d0b164135e6',
				loginName: 'leiman',
			},

            headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
            // 处理接口的问题，传给后端的参数有问题，需要重新解析成json字符串
            transformRequest: function(obj) {    
                var str = [];    
                for (var p in obj) {    
                    
                    if (typeof obj[p] == 'object' ) {
                        // console.log(p, JSON.stringify(obj[p]));
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(JSON.stringify(obj[p])))
                    } else {
                        str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
                    }                      
                }    
                // console.log(str)
                return str.join("&");    
            }			

		}).success(function(data) {
			console.log(data);
			// $scope.data = data.data.supplierMaterialOrderList;
		})
	} 

})