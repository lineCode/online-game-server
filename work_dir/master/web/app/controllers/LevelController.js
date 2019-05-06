'use strict';

WebApp.controller('LevelController', ['$scope', '$rootScope', 'HttpService', function($scope, $rootScope, HttpService) {
  // Uploaded level list
  $scope.levels = null;
  // Upload할 level Name
  $scope.level = null;
  $scope.baseUri = getBaseUri(document.URL);
  // 모든 Levels 얻기
  HttpService.request($scope.baseUri + 'game/list_levels', 'POST', '{}').then(
  	function(res) {
			if (res.succeeded == true)
				$scope.uploaded_levels = res.levels;
  		else
  			toastr.error('올리적재된 지형목록을 현시할수 없습니다.', '실패');
  	});
  HttpService.request($scope.baseUri + 'level/uploaded_list', 'POST', '{}').then(
  	function(res) {
			if (res.succeeded == true)
				$scope.levels = res.level;
  		else
  			toastr.error('등록된 지형목록을 현시할수 없습니다.', '실패');
  	});

  // page load event
  $scope.$on('$viewContentLoaded', function () {
  	$rootScope.$broadcast('set_active', {page: 'levels'});
  });

  $scope.upload_level = function() {
    var  x = {"level":$scope.level.name };
		$scope.requestPara = JSON.stringify(x);
		
  	HttpService.request($scope.baseUri + 'level/upload', 'POST', $scope.requestPara).then(
  		function(res) {
  			if (res.succeeded == true) {
  				toastr.success('성공적으로 올리적재되였습니다.', '성공');
          $scope.levels.push({name: $scope.level.name});
  			} else {
  				toastr.error('실패하였습니다.', '실패');
  			}
  		});
  };
}]);
