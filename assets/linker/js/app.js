var Module = angular.module('main',
['ngRoute', 'ui.bootstrap','Ctrl', 'Services' ,'ProductsModule', 'CustomersModule', 'SalesModule']);

Module.config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
      $routeProvider
         .when('/products', {
            controller: 'ProductCtrl',
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
            controller: 'CustomersCtrl',
            templateUrl: '/templates/customers.html',
            resolve: {
               customers: ['$q','$api', function ($q,$api) {
                  var deferred = $q.defer();
                  $api.fetch($api.customers, function (data) {
                     deferred.resolve(data);
                  });
                  return deferred.promise;
               }]

            }
         })
         .when('/sales', {
            controller: 'SalesCtrl',
            templateUrl: '/templates/sales.html',
            resolve: {
               sales:  ['$q','$api', function ($q,$api) {
                  var deferred = $q.defer();
                  $api.fetch($api.sales, function (data) {
                     deferred.resolve(data);
                  });
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


