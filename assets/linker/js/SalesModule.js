angular.module('SalesModule', [])
   .controller('SalesCtrl', ['$scope', '$rootScope', '$modal', '$api', 'sales',
      function ($scope, $rootScope, $modal, $api, sales) {
         $scope.sales = sales;
         $rootScope.title = $scope.sales.length + " sales & counting";
         $api.listen($api.sales, function (data, msg) {
            $scope.sales = data;
            $scope.notify(msg);
            $scope.$apply();
         });
         $scope.editDialog = function (data, mode) {
            var modalInstance = $modal.open({
               templateUrl: '/templates/partials/new_customer.html',
               controller: 'FormCtrl',
               resolve: {
                  fact: function () {
                     return {
                        data: data,
                        mode: mode,
                        model: $api.sales,
                        attr: 'customer'
                     }
                  }
               }
            });
         };
         $scope.showDetails = function (sales) {
            var modalInstance = $modal.open({
               templateUrl: '/templates/partials/sales_details.html',
               controller: 'showDetailsCtrl',
               resolve: {
                  details: function () {
                     return {
                        data: sales,
                        editDialog: $scope.editDialog,
                        attr: 'customer'
                     }
                  }
               }
            });
         };
         $scope.deleteIt = function (customer) {
            $scope.deleteDialog(customer, $api.customers);
         };
      }]);
