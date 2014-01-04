(function (io) {
    var socket = io.connect();
    socket.on('connect', function socketConnected () {
        socket.on('message', function messageReceived (message) {

            log('New message received :: ', message);

        });

        log(
            'Socket is now connected !'
        );
        socket.on('disconnect', function () {
            log("Socket is now Disconnected");

        });

    });
    window.socket = socket;

})(window.io);

window.log = function log () {
    if (typeof console !== 'undefined') {
        console.log.apply(console, arguments);
    }
}

var Module = angular.module('main', ['ngRoute']);

Module.config(function ($routeProvider, $locationProvider) {
    $routeProvider
        .when('/products', {
            controller: 'ProductList',
            templateUrl: '/templates/products.html'
        })
        .when('/', {
            controller: 'Home',
            templateUrl: '/templates/home.html'
        })
        .when('/products/add', {
            controller: 'AddProduct',
            templateUrl: '/templates/add_product.html'
        })
    //$locationProvider.html5Mode('on');
    $locationProvider.hashPrefix('!');
}).controller('ProductList', function ($scope) {
        socket.get('/products', function (products) {
            $scope.$apply(function () {
                $scope.products = products;
            });
        });

    })
    .controller('Home', function ($scope) {

    })
    .controller('AddProduct', function ($scope, $location) {
        $scope.add = function () {
            socket.post('/products', $scope.product, function (message) {
                $scope.$apply(function () {
                    $location.path('/products');
                });

            })
        };
    })