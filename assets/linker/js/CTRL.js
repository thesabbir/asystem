var Ctrl = angular.module('Ctrl', [])
   .controller('Boss', ['$scope', function ($scope) {

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

   }])

   .controller('FormCtrl', ['$scope', '$modalInstance', '$api' , 'data', 'mode', 'model',
      function ($scope, $modalInstance, $api, data, mode, model) {
         var dataSet = JSON.parse(JSON.stringify(data));
         $scope.data = dataSet;
         $scope.mode = mode;
         $scope.submit = function (data) {
            switch (mode) {
               case 'Edit':
                  $api.update(model, data);
                  break;
               default :
                  $api.create(model, data);
            }
            $modalInstance.close('close');
         };
         $scope.cancel = function () {
            $modalInstance.dismiss('cancel');
         };

      }]).controller('showDetailsCtrl', ['$scope', '$modalInstance', 'product', 'editDialog',
      function ($scope, $modalInstance, product, editDialog) {
         $scope.product = product;

         $scope.edit = function () {
            $scope.close();
            return editDialog(product, 'edit');
         }
         $scope.close = function () {
            $modalInstance.close('ok');
         }

      }])
   .controller('DeleteCtrl', ['$scope', '$modalInstance', 'data', 'url',
      function ($scope, $modalInstance, data, url) {
         $scope.data = data;
         $scope.cancel = function () {
            $modalInstance.dismiss('cancelled');
         }
         $scope.delete = function () {
            socket.delete(url + data.id, data, function () {
               $modalInstance.close('deleted');
            });
         }
      }]);