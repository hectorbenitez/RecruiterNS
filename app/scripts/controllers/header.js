'use strict';

angular.module('recruiternsApp')
.controller('HeaderController', function ($scope, $rootScope, $state, $firebaseSimpleLogin) {
	var dataRef = new Firebase("https://recruiterns.firebaseio.com");
	var loginService = $firebaseSimpleLogin(dataRef);
	var currentUser;

	$scope.logged = false;
	$scope.items = [{
		name: 'Login',
		state: 'anonymous.login'
	}];

	var updateMenu = function () {
		loginService.$getCurrentUser().then(
	    function (user) {
	    	currentUser = user;
		    if(user !== null)
		    {
		    	$scope.logged = true;
		    	$scope.items = [
					{
						name: 'Dashboard',
						state: 'user.dashboard'
					}
				];
		    }
		    else 
		    {
		    	$scope.logged = false;
		    	$scope.items = [{
					name: 'Login',
					state: 'anonymous.login'
				}];
		    }
	    });
	};

    $rootScope.$on('loginEvent', function() {
    	updateMenu();
    });

    $scope.logout = function() {
    	loginService.$logout();
    	$state.go('anonymous.index');
    	updateMenu();
    };

    updateMenu();

});