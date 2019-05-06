'use strict';
WebApp.controller('JobController', ['$scope', '$rootScope', 'HttpService', function($scope, $rootScope, http) {
  $scope.jobs = [];

  $scope.baseUri = getBaseUri(document.URL);

  http.request($scope.baseUri + 'job/list', 'POST', '{}').then(function(res) {
  	$scope.jobs = res.jobs;
  });

  $scope.$on('$viewContentLoaded', function () {
	$rootScope.$broadcast('set_active', {page: 'jobs'});
  });

  // Get the job detail information
  $scope.view_detail = function(jobid) {
  	http.request($scope.baseUri + 'job/info', 'POST', '{"id":' + jobid + '}')
  		.then(function(res){
  			if (res.succeeded == true) {
  				$scope.selected_job = res;
  				$('#view_modal').modal('show');
  			} else {
  				toastr.error("실패하였습니다.", '실패');
  			}
  		});
  };

  // Cancel the job
  $scope.cancel_job = function(jobid, $index) {
  	http.request($scope.baseUri + 'job/cancel', 'POST', '{"id":' + jobid + '}').then(
  		function(res) {
  			if (res.succeeded == true) {
          $scope.jobs.splice($index, 1);
  				toastr.success('성공적으로 취소하였습니다.\n'+'ID = ' + res.id, '성공');
  			} else {
  				toastr.error('실패하였습니다.', '실패');
  			}
  		});
  };
}]);