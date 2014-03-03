'use strict';

angular.module('recruiternsApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ui.router',
  'firebase'
  ])
.config(['$stateProvider', '$urlRouterProvider', '$locationProvider', '$httpProvider', function ($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

    $stateProvider
        .state('public', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                role: 'public'
            }
        })
        .state('public.404', {
            url: '/404',
            templateUrl: 'views/notFound.html'
        });

    // Anonymous routes
    $stateProvider
        .state('anonymous', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                role: 'anonymous'
            }
        })
        .state('anonymous.index', {
            url: '/',
            templateUrl: 'views/main.html'
        })
        .state('anonymous.login', {
            url: '/login/',
            templateUrl: 'views/login.html',
            controller: 'LoginController'
        });

    // Regular user routes
    $stateProvider
        .state('user', {
            abstract: true,
            template: "<ui-view/>",
            data: {
                role: 'user'
            }
        })
        .state('user.dashboard', {
            url: '/dashboard/',
            templateUrl: 'views/dashboard.html'
        })
        .state('user.candidates', {
            url: '/candidates/',
            templateUrl: 'views/candidates/list.html',
            controller: 'CandidatesController'
        })
        .state('user.candidates-new', {
            url: '/new-candidate/',
            templateUrl: 'views/candidates/new.html',
            controller: 'NewCandidateController'
        });

    $urlRouterProvider.otherwise('/404');

    // FIX for trailing slashes. Gracefully "borrowed" from https://github.com/angular-ui/ui-router/issues/50
    $urlRouterProvider.rule(function($injector, $location) {
        if($location.protocol() === 'file')
            return;

        var path = $location.path()
        // Note: misnomer. This returns a query object, not a search string
            , search = $location.search()
            , params
            ;

        // check to see if the path already ends in '/'
        if (path[path.length - 1] === '/') {
            return;
        }

        // If there was no search string / query params, return with a `/`
        if (Object.keys(search).length === 0) {
            return path + '/';
        }

        // Otherwise build the search string and return a `/?` prefix
        params = [];
        angular.forEach(search, function(v, k){
            params.push(k + '=' + v);
        });
        return path + '/?' + params.join('&');
    });

    $locationProvider.html5Mode(false);

    $httpProvider.interceptors.push(function($q, $location) {
        return {
            'responseError': function(response) {
                if(response.status === 401 || response.status === 403) {
                    $location.path('/login');
                    return $q.reject(response);
                }
                else {
                    return $q.reject(response);
                }
            }
        }
    });

}])

.run(['$rootScope', '$state', '$firebaseSimpleLogin', function ($rootScope, $state, $firebaseSimpleLogin) {

    var dataRef = new Firebase("https://recruiterns.firebaseio.com");
    var Auth = $firebaseSimpleLogin(dataRef);
    $rootScope.$on("$stateChangeStart", function (event, toState, toParams, fromState, fromParams) {
            
            if(toState.data.role === 'public' || toState.data.role === 'anonymous')
                return;

            if(toState.data.role === 'user')
            {
                Auth.$getCurrentUser().then(
                function (user) {
                  if(user === null)
                  {
                    $rootScope.error = null;
                    $state.go('anonymous.login');
                  }
                },
                function () {
                  console.log('No Auth');
                  $rootScope.error = null;
                  $state.go('anonymous.login');
                });
            }

            if(fromState.url === '^') {
              Auth.$getCurrentUser().then(
                function (user) {
                  if(user === null)
                  {
                    $rootScope.error = null;
                    $state.go('anonymous.login');
                  }
                },
                function () {
                  console.log('No Auth');
                  $rootScope.error = null;
                  $state.go('anonymous.login');
                });
            }
        //}
    }
    );

}]);
