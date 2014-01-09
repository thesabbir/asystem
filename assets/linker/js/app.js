var Module = angular.module('main',
['ngRoute', 'ui.bootstrap','Ctrl', 'Services' ,'ProductsModule', 'CustomersModule']);

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


