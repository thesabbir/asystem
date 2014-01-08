

var ProductsModule = angular.module('ProductsModule', [])
   .controller('ProductList', ['$scope', '$rootScope', '$modal', '$api', 'products',
      function ($scope, $rootScope, $modal, $api, products) {
         $scope.products = products;

         $rootScope.title = $scope.products.length + " Products & counting";

         socket.on('message', function (message) {
            var name = " & Name : ";
            message.data ? name += message.data.name : name = '';
            message.verb != 'destroy' ? message.verb += 'd ' : message.verb = 'Deleted';
            var msg = message.model.slice(0, -1).capF() + '-ID : ' + message.id + name + ' was ' + message.verb;
            $scope.notify({
               msg: msg,
               type: 'success'
            });
            socket.get(api.products, function (data) {
               $scope.$apply(function () {
                  $scope.products = data;
                  $scope.total = $scope.products.length;

               });
            });
         });

         $scope.editDialog = function (product, mode) {
            var modalInstance = $modal.open({
               templateUrl: '/templates/form.html',
               controller: 'FormCtrl',
               resolve: {
                  product: function () {
                     return product;
                  },
                  mode: function () {
                     return mode;
                  },
                  url: function () {
                     return api.products;
                  }
               }
            })
         }
         $scope.showDetails = function (product) {
            var modalInstance = $modal.open({
               templateUrl: '/templates/details.html',
               controller: 'showDetailsCtrl',
               resolve: {
                  product: function () {
                     return product;
                  },
                  editDialog: function () {
                     return $scope.editDialog;
                  }
               }
            })
         }
         $scope.deleteDialog = function (data) {
            var modalInstance = $modal.open({
               templateUrl: '/templates/delete_dialog.html',
               controller: 'DeleteCtrl',
               resolve: {
                  data: function () {
                     return data;
                  },
                  url: function () {
                     return api.products;
                  }
               }
            })
         }
      }]);
