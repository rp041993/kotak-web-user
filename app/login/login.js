'use strict';

angular.module('webApp.login', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/login', {
		templateUrl: 'login/login.html',
		controller: 'LoginCtrl'
	});
}])

.controller('LoginCtrl', ['$scope','$http', '$firebaseAuth', '$location', 'CommonProp', function($scope, $http, $firebaseAuth, $location, CommonProp){

	$scope.username = CommonProp.getUser();

	if($scope.username){
		$location.path('/welcome');
	}
	$scope.sendOtp=function()
	{
		var username = $scope.user.email;
		
		$http.get("https://kotak-onboard-api.herokuapp.com/otp_generation?email="+username+"&status=dev")
			.success(function (data) {
				const myObjStr = JSON.stringify(data);
				var response=JSON.parse(myObjStr);
				if(response.status=="OK")
				{
					$scope.errMsg = false;
					$scope.errorMessage = "";
				}
				else
				{
					$scope.errMsg = true;
					$scope.errorMessage = response.message;
				}
		});
		
		
	}
	$scope.signIn = function(){
			var username = $scope.user.email;
			var otp = $scope.user.password;
			$http.get("https://kotak-onboard-api.herokuapp.com/otp_validation?email="+username+"&otp="+otp+"&status=dev")
			.success(function (data) {
				const myObjStr = JSON.stringify(data);
				var response=JSON.parse(myObjStr);
				console.log(response);
				if(response.status=="OK")
				{
					$scope.errMsg = false;
					$scope.errorMessage = "";
					firebase.auth().signInWithCustomToken(response.token).then(function(){
								CommonProp.setUser(response.onboard_id);
								$location.path('/welcome');
							})
						.catch(function(error) {
						var errorCode = error.code;
						var errorMessage = error.message;
					  });

				}
				else
				{
					$scope.errMsg = true;
					$scope.errorMessage = response.message;
				}
		});
	}
}])

.service('CommonProp', ['$location', '$firebaseAuth', function($location, $firebaseAuth){
	var user = "";
	var auth = $firebaseAuth();

	return {
		getUser: function(){
			if(user == ""){
				user = localStorage.getItem("userId");
			}
			return user;
		},
		setUser: function(value){
			localStorage.setItem("userId", value);
			user = value;
		},
		logoutUser: function(){
			auth.$signOut();
			console.log("Logged Out Succesfully");
			user = "";
			localStorage.removeItem('userId');
			$location.path('/login');
		},
		getTimeStamp: function(){
			var today = new Date();
			 return today.getTime();
		},
		getUserDetails: function(userId)
		{
			var userDetails;
			firebase.database().ref().child("development").child("users").child(userId).once('value',function(user)
				{
				userDetails=user.val();
				})
			return userDetails;
		},
		getCurrentDate: function()
		{
			var today = new Date();
			var dd = today.getDate();
			var mm = today.getMonth()+1; //January is 0!
			
			var yyyy = today.getFullYear();
			if(dd<10){
				dd='0'+dd;
			} 
			if(mm<10){
				mm='0'+mm;
			} 
			var today = dd+'/'+mm+'/'+yyyy;
			return today;
		},
		getCurrentTime: function()
		{
			var d = new Date();
			var curr_hour = d.getHours();
			var curr_min = d.getMinutes();

			var curr_sec = d.getSeconds();

			return curr_hour + ":" + curr_min + ":" + curr_sec;
		}
	};
}]);