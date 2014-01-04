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
})
    .controller('ProductList', function ($scope, $location) {

        update($scope, '/api/products');

        $scope.stat = true;
        $scope.toggleForm = function () {
            $scope.stat == false ? $scope.stat = true : $scope.stat = false;

        };
        $scope.add = function () {
            socket.post('/api/products', $scope.product, function (message) {
                if (message.errors != undefined) {
                    var msg = [];
                    for (var item in message.errors[0].ValidationError) {
                        msg.push('Invalid ' + item + ' !');
                    }
                    $scope.$apply(function () {
                        $scope.messages = msg;
                        $scope.ms_class = "error";
                    });
                } else {
                    update($scope, '/api/products', ['Added A New Product !']);
                }

            })
        };
    })
    .controller('Home', function ($scope) {

    });

function update ($scope, url, msg) {
    socket.get(url, function (products) {
        $scope.$apply(function () {
            $scope.products = products;
            $scope.messages = msg || "";
        });
    });
}