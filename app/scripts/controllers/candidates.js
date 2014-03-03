'use strict';

angular.module('recruiternsApp')
  .controller('CandidatesController', function ($scope, $firebase) {
    var dataRef = new Firebase("https://recruiterns.firebaseio.com/candidates");
  	$scope.candidates = $firebase(dataRef);
  })
  .controller('NewCandidateController', function ($scope, $firebase) {
  	var dataRef = new Firebase("https://recruiterns.firebaseio.com/candidates");
  	$scope.candidates = $firebase(dataRef);
    $scope.submitted = false;
  	
    $scope.save = function () {
      $scope.submitted = true;
      if($scope.loginForm.$invalid)
      {
        return;
      }

      $scope.newCandidate.$priority = $scope.newCandidate.email;

  		$scope.candidates.$add($scope.newCandidate);
  		$scope.newCandidate.firstName = '';
  		$scope.newCandidate.lastName = '';
  		$scope.newCandidate.email = '';
  	};
    
  });