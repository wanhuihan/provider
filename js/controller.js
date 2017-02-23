
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
 * 供货信息 - 详情
*/
app.controller("goodsDetails", function($http, $scope, ngDialog, cookie, $location, $cookies) {

	if (!cookie.check()) {

		$location.path("/login");

	} else {

		var id = $scope.id;

		$http({
			url: g.host+'/decoration_supplier/basic/selectMaterialDetailBySupplierId',
			
			method: 'post',
			
			data: {
				token: $cookies[g.cookieName],
				loginName: window.localStorage.loginName,
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
			$scope.data = data.data.materialList;
		})
	} 

	$scope.viewSupplyInfo = function(id) {

		// console.log(id);
		$scope.id = id;
		// return false;

		ngDialog.open({

			id: '',
			scope: $scope,
			closeByEscape: false,
			closeByDocument: false,
			templateUrl: 'templates/viewSupplyInfo.html',
			className: 'ngdialog ngdialog-theme-default provider-details',
			width:'600px',
			controller: 'goodsDetails'
			
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

			for (var i in $scope.data) {

				if ($scope.data[i].status == 0) {

					$scope.data[i].status = '未完成';

				} else {

					$scope.data[i].status = '已完成';
					
				}
			}
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

		$scope.orderNum = $location.$$search.id;

		$scope.decorationTaskCode = $location.$$search.code;

		// 获取订单信息，包括订单信息和订单列表
		$http({

			url: g.host+'/decoration_supplier/order/selectOrderDetailBysupplierOrderNumber',
			
			method: 'post',
			
			data: {

				token: $cookies.get(g.cookieName),

				loginName: window.localStorage.loginName,

				supplierOrderNumber: $scope.orderNum

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
			$scope.billList = data.data.supplierMaterialsMiddleList;
			// console.log($scope.billLis)
			$scope.billListTotal = data.data.sumTotal;

			$scope.orderInfo = data.data.supplierMaterialOrder;


				if ($scope.orderInfo.status == 0 ) {

					$scope.orderInfo.status = "未完成";

				} else {
					
					$scope.orderInfo.status = "已完成";
				}

		})


		$scope.$watch("orderInfo", function(data) {
			
			if (data) {
				// 获取订单详情
				// $http({
				// 	url: g.host+'/decoration_supplier/order/viewSupplierMaterialOrder',

				// 	method: 'post',

				// 	data: {

				// 		supplierId: data.supplierId,

				// 		supplierMaterialOrderId: data.supplierMaterialOrderId

				// 	},

		  //           headers: { 'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8' },
		  //           // 处理接口的问题，传给后端的参数有问题，需要重新解析成json字符串
		  //           transformRequest: function(obj) {    
		  //               var str = [];    
		  //               for (var p in obj) {    
		                    
		  //                   if (typeof obj[p] == 'object' ) {
		  //                       // console.log(p, JSON.stringify(obj[p]));
		  //                       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(JSON.stringify(obj[p])))
		  //                   } else {
		  //                       str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));  
		  //                   }                     
		  //               }    
		  //               // console.log(str)
		  //               return str.join("&");    
		  //           }	
		            				
				// }).success(function(data) {
				// 	// console.log(data)
				// })

				$http({

					url: g.host+'/decoration_supplier/order/querySendMaterialList',
					
					method: 'post',
					
					data: {

						token: $cookies.get(g.cookieName),

						decorationTaskCode: $scope.decorationTaskCode,

						supplierOrderNumber: $scope.orderNum

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
					if (data.code == 0) {

						$scope.deliveryList = data.data.waybillCodeList;

						console.log($scope.deliveryList);
					}
					
				})


			}
		})

	} 

	$scope.checkboxSelect = function(e) {

		var checkbox = jQuery(e.target).parents(".table").find(".items input[type='checkbox']");
		if (e.target.checked) {

			checkbox.prop("checked", 'checked');
		
		} else {
			// console.log(checkbox);
			checkbox.prop("checked", false);
			// jQuery(e.target).parents(".table").find(".items input[type='checkbox']")
		}
	}

	$scope.delivery = function(e) {


		var checkbox = jQuery(e.target).parents(".table").find(".items input[type='checkbox']:checked");

		$scope.ids = [];

		if (checkbox.length > 0) {

			for (var i = 0; i < checkbox.length; i++) {
				// console.log(jQuery(checkbox[i]).val());
				$scope.ids.push(jQuery(checkbox[i]).val());

			}		

		}

		if ($scope.ids.length > 0) {

			ngDialog.open({
				id: 'delivery',
				templateUrl: 'templates/deliverySend.html',
				scope: $scope,
				controller: 'delivery'
			})

		} else {

			alert('未选择商品');

			return false;

		}

		return false;
	}

	$scope.print = function() {

		window.print();

	}
})

/*
 * 发货 controller
*/

app.controller("delivery", function($http, $window, $location, $cookies, $scope, ngDialog) {

	$scope.waybillCode = '';

	$scope.logisticsCompany = '';

	$scope.send = function() {

		$http({
			url: g.host+'/decoration_supplier/order/sendMaterial',
			
			method: 'post',
			
			data: {

				token: $cookies.get(g.cookieName),

				loginName: window.localStorage.loginName,

				ids: $scope.ids.join(","),

				supplierOrderNumber: $scope.orderNum,

				decorationTaskCode: $scope.decorationTaskCode,

				waybillCode: $scope.waybillCode,

				logisticsCompany: $scope.logisticsCompany

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
			if (data.code == 0) {

				ngDialog.close("delivery");

				$window.location.reload();

			}
		})		
	}

	$scope.cancel = function() {

		ngDialog.close("delivery");

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
			
			$scope.data = data.data.materialExchangeList;

			// console.log($scope.data)
		})
	} 

})

// 退换货详情

app.controller("refundDetails", function($scope,$http, cookie, $cookies, $location) {

	if (!cookie.check()) {

		$location.path("/login");

	} else {

		// console.log($location)
		$http({

			url: g.host+'/decoration_supplier/order/selectExOrdersDetailListBySupplierId',
			
			method: 'post',
			
			data: {
				materialExchangeId: $location.$$search.id
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
			$scope.data = data.data;

		})

		$scope.doDevliery = function() {

			$http({
				url: g.host+'/decoration_supplier//order/sendMaterialChange',
				method: 'post',
				data: {
					materialExchangeId: $scope.data.materialMap.materialExchangeId,
					supplierOrderNumber: $scope.data.tuihuoMap.supplierOrderNumber,
					loginName: window.localStorage.loginName,
					waybillCode:  $scope.data.processMap.waybillCode, 
					decorationTaskCode: $location.$$search.code, 
					logisticsCompany: $scope.data.processMap.logisticsCompany

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

			})

		}
	}
})


app.controller("header", function($scope, $location, cookie, $cookies) {

	// logout function bind on label with class .logOut

	$scope.logOut = function() {

		$cookies.remove(g.cookieName);

		$location.path("/login");	

	}

})