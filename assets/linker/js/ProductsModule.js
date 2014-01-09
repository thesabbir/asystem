

var ProductsModule = angular.module('ProductsModule', [])
   .controller('ProductList', ['$scope', '$rootScope', '$modal', '$api', 'products',
      function ($scope, $rootScope, $modal, $api, products) {
         $scope.products = products;

         $rootScope.title = $scope.products.length + " Products & counting";
         $api.listen($api.products, function (data, msg) {
             $scope.products = data;
            $scope.notify(msg);
            $scope.$apply();
         });

         $scope.editDialog = function (data, mode) {
            var modalInstance = $modal.open({
               templateUrl: '/templates/partials/add_product.html',
               controller: 'FormCtrl',
               resolve: {
                  data: function () {
                     return data;
                  },
                  mode: function () {
                     return mode;
                  },
                  model: function () {
                     return $api.products;
                  }
               }
            })
         }
         $scope.showDetails = function (product) {
            var modalInstance = $modal.open({
               templateUrl: '/templates/partials/details.html',
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
               templateUrl: '/templates/partials/delete_dialog.html',
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
