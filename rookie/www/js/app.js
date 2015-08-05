// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', [
    'ionic',
    'ionic.service.core',
    'ngCordova',
    'ion-fab-button',
    'ionic.service.push',
    'starter.controllers',
    'starter.controllers'
])
.config(['$ionicAppProvider', function($ionicAppProvider) {
    // Identify app
    $ionicAppProvider.identify({
        // The App ID (from apps.ionic.io) for the server
        app_id: '2c5dbbdc',
        // The public API key all services will use for this app
        api_key: 'be81c1489526a9a70a2c654925e48b9ef68e1c9ef4d93b1b',
        // Set the app to use development pushes

    });
}])
.config(['$ionicConfigProvider', function( $ionicConfigProvider) {
     $ionicConfigProvider.navBar.alignTitle('center');
}])


.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
        if (window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
            cordova.plugins.Keyboard.disableScroll(true);

        }
        if (window.StatusBar) {
            // org.apache.cordova.statusbar required
            StatusBar.styleDefault();
        }
    });
})

.config(function($stateProvider, $urlRouterProvider) {
    $stateProvider

    .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'MenuCtrl'
    })

    .state('app.setting', {
        url: '/setting',
        views: {
            'menuContent': {
                templateUrl: 'templates/menu/setting.html',
                controller: 'loginCtrl'
            }
        }
    })

    .state('app.login', {
        url: '/login',
        views: {
            'menuContent': {
                templateUrl: 'templates/menu/login.html',
                controller: 'loginCtrl'
            }
        }
    })

    .state('app.adsQuery', {
        url: '/adsQuery',
        views: {
            'menuContent': {
                templateUrl: 'templates/menu/adsQuery.html',
                controller: 'adsQueryCtrl'
            }
        }
    })

    .state('app.terms', {
        url: '/terms',
        views: {
            'menuContent': {
                templateUrl: 'templates/menu/terms.html'
            }
        }
    })


    .state('app.main', {
        url: '/main',
        views: {
            'menuContent': {
                templateUrl: 'templates/main.html',
                controller: 'MainCtrl'
            }
        }
    })

    .state('app.sports', {
        url: '/main/:sports',
        views: {
            'menuContent': {
                templateUrl: 'templates/sports/sports.html',
                controller: 'SportsCtrl'
            }
        }
    })

    .state('app.details', {
        url: '/main/:sports/:category/:details',
        views: {
            'menuContent': {
                templateUrl: 'templates/sports/details.html',
                controller: 'DetailCtrl'
            }
        }
    })




    .state('app.single', {
        url: '/playlists/:playlistId',
        views: {
            'detailContent': {
                templateUrl: 'templates/playlist.html',
                controller: 'PlaylistCtrl'
            }
        }
    });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/main');
});
