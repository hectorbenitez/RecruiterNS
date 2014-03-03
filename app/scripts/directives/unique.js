'use strict';

angular.module('recruiternsApp')
  .directive('rnsUnique', function ($firebase) {
    return {
    	require: 'ngModel',
    	restrict: 'A',
    	link: function(scope, element, attrs, ctrl) {
    		element.on('blur', function() {

    			new Firebase("https://recruiterns.firebaseio.com/candidates")
	    		.startAt(element.val())
	    		.endAt(element.val())
			    .once('value', function(snap) {		
			    	if(snap.val() == undefined)
			    	{
						ctrl.$setValidity('unique', true);
			    	}   
			    	else
			    	{
			    		ctrl.$setValidity('unique', false);
			    	} 	
			        console.log('accounts matching email address', snap.val())
			    });
			    scope.$apply();
    		});
  			
    		
    	}
    };
  });
