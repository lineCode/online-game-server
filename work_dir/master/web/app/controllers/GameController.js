function stylizer( str )
{
  var val = ""+str+"";
  if (val.length < 2)
  {
    val = "0" + str;
  }
  else
  {
    val = str;  
  }
  
  return val;
}

'use strict';

WebApp.controller('GameController', ['$scope', '$rootScope', 'HttpService', function($scope, $rootScope, HttpService) {
  // Game level list
  $scope.levels = {};
  // 진행중의 Game list
  $scope.playings = {};

  // game console
  $scope.console = null;

  $scope.new_game = null;

  $scope.requestPara = null;
  $scope.formatStartDate = null;
  $scope.formatStartTime = null;
  $scope.formatEndDate = null;
  $scope.formatEndTime = null;
  var dt = new Date();

  $scope.curDate = dt.getFullYear() + "-" + stylizer(dt.getMonth()+1) + "-" + stylizer(dt.getDate());
  $scope.curTime = stylizer(dt.getHours()) + ":" + stylizer(dt.getMinutes());
  $scope.baseUri = getBaseUri(document.URL);

  // 모든 게임 얻기
  HttpService.request($scope.baseUri + 'level/uploaded_list', 'POST', '{}').then(
  	function(res) {
  		if (res.succeeded == true)
  			$scope.levels = res.level;
  		else
  			toastr.error('경기목록을 가져올수 없습니다.', '실패');
  	});

  // 진행중의 게임 얻기
  HttpService.request($scope.baseUri + 'game/list', 'POST', '{}').then(
  	function(res) {
  		if (res.succeeded == true) 
  			$scope.playings = res.games;
  		else
  			toastr.error('진행중의 경기들을 얻을수 없습니다.', '실패');
  	});

  // page load event
  $scope.$on('$viewContentLoaded', function () {
  	$rootScope.$broadcast('set_active', {page: 'games'});
  });

  // View console output
  $scope.view_console = function(gid) {
    //'{"id":' + gid + '}'
  	HttpService.request($scope.baseUri + 'game/console', 'POST', '{"id":' + gid + '}').then(
  		function(res) {
  			if (res.succeeded == true ) {
  				$scope.console = res;

          $('#console_modal').modal('show');
  			} else {
  				toastr.error('경기기록을 가져올수 없습니다.', '실패');
  			}
  		});
  };

  // terminate game
  $scope.terminate = function(gid, $index) {
    HttpService.request($scope.baseUri + 'game/terminate', 'POST', '{"id":' + gid + '}').then(
      function(res) {
        if (res.succeeded == true) {
          $scope.playings.splice($index, 1);
          toastr.success('경기를 성공적으로 완료하였습니다.', '성공');
        } else {
          toastr.error('경기를 완료할수 없습니다.', '실패');
        }
      });
  };

  // Create game
  $scope.show_create = function() {
  	$('#create_modal').modal('show');
  };
  $scope.create_level = function() {
    $scope.formatStartDate = moment($scope.new_game.start_date).format('YYYY-MM-DD');
    $scope.formatStartTime = moment($scope.new_game.start_time).format('HH:mm:ss');

    $scope.formatEndDate = moment($scope.new_game.end_date).format('YYYY-MM-DD');
    $scope.formatEndTime = moment($scope.new_game.end_time).format('HH:mm:ss');

    var x = { "game_name":$scope.new_game.game_name,
              "level":$scope.new_game.level,
              "game_mode": Number($scope.new_game.mode),
              "start_tm":$scope.formatStartDate + ' ' + $scope.formatStartTime,
              "end_tm":$scope.formatEndDate + ' ' + $scope.formatEndTime
            };
    $scope.requestPara = JSON.stringify(x);

    /*$scope.requestPara = '{"level":"' + $scope.new_game.level + '",' +
                           '"game_mode":' + $scope.new_game.mode + ',' +
                           '"start_tm":"' + $scope.formatStartDate + ' ' + $scope.formatStartTime + '",' +
                           '"end_tm":"' + $scope.formatEndDate + ' ' + $scope.formatEndTime + '"}'; 
    var requestParaJSON = JSON.parse($scope.requestPara);
    console.log(requestParaJSON);
    exit();*/ 
    HttpService.request($scope.baseUri + 'game/create', 'POST', $scope.requestPara).then(
  		function(res) {
  			if (res.succeeded == true) {
  				toastr.success('성공적으로 경기가 창조되였습니다.(job_id='+res.job_id+")", '성공');
          $scope.levels.push({name: $scope.new_game.level});
          HttpService.request($scope.baseUri + 'game/list', 'POST', '{}').then(
          function(res) {
            if (res.succeeded == true) 
              $scope.playings = res.games;
            else
              toastr.error('경기창조가 실패하였습니다.', '실패');
          });
          $('#create_modal').modal('hide');
  			} else {
  				toastr.error('경기창조가 실패하였습니다.', '실패');
  			}
  		});
  };
}]);
