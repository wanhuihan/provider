

app.config(function($stateProvider, $urlRouterProvider) {

    $urlRouterProvider.when("", "login")

    // 登录界面
    $stateProvider.state('/', {
        url: '/login',
        resolve: {

        },

        views: {
            'main': {
                templateUrl: 'templates/login.html',
                controller: 'login'
            },
            'header': {
                // templateUrl: 'templates/header.html',
            }
        },
    })

    $stateProvider.state('orders', {

        url: '/orders',      
         
        views: {
            
            'header': {
                templateUrl: 'templates/header.html',
            },            
            'left': {
                templateUrl: 'templates/sideBar.html',
                controller: function($scope) {
                    $scope.page = 'orders'
                }
            },
            'main': {
                templateUrl: 'templates/order.html',
                controller: 'orders'
            }   
        }

    });

    $stateProvider.state('orders.details', {
        url: '/details?id&code',       
        views: {
            
            'header': {
                templateUrl: 'templates/header.html',
            },            
            'left': {
                templateUrl: 'templates/sideBar.html',
            },
            'main@': {
                templateUrl: 'templates/orderDetails.html',
                controller: 'orderDetails'
            }   
        }
    });

    $stateProvider.state('orders.refund', {
        url: '/refund',       
        views: {
            
            'header': {
                templateUrl: 'templates/header.html',
            },            
            'left': {
                templateUrl: 'templates/sideBar.html',
            },
            'main@': {
                templateUrl: 'templates/orderRefund.html',
                controller: 'refund'
            }   
        }
    });

    $stateProvider.state('orders.refund.details', {
        url: '/details',       
        views: {
            
            'header': {
                templateUrl: 'templates/header.html',
            },            
            'left': {
                templateUrl: 'templates/sideBar.html',
            },
            'main@': {
                templateUrl: 'templates/orderRefundDetails.html',
            }   
        }
    });

    $stateProvider.state('info', {
        url: '/info',       
        views: {
          
            'header': {
                templateUrl: 'templates/header.html',
            },            
            'left': {
                templateUrl: 'templates/sideBar.html',
                controller: function($scope) {
                    $scope.page = 'info';
                }
            },
            'main': {
                templateUrl: 'templates/generalInfo.html',
                controller: 'info'
            }   
        }
    });

     $stateProvider.state('info.generalInfo', {
        url: '/generalInfo',       
        views: {
            
            'header': {
                templateUrl: 'templates/header.html',
            },            
            'left': {
                templateUrl: 'templates/sideBar.html',
            },
            'main@': {
                templateUrl: 'templates/generalInfo.html',
            }   
        }
    });

     $stateProvider.state('info.providerInfo', {
        url: '/providerInfo',       
        views: {
            
            'header': {
                templateUrl: 'templates/header.html',
            },            
            'left': {
                templateUrl: 'templates/sideBar.html',
            },
            'main@': {
                templateUrl: 'templates/providerInfo.html',
                controller: 'providerInfo'
            }   
        }
    });

     $stateProvider.state('info.providerInfo.goodsDetails', {
        url: '/goodsDetails?id',       
        views: {
            
            'header': {
                templateUrl: 'templates/header.html',
            },            
            'left': {
                templateUrl: 'templates/sideBar.html',
            },
            'main@': {
                templateUrl: 'templates/goodsDetails.html',
                controller: 'goodsDetails'
            }   
        }
    });
    

    // $stateProvider.state('orders.', {

    // });

    // // 主面板
    // $stateProvider.state('dashboard', {
    //     url: '/dashboard',
    //     resolve: {

    //     },
    //     views: {
    //         'header': {
    //             templateUrl: 'templates/header.html',
    //             controller: 'header'
    //         },

    //         'mainBody': {
    //             templateUrl:'templates/dashboard.html', 
    //             // templateUrl: 'templates/main_body.html',
    //             // controller: 'navigation'
    //             controller: 'dashboard'
    //         },
    //     },
    // })

})