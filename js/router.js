

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
            },
            'main': {
                templateUrl: 'templates/order.html',
            }   
        }

    });

    $stateProvider.state('orders.details', {
        url: '/details',       
        views: {
            
            'header': {
                templateUrl: 'templates/header.html',
            },            
            'left': {
                templateUrl: 'templates/sideBar.html',
            },
            'main@': {
                templateUrl: 'templates/orderDetails.html',
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

    // $stateProvider.state('info', {
    //     url: '/info',       
    //     views: {
            
    //         'header': {
    //             templateUrl: 'templates/header.html',
    //         },            
    //         'left': {
    //             templateUrl: 'templates/sideBar.html',
    //         },
    //         'main': {
    //             templateUrl: 'templates/generalInfo.html',
    //         }   
    //     }
    // });

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