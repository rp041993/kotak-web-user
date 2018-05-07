'use strict';

angular.module('webApp.welcome', ['ngRoute', 'firebase'])

.config(['$routeProvider', function($routeProvider){
	$routeProvider.when('/welcome',{
		templateUrl: 'welcome/welcome.html',
		controller: 'WelcomeCtrl'
	});
}])

.controller('WelcomeCtrl', ['$scope','$http','$filter', 'CommonProp', '$firebaseArray', '$firebaseObject', '$location', function($scope,$http ,$filter, CommonProp, $firebaseArray, $firebaseObject, $location){
	$scope.userId=CommonProp.getUser();
	$scope.ddMMyyyy =CommonProp.getCurrentDate();
	$scope.HHmmss = CommonProp.getCurrentTime();
	$scope.userDetails=CommonProp.getUserDetails($scope.userId);
	
	if(!$scope.userId){
		$location.path('/home');
	}
	$scope.checkIpPunching = function()
	{
		$.getJSON('http://gd.geobytes.com/GetCityDetails?callback=?', function(data) {
			var jsonData=JSON.stringify(data, null, 2);
			var JSONObject = JSON.parse(jsonData);
			
			console.log($scope.ddMMyyyy);
			console.log($scope.userDetails);
			var ip=JSONObject.geobytesremoteip;
			console.log(ip);
			if(ip=="114.143.188.42" || ip=="27.250.13.74" || ip=="114.79.172.18")	
			{
				$http({
					method: 'POST',
					url: 'https://kotak-onboard-api.herokuapp.com/remote_attendence_request?status=dev',
					data: {
						"address" : " ",
						"display_name" : "Headquarter",
						"user_id" : $scope.userId,
						"timestamp" : CommonProp.getTimeStamp(),
						"user_name" : "",
						"status" : "Punch",
						"date" : $scope.ddMMyyyy,
						"time" : $scope.HHmmss,
						"type" : "Normal",
						"accesspoint_id" : "",
						"BSSID":"",
						"SSID":"",
						"applied_on":CommonProp.getTimeStamp()
					},
					headers: {
					  'Content-Type': 'application/json'
					}
				  }).then(function(response) {
					  if(response.data.status=="OK")
					alert(response.data.status);
					else
					alert(response.data.message);
					console.log(JSON.parse());
				  });
			}
			else
			{
				$('#myModal').modal('show'); 
			}
		});
	}
	$scope.shortBreakPunching = function()
	{
		$scope.user.shortBreaKMessage;
		$scope.variable=datenew;
		$scope.selectedtime=selectedtime;
		console.log($scope.selectedtime);
		var formattedDate =   $filter('date')($scope.variable, "dd-MM-yyyy");
		$http({
			method: 'POST',
			url: 'https://kotak-onboard-api.herokuapp.com/remote_attendence_request?status=dev',
			data: {
				"approval_status" : "PENDING",
				"date" : formattedDate,
				"display_name" : "Short Break",
				"latitude" : 0,
				"longitude" : 0,
				"reason_for_short_break" : $scope.user.shortBreaKMessage,
				"status" : "In",
				"time" : $scope.selectedtime,
				"timestamp" :CommonProp.getTimeStamp() ,
				"type" : "ShortBreak",
				"user_id" : $scope.userId

			},
			headers: {
			  'Content-Type': 'application/json'
			}
		  }).then(function(response) {
			$('#ShortBreakModel').modal('hide');
			if(response.data.status=="OK")
			alert(response.data.status);
			else
			alert(response.data.message);
			console.log();
		  });
	}
	$scope.remotePunching = function()
	{
		// var time=$scope.user.time;
		var date=$scope.user.date;
		$scope.selectedtimeremote=selectedtime;
		var formattedDate =   $filter('date')(date, "dd-MM-yyyy");
		$http({
			method: 'POST',
			url: 'https://kotak-onboard-api.herokuapp.com/remote_attendence_request?status=dev',
			data: {
				"address" : $scope.user.address,
				"approval_status" : "PENDING",
				"date" : formattedDate,
				"display_name" : $scope.user.address,
				"latitude" : 19.0469058,
				"longitude" : 72.9069272,
				"status" : "In",
				"time" : $scope.selectedtimeremote,
				"timestamp" :CommonProp.getTimeStamp() ,
				"type" : "Remote",
				"user_id" : $scope.userId
			},
			headers: {
			  'Content-Type': 'application/json'
			}
		  }).then(function(response) {
			$('#myModal').modal('hide');
			if(response.data.status=="OK")
			alert(response.data.status);
			else
			alert(response.data.message);
			console.log(response.data.status);
		  });
	}
	
	$scope.logout = function(){
		CommonProp.logoutUser();
		firebase.auth().signOut().then(function() {
			console.log("Sign-out successful")
		  }).catch(function(error) {
			alert("error occured");
		  });
	}
}])