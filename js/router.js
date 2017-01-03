

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
            },
            'header': {
                templateUrl: 'templates/header.html',
            }
        },
    })

    // 主面板
    $stateProvider.state('dashboard', {
        url: '/dashboard',
        resolve: {

        },
        views: {
            'header': {
                templateUrl: 'templates/header.html',
                controller: 'header'
            },

            'mainBody': {
                templateUrl:'templates/dashboard.html', 
                // templateUrl: 'templates/main_body.html',
                // controller: 'navigation'
                controller: 'dashboard'
                },
        },
    })

})