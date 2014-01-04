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
    //$locationProvider.html5Mode('on');
    $locationProvider.hashPrefix('!');
}).controller('ProductList', function ($scope) {
        $scope.add = function () {
            socket.post('/products', $scope.product, function (message) {
                $scope.$apply(function () {
                    $location.path('/products');
                });

            })
        };
        socket.get('/products', function (products) {
            $scope.$apply(function () {
                $scope.products = products;
            });
        });

    })
    .controller('Home', function ($scope) {

    });



$(document).ready(function () {

    $(document).on('click', '#add_btn', function () {
        $('#add_btn').hide();
      $('#add_prod').show(300);
    });
    $(document).on('click', '.close', function () {
        $('#add_btn').show();
        $('#add_prod').hide(300);
    });
});