var CustomersModule = angular.module('CustomersModule', [])
   .controller('CustomersList', ['$scope', '$rootScope', '$modal',  'customers',
      function ($scope, $rootScope, $modal, customers) {
         $rootScope.title = 'Manage customers';
         $scope.customers = customers;
      }])
