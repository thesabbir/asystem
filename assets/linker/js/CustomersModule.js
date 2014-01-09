angular.module('CustomersModule', [])
   .controller('CustomersList', ['$scope', '$rootScope', '$modal', '$api', 'customers',
      function ($scope, $rootScope, $modal, $api, customers) {
         $scope.customers = customers;
         $rootScope.title = $scope.customers.length + " customers & counting";
         $api.listen($api.customers, function (data, msg) {
            $scope.customers = data;
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
                        model: $api.customers,
                        attr: 'customer'
                     }
                  }
               }
            });
         };
         $scope.showDetails = function (customer) {
            var modalInstance = $modal.open({
               templateUrl: '/templates/partials/details.html',
               controller: 'showDetailsCtrl',
               resolve: {
                  details: function () {
                     return {
                        data: customer,
                        editDialog: $scope.editDialog,
                        attr: 'product'
                     }
                  }
               }
            });
         };
         $scope.deleteIt = function (customer) {
            $scope.deleteDialog(customer, $api.customers);
         };
      }]);
