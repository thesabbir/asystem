var Module = angular.module('main', ['Services','ngRoute', 'ui.bootstrap', 'ProductsModule', 'CustomersModule']);

Module.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
      $routeProvider
         .when('/products', {
            controller: 'ProductList',
            templateUrl: '/templates/products.html',
            resolve: {
               products: ['$q', '$api', function ($q, $api) {
                  var deferred = $q.defer();
                  $api.fetch($api.products, function (data) {
                     deferred.resolve(data);
                  });
                  return deferred.promise;
               }]

            }
         })
         .when('/customers', {
            controller: 'CustomersList',
            templateUrl: '/templates/customers.html',
            resolve: {
               customers: ['$q', function ($q) {
                  var deferred = $q.defer();
                  socket.get('/api/customers', function (data) {
                     deferred.resolve(data);
                  })
                  return deferred.promise;
               }]

            }
         })
         .when('/', {
            controller: 'Home',
            templateUrl: '/templates/home.html'
         })
         .otherwise({
            redirectTo: '/'
         })

      $locationProvider.hashPrefix('!');
   }])

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
   .controller('Home', ['$scope', function ($scope) {

   }])
   .controller('FormCtrl', ['$scope', '$modalInstance', 'product', 'mode', 'url',
      function ($scope, $modalInstance, product, mode, url) {
         $scope.product = product;
         $scope.mode = mode;
         $scope.submit = function () {
            switch (mode) {
               case 'Edit':
                  socket.put(url + product.id, product);
                  break;
               default :
                  socket.post(url, product)

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

