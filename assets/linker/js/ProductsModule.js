angular.module('ProductsModule', [])
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
                  fact: function () {
                     return {
                        data: data,
                        mode: mode,
                        model: $api.products,
                        attr: 'product'
                     }
                  }
               }
            });
         };
         $scope.showDetails = function (product) {
            var modalInstance = $modal.open({
               templateUrl: '/templates/partials/product_details.html',
               controller: 'showDetailsCtrl',
               resolve: {
                  details: function () {
                     return {
                        data: product,
                        editDialog: $scope.editDialog,
                        attr: 'product'
                     }
                  }
               }
            });
         };
         $scope.deleteIt = function (product) {
            $scope.deleteDialog(product, $api.products);
         };
      }]);
