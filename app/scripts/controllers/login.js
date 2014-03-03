'use strict';

angular.module('recruiternsApp')
.controller('LoginController', function ($scope, $rootScope, $state, $firebaseSimpleLogin) {
	var dataRef = new Firebase("https://recruiterns.firebaseio.com");
	var loginService = $firebaseSimpleLogin(dataRef);

	$scope.login = function () {
		loginService.$login('password', {
			email: $scope.username,
			password: $scope.password
		}).then(function(user) {
			console.log('Logged in as: ', user.uid);
			$state.go('user.dashboard');
			$rootScope.$emit('loginEvent');
		}, function(error) {
			console.error('Login failed: ', error);
		});
	};

});
