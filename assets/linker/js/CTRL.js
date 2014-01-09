angular.module('Ctrl', [])
   .controller('Home', ['$scope', function ($scope) {

   }])
   .controller('Boss', ['$scope', '$modal', function ($scope, $modal) {

      $scope.sortBy = function (value) {
         $scope.reverse = !$scope.reverse;
         $scope.order = value;
      };
      $scope.notices = [];
      $scope.notify = function (msg) {
         $scope.$apply(function () {
            $scope.notices.push(msg);
         });
         setTimeout(function () {
            $scope.$apply(function () {
               $scope.closeNotice(0);
            });
         }, 5000);
      };
      $scope.closeNotice = function (index) {
         $scope.notices.splice(index, 1);
      };

      $scope.deleteDialog = function (data, model) {
         var modalInstance = $modal.open({
            templateUrl: '/templates/partials/delete_dialog.html',
            controller: 'DeleteCtrl',
            resolve: {
               data: function () {
                  return data;
               },
               model: function () {
                  return model;
               }
            }
         });
      };

   }])

   .controller('FormCtrl', ['$scope', '$modalInstance', '$api' , 'fact',
      function ($scope, $modalInstance, $api, fact) {
         $scope[fact.attr] = JSON.parse(JSON.stringify(fact.data));
         $scope.mode = fact.mode;
         $scope.submit = function (data) {
            $api.submit({
               edit: fact.mode,
               data: data,
               model: fact.model
            }, function () {

            });
            $modalInstance.close('close');
         };
         $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
         };

      }])
   .controller('showDetailsCtrl', ['$scope', '$modalInstance', 'details',
      function ($scope, $modalInstance, details) {
         $scope[details.attr] = details.data;
         $scope.edit = function () {
            $scope.close();
            return details.editDialog(details.data, true);
         };
         $scope.close = function () {
            $modalInstance.close('ok');
         };

      }])
   .controller('DeleteCtrl', ['$scope', '$modalInstance', 'data', 'model', '$api',
      function ($scope, $modalInstance, data, model, $api) {
         $scope.data = data;
         $scope.cancel = function () {
            $modalInstance.dismiss('cancelled');
         };
         $scope.delete = function () {
            $api.delete(model, data);
            $modalInstance.close('deleted');
         };
      }]);